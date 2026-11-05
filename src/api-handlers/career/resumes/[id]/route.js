export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { connectDB } from '@/app/lib/config';
import CareerApplication from '@/app/models/CareerApplication';
import { requirePermission } from '@/app/lib/auth';
import { getPrivateResumeDir } from '@/lib/upload';

// GET /api/career/resumes/[id] — Authenticated admin resume download endpoint
export async function GET(request, context) {
  // 1. Enforce admin authentication & permission check (FINDING-601-05 dedicated permission)
  const { user, error } = await requirePermission(request, 'careers', 'read');
  if (error) {
    return error; // Returns 401 or 403 sanitized JSON
  }

  try {
    const params = await context.params;
    const { id } = params;

    if (!id || typeof id !== 'string') {
      return Response.json(
        { success: false, message: "A valid resume identifier is required." },
        { status: 400 }
      );
    }

    let resumeKey = null;
    let originalFilename = 'candidate-resume.pdf';

    // 2. Resolve via MongoDB CareerApplication record if ID is an ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      await connectDB();
      const application = await CareerApplication.findById(id).lean();

      if (!application) {
        return Response.json(
          { success: false, message: "Career application record not found." },
          { status: 404 }
        );
      }

      resumeKey = application.resumeKey;
      if (!resumeKey && application.resumeUrl) {
        // Fallback resolution for migrated legacy records
        resumeKey = path.basename(application.resumeUrl);
      }

      if (application.resumeOriginalName) {
        originalFilename = application.resumeOriginalName;
      }
    } else {
      // 3. Alternatively resolve directly by validated opaque UUID storage key
      const isOpaqueKey =
        /^resume-[a-zA-Z0-9_-]+\.pdf$/.test(id) ||
        /^\d+-resume-[a-zA-Z0-9_-]+\.pdf$/.test(id);

      if (!isOpaqueKey) {
        return Response.json(
          { success: false, message: "Invalid resume identifier format." },
          { status: 400 }
        );
      }

      resumeKey = id;
    }

    if (!resumeKey) {
      return Response.json(
        { success: false, message: "No resume associated with this application." },
        { status: 404 }
      );
    }

    // 4. Confinement & Path Traversal Prevention
    const privateDir = path.resolve(getPrivateResumeDir());
    const safeKey = path.basename(resumeKey);
    const targetFilePath = path.resolve(privateDir, safeKey);

    if (!targetFilePath.startsWith(privateDir)) {
      console.warn("[Security] Path traversal attempt blocked on resume retrieval:", id);
      return Response.json(
        { success: false, message: "Access denied." },
        { status: 403 }
      );
    }

    if (!fs.existsSync(targetFilePath)) {
      return Response.json(
        { success: false, message: "Resume file not found in storage." },
        { status: 404 }
      );
    }

    // 5. Read file buffer and return with secure HTTP headers
    const fileBuffer = fs.readFileSync(targetFilePath);
    const safeDownloadName = originalFilename.replace(/[^a-zA-Z0-9._-]/g, '_');

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${safeDownloadName}"`,
        'Content-Length': fileBuffer.length.toString(),
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (err) {
    console.error("[Resume Download Error]:", err);
    return Response.json(
      { success: false, message: "Failed to retrieve resume file." },
      { status: 500 }
    );
  }
}

