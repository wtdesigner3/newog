import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "@/app/lib/config";
import HomeExtra from "@/app/models/HomeExtra";
import { requirePermission } from "@/app/lib/auth";

// GET home-extra (Public)
export async function GET() {
    await connectDB();
    const homeExtra = await HomeExtra.find().lean();
    return Response.json(homeExtra);
}

// POST home-extra (Requires 'home:update' permission)
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
        }

        const updateData = {
            choose_badge: body.choose_badge !== undefined ? body.choose_badge : "",
            choose_title: body.choose_title || "",
            choose_subtitle: body.choose_subtitle || "",
            product_badge: body.product_badge !== undefined ? body.product_badge : "",
            product_title: body.product_title || "",
            product_subtitle: body.product_subtitle || "",
            certified_badge: body.certified_badge !== undefined ? body.certified_badge : "",
            certified_title: body.certified_title || "",
            certified_subtitle: body.certified_subtitle || "",
            work_badge: body.work_badge !== undefined ? body.work_badge : "",
            work_title: body.work_title || "",
            work_subtitle: body.work_subtitle || "",
            blog_badge: body.blog_badge !== undefined ? body.blog_badge : "",
            blog_title: body.blog_title || "",
            blog_subtitle: body.blog_subtitle || "",
            contact_badge: body.contact_badge !== undefined ? body.contact_badge : "",
            contact_title: body.contact_title || "",
            contact_subtitle: body.contact_subtitle || "",
        };

        let homeExtra = await HomeExtra.findOne();
        if (homeExtra) {
            homeExtra = await HomeExtra.findByIdAndUpdate(homeExtra._id, updateData, { new: true });
        } else {
            homeExtra = await HomeExtra.create(updateData);
        }

        revalidatePath('/');
        revalidatePath('/', 'page');
        revalidatePath('/', 'layout');
        return Response.json({
            message: "HomeExtra saved successfully",
            data: homeExtra,
        });

    } catch (error) {
        return Response.json(
            { message: "Save failed", error: error.message },
            { status: 500 }
        );
    }
}
