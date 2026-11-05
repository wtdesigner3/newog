import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../lib/config";
import Work from "../../models/Work";
import { uploadFile, isUploadFile } from "../../../lib/upload";
import { requirePermission } from "../../lib/auth";

// GET /api/work (Public)
export async function GET() {
    await connectDB();
    const works = await Work.find().sort({ sort: 1 }).lean();
    return Response.json(works);
}

// POST /api/work (Requires 'home:update' permission)
export async function POST(request) {
    const { user, error } = await requirePermission(request, 'home', 'update');
    if (error) return error;

    try {
        await connectDB();

        const formData = await request.formData();
        const title = formData.get("title");
        const status = formData.get("status");
        const sort = Number(formData.get("sort"));
        const category = formData.get("category") || "Industry";
        const logo = formData.get("logo");

        if (!isUploadFile(logo)) {
            return Response.json(
                { message: "Valid logo file is required" },
                { status: 400 }
            );
        }

        const imageUrl = await uploadFile(logo, "work", "work");

        const work = await Work.create({
            title,
            status,
            sort,
            category,
            logo: imageUrl, 
        });
        
        revalidatePath('/', 'layout');
        return Response.json({
            message: "Work created successfully",
            data: work,
        }, { status: 201 });

    } catch (err) {
        return Response.json(
            { message: "Upload failed", error: err.message },
            { status: 500 }
        );
    }
}
