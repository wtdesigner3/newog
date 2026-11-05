export const dynamic = 'force-dynamic';
import { connectDB } from "../../../lib/config";
import CareerApplication from "../../../models/CareerApplication";
import { uploadResumeFile, isUploadFile, deletePrivateResume } from "../../../../lib/upload";
import { requirePermission, requireAuth } from "../../../lib/auth";
import { sendCareerApplicationEmail } from "../../../../lib/email";
import { verifyRecaptcha } from "../../../../lib/captcha";

// In-memory rate limiting map
const careerRateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

// Clean rate limit map periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of careerRateLimitMap.entries()) {
      if (now - data.firstRequest > RATE_LIMIT_WINDOW_MS) {
        careerRateLimitMap.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}

// Sanitize string
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
}

// GET /api/career/apply — List career submissions (Super Admin / Admin Only)
export async function GET(request) {
  const { user, error: authError } = await requireAuth(request);
  if (authError) return authError;

  if (user.role !== 'super_admin') {
    const permissions = user.permissions || {};
    const hasCareer = permissions.careers?.includes('read');
    const hasInner = permissions.inner_pages?.includes('read');
    if (!hasCareer && !hasInner) {
      return Response.json(
        { success: false, message: "Forbidden: You do not have 'read' permission on 'careers'." },
        { status: 403 }
      );
    }
  }

  try {
    await connectDB();
    const applications = await CareerApplication.find().sort({ createdAt: -1 }).lean();

    // Map resumeUrl to authenticated API endpoint for each application
    const sanitizedApplications = applications.map((app) => ({
      ...app,
      resumeUrl: `/api/career/resumes/${app._id}`,
    }));

    return Response.json({ success: true, data: sanitizedApplications });
  } catch (err) {
    return Response.json({ success: false, message: "Failed to fetch career applications" }, { status: 500 });
  }
}

// POST /api/career/apply — Public application submission with private PDF resume validation & CAPTCHA
export async function POST(request) {
  let uploadedStorageKey = null;

  try {
    // 1. IP Rate Limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('remote-addr') ||
      'anonymous';

    const now = Date.now();
    const clientData = careerRateLimitMap.get(ip) || { count: 0, firstRequest: now };

    if (now - clientData.firstRequest > RATE_LIMIT_WINDOW_MS) {
      clientData.count = 1;
      clientData.firstRequest = now;
    } else {
      clientData.count++;
      if (clientData.count > MAX_REQUESTS_PER_WINDOW) {
        return Response.json(
          { success: false, message: "Too many application attempts. Please wait a minute before trying again." },
          { status: 429 }
        );
      }
    }
    careerRateLimitMap.set(ip, clientData);

    const formData = await request.formData();

    // 2. Honeypot check
    if (formData.get("website") || formData.get("_hp") || formData.get("fax") || formData.get("url")) {
      return Response.json(
        { success: true, message: "Application submitted successfully", data: { id: "mock_ack" } },
        { status: 201 }
      );
    }

    // 3. Google reCAPTCHA v3 verification
    const captchaToken = formData.get("recaptchaToken");
    const captchaResult = await verifyRecaptcha(captchaToken, {
      expectedAction: "career_application",
      remoteIp: ip,
    });

    if (!captchaResult.success) {
      return Response.json(
        { success: false, message: captchaResult.error || "CAPTCHA verification failed. Please try again." },
        { status: 400 }
      );
    }

    // 4. Input Sanitization & Normalization
    const fullName = sanitize(String(formData.get("fullName") || formData.get("name") || ""));
    const email = sanitize(String(formData.get("email") || "")).toLowerCase();
    const phone = sanitize(String(formData.get("phone") || formData.get("contactNo") || ""));
    const position = sanitize(String(formData.get("position") || formData.get("applyfor") || "General Application"));
    const experienceYears = sanitize(String(formData.get("experienceYears") || formData.get("experience") || ""));
    const location = sanitize(String(formData.get("location") || ""));
    const message = sanitize(String(formData.get("message") || ""));
    const resumeFile = formData.get("resume");

    // 5. Validation
    if (!fullName || !email || !phone) {
      return Response.json(
        { success: false, message: "Full Name, Email, and Phone number are required." },
        { status: 400 }
      );
    }

    if (fullName.length > 120 || email.length > 120 || phone.length > 30 || position.length > 120 || message.length > 3000) {
      return Response.json(
        { success: false, message: "Input fields exceed allowed character lengths." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      return Response.json(
        { success: false, message: "Please provide a valid telephone number (7 to 15 digits)." },
        { status: 400 }
      );
    }

    if (!isUploadFile(resumeFile)) {
      return Response.json(
        { success: false, message: "A valid PDF resume is required (max 5 MB)." },
        { status: 400 }
      );
    }

    // 6. Resume Signature Validation & Safe Private Disk Storage (Outside public/)
    const uploadResult = await uploadResumeFile(resumeFile);
    uploadedStorageKey = uploadResult.storageKey;

    // 7. Database Persistence
    await connectDB();
    const application = await CareerApplication.create({
      fullName,
      email,
      phone,
      position: position + (location ? ` (${location})` : ""),
      experienceYears,
      message,
      resumeKey: uploadResult.storageKey,
      resumeOriginalName: uploadResult.originalName,
      resumeSize: uploadResult.size,
      resumeMime: uploadResult.mimeType,
      resumeUrl: `/api/career/resumes/${uploadResult.storageKey}`,
      status: 'new',
    });

    // Update resumeUrl to point to application document ID
    application.resumeUrl = `/api/career/resumes/${application._id}`;
    await application.save();

    // 8. Business Notification Email (Secure authenticated link only)
    try {
      if (typeof sendCareerApplicationEmail === 'function') {
        await sendCareerApplicationEmail({
          fullName,
          email,
          phone,
          position,
          experienceYears,
          location,
          message,
          resumeUrl: `/api/career/resumes/${application._id}`,
        });
      }
    } catch (mailErr) {
      console.error("[Career Email Notification Failed]:", mailErr);
    }

    return Response.json(
      {
        success: true,
        message: "Application submitted successfully",
        data: { id: application._id },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/career/apply] Error:", err);

    // Clean up uploaded resume file from private storage if database insert failed
    if (uploadedStorageKey) {
      try {
        await deletePrivateResume(uploadedStorageKey);
      } catch (cleanErr) {
        console.error("[Career CleanUp Failed]:", cleanErr);
      }
    }

    return Response.json(
      { success: false, message: err.message || "Failed to submit application" },
      { status: 400 }
    );
  }
}
