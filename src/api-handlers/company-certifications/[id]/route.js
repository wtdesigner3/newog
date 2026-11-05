import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import CompanyCertification from "@/app/models/CompanyCertification";
import { connectDB } from "@/app/lib/config";
import { uploadFile, isUploadFile, deleteFile } from "@/lib/upload";
import { requirePermission } from "@/app/lib/auth";

export async function PUT(request, context) {
    const { user, error } = await requirePermission(request, 'certifications', 'update');
    if (error) return error;

    try {
        await connectDB();
        const { id } = await context.params;
        const formData = await request.formData();
        
        const cert = await CompanyCertification.findById(id);
        if (!cert) return Response.json({ message: "Not found" }, { status: 404 });

        const name = formData.get("name");
        const sub_title = formData.get("sub_title");
        const third_title = formData.get("third_title");
        const status = formData.get("status");
        const sort = formData.get("sort");

        if (name) cert.name = name;
        if (sub_title !== null) cert.sub_title = sub_title;
        if (third_title !== null) cert.third_title = third_title;
        if (status) cert.status = status;
        if (sort !== null) cert.sort = sort;

        const file = formData.get("file");

        if (isUploadFile(file)) {
            const oldFile = cert.file_url;
            cert.file_url = await uploadFile(file, "certifications", "cert");
            if (oldFile) {
                await deleteFile(oldFile);
            }
        }

        await cert.save();

        revalidatePath('/', 'layout');
        return Response.json(cert);
    } catch (err) {
        return Response.json({ message: "Update failed", error: err.message }, { status: 500 });
    }
}

export async function DELETE(request, context) {
    const { user, error } = await requirePermission(request, 'certifications', 'delete');
    if (error) return error;

    try {
        await connectDB();
        const { id } = await context.params;

        const cert = await CompanyCertification.findById(id);
        if (!cert) return Response.json({ message: "Not found" }, { status: 404 });

        if (cert.file_url) {
            await deleteFile(cert.file_url);
        }

        await CompanyCertification.findByIdAndDelete(id);

        revalidatePath('/', 'layout');
        return Response.json({ message: "Deleted successfully" });
    } catch (err) {
        return Response.json({ message: "Delete failed", error: err.message }, { status: 500 });
    }
}
