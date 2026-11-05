import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../lib/config";
import Othercta from "../../models/Othercta";
import { uploadFile, isUploadFile, deleteFile } from "../../../lib/upload";
import { requirePermission } from "../../lib/auth";

// GET othercta (Public)
export async function GET() {
    await connectDB();
    const othercta = await Othercta.find().lean();
    return Response.json(othercta);
}

// POST othercta (Requires 'home:update' permission)
export async function POST(request) {
    const { user, error } = await requirePermission(request, 'home', 'update');
    if (error) return error;

    try {
        await connectDB();

        const formData = await request.formData();
        const updateData = {
            title: formData.get("title") || "",
            subtitle: formData.get("subtitle") || "",
            content: formData.get("content") || "",
            buttonText1: formData.get("buttonText1") || "",
            url1: formData.get("url1") || "",
            buttonText2: formData.get("buttonText2") || "",
            url2: formData.get("url2") || "",
        };

        const image = formData.get("image");
        let imageUrl = undefined;
        if (isUploadFile(image)) {
            imageUrl = await uploadFile(image, "cta", "cta");
        }
        if (imageUrl) updateData.image = imageUrl;

        let othercta = await Othercta.findOne();
        if (othercta) {
            if (imageUrl && othercta.image) {
                await deleteFile(othercta.image);
            }
            othercta = await Othercta.findByIdAndUpdate(othercta._id, updateData, { new: true });
        } else {
            othercta = await Othercta.create(updateData);
        }

        revalidatePath('/', 'layout');
        return Response.json({
            message: "Othercta saved successfully",
            data: othercta,
        });

    } catch (error) {
        return Response.json(
            { message: "Save failed", error: error.message },
            { status: 500 }
        );
    }
}
