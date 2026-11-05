import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../lib/config";
import WhyChoose from "../../models/whyChoose";
import { uploadFile, isUploadFile } from "../../../lib/upload";
import { requirePermission } from "../../lib/auth";

// GET /api/why-choose (Public)
export async function GET() {
    await connectDB();
    const whyChoose = await WhyChoose.find().sort({ sort: 1 }).lean();
    return Response.json(whyChoose);
}

// POST /api/why-choose (Requires 'home:update' permission)
export async function POST(request) {
    const { user, error } = await requirePermission(request, 'home', 'update');
    if (error) return error;

    try {
        await connectDB();

        const formData = await request.formData();
        const title = formData.get("title");
        const content = formData.get("content");
        const status = formData.get("status");
        const sort = Number(formData.get("sort"));
        const icon = formData.get("icon");

        if (!isUploadFile(icon)) {
            return Response.json(
                { message: "Valid icon file is required" },
                { status: 400 }
            );
        }

        const imageUrl = await uploadFile(icon, "why-choose", "why");

        const whyChoose = await WhyChoose.create({
            title,
            content,
            status,
            sort,
            icon: imageUrl,
        });

        revalidatePath('/', 'layout');
        return Response.json({
            message: "Why choose item created successfully",
            data: whyChoose,
        }, { status: 201 });

    } catch (err) {
        return Response.json(
            { message: "Upload failed", error: err.message },
            { status: 500 }
        );
    }
}
