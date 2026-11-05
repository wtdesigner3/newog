export const dynamic = 'force-dynamic';
import { connectDB } from "@/app/lib/config";
import ActivityLog from "@/app/models/ActivityLog";
import { requireSuperAdmin } from "@/app/lib/auth";

// GET /api/logs — Admin activity audit trail (Super Admin Only)
export async function GET(request) {
  const { user, error } = await requireSuperAdmin(request);
  if (error) return error;

  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit')) || 100, 500);

    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return Response.json(logs);
  } catch (err) {
    return Response.json({ message: "Failed to fetch logs", error: err.message }, { status: 500 });
  }
}
