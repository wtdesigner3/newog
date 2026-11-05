import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "@/app/lib/config";
import Banner from "@/app/models/Banner";
import fs from "fs";
import path from "path";
import { uploadFile, isUploadFile, deleteFile } from "@/lib/upload";
import { requirePermission } from "@/app/lib/auth";

// GET single Banner by ID (Public)
export async function GET(request, context) {
    try {
        await connectDB();
        const { id } = await context.params;
        const banner = await Banner.findById(id).lean();
        if (!banner) {
            return Response.json({ message: "Banner not found" }, { status: 404 });
        }
        return Response.json(banner);
    } catch (error) {
        return Response.json({ message: "Failed to fetch banner", error: error.message }, { status: 500 });
    }
}

// PUT to update Banner (Requires 'home:update' permission)
export async function PUT(request, context) {
    const { user, error } = await requirePermission(request, 'home', 'update');
    if (error) return error;

    try {
        await connectDB();

        const formData = await request.formData();
        const { id } = await context.params;

        const existingBanner = await Banner.findById(id);

        if (!existingBanner) {
            return Response.json(
                { message: "Banner not found" },
                { status: 404 }
            );
        }

        const image = formData.get("image");
        let imageUrl = existingBanner.image;

        if (isUploadFile(image)) {
            imageUrl = await uploadFile(image, "banner", "banner");
            if (existingBanner.image) {
                await deleteFile(existingBanner.image);
            }
        }

        const updateData = {
            kicker: formData.get("kicker") !== null ? formData.get("kicker") : (existingBanner.kicker || ""),
            title: formData.get("title"),
            subtitle: formData.get("subtitle"),
            url: formData.get("url"),
            buttonText: formData.get("buttonText"),
            alt: formData.get("alt"),
            status: formData.get("status"),
            sort: Number(formData.get("sort")),
            showCertifications: formData.get("showCertifications") === "true",
            image: imageUrl,
        };

        const banner = await Banner.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        revalidatePath('/');
        revalidatePath('/', 'page');
        revalidatePath('/', 'layout');

        return Response.json({
            message: "Updated successfully",
            data: banner,
        });

    } catch (error) {
        return Response.json(
            { message: "Update failed", error: error.message },
            { status: 500 }
        );
    }
}

// DELETE a Banner (Requires 'home:update' permission)
export async function DELETE(request, context) {
    const { user, error } = await requirePermission(request, 'home', 'update');
    if (error) return error;

    try {
        await connectDB();
        const { id } = await context.params;
        const banner = await Banner.findById(id);

        if (!banner) {
            return Response.json(
                { message: "Banner not found" },
                { status: 404 }
            );
        }

        if (banner.image) {
            await deleteFile(banner.image);
        }

        await Banner.findByIdAndDelete(id);

        revalidatePath('/');
        revalidatePath('/', 'page');
        revalidatePath('/', 'layout');

        return Response.json({
            message: "Deleted successfully",
        });

    } catch (error) {
        return Response.json(
            { message: "Delete failed", error: error.message },
            { status: 500 }
        );
    }
}
