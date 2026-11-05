import { NextResponse } from 'next/server';
import { uploadFile } from '../../../lib/upload';
import { requireAuth } from '../../lib/auth';

export async function POST(request) {
  // Enforce authentication for CKEditor uploads
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get('upload'); // CKEditor sends the file in the 'upload' field

    if (!file) {
      return NextResponse.json({ error: { message: "No file provided" } }, { status: 400 });
    }

    const url = await uploadFile(file, 'editor', 'ckeditor');

    // CKEditor 5 expects { url: string }
    return NextResponse.json({
      url: url
    });

  } catch (err) {
    console.error("CKEditor Upload Error:", err);
    return NextResponse.json({
      error: { message: err.message || "Upload failed" }
    }, { status: 400 });
  }
}
