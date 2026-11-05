import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "@/app/lib/config";
import ContactPage from "@/app/models/ContactPage";
import { uploadFile, isUploadFile, deleteFile } from "@/lib/upload";
import { requirePermission } from "@/app/lib/auth";

// GET /api/contact-page (Public)
export async function GET() {
    try {
        await connectDB();
        let page = await ContactPage.findOne();
        if (!page) {
            page = await ContactPage.create({});
        }
        return Response.json({ success: true, data: page });
    } catch (error) {
        return Response.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PUT /api/contact-page (Requires 'contact_cms:update' permission)
export async function PUT(request) {
    const { user, error } = await requirePermission(request, 'contact_cms', 'update');
    if (error) return error;

    try {
        await connectDB();
        const formData = await request.formData();

        let page = await ContactPage.findOne();
        if (!page) {
            page = new ContactPage();
        }

        // Process File Uploads
        const headerImage = formData.get("headerImage");
        if (isUploadFile(headerImage)) {
            const oldImage = page.headerImage;
            page.headerImage = await uploadFile(headerImage, "contact", "header");

            if (oldImage) {
                await deleteFile(oldImage);
            }
        }

        // Text Fields
        if (formData.has("headerTitle")) page.headerTitle = formData.get("headerTitle");
        if (formData.has("contactSubTitle")) page.contactSubTitle = formData.get("contactSubTitle");
        if (formData.has("contactTitle")) page.contactTitle = formData.get("contactTitle");
        if (formData.has("contactDescription")) page.contactDescription = formData.get("contactDescription");
        if (formData.has("mapIframeUrl")) page.mapIframeUrl = formData.get("mapIframeUrl");

        // Locations Array
        if (formData.has("locations")) {
            try {
                const locations = JSON.parse(formData.get("locations"));
                if (Array.isArray(locations)) {
                    page.locations = locations;
                }
            } catch (e) {
                console.error("Invalid locations JSON format");
            }
        }

        // SEO Fields
        if (formData.has("metatag")) page.metatag = formData.get("metatag");
        if (formData.has("metaDescription")) page.metaDescription = formData.get("metaDescription");
        if (formData.has("canonicalUrl")) page.canonicalUrl = formData.get("canonicalUrl");
        if (formData.has("ogTitle")) page.ogTitle = formData.get("ogTitle");
        if (formData.has("ogDescription")) page.ogDescription = formData.get("ogDescription");
        if (formData.has("twitterCard")) page.twitterCard = formData.get("twitterCard");
        if (formData.has("robots")) page.robots = formData.get("robots");

        if (formData.has("metakeywords")) {
            try {
                page.metakeywords = JSON.parse(formData.get("metakeywords"));
            } catch (e) {}
        }
        
        if (formData.has("schemaMarkup")) {
            try {
                page.schemaMarkup = JSON.parse(formData.get("schemaMarkup"));
            } catch (e) {}
        }

        await page.save();

        revalidatePath('/', 'layout');
        return Response.json({ success: true, message: "Contact Page updated", data: page });
    } catch (err) {
        console.error("[PUT /api/contact-page] Error:", err);
        return Response.json({ success: false, message: err.message }, { status: 500 });
    }
}
