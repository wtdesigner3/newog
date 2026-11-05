import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "@/app/lib/config";
import EmailTemplate from "@/app/models/EmailTemplate";
import { requireSuperAdmin } from "@/app/lib/auth";
import { NextResponse } from "next/server";

// GET /api/email-templates — List all email templates (Super Admin Only)
export async function GET(request) {
    const { user, error } = await requireSuperAdmin(request);
    if (error) return error;

    try {
        await connectDB();
        const templates = await EmailTemplate.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json(templates);
    } catch (err) {
        return Response.json({ message: "Failed to fetch email templates", error: err.message }, { status: 500 });
    }
}

// POST /api/email-templates — Create email template (Super Admin Only)
export async function POST(request) {
    const { user, error } = await requireSuperAdmin(request);
    if (error) return error;

    try {
        await connectDB();
        const data = await request.json();

        if (!data.name || !data.subject || !data.htmlContent) {
            return Response.json({ message: "Name, subject, and HTML content are required." }, { status: 400 });
        }

        const regex = /{{(.*?)}}/g;
        let match;
        const variables = new Set();
        while ((match = regex.exec(data.htmlContent)) !== null) {
            variables.add(match[1].trim());
        }
        data.variables = Array.from(variables);

        const template = await EmailTemplate.create(data);
        
        revalidatePath('/', 'layout');
        return Response.json({ message: "Template created successfully", data: template }, { status: 201 });
    } catch (err) {
        if (err.code === 11000) {
            return Response.json({ message: "Template name must be unique." }, { status: 400 });
        }
        return Response.json({ message: "Failed to create template", error: err.message }, { status: 500 });
    }
}
