import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "@/app/lib/config";
import Testimonial from "@/app/models/Testimonial";
import { uploadFile, isUploadFile, deleteFile } from "@/lib/upload";
import { requirePermission } from "@/app/lib/auth";

// GET /api/testimonials/[id]
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const item = await Testimonial.findById(id).lean();
    if (!item) {
      return Response.json({ error: "Testimonial not found" }, { status: 404 });
    }
    return Response.json(item);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/testimonials/[id] (Requires 'home' permission)
export async function PUT(request, { params }) {
  const { user, error } = await requirePermission(request, 'home', 'update');
  if (error) return error;

  try {
    const { id } = await params;
    await connectDB();

    const existing = await Testimonial.findById(id);
    if (!existing) {
      return Response.json({ error: "Testimonial not found" }, { status: 404 });
    }

    const contentType = request.headers.get("content-type") || "";
    let updateFields = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      updateFields = {
        name: formData.get("name") ?? existing.name,
        role: formData.get("role") ?? existing.role,
        company: formData.get("company") ?? existing.company,
        equipment: formData.get("equipment") ?? existing.equipment,
        highlight: formData.get("highlight") ?? existing.highlight,
        stars: formData.has("stars") ? Number(formData.get("stars")) : existing.stars,
        quote: formData.get("quote") ?? existing.quote,
        sort: formData.has("sort") ? Number(formData.get("sort")) : existing.sort,
        status: formData.get("status") ?? existing.status,
      };

      const avatarFile = formData.get("avatar");
      if (isUploadFile(avatarFile)) {
        if (existing.avatar) {
          await deleteFile(existing.avatar).catch(() => {});
        }
        const avatarUrl = await uploadFile(avatarFile, "testimonials", "testimonial");
        updateFields.avatar = avatarUrl;
      }
    } else {
      updateFields = await request.json();
    }

    const updated = await Testimonial.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    revalidatePath('/', 'layout');

    return Response.json({
      message: "Testimonial updated successfully",
      data: updated,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/testimonials/[id] (Requires 'home' permission)
export async function DELETE(request, { params }) {
  const { user, error } = await requirePermission(request, 'home', 'delete');
  if (error) return error;

  try {
    const { id } = await params;
    await connectDB();

    const item = await Testimonial.findById(id);
    if (!item) {
      return Response.json({ error: "Testimonial not found" }, { status: 404 });
    }

    if (item.avatar) {
      await deleteFile(item.avatar).catch(() => {});
    }

    await Testimonial.findByIdAndDelete(id);

    revalidatePath('/', 'layout');

    return Response.json({ message: "Testimonial deleted successfully" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

