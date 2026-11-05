import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/config";
import CustomPage from "@/app/models/CustomPage";
import { uploadFile } from "@/lib/upload";
import { requirePermission } from "@/app/lib/auth";

// GET /api/custom-pages (Public)
export async function GET() {
    try {
        await connectDB();
        const pages = await CustomPage.find().sort({ createdAt: -1 });
        return NextResponse.json(pages, { status: 200 });
    } catch (error) {
        console.error("Error fetching custom pages:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/custom-pages (Requires 'inner_pages:create' permission)
export async function POST(req) {
    const { user, error } = await requirePermission(req, 'inner_pages', 'create');
    if (error) return error;

    try {
        await connectDB();
        const formData = await req.formData();
        
        const title = formData.get('title');
        const slug = formData.get('slug');
        
        if (!title || !slug) {
            return NextResponse.json({ error: 'Title and Slug are required' }, { status: 400 });
        }

        const existing = await CustomPage.findOne({ slug });
        if (existing) {
            return NextResponse.json({ error: 'Slug already in use' }, { status: 400 });
        }

        let bannerImage = '';
        const file = formData.get('bannerImage');
        if (file && file.size > 0) {
            bannerImage = await uploadFile(file, 'custom-pages', 'page');
        }

        const page = await CustomPage.create({
            title,
            slug,
            bannerTitle: formData.get('bannerTitle') || '',
            bannerSubtitle: formData.get('bannerSubtitle') || '',
            bannerImage,
            content: formData.get('content') || '',
            status: formData.get('status') || 'draft',
            metaTitle: formData.get('metaTitle') || '',
            metaDescription: formData.get('metaDescription') || '',
            metaKeywords: formData.get('metaKeywords') || '',
            canonicalUrl: formData.get('canonicalUrl') || '',
            ogTitle: formData.get('ogTitle') || '',
            ogDescription: formData.get('ogDescription') || '',
            twitterCard: formData.get('twitterCard') || 'summary',
            robots: formData.get('robots') || 'index, follow',
            schemaMarkup: formData.get('schemaMarkup') || ''
        });

        return NextResponse.json(page, { status: 201 });
    } catch (err) {
        console.error("POST Error: ", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
