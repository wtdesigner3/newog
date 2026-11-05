import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "@/app/lib/config";
import Work from "@/app/models/Work";
import { uploadFile, isUploadFile, deleteFile } from "@/lib/upload";
import { requirePermission } from "@/app/lib/auth";

export async function PUT(request, context) {
    const { user, error } = await requirePermission(request, 'home', 'update');
    if (error) return error;

    try {
        await connectDB();

        const formData = await request.formData();
        const { id } = await context.params;

        const existingWork = await Work.findById(id);

        if (!existingWork) {
            return Response.json(
                { message: "Work not found" },
                { status: 404 }
            );
        }

        const logo = formData.get("logo");
        let logoUrl = existingWork.logo;

        if (isUploadFile(logo)) {
            logoUrl = await uploadFile(logo, "work", "work");
            if (existingWork.logo) {
                await deleteFile(existingWork.logo);
            }
        }

        const updateData = {
            title: formData.get("title"),
            status: formData.get("status"),
            sort: Number(formData.get("sort")),
            category: formData.get("category"),
            logo: logoUrl,
        };

        const work = await Work.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        revalidatePath('/', 'layout');
        return Response.json({
            message: "Updated successfully",
            data: work,
        });

    } catch (err) {
        console.error("Work PUT Error:", err);
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

        const work = await Work.findById(id);
        if (!work) {
            return Response.json({ message: "Not found" }, { status: 404 });
        }

        if (work.logo) {
            await deleteFile(work.logo);
        }

        await Work.findByIdAndDelete(id);

        revalidatePath('/', 'layout');
        return Response.json({
            message: "Deleted successfully",
        });
    } catch (err) {
        return Response.json({ message: "Delete failed", error: err.message }, { status: 500 });
    }
}
