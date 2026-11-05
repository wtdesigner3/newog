export const dynamic = 'force-dynamic';
import { revalidatePath } from 'next/cache';
import { connectDB } from "@/app/lib/config";
import Section from "@/app/models/Section";
import { uploadFile, isUploadFile, deleteFile } from "@/lib/upload";
import { requirePermission } from "@/app/lib/auth";

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        await connectDB();
        const section = await Section.findById(id);
        if (!section) return Response.json({ message: "Section not found" }, { status: 404 });
        return Response.json(section);
    } catch (error) {
        return Response.json({ message: "Failed to fetch section", error: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { user, error } = await requirePermission(request, 'inner_pages', 'update');
    if (error) return error;

    try {
        const { id } = await params;
        await connectDB();

        const formData = await request.formData();

        const name = formData.get("name");
        const slug = formData.get("slug");
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

        if (!name || !slug) {
            return Response.json({ message: "Name and slug are required" }, { status: 400 });
        }

        const existingSection = await Section.findById(id);
        if (!existingSection) {
            return Response.json({ message: "Section not found" }, { status: 404 });
        }

        const duplicateSlug = await Section.findOne({ slug, _id: { $ne: id } });
        if (duplicateSlug) {
            return Response.json({ message: "Slug already exists" }, { status: 400 });
        }

        let bannerImageUrl = existingSection.bannerImage;
        const bannerFile = formData.get("bannerImage");

        if (isUploadFile(bannerFile)) {
            bannerImageUrl = await uploadFile(bannerFile, "sections", "section-banner");
            if (existingSection.bannerImage) {
                await deleteFile(existingSection.bannerImage);
            }
        }

        const updatedSection = await Section.findByIdAndUpdate(
            id,
            {
                name,
                slug,
                sort,
                bannerImage: bannerImageUrl,
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
        return Response.json(updatedSection);

    } catch (err) {
        console.error("Section Update Error:", err);
        return Response.json(
            { message: "Failed to update section", error: err.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    const { user, error } = await requirePermission(request, 'inner_pages', 'delete');
    if (error) return error;

    try {
        const { id } = await params;
        await connectDB();

        const section = await Section.findById(id);
        if (!section) {
            return Response.json({ message: "Section not found" }, { status: 404 });
        }

        if (section.bannerImage) {
            await deleteFile(section.bannerImage);
        }

        await Section.findByIdAndDelete(id);

        revalidatePath('/', 'layout');
        return Response.json({ message: "Section deleted successfully" });
    } catch (err) {
        return Response.json(
            { message: "Failed to delete section", error: err.message },
            { status: 500 }
        );
    }
}
