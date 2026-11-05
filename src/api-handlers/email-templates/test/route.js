import { revalidatePath } from "next/cache";
import { sendTestEmail } from "@/lib/email";
import { connectDB } from "@/app/lib/config";
import EmailTemplate from "@/app/models/EmailTemplate";
import { requireSuperAdmin } from "@/app/lib/auth";

export const dynamic = 'force-dynamic';

// POST /api/email-templates/test — Send test email (Super Admin Only)
export async function POST(request) {
    const { user, error } = await requireSuperAdmin(request);
    if (error) return error;

    try {
        await connectDB();
        const data = await request.json();
        
        const { templateId, toEmail } = data;

        if (!templateId || !toEmail) {
            return Response.json({ message: "Template ID and target Email are required." }, { status: 400 });
        }

        const template = await EmailTemplate.findById(templateId);
        
        if (!template) {
            return Response.json({ message: "Template not found" }, { status: 404 });
        }

        await sendTestEmail(toEmail, template.subject, template.htmlContent);

        revalidatePath('/', 'layout');
        return Response.json({ message: `Test email sent to ${toEmail}` }, { status: 200 });
    } catch (err) {
        console.error("Test Email error:", err);
        return Response.json({ message: "Failed to send test email", error: err.message }, { status: 500 });
    }
}
