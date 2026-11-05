import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../../lib/config";
import HomeExtra from "../../../models/HomeExtra";
import { requirePermission } from "../../../lib/auth";

export async function PUT(request, context) {
    const { user, error } = await requirePermission(request, 'home', 'update');
    if (error) return error;

    await connectDB();

    const body = await request.json();
    const { id } = await context.params;

    try {
        const existingHomeExtra = await HomeExtra.findById(id);
        if (!existingHomeExtra) {
            return Response.json({ message: "HomeExtra not found" }, { status: 404 });
        }

        const homeExtra = await HomeExtra.findByIdAndUpdate(
            id,
            {
                choose_title: body.choose_title,
                choose_subtitle: body.choose_subtitle,
                product_title: body.product_title,
                product_subtitle: body.product_subtitle,
                certified_title: body.certified_title,
                work_title: body.work_title,
                work_subtitle: body.work_subtitle,
                blog_title: body.blog_title,
                blog_subtitle: body.blog_subtitle,
                contact_title: body.contact_title,
                contact_subtitle: body.contact_subtitle,
            },
            { new: true }
        );

        revalidatePath('/', 'layout');
        return Response.json({ message: "Updated successfully", data: homeExtra });

    } catch (error) {
        return Response.json({ message: "Update failed", error: error.message }, { status: 500 });
    }
}
