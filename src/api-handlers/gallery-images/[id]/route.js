import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "@/app/lib/config";
import GalleryImage from "@/app/models/GalleryImage";
import { uploadFile, isUploadFile, deleteFile } from "@/lib/upload";
import { requirePermission } from "@/app/lib/auth";

export async function PUT(request, context) {
    const { user, error } = await requirePermission(request, 'gallery', 'update');
    if (error) return error;

    try {
        await connectDB();
        const { id } = await context.params;
        
        const image = await GalleryImage.findById(id);
        if (!image) return Response.json({ message: "Not found" }, { status: 404 });

        const formData = await request.formData();
        const caption = formData.get('caption');
        const file = formData.get('file');
        const isActiveStr = formData.get('isActive');

        if (caption !== null && caption !== undefined) {
            image.caption = caption;
        }
        
        if (isActiveStr !== null && isActiveStr !== undefined) {
            image.isActive = isActiveStr === 'true';
        }

        if (isUploadFile(file)) {
            const oldUrl = image.url;
            image.url = await uploadFile(file, "gallery", "gal");
            if (oldUrl) {
                await deleteFile(oldUrl);
            }
        }

        await image.save();

        revalidatePath('/', 'layout');
        return Response.json({ message: "Updated successfully", data: image });

    } catch (err) {
        return Response.json({ message: "Update failed", error: err.message }, { status: 500 });
    }
}

export async function DELETE(request, context) {
    const { user, error } = await requirePermission(request, 'gallery', 'delete');
    if (error) return error;

    try {
        await connectDB();
        const { id } = await context.params;

        const image = await GalleryImage.findById(id);
        if (!image) return Response.json({ message: "Not found" }, { status: 404 });

        if (image.url) {
            await deleteFile(image.url);
        }

        await GalleryImage.findByIdAndDelete(id);

        revalidatePath('/', 'layout');
        return Response.json({ message: "Deleted successfully" });

    } catch (err) {
        return Response.json({ message: "Delete failed", error: err.message }, { status: 500 });
    }
}
