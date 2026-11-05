import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "@/app/lib/config";
import Milestone from "@/app/models/Milestone";
import { requirePermission } from "@/app/lib/auth";

// GET /api/milestones/[id]
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const item = await Milestone.findById(id).lean();
    if (!item) {
      return Response.json({ message: "Milestone not found" }, { status: 404 });
    }
    return Response.json(item);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/milestones/[id]
export async function PUT(request, { params }) {
  const { user, error } = await requirePermission(request, 'home', 'update');
  if (error) return error;

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const updateData = {
      badge: body.badge,
      valueType: body.valueType || (body.textValue ? "text" : "number"),
      target: Number(body.target) || 0,
      suffix: body.suffix || "",
      formatNumber: Boolean(body.formatNumber),
      textValue: body.textValue || "",
      label: body.label,
      subtext: body.subtext,
      icon: body.icon || "Award",
      sort: Number(body.sort) || 1,
      status: body.status || "active",
    };

    const updated = await Milestone.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return Response.json({ message: "Milestone not found" }, { status: 404 });
    }

    revalidatePath('/', 'layout');
    revalidatePath('/about-us', 'page');

    return Response.json({
      message: "Milestone updated successfully",
      data: updated,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/milestones/[id]
export async function DELETE(request, { params }) {
  const { user, error } = await requirePermission(request, 'home', 'delete');
  if (error) return error;

  try {
    await connectDB();
    const { id } = await params;

    const deleted = await Milestone.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json({ message: "Milestone not found" }, { status: 404 });
    }

    revalidatePath('/', 'layout');
    revalidatePath('/about-us', 'page');

    return Response.json({
      message: "Milestone deleted successfully",
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

