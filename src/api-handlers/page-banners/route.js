import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/config";
import PageBanner from "@/app/models/PageBanner";
import { uploadFile, isUploadFile, deleteFile } from "@/lib/upload";
import { requirePermission } from "@/app/lib/auth";

// GET /api/page-banners (Public)
export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const pageKey = searchParams.get('pageKey');
        
        let query = {};
        if (pageKey) query.pageKey = pageKey;

        const banners = await PageBanner.find(query).lean();
        return NextResponse.json(banners);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching page banners" }, { status: 500 });
    }
}

// POST /api/page-banners (Requires 'inner_pages:update' permission)
export async function POST(req) {
    const { user, error } = await requirePermission(req, 'inner_pages', 'update');
    if (error) return error;

    try {
        await connectDB();
        const formData = await req.formData();
        
        const pageKey = formData.get("pageKey");
        const title = formData.get("title");
        const isActive = formData.get("isActive") === "true";
        const imageFile = formData.get("image");

        if (!pageKey) {
            return NextResponse.json({ message: "pageKey is required" }, { status: 400 });
        }

        let imageUrl = undefined;
        if (isUploadFile(imageFile)) {
            imageUrl = await uploadFile(imageFile, "page-banners", `banner-${pageKey}`);
        }

        const existing = await PageBanner.findOne({ pageKey });
        if (existing && imageUrl && existing.image) {
            await deleteFile(existing.image);
        }

        const bannerData = {
            pageKey,
            title,
            isActive
        };
        if (imageUrl) bannerData.image = imageUrl;

        const banner = await PageBanner.findOneAndUpdate(
            { pageKey },
            bannerData,
            { upsert: true, new: true }
        );

        revalidatePath('/', 'layout');
        return NextResponse.json(banner, { status: 200 });
    } catch (err) {
        console.error("Error saving page banner:", err);
        return NextResponse.json({ message: "Error saving page banner", error: err.message }, { status: 500 });
    }
}
