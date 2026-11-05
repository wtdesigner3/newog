import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../lib/config";
import Enquiry from "../../models/Enquiry";
import { requirePermission } from "../../lib/auth";
import { sendNewEnquiryEmail } from "../../../lib/email";
import { verifyRecaptcha } from "../../../lib/captcha";

// Simple in-memory rate limiting map
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

// Clean rate limit map periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of rateLimitMap.entries()) {
      if (now - data.firstRequest > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}

// Sanitize string to remove control chars and trim
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
}

// GET /api/enquiries — Protected: list customer enquiries
export async function GET(request) {
  const { user, error } = await requirePermission(request, 'enquiries', 'read');
  if (error) return error;

  try {
    await connectDB();
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).lean();
    return Response.json(enquiries);
  } catch (err) {
    return Response.json({ message: "Failed to fetch enquiries", error: err.message }, { status: 500 });
  }
}

// POST /api/enquiries — Public customer submission with honeypot & reCAPTCHA
export async function POST(request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('remote-addr') ||
      'anonymous';

    const now = Date.now();
    const clientData = rateLimitMap.get(ip) || { count: 0, firstRequest: now };

    if (now - clientData.firstRequest > RATE_LIMIT_WINDOW_MS) {
      clientData.count = 1;
      clientData.firstRequest = now;
    } else {
      clientData.count++;
      if (clientData.count > MAX_REQUESTS_PER_WINDOW) {
        return Response.json(
          { message: "Too many requests. Please wait a minute before submitting again." },
          { status: 429 }
        );
      }
    }
    rateLimitMap.set(ip, clientData);

    const body = await request.json().catch(() => ({}));

    // Honeypot check: automated bots fill hidden form fields
    if (body.website || body._hp || body.fax || body.comment_body || body.url) {
      // Silently return success to mislead the bot without saving spam
      return Response.json(
        { message: "Enquiry submitted successfully", data: { id: "mock_ack" } },
        { status: 201 }
      );
    }

    // Google reCAPTCHA v3 verification
    const captchaResult = await verifyRecaptcha(body.recaptchaToken, {
      expectedAction: "enquiry_submission",
      remoteIp: ip,
    });

    if (!captchaResult.success) {
      return Response.json(
        { message: captchaResult.error || "CAPTCHA verification failed. Please refresh and try again." },
        { status: 400 }
      );
    }

    // Field Normalization, Mapping & Sanitization (Mass Assignment Defense)
    const contactPerson = sanitizeInput(body.contactPerson || body.name || body.fullName);
    const companyName = sanitizeInput(body.companyName || body.company) || "Individual / Residential";
    const email = sanitizeInput(body.email).toLowerCase();
    const contactNo = sanitizeInput(body.contactNo || body.phone || body.mobile);
    const address = sanitizeInput(body.address || body.city || body.location);
    const city = sanitizeInput(body.city || body.address || body.location);
    const message = sanitizeInput(body.message || body.specialRequirements);
    const specialRequirements = message || sanitizeInput(body.specialRequirements);
    const enquiryType = sanitizeInput(body.enquiryType) || "General Enquiry";
    const product = sanitizeInput(body.product || body.equipmentInterest || body.equipment);

    // Legacy technical fields preserved for backward compatibility
    const standard = sanitizeInput(body.standard);
    const grade = sanitizeInput(body.grade);
    const thicknessMin = sanitizeInput(body.thicknessMin);
    const thicknessMax = sanitizeInput(body.thicknessMax);
    const widthMin = sanitizeInput(body.widthMin);
    const widthMax = sanitizeInput(body.widthMax);
    const qty = sanitizeInput(body.qty);
    const surfaceFinish = sanitizeInput(body.surfaceFinish);
    const hardness = sanitizeInput(body.hardness);
    const selectOne = sanitizeInput(body.selectOne);
    const uts = sanitizeInput(body.uts);
    const ys = sanitizeInput(body.ys);
    const elongation = sanitizeInput(body.elongation);
    const endUse = sanitizeInput(body.endUse);

    // Sizing details object if submitted from /ac-sizing tool
    const sizingDetails = (body.sizingDetails && typeof body.sizingDetails === 'object')
      ? body.sizingDetails
      : null;

    // Validate required fields
    if (!contactPerson || !email || !contactNo) {
      return Response.json(
        { message: "Name, Email, and Phone number are required." },
        { status: 400 }
      );
    }

    // Enforce reasonable length limits to prevent payload abuse
    if (
      contactPerson.length > 120 ||
      companyName.length > 150 ||
      email.length > 120 ||
      contactNo.length > 30 ||
      address.length > 250 ||
      message.length > 4000
    ) {
      return Response.json(
        { message: "Input length exceeds allowed character limits." },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Phone format validation (allows digits, +, -, spaces, parentheses; min 7 digits)
    const phoneDigits = contactNo.replace(/\D/g, '');
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      return Response.json(
        { message: "Please provide a valid contact telephone number (7 to 15 digits)." },
        { status: 400 }
      );
    }

    await connectDB();

    const sanitizedEnquiry = {
      companyName,
      contactPerson,
      email,
      contactNo,
      address,
      city,
      message,
      enquiryType,
      product,
      sizingDetails,
      specialRequirements,
      standard,
      grade,
      thicknessMin,
      thicknessMax,
      widthMin,
      widthMax,
      qty,
      surfaceFinish,
      hardness,
      selectOne,
      uts,
      ys,
      elongation,
      endUse,
      status: 'new',
      isRead: false,
    };

    const enquiry = await Enquiry.create(sanitizedEnquiry);

    // Send email notification asynchronously
    try {
      await sendNewEnquiryEmail(sanitizedEnquiry);
    } catch (err) {
      console.error("[Email Notification Failed]:", err);
    }

    revalidatePath('/', 'layout');
    return Response.json(
      { message: "Enquiry submitted successfully", data: enquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/enquiries] Error:", error);
    return Response.json(
      { message: "Failed to submit enquiry. Please verify your entries and try again." },
      { status: 500 }
    );
  }
}
