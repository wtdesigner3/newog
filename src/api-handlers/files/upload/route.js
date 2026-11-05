import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { uploadFile } from "@/lib/upload";
import { requireAuth } from "@/app/lib/auth";

function hasMediaPermission(user, action) {
  if (user?.role === 'super_admin') return true;
  return (
    user?.hasPermission?.('media', action) ||
    user?.hasPermission?.('files', action) ||
    user?.hasPermission?.('file_manager', action) ||
    false
  );
}

export async function POST(request) {
  // Enforce authentication & RBAC for file manager uploads
  const { user, error } = await requireAuth(request);
  if (error) return error;

  if (!hasMediaPermission(user, 'create')) {
    return Response.json({ success: false, message: "Forbidden: Media upload permission required." }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = (formData.get('folder') || 'manager').replace(/[^a-zA-Z0-9_-]/g, '');

    if (!file) {
      return Response.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    // Never allow uploading to private resumes folder via public media upload API
    if (folder.toLowerCase().includes('resume')) {
      return Response.json({ success: false, message: "Security Exception: Uploading to resumes folder is restricted." }, { status: 403 });
    }

    const url = await uploadFile(file, folder, 'asset');

    // On-Demand Revalidation
    revalidatePath('/', 'layout');
    return Response.json({ success: true, message: "File uploaded successfully", url }, { status: 201 });
  } catch (err) {
    console.error("[API files upload] Upload failed:", err);
    return Response.json({ success: false, message: "Upload failed", error: err.message }, { status: err.statusCode || 400 });
  }
}
