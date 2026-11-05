import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "@/app/lib/config";
import Cta from "@/app/models/Cta";
import { uploadFile, isUploadFile, deleteFile } from "@/lib/upload";
import { requirePermission } from "@/app/lib/auth";

// PUT /api/cta/[id] (Requires 'home:update' permission)
export async function PUT(request, context) {
    const { user, error } = await requirePermission(request, 'home', 'update');
    if (error) return error;

    try {
        await connectDB();

        const formData = await request.formData();
        const { id } = await context.params;
        const existingCta = await Cta.findById(id);

        if (!existingCta) {
            return Response.json(
                { message: "CTA not found" },
                { status: 404 }
            );
        }

        const image = formData.get("image");
        let imageUrl = existingCta.image;

        if (isUploadFile(image)) {
            imageUrl = await uploadFile(image, "cta", "cta");
            if (existingCta.image) {
                await deleteFile(existingCta.image);
            }
        }

        const updateData = {
            title: formData.get("title"),
            content: formData.get("content"),
            image: imageUrl,
        };

        const cta = await Cta.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        revalidatePath('/', 'layout');
        return Response.json({
            message: "Updated successfully",
            data: cta,
        });

    } catch (err) {
        console.error("CTA PUT Error:", err);
        return Response.json(
            {
                message: "Update failed",
                error: err.message,
            },
            { status: 500 }
        );
    }
}
