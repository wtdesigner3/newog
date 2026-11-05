import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../../lib/config";
import HomeAbout from "../../../models/HomeAbout";
import { uploadFile, isUploadFile, deleteFile } from "../../../../lib/upload";
import { requirePermission } from "../../../lib/auth";

// PUT /api/home-about/[id] (Requires 'home:update' permission)
export async function PUT(request, context) {
    const { user, error } = await requirePermission(request, 'home', 'update');
    if (error) return error;

    try {
        await connectDB();

        const formData = await request.formData();
        const { id } = await context.params;

        const existingHomeAbout = await HomeAbout.findById(id);

        if (!existingHomeAbout) {
            return Response.json(
                { message: "Home about not found" },
                { status: 404 }
            );
        }

        const image = formData.get("image");
        let imageUrl = existingHomeAbout.image;

        if (isUploadFile(image)) {
            imageUrl = await uploadFile(image, "home-about", "homeabout");
            if (existingHomeAbout.image) {
                await deleteFile(existingHomeAbout.image);
            }
        }

        const updateData = {
            title: formData.get("title"),
            description: formData.get("description"),
            alt: formData.get("alt"),
            image: imageUrl,
        };

        const homeAbout = await HomeAbout.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        revalidatePath('/', 'layout');
        return Response.json({
            message: "Updated successfully",
            data: homeAbout,
        });

    } catch (err) {
        console.error("HomeAbout PUT Error:", err);
        return Response.json(
            {
                message: "Update failed",
                error: err.message,
            },
            { status: 500 }
        );
    }
}
