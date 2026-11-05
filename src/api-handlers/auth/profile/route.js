import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { requireAuth } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/config";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadFile, isUploadFile } from "@/lib/upload";

// GET /api/auth/profile — Return current user profile
export async function GET(request) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  return Response.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.doc.avatar || null,
      permissions: user.permissions,
    },
  });
}

// PUT /api/auth/profile — Update name, email, password and/or avatar
export async function PUT(request) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    await connectDB();
    const currentUser = await User.findById(user.id);
    if (!currentUser) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const name     = formData.get("name");
    const email    = formData.get("email");
    const password = formData.get("password");
    const avatar   = formData.get("avatar"); // File object or null

    const updateData = {};
    if (name) updateData.name = name.trim();

    // Only super_admin can update their email and password freely
    if (currentUser.role === 'super_admin') {
      if (email && email.trim().toLowerCase() !== currentUser.email) {
        const existing = await User.findOne({ email: email.trim().toLowerCase(), _id: { $ne: currentUser._id } }).lean();
        if (existing) {
          return Response.json({ success: false, message: "Email already in use" }, { status: 400 });
        }
        updateData.email = email.trim().toLowerCase();
      }
      
      if (password && password.trim().length > 0) {
        if (password.trim().length < 8) {
          return Response.json({ success: false, message: "Password must be at least 8 characters long" }, { status: 400 });
        }
        const salt = await bcrypt.genSalt(12);
        updateData.password = await bcrypt.hash(password.trim(), salt);
        // Increment tokenVersion to revoke all active sessions across other devices
        updateData.tokenVersion = (currentUser.tokenVersion || 0) + 1;
      }
    }

    if (isUploadFile(avatar)) {
      updateData.avatar = await uploadFile(avatar, "avatars", "avatar");
    }

    const updated = await User.findByIdAndUpdate(
      user.id,
      { $set: updateData },
      { new: true, select: "-password" }
    );

    // On-Demand Revalidation
    revalidatePath('/', 'layout');

    const resPayload = {
      success: true,
      message: "Profile updated successfully",
      user: {
        id:     updated._id.toString(),
        name:   updated.name,
        email:  updated.email,
        role:   updated.role,
        avatar: updated.avatar || null,
      },
    };

    const response = Response.json(resPayload);

    // If password changed, reissue fresh JWT for the active session
    if (updateData.tokenVersion !== undefined) {
      const newToken = jwt.sign(
        {
          id:           updated._id,
          email:        updated.email,
          username:     updated.username || "",
          name:         updated.name,
          role:         updated.role,
          tokenVersion: updated.tokenVersion,
          permissions:  updated.getPermissionsObject ? updated.getPermissionsObject() : {},
        },
        process.env.JWT_SECRET || "og_heavy_duty_fallback_secret",
        { expiresIn: "1d" }
      );

      const isProduction = process.env.NODE_ENV === "production";
      const cookieFlags = `HttpOnly; Path=/; Max-Age=86400; SameSite=Lax${
        isProduction ? "; Secure" : ""
      }`;
      response.headers.set("Set-Cookie", `admin_token=${newToken}; ${cookieFlags}`);
    }

    return response;
  } catch (err) {
    console.error("[PUT /api/auth/profile] Error:", err);
    return Response.json({ success: false, message: err.message || "Failed to update profile" }, { status: 500 });
  }
}
