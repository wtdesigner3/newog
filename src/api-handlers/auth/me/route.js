export const dynamic = 'force-dynamic';
import { requireAuth } from "@/app/lib/auth";

// GET /api/auth/me — Validate token and return current user info (with fresh DB data)
export async function GET(request) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  return Response.json({
    success: true,
    user: {
      id:          user.id,
      name:        user.name,
      username:    user.username || "",
      email:       user.email,
      role:        user.role,
      avatar:      user.doc.avatar || null,
      permissions: user.permissions,
    },
  });
}
