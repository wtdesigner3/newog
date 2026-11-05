import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../lib/config";
import SecuritySettings from "../../models/SecuritySettings";
import { logActivity } from "../../../lib/logger";
import { requireSuperAdmin } from '../../lib/auth';

// GET /api/security — Fetch security settings (Super Admin Only)
export async function GET(request) {
    const { user, error } = await requireSuperAdmin(request);
    if (error) return error;

    try {
        await connectDB();
        let settings = await SecuritySettings.findOne();
        if (!settings) {
            settings = await SecuritySettings.create({});
        }
        return Response.json({ data: settings });
    } catch (err) {
        return Response.json({ message: "Failed to fetch security settings", error: err.message }, { status: 500 });
    }
}

// PUT /api/security — Update security settings (Super Admin Only)
export async function PUT(request) {
    const { user, error } = await requireSuperAdmin(request);
    if (error) return error;

    try {
        await connectDB();
        const data = await request.json();
        
        let settings = await SecuritySettings.findOne();
        if (!settings) {
            settings = await SecuritySettings.create(data);
        } else {
            settings = await SecuritySettings.findByIdAndUpdate(settings._id, data, { new: true });
        }

        const ipAddress = request.headers.get("x-forwarded-for") || "unknown";
        await logActivity(
            'Updated Security Settings',
            'Security',
            `Updated rate limits or security policy by ${user.email}.`,
            user.doc,
            ipAddress
        ).catch(() => {});

        revalidatePath('/', 'layout');
        return Response.json({ message: "Settings updated successfully", data: settings });
    } catch (err) {
        return Response.json({ message: "Failed to update security settings", error: err.message }, { status: 500 });
    }
}
