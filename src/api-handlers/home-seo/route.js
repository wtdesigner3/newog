import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "@/app/lib/config";
import HomeSeo from "@/app/models/HomeSeo";
import { requirePermission } from "@/app/lib/auth";

// GET /api/home-seo (Public)
export async function GET() {
    await connectDB();
    const homeSeo = await HomeSeo.find().lean();
    return Response.json(homeSeo);
}

// POST /api/home-seo (Requires 'home:update' permission)
export async function POST(request) {
    const { user, error } = await requirePermission(request, 'home', 'update');
    if (error) return error;

    try {
        await connectDB();

        const contentType = request.headers.get('content-type') || '';
        let body = {};

        if (contentType.includes('application/json')) {
            body = await request.json();
        } else {
            const formData = await request.formData();
            body = Object.fromEntries(formData.entries());
            if (body.metaKeywords && typeof body.metaKeywords === 'string') {
                body.metaKeywords = body.metaKeywords.split(',').map(k => k.trim()).filter(Boolean);
            }
            if (body.schema && typeof body.schema === 'string') {
                try { body.schema = JSON.parse(body.schema); } catch { body.schema = {}; }
            }
        }

        const updateData = {
            pageSlug:        body.pageSlug        || 'home',
            title:           body.title           || '',
            metaDescription: body.metaDescription || '',
            metaKeywords:    body.metaKeywords    || [],
            canonicalUrl:    body.canonicalUrl    || '',
            ogTitle:         body.ogTitle         || '',
            ogDescription:   body.ogDescription   || '',
            ogImage:         body.ogImage         || '',
            twitterCard:     body.twitterCard     || 'summary_large_image',
            robots:          body.robots          || 'index, follow',
            schema:          body.schema          || {},
            h1:              body.h1              || '',
            updatedAt:       new Date().toISOString().split('T')[0],
        };

        const existing = await HomeSeo.findOne({ pageSlug: updateData.pageSlug });
        let homeSeo;

        if (existing) {
            homeSeo = await HomeSeo.findByIdAndUpdate(existing._id, updateData, { new: true });
        } else {
            homeSeo = await HomeSeo.create(updateData);
        }

        revalidatePath('/', 'layout');
        return Response.json({
            message: "HomeSeo saved successfully",
            data: homeSeo,
        });

    } catch (err) {
        return Response.json(
            { message: "Save failed", error: err.message },
            { status: 500 }
        );
    }
}
