import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "@/app/lib/config";
import Cta from "@/app/models/Cta";
import { uploadFile, isUploadFile, deleteFile } from "@/lib/upload";
import { requirePermission } from "@/app/lib/auth";

// GET /api/cta (Public)
export async function GET() {
    await connectDB();
    const cta = await Cta.find().lean();
    return Response.json(cta);
}

// POST /api/cta (Requires 'home:update' permission)
export async function POST(request) {
    const { user, error } = await requirePermission(request, 'home', 'update');
    if (error) return error;

    try {
        await connectDB();

        const formData = await request.formData();
        const badge = formData.get("badge") || "MEP & HVAC ENGINEERING SUPPORT";
        const title = formData.get("title") || "";
        const content = formData.get("content") || "";
        const buttonText = formData.get("buttonText") || "Consult Engineering Desk";
        const buttonUrl = formData.get("buttonUrl") || "/contact-us";
        const image = formData.get("image");

        let imageUrl = undefined;

        if (isUploadFile(image)) {
            imageUrl = await uploadFile(image, "cta", "cta");
        }

        const updateData = { badge, title, content, buttonText, buttonUrl };
        if (imageUrl) updateData.image = imageUrl;

        let cta = await Cta.findOne();
        if (cta) {
            if (imageUrl && cta.image) {
                await deleteFile(cta.image);
            }
            cta = await Cta.findByIdAndUpdate(cta._id, updateData, { new: true });
        } else {
            cta = await Cta.create(updateData);
        }

        revalidatePath('/', 'layout');
        return Response.json({
            message: "CTA saved successfully",
            data: cta,
        });

    } catch (err) {
        return Response.json(
            { message: "Upload failed", error: err.message },
            { status: 500 }
        );
    }
}
