import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "@/app/lib/config";
import WhyChoose from "@/app/models/whyChoose";
import { uploadFile, isUploadFile, deleteFile } from "@/lib/upload";
import { requirePermission } from "@/app/lib/auth";

export async function PUT(request, context) {
    const { user, error } = await requirePermission(request, 'home', 'update');
    if (error) return error;

    try {
        await connectDB();

        const formData = await request.formData();
        const { id } = await context.params;

        const existingWhyChoose = await WhyChoose.findById(id);

        if (!existingWhyChoose) {
            return Response.json(
                { message: "Why choose item not found" },
                { status: 404 }
            );
        }

        const icon = formData.get("icon");
        let iconUrl = existingWhyChoose.icon;

        if (isUploadFile(icon)) {
            iconUrl = await uploadFile(icon, "why-choose", "why");
            if (existingWhyChoose.icon) {
                await deleteFile(existingWhyChoose.icon);
            }
        }

        const updateData = {
            title: formData.get("title"),
            content: formData.get("content"),
            status: formData.get("status"),
            sort: Number(formData.get("sort")),
            icon: iconUrl,
        };

        const whyChoose = await WhyChoose.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        revalidatePath('/', 'layout');
        return Response.json({
            message: "Updated successfully",
            data: whyChoose,
        });

    } catch (err) {
        console.error("WhyChoose PUT Error:", err);
        return Response.json(
            {
                message: "Update failed",
                error: err.message,
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request, context) {
    const { user, error } = await requirePermission(request, 'home', 'update');
    if (error) return error;

    try {
        await connectDB();
        const { id } = await context.params;

        const item = await WhyChoose.findById(id);
        if (!item) {
            return Response.json({ message: "Not found" }, { status: 404 });
        }

        if (item.icon) {
            await deleteFile(item.icon);
        }

        await WhyChoose.findByIdAndDelete(id);

        revalidatePath('/', 'layout');
        return Response.json({
            message: "Deleted successfully",
        });
    } catch (err) {
        return Response.json({ message: "Delete failed", error: err.message }, { status: 500 });
    }
}
