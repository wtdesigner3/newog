import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import Certification from "../../../models/Certification";
import { connectDB } from "../../../lib/config";
import { uploadFile, isUploadFile, deleteFile } from "../../../../lib/upload";
import { requirePermission } from "../../../lib/auth";

export async function PUT(request, context) {
    const { user, error } = await requirePermission(request, 'certifications', 'update');
    if (error) return error;

    try {
        await connectDB();
        const formData = await request.formData();
        const { id } = await context.params;
        const existingCertification = await Certification.findById(id);

        if (!existingCertification) {
            return Response.json(
                { message: "Certification not found" },
                { status: 404 }
            );
        }

        const logo = formData.get("logo");
        let logoUrl = existingCertification.logo;

        if (isUploadFile(logo)) {
            logoUrl = await uploadFile(logo, "certification", "cert");
            if (existingCertification.logo) {
                await deleteFile(existingCertification.logo);
            }
        }

        const updateData = {
            title: formData.get("title"),
            status: formData.get("status"),
            sort: Number(formData.get("sort")),
            logo: logoUrl,
        };

        const certification = await Certification.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        revalidatePath('/', 'layout');
        return Response.json({
            message: "Updated successfully",
            data: certification,
        });

    } catch (err) {
        console.error("Certification PUT Error:", err);
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
    const { user, error } = await requirePermission(request, 'certifications', 'delete');
    if (error) return error;

    try {
        await connectDB();
        const { id } = await context.params;

        const certification = await Certification.findById(id);
        if (!certification) {
            return Response.json({ message: "Not found" }, { status: 404 });
        }

        if (certification.logo) {
            await deleteFile(certification.logo);
        }

        await Certification.findByIdAndDelete(id);

        revalidatePath('/', 'layout');
        return Response.json({
            message: "Deleted successfully",
        });
    } catch (err) {
        return Response.json({ message: "Delete failed", error: err.message }, { status: 500 });
    }
}
