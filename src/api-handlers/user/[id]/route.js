import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import mongoose from "mongoose";
import { connectDB } from "@/app/lib/config";
import User from "@/app/models/User";
import { requireSuperAdmin } from "@/app/lib/auth";
import bcrypt from "bcryptjs";

// GET /api/user/[id] — Get single admin user details
export async function GET(request, { params }) {
  const { error } = await requireSuperAdmin(request);
  if (error) return error;

  const { id } = await params;

  if (!id || !mongoose.Types.ObjectId.isValid(id) || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return Response.json(
      { success: false, message: `Invalid user identifier format: "${id}". Expected a 24-character hexadecimal ObjectId.` },
      { status: 400 }
    );
  }

  await connectDB();
  const user = await User.findOne({ _id: id, role: { $ne: "super_admin" } })
    .select("-password")
    .lean();

  if (!user) {
    return Response.json({ success: false, message: "User not found" }, { status: 404 });
  }

  const permissions = {};
  if (user.permissions) {
    for (const [k, v] of Object.entries(user.permissions)) permissions[k] = v;
  }

  return Response.json({
    success: true,
    data: {
      ...user,
      _id: user._id.toString(),
      permissions,
    },
  });
}

// PUT /api/user/[id] — Update admin user info, permissions, status and password
export async function PUT(request, { params }) {
  const { error } = await requireSuperAdmin(request);
  if (error) return error;

  const { id } = await params;

  if (!id || !mongoose.Types.ObjectId.isValid(id) || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return Response.json(
      { success: false, message: `Invalid user identifier format: "${id}". Expected a 24-character hexadecimal ObjectId.` },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const body = await request.json();
    const { name, email, password, permissions, isActive } = body;

    const user = await User.findOne({ _id: id, role: { $ne: "super_admin" } });
    if (!user) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (name !== undefined) user.name = name.trim();
    if (email !== undefined) {
      const cleanEmail = email.toLowerCase().trim();
      const existing = await User.findOne({ email: cleanEmail, _id: { $ne: id } });
      if (existing) {
        return Response.json({ success: false, message: "A user with this email already exists" }, { status: 409 });
      }
      user.email = cleanEmail;
    }
    if (permissions !== undefined) {
      user.permissions = new Map(Object.entries(permissions));
    }
    if (typeof isActive === "boolean") {
      // If deactivating user, increment tokenVersion to revoke active sessions
      if (user.isActive && !isActive) {
        user.tokenVersion = (user.tokenVersion || 0) + 1;
      }
      user.isActive = isActive;
    }

    if (password && password.trim().length > 0) {
      if (password.trim().length < 8) {
        return Response.json({ success: false, message: "Password must be at least 8 characters long" }, { status: 400 });
      }
      user.password = await bcrypt.hash(password.trim(), 12);
      // Increment tokenVersion on password reset to invalidate previous JWTs
      user.tokenVersion = (user.tokenVersion || 0) + 1;
    }

    await user.save();

    // Serialize permissions Map → plain object
    const permObj = {};
    if (user.permissions) {
      for (const [k, v] of user.permissions.entries()) permObj[k] = v;
    }

    // On-Demand Revalidation
    revalidatePath('/', 'layout');
    return Response.json({
      success: true,
      message: "User updated successfully",
      data: {
        _id:         user._id.toString(),
        name:        user.name,
        email:       user.email,
        role:        user.role,
        isActive:    user.isActive,
        permissions: permObj,
      },
    });
  } catch (err) {
    console.error("[PUT /api/user/[id]]", err);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE /api/user/[id] — Delete admin user
export async function DELETE(request, { params }) {
  const { error } = await requireSuperAdmin(request);
  if (error) return error;

  const { id } = await params;

  if (!id || !mongoose.Types.ObjectId.isValid(id) || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return Response.json(
      { success: false, message: `Invalid user identifier format: "${id}". Expected a 24-character hexadecimal ObjectId.` },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const user = await User.findOne({ _id: id, role: { $ne: "super_admin" } });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found or cannot delete super admin" },
        { status: 404 }
      );
    }

    await user.deleteOne();
    
    // On-Demand Revalidation
    revalidatePath('/', 'layout');
    return Response.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
