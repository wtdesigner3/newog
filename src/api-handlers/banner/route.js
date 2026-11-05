import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "@/app/lib/config";
import Banner from "@/app/models/Banner";
import { uploadFile, isUploadFile } from "@/lib/upload";
import { requirePermission } from "@/app/lib/auth";

// GET all Banners (Public)
export async function GET() {
    try {
        await connectDB();
        const banners = await Banner.find().sort({ sort: 1 }).lean();
        return Response.json(banners);
    } catch (error) {
        return Response.json(
            { message: "Failed to fetch banners", error: error.message },
            { status: 500 }
        );
    }
}

// POST a new Banner (Requires 'home:update' permission)
export async function POST(request) {
    const { user, error } = await requirePermission(request, 'home', 'update');
    if (error) return error;

    try {
        await connectDB();
        const formData = await request.formData();
        const kicker = formData.get("kicker") || "";
        const title = formData.get("title");
        const subtitle = formData.get("subtitle");
        const url = formData.get("url");
        const buttonText = formData.get("buttonText");
        const alt = formData.get("alt");
        const status = formData.get("status");
        const sort = Number(formData.get("sort"));
        const showCertifications = formData.get("showCertifications") === "true";
        const image = formData.get("image");

        if (!isUploadFile(image)) {
            return Response.json(
                { message: "Valid image is required" },
                { status: 400 }
            );
        }

        const imageUrl = await uploadFile(image, "banner", "banner");

        const banner = await Banner.create({
            kicker,
            title,
            subtitle,
            url,
            buttonText,
            alt,
            status,
            sort,
            showCertifications,
            image: imageUrl,
        });

        revalidatePath('/');
        revalidatePath('/', 'page');
        revalidatePath('/', 'layout');

        return Response.json({
            message: "Banner created successfully",
            data: banner,
        }, { status: 201 });

    } catch (error) {
        return Response.json(
            { message: "Upload failed", error: error.message },
            { status: 500 }
        );
    }
}
