import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "@/app/lib/config";
import Certification from "@/app/models/Certification";
import { uploadFile, isUploadFile } from "@/lib/upload";
import { requirePermission } from "@/app/lib/auth";

// GET /api/certification (Public)
export async function GET() {
    await connectDB();
    const certifications = await Certification.find().sort({ sort: 1 }).lean();
    return Response.json(certifications);
}

// POST /api/certification (Requires 'certifications:create' permission)
export async function POST(request) {
    const { user, error } = await requirePermission(request, 'certifications', 'create');
    if (error) return error;

    try {
        await connectDB();

        const formData = await request.formData();
        const title = formData.get("title");
        const status = formData.get("status");
        const sort = Number(formData.get("sort"));
        const logo = formData.get("logo");

        if (!isUploadFile(logo)) {
            return Response.json(
                { message: "Valid logo file is required" },
                { status: 400 }
            );
        }

        const imageUrl = await uploadFile(logo, "certification", "cert");

        const certification = await Certification.create({
            title,
            status,
            sort,
            logo: imageUrl, 
        });

        revalidatePath('/', 'layout');
        return Response.json({
            message: "Certification created successfully",
            data: certification,
        }, { status: 201 });

    } catch (err) {
        return Response.json(
            { message: "Upload failed", error: err.message },
            { status: 500 }
        );
    }
}
