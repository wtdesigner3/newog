export const dynamic = 'force-dynamic';
import { connectDB } from "@/app/lib/config";
import Enquiry from "@/app/models/Enquiry";
import { requirePermission } from "@/app/lib/auth";

// Neutralize CSV Formula Injection (prefix with single quote if starts with dangerous formula chars)
function sanitizeCsvCell(val) {
  if (val === null || val === undefined) return '""';
  let str = String(val).trim();
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

export async function GET(request) {
  const { user, error } = await requirePermission(request, 'enquiries', 'read');
  if (error) return error;

  try {
    await connectDB();
    
    // Fetch all enquiries, sorted by newest
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).lean();

    if (enquiries.length === 0) {
      return Response.json({ message: "No enquiries found to export." }, { status: 404 });
    }

    // CSV Header
    const headers = [
      "Date", "Company Name", "Contact Person", "Email", "Phone", 
      "Status", "Address", "Standard", "Grade", "Thickness Min", 
      "Thickness Max", "Width Min", "Width Max", "Qty", "Surface Finish",
      "Hardness", "Select Option", "UTS", "YS", "Elongation", 
      "End Use", "Special Requirements"
    ];

    // Map data to sanitized rows
    const rows = enquiries.map(eq => {
      return [
        sanitizeCsvCell(new Date(eq.createdAt).toISOString().split('T')[0]),
        sanitizeCsvCell(eq.companyName),
        sanitizeCsvCell(eq.contactPerson),
        sanitizeCsvCell(eq.email),
        sanitizeCsvCell(eq.contactNo),
        sanitizeCsvCell(eq.status || 'new'),
        sanitizeCsvCell(eq.address),
        sanitizeCsvCell(eq.standard),
        sanitizeCsvCell(eq.grade),
        sanitizeCsvCell(eq.thicknessMin),
        sanitizeCsvCell(eq.thicknessMax),
        sanitizeCsvCell(eq.widthMin),
        sanitizeCsvCell(eq.widthMax),
        sanitizeCsvCell(eq.qty),
        sanitizeCsvCell(eq.surfaceFinish),
        sanitizeCsvCell(eq.hardness),
        sanitizeCsvCell(eq.selectOne),
        sanitizeCsvCell(eq.uts),
        sanitizeCsvCell(eq.ys),
        sanitizeCsvCell(eq.elongation),
        sanitizeCsvCell(eq.endUse),
        sanitizeCsvCell(eq.specialRequirements)
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\r\n');

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="ogheavyduty_enquiries_export.csv"',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    });
  } catch (err) {
    console.error("[GET /api/enquiries/export] Error:", err);
    return Response.json({ message: "Failed to export data", error: err.message }, { status: 500 });
  }
}
