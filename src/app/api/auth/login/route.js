import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../../lib/config";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logActivity } from "../../../../lib/logger";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const identifier = body.email || body.username || body.identifier;
    const password = body.password;

    if (!identifier || !password) {
      return Response.json(
        { success: false, message: "Username/email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const cleanIdentifier = String(identifier).trim().toLowerCase();
    const user = await User.findOne({
      $or: [
        { email: cleanIdentifier },
        { username: cleanIdentifier },
      ],
    });

    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("remote-addr") ||
      "Unknown";

    if (!user) {
      return Response.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return Response.json(
        { success: false, message: "Account is disabled. Contact system administrator." },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (user.isLocked && user.lockUntil && user.lockUntil > new Date()) {
      const minutesRemaining = Math.ceil((user.lockUntil - new Date()) / 60000);
      return Response.json(
        {
          success: false,
          message: `Account locked due to consecutive failed attempts. Try again in ${minutesRemaining} minutes.`,
        },
        { status: 403 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      let message = "Invalid credentials";

      if (user.failedLoginAttempts >= 5) {
        user.isLocked = true;
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15-minute lockout
        message =
          "Account locked due to 5 consecutive failed attempts. Try again in 15 minutes.";
        await logActivity(
          "Account Locked",
          "Security",
          `User ${user.email} locked out after 5 failed attempts.`,
          user,
          ipAddress
        ).catch(() => {});
      } else {
        await logActivity(
          "Failed Login",
          "Security",
          `Failed login attempt (${user.failedLoginAttempts}/5) for ${user.email}.`,
          user,
          ipAddress
        ).catch(() => {});
      }

      await user.save();
      return Response.json({ success: false, message }, { status: 401 });
    }

    // Reset failed attempts on success
    user.failedLoginAttempts = 0;
    user.isLocked = false;
    user.lockUntil = null;
    await user.save();

    await logActivity(
      "Successful Login",
      "Security",
      `User ${user.email} successfully logged into dashboard.`,
      user,
      ipAddress
    ).catch(() => {});

    // Build permissions object from the Map
    const permissionsObj = user.getPermissionsObject();

    // Sign JWT with role, username, tokenVersion, and permissions
    const token = jwt.sign(
      {
        id:           user._id,
        email:        user.email,
        username:     user.username || "",
        name:         user.name,
        role:         user.role,
        tokenVersion: user.tokenVersion || 0,
        permissions:  permissionsObj,
      },
      process.env.JWT_SECRET || "og_heavy_duty_fallback_secret",
      { expiresIn: "1d" }
    );

    const response = Response.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id:          user._id,
        name:        user.name,
        username:    user.username || "",
        email:       user.email,
        role:        user.role,
        permissions: permissionsObj,
      },
    });

    // Set httpOnly cookie for SSR-safe auth
    const isProduction = process.env.NODE_ENV === "production";
    const cookieFlags = `HttpOnly; Path=/; Max-Age=86400; SameSite=Lax${
      isProduction ? "; Secure" : ""
    }`;
    response.headers.set("Set-Cookie", `admin_token=${token}; ${cookieFlags}`);

    return response;
  } catch (error) {
    console.error("[auth/login] Error:", error);
    const isProd = process.env.NODE_ENV === "production";
    return Response.json(
      {
        success: false,
        message: "Internal server error during login",
        ...(isProd ? {} : { error: error.message }),
      },
      { status: 500 }
    );
  }
}
