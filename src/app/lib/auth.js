import jwt from "jsonwebtoken";
import { connectDB } from "./config";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "og_heavy_duty_fallback_secret";

/**
 * Verify and decode the JWT from Authorization header or httpOnly cookie.
 * Returns the decoded payload or null.
 */
export async function verifyToken(request) {
  try {
    let token = null;

    // 1. Try Authorization header (Bearer token)
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7).trim();
    }

    // 2. Fall back to httpOnly cookie
    if (!token || token === "null" || token === "undefined") {
      const cookieHeader = request.headers.get("cookie") || "";
      const match = cookieHeader.match(/(?:^|;\s*)admin_token=([^;]+)/);
      if (match) token = match[1];
    }

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Require a valid, active authenticated user with real-time tokenVersion validation.
 * Verifies that the user exists in DB, isActive is true, not locked out,
 * and tokenVersion matches the issued JWT (revoking stale tokens).
 * 
 * Returns { user } or { error: Response }.
 */
export async function requireAuth(request) {
  const decoded = await verifyToken(request);
  if (!decoded || !decoded.id) {
    return {
      error: Response.json(
        { success: false, message: "Unauthorized: Please log in." },
        { status: 401 }
      ),
    };
  }

  try {
    await connectDB();
    const userDoc = await User.findById(decoded.id);

    if (!userDoc) {
      return {
        error: Response.json(
          { success: false, message: "Unauthorized: User account no longer exists." },
          { status: 401 }
        ),
      };
    }

    if (!userDoc.isActive) {
      return {
        error: Response.json(
          { success: false, message: "Unauthorized: Account has been disabled. Please contact an administrator." },
          { status: 401 }
        ),
      };
    }

    if (userDoc.isLocked && userDoc.lockUntil && userDoc.lockUntil > new Date()) {
      const minutesRemaining = Math.ceil((userDoc.lockUntil - new Date()) / 60000);
      return {
        error: Response.json(
          {
            success: false,
            message: `Account is temporarily locked. Try again in ${minutesRemaining} minutes.`,
          },
          { status: 403 }
        ),
      };
    }

    // Enforce immediate token revocation on password update or privilege change
    const expectedTokenVersion = userDoc.tokenVersion || 0;
    const tokenVersion = decoded.tokenVersion || 0;
    if (tokenVersion !== expectedTokenVersion) {
      return {
        error: Response.json(
          { success: false, message: "Unauthorized: Session has expired or been revoked. Please log in again." },
          { status: 401 }
        ),
      };
    }

    const permissionsObj = userDoc.getPermissionsObject
      ? userDoc.getPermissionsObject()
      : (userDoc.permissions ? Object.fromEntries(userDoc.permissions) : {});

    const user = {
      _id: userDoc._id,
      id: userDoc._id.toString(),
      name: userDoc.name,
      username: userDoc.username || "",
      email: userDoc.email,
      role: userDoc.role,
      tokenVersion: userDoc.tokenVersion || 0,
      permissions: permissionsObj,
      doc: userDoc,
    };

    return { user };
  } catch (dbErr) {
    console.error("[requireAuth] Database verification error:", dbErr);
    return {
      error: Response.json(
        { success: false, message: "Internal server error during authentication verification" },
        { status: 500 }
      ),
    };
  }
}

/**
 * Require the user to be a super_admin.
 * Returns the validated user or sends 403.
 */
export async function requireSuperAdmin(request) {
  const { user, error } = await requireAuth(request);
  if (error) return { error };
  if (user.role !== "super_admin") {
    return {
      error: Response.json(
        { success: false, message: "Forbidden: Super Admin access required." },
        { status: 403 }
      ),
    };
  }
  return { user };
}

/**
 * Require the user to have a specific module permission.
 * Super admins bypass all permission checks.
 * @param {Request} request
 * @param {string} module  - e.g. 'products', 'categories', 'enquiries'
 * @param {string} action  - e.g. 'create', 'read', 'update', 'delete'
 */
export async function requirePermission(request, module, action) {
  const { user, error } = await requireAuth(request);
  if (error) return { error };

  // Super admins have all permissions
  if (user.role === "super_admin") return { user };

  const permissions = user.permissions || {};
  const allowed = permissions[module] || [];

  if (!allowed.includes(action)) {
    return {
      error: Response.json(
        { success: false, message: `Forbidden: You do not have '${action}' permission on '${module}'.` },
        { status: 403 }
      ),
    };
  }

  return { user };
}
