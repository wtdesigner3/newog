export const dynamic = 'force-dynamic';
import { revalidatePath } from 'next/cache';
import { connectDB } from "../../lib/config";
import About from "../../models/About";
import { uploadFile, isUploadFile } from "../../../lib/upload";
import { requirePermission } from "../../lib/auth";

// GET all About pages (Public)
export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const section = searchParams.get('section');
        
        let query = {};
        if (section) {
            query.section = section;
        }

        const aboutPages = await About.find(query).sort({ sort: 1 }).lean();
        return Response.json(aboutPages);
    } catch (error) {
        return Response.json(
            { message: "Failed to fetch pages", error: error.message },
            { status: 500 }
        );
    }
}

// POST a new About page (Requires 'inner_pages:create' permission)
export async function POST(request) {
    const { user, error } = await requirePermission(request, 'inner_pages', 'create');
    if (error) return error;

    try {
        await connectDB();

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

        const existing = await About.findOne({ slug });
        if (existing) {
            return Response.json({ message: "Slug already exists" }, { status: 400 });
        }

        let imageUrl = "";
        let breadImageUrl = "";

        const imageFile = formData.get("image");
        const breadImageFile = formData.get("breadimage");

        if (isUploadFile(imageFile)) {
            imageUrl = await uploadFile(imageFile, "about", "about");
        }

        if (isUploadFile(breadImageFile)) {
            breadImageUrl = await uploadFile(breadImageFile, "about", "bread");
        }

        const newAbout = await About.create({
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
        });

        revalidatePath('/', 'layout');
        return Response.json(newAbout, { status: 201 });

    } catch (err) {
        console.error("About Creation Error:", err);
        return Response.json(
            { message: "Failed to create page", error: err.message },
            { status: 500 }
        );
    }
}
