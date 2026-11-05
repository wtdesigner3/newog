import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../lib/config";
import CompanyCertification from "../../models/CompanyCertification";
import { uploadFile, isUploadFile } from "../../../lib/upload";
import { requirePermission } from "../../lib/auth";

// GET /api/company-certifications (Public)
export async function GET(request) {
    await connectDB();
    const certs = await CompanyCertification.find().sort({ sort: 1, createdAt: -1 }).lean();
    return Response.json(certs);
}

// POST /api/company-certifications (Requires 'certifications:create' permission)
export async function POST(request) {
    const { user, error } = await requirePermission(request, 'certifications', 'create');
    if (error) return error;

    try {
        await connectDB();
        const formData = await request.formData();
        
        const name = formData.get("name");
        const sub_title = formData.get("sub_title") || "";
        const third_title = formData.get("third_title") || "";
        const status = formData.get("status") || "active";
        const sort = formData.get("sort") || 0;
        
        const file = formData.get("file");

        if (!isUploadFile(file)) {
            return Response.json({ message: "Valid file is required" }, { status: 400 });
        }

        const file_url = await uploadFile(file, "certifications", "cert");

        const newCert = await CompanyCertification.create({
            name,
            sub_title,
            third_title,
            status,
            sort,
            file_url
        });

        revalidatePath('/', 'layout');
        return Response.json(newCert, { status: 201 });
    } catch (err) {
        return Response.json({ message: "Upload failed", error: err.message }, { status: 500 });
    }
}
