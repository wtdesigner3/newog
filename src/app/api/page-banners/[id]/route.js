import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/config";
import PageBanner from "../../../models/PageBanner";
import { deleteFile } from "../../../../lib/upload";
import { requirePermission } from "../../../lib/auth";

export async function DELETE(req, context) {
    const { user, error } = await requirePermission(req, 'inner_pages', 'delete');
    if (error) return error;

    try {
        const { id } = await context.params;
        await connectDB();
        
        const banner = await PageBanner.findById(id);
        if (!banner) {
            return NextResponse.json({ message: "Banner not found" }, { status: 404 });
        }

        if (banner.image) {
            await deleteFile(banner.image);
        }

        await PageBanner.findByIdAndDelete(id);
        
        revalidatePath('/', 'layout');
        return NextResponse.json({ message: "Banner deleted" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: "Error deleting banner", error: err.message }, { status: 500 });
    }
}
