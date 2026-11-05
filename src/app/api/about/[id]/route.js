export const dynamic = 'force-dynamic';
import { revalidatePath } from 'next/cache';
import { connectDB } from "../../../lib/config";
import About from "../../../models/About";
import { uploadFile, isUploadFile, deleteFile } from "../../../../lib/upload";
import { requirePermission } from "../../../lib/auth";

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const about = await About.findById(id);

        if (!about) {
            return Response.json({ message: "About page not found" }, { status: 404 });
        }

        return Response.json(about);
    } catch (error) {
        return Response.json(
            { message: "Error fetching about page", error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    const { user, error } = await requirePermission(request, 'inner_pages', 'update');
    if (error) return error;

    try {
        await connectDB();
        const { id } = await params;
        const existing = await About.findById(id);

        if (!existing) {
            return Response.json({ message: "About page not found" }, { status: 404 });
        }

        const formData = await request.formData();

        const b_heading = formData.get("b_heading") || "";
        const title = formData.get("title");
        const slug = formData.get("slug");
        const content = formData.get("content") || "";
        const section = formData.get("section") || "";
        const alt = formData.get("alt") || "";
        const sort = formData.get("sort") ? Number(formData.get("sort")) : 0;
        const isActive = formData.get("isActive") !== "false";

        // SEO fields
        const metatag = formData.get("metatag") || "";
        const metaDescription = formData.get("metaDescription") || "";
        const canonicalUrl = formData.get("canonicalUrl") || "";
        const ogTitle = formData.get("ogTitle") || "";
        const ogDescription = formData.get("ogDescription") || "";
        const twitterCard = formData.get("twitterCard") || "summary_large_image";
        const robots = formData.get("robots") || "index, follow";

        let schemaObj = {};
        const schemaRaw = formData.get("schema");
        if (schemaRaw) {
            try { schemaObj = JSON.parse(schemaRaw); } catch (e) {}
        }

        let metakeywords = [];
        const kwRaw = formData.get("metakeywords");
        if (kwRaw) {
            try {
                const parsed = JSON.parse(kwRaw);
                metakeywords = Array.isArray(parsed) ? parsed.map(k => k.value || k) : kwRaw.split(',').map(s => s.trim());
            } catch (e) {
                metakeywords = kwRaw.split(',').map(s => s.trim());
            }
        }

        if (!title || !slug) {
            return Response.json({ message: "Title and slug are required" }, { status: 400 });
        }

        const duplicateSlug = await About.findOne({ slug, _id: { $ne: id } });
        if (duplicateSlug) {
            return Response.json({ message: "Slug already exists" }, { status: 400 });
        }

        let imageUrl = existing.image;
        let breadImageUrl = existing.breadimage;

        const imageFile = formData.get("image");
        const breadImageFile = formData.get("breadimage");

        if (isUploadFile(imageFile)) {
            imageUrl = await uploadFile(imageFile, "about", "about");
            if (existing.image) {
                await deleteFile(existing.image);
            }
        }

        if (isUploadFile(breadImageFile)) {
            breadImageUrl = await uploadFile(breadImageFile, "about", "bread");
            if (existing.breadimage) {
                await deleteFile(existing.breadimage);
            }
        }

        const updatedAbout = await About.findByIdAndUpdate(
            id,
            {
                b_heading,
                title,
                slug,
                content,
                section,
                image: imageUrl,
                breadimage: breadImageUrl,
                alt,
                sort,
                isActive,
                metatag,
                metaDescription,
                metakeywords,
                canonicalUrl,
                ogTitle,
                ogDescription,
                twitterCard,
                robots,
                schemaMarkup: schemaObj,
            },
            { new: true }
        );

        revalidatePath('/', 'layout');
        return Response.json(updatedAbout);

    } catch (err) {
        console.error("About Update Error:", err);
        return Response.json(
            { message: "Failed to update page", error: err.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    const { user, error } = await requirePermission(request, 'inner_pages', 'delete');
    if (error) return error;

    try {
        await connectDB();
        const { id } = await params;

        const existing = await About.findById(id);
        if (!existing) {
            return Response.json({ message: "About page not found" }, { status: 404 });
        }

        if (existing.image) {
            await deleteFile(existing.image);
        }

        if (existing.breadimage) {
            await deleteFile(existing.breadimage);
        }

        await About.findByIdAndDelete(id);

        revalidatePath('/', 'layout');
        return Response.json({ message: "About page deleted successfully" });
    } catch (err) {
        return Response.json(
            { message: "Failed to delete page", error: err.message },
            { status: 500 }
        );
    }
}
