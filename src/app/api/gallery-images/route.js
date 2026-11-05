import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../lib/config";
import { NextResponse } from "next/server";
import GalleryImage from "../../models/GalleryImage";
import { uploadFile, isUploadFile } from "../../../lib/upload";
import { requirePermission } from "../../lib/auth";

// GET /api/gallery-images (Public)
export async function GET(request) {
    try {
        await connectDB();
        const images = await GalleryImage.find().sort({ sort: 1, createdAt: -1 }).lean();
        return NextResponse.json(images);
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch images" }, { status: 500 });
    }
}

// POST /api/gallery-images (Requires 'gallery:create' permission)
export async function POST(request) {
    const { user, error } = await requirePermission(request, 'gallery', 'create');
    if (error) return error;

    try {
        await connectDB();
        const formData = await request.formData();
        
        const files = [];
        const captions = [];
        
        for (let [key, value] of formData.entries()) {
            if (key.startsWith('files[')) {
                files.push(value);
            } else if (key.startsWith('captions[')) {
                captions.push(value);
            }
        }

        if (files.length === 0) {
            return Response.json({ message: "No files uploaded" }, { status: 400 });
        }

        const uploadedImages = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const caption = captions[i] || "";

            if (isUploadFile(file)) {
                const url = await uploadFile(file, "gallery", "gal");
                const newImg = await GalleryImage.create({
                    url,
                    caption,
                    sort: 0,
                    isActive: true,
                });
                uploadedImages.push(newImg);
            }
        }

        revalidatePath('/', 'layout');
        return Response.json({
            message: "Images uploaded successfully",
            data: uploadedImages,
        }, { status: 201 });

    } catch (err) {
        return Response.json({ message: "Upload failed", error: err.message }, { status: 500 });
    }
}
