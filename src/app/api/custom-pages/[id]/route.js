import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/config";
import CustomPage from "../../../models/CustomPage";
import { uploadFile, deleteFile } from "../../../../lib/upload";
import { requirePermission } from "../../../lib/auth";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        await connectDB();
        const page = await CustomPage.findById(id);
        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }
        return NextResponse.json(page, { status: 200 });
    } catch (error) {
        console.error("GET Error: ", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const { user, error } = await requirePermission(req, 'inner_pages', 'update');
    if (error) return error;

    try {
        const { id } = await params;
        await connectDB();
        const formData = await req.formData();
        
        const existingPage = await CustomPage.findById(id);
        if (!existingPage) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        const slug = formData.get('slug');
        if (slug && slug !== existingPage.slug) {
            const slugExists = await CustomPage.findOne({ slug });
            if (slugExists) {
                return NextResponse.json({ error: 'Slug already in use' }, { status: 400 });
            }
        }

        const updates = {
            title: formData.get('title') || existingPage.title,
            slug: slug || existingPage.slug,
            bannerTitle: formData.get('bannerTitle') ?? existingPage.bannerTitle,
            bannerSubtitle: formData.get('bannerSubtitle') ?? existingPage.bannerSubtitle,
            content: formData.get('content') ?? existingPage.content,
            status: formData.get('status') ?? existingPage.status,
            metaTitle: formData.get('metaTitle') ?? existingPage.metaTitle,
            metaDescription: formData.get('metaDescription') ?? existingPage.metaDescription,
            metaKeywords: formData.get('metaKeywords') ?? existingPage.metaKeywords,
            canonicalUrl: formData.get('canonicalUrl') ?? existingPage.canonicalUrl,
            ogTitle: formData.get('ogTitle') ?? existingPage.ogTitle,
            ogDescription: formData.get('ogDescription') ?? existingPage.ogDescription,
            twitterCard: formData.get('twitterCard') ?? existingPage.twitterCard,
            robots: formData.get('robots') ?? existingPage.robots,
            schemaMarkup: formData.get('schemaMarkup') ?? existingPage.schemaMarkup
        };

        const file = formData.get('bannerImage');
        if (file && file.size > 0) {
            if (existingPage.bannerImage) {
                await deleteFile(existingPage.bannerImage);
            }
            updates.bannerImage = await uploadFile(file, 'custom-pages', 'page');
        }

        const updatedPage = await CustomPage.findByIdAndUpdate(id, updates, { new: true });
        return NextResponse.json(updatedPage, { status: 200 });

    } catch (err) {
        console.error("PUT Error: ", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const { user, error } = await requirePermission(req, 'inner_pages', 'delete');
    if (error) return error;

    try {
        const { id } = await params;
        await connectDB();
        
        const existingPage = await CustomPage.findById(id);
        if (!existingPage) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        if (existingPage.bannerImage) {
            await deleteFile(existingPage.bannerImage);
        }

        await CustomPage.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Page deleted successfully' }, { status: 200 });
    } catch (err) {
        console.error("DELETE Error: ", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
