import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const fromEmail = process.env.EMAIL_SEND_FROM || 'onboarding@resend.dev';
const toEmail = process.env.EMAIL_SEND_TO || 'hello@example.com';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const getEmailWrapper = (title, content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f1f5f9;
      margin: 0;
      padding: 0;
      color: #1e293b;
    }
    .email-container {
      max-width: 640px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #0b192c 0%, #1e3a8a 100%);
      padding: 28px 32px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 8px 0 0 0;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .header p {
      color: #93c5fd;
      margin: 4px 0 0 0;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .content {
      padding: 32px;
    }
    .content p {
      font-size: 15px;
      line-height: 1.6;
      margin-top: 0;
      color: #475569;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
      margin-bottom: 24px;
    }
    .data-table th, .data-table td {
      padding: 12px 14px;
      border-bottom: 1px solid #e2e8f0;
      text-align: left;
    }
    .data-table th {
      background-color: #f8fafc;
      font-weight: 600;
      color: #334155;
      width: 35%;
      font-size: 13px;
    }
    .data-table td {
      font-size: 14px;
      color: #0f172a;
    }
    .section-title {
      margin-top: 28px;
      margin-bottom: 8px;
      font-size: 16px;
      color: #0f172a;
      border-bottom: 2px solid #0f7ae0;
      padding-bottom: 6px;
    }
    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      background-color: #e0f2fe;
      color: #0284c7;
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px 32px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      margin: 0;
      font-size: 12px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <p>OG Heavy Duty Air Conditioners</p>
      <h1>${escapeHtml(title)}</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>This is an automated notification from the official OG Heavy Duty website (ogheavyduty.in).</p>
      <p style="margin-top: 4px;">D-14, Rajan Babu Road, Adarsh Nagar, New Delhi - 110033</p>
    </div>
  </div>
</body>
</html>
`;

export const sendNewEnquiryEmail = async (data) => {
  if (!resend) {
    console.warn("RESEND_API_KEY is not configured. Skipping email dispatch.");
    return { success: false, reason: "unconfigured" };
  }

  const {
    companyName, contactPerson, email, contactNo, address, city,
    message, enquiryType, product, sizingDetails,
    standard, grade, thicknessMin, thicknessMax, widthMin, widthMax,
    qty, surfaceFinish, hardness, selectOne, uts, ys, elongation,
    endUse, specialRequirements
  } = data;

  let sizingHtml = '';
  if (sizingDetails && typeof sizingDetails === 'object') {
    sizingHtml = `
      <h3 class="section-title">Preliminary Sizing Specifications</h3>
      <table class="data-table">
        <tbody>
          <tr><th>Application Space</th><td>${escapeHtml(sizingDetails.spaceType || '-')}</td></tr>
          <tr><th>Dimensions / Area</th><td>${escapeHtml(sizingDetails.roomDimensions || '-')} (${escapeHtml(sizingDetails.totalAreaSqFt || '-')} sq.ft)</td></tr>
          <tr><th>Ceiling Height</th><td>${escapeHtml(sizingDetails.ceilingHeight || '-')}</td></tr>
          <tr><th>Peak Occupancy</th><td>${escapeHtml(sizingDetails.occupancy || '-')} persons</td></tr>
          <tr><th>Sunlight Exposure</th><td>${escapeHtml(sizingDetails.sunExposure || '-')}</td></tr>
          <tr><th>Heat Sources</th><td>${escapeHtml(sizingDetails.heatEquipment || '-')}</td></tr>
          <tr><th>Equipment Preference</th><td>${escapeHtml(sizingDetails.preferredType || '-')}</td></tr>
        </tbody>
      </table>
    `;
  }

  let technicalHtml = '';
  if (standard || grade || qty || thicknessMin) {
    technicalHtml = `
      <h3 class="section-title">Technical Specifications</h3>
      <table class="data-table">
        <tbody>
          <tr><th>Standard</th><td>${escapeHtml(standard || '-')}</td></tr>
          <tr><th>Grade</th><td>${escapeHtml(grade || '-')}</td></tr>
          <tr><th>Thickness</th><td>Min: ${escapeHtml(thicknessMin || '-')} mm &nbsp;|&nbsp; Max: ${escapeHtml(thicknessMax || '-')} mm</td></tr>
          <tr><th>Width</th><td>Min: ${escapeHtml(widthMin || '-')} mm &nbsp;|&nbsp; Max: ${escapeHtml(widthMax || '-')} mm</td></tr>
          <tr><th>Quantity</th><td>${escapeHtml(qty || '-')}</td></tr>
          <tr><th>Surface Finish</th><td>${escapeHtml(surfaceFinish || '-')}</td></tr>
        </tbody>
      </table>
    `;
  }

  const content = `
    <p>You have received a new customer enquiry from the OG Heavy Duty website.</p>
    
    <h3 class="section-title">Customer & Contact Information</h3>
    <table class="data-table">
      <tbody>
        <tr><th>Contact Person</th><td><strong>${escapeHtml(contactPerson || '-')}</strong></td></tr>
        <tr><th>Company / Organization</th><td>${escapeHtml(companyName || 'Individual / Residential')}</td></tr>
        <tr><th>Email Address</th><td><a href="mailto:${escapeHtml(email)}" style="color: #0f7ae0;">${escapeHtml(email || '-')}</a></td></tr>
        <tr><th>Contact Phone</th><td><a href="tel:${escapeHtml(contactNo)}" style="color: #0f7ae0;">${escapeHtml(contactNo || '-')}</a></td></tr>
        <tr><th>City / Location</th><td>${escapeHtml(city || address || '-')}</td></tr>
        <tr><th>Enquiry Classification</th><td><span class="badge">${escapeHtml(enquiryType || 'General Enquiry')}</span></td></tr>
        <tr><th>Product of Interest</th><td>${escapeHtml(product || 'General / Unspecified')}</td></tr>
      </tbody>
    </table>

    ${sizingHtml}
    ${technicalHtml}

    <h3 class="section-title">Customer Message / Requirements</h3>
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap;">
      ${escapeHtml(message || specialRequirements || 'No additional message provided.')}
    </div>
  `;

  const html = getEmailWrapper("New Website Customer Enquiry", content);

  try {
    const response = await resend.emails.send({
      from: `OG Heavy Duty <${fromEmail}>`,
      to: [toEmail],
      subject: `[Website Enquiry] ${enquiryType || 'New Lead'}: ${contactPerson} (${companyName || 'Residential'})`,
      html: html,
      replyTo: email,
    });
    return response;
  } catch (error) {
    console.error("[Email Dispatch Error]:", error);
    throw error;
  }
};

export const sendCareerApplicationEmail = async (data) => {
  if (!resend) {
    console.warn("RESEND_API_KEY is not configured. Skipping career email dispatch.");
    return { success: false, reason: "unconfigured" };
  }

  const { fullName, email, phone, position, experienceYears, location, message, resumeUrl } = data;

  const content = `
    <p>A new job candidate has submitted an application through the OG Heavy Duty Career Portal.</p>
    
    <h3 class="section-title">Candidate Details</h3>
    <table class="data-table">
      <tbody>
        <tr><th>Applicant Name</th><td><strong>${escapeHtml(fullName || '-')}</strong></td></tr>
        <tr><th>Email Address</th><td><a href="mailto:${escapeHtml(email)}" style="color: #0f7ae0;">${escapeHtml(email || '-')}</a></td></tr>
        <tr><th>Telephone</th><td><a href="tel:${escapeHtml(phone)}" style="color: #0f7ae0;">${escapeHtml(phone || '-')}</a></td></tr>
        <tr><th>Target Position</th><td><span class="badge">${escapeHtml(position || 'General Opening')}</span></td></tr>
        <tr><th>Total Experience</th><td>${escapeHtml(experienceYears || 'Not specified')}</td></tr>
        <tr><th>Preferred Location</th><td>${escapeHtml(location || 'Delhi NCR')}</td></tr>
      </tbody>
    </table>

    <h3 class="section-title">Candidate Introduction / Cover Note</h3>
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; margin-bottom: 24px;">
      ${escapeHtml(message || 'No additional cover note provided.')}
    </div>

    ${resumeUrl ? `
      <div style="text-align: center; margin-top: 24px;">
        <a href="${escapeHtml(resumeUrl)}" target="_blank" style="display: inline-block; background-color: #0f7ae0; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none;">
          Download Candidate Resume (PDF)
        </a>
      </div>
    ` : ''}
  `;

  const html = getEmailWrapper("New Career Application", content);

  try {
    const response = await resend.emails.send({
      from: `OG Heavy Duty Careers <${fromEmail}>`,
      to: [toEmail],
      subject: `[Career Application] ${position}: ${fullName}`,
      html: html,
      replyTo: email,
    });
    return response;
  } catch (error) {
    console.error("[Career Email Dispatch Error]:", error);
    throw error;
  }
};

export const sendUpdatedEnquiryEmail = async (data) => {
  if (!resend) return { success: false, reason: "unconfigured" };

  const { companyName, contactPerson, email, contactNo, message, specialRequirements } = data;

  const content = `
    <p>A customer or technician has updated information for their enquiry.</p>
    <table class="data-table">
      <tbody>
        <tr><th>Company / Name</th><td>${escapeHtml(companyName || contactPerson || '-')}</td></tr>
        <tr><th>Email</th><td>${escapeHtml(email || '-')}</td></tr>
        <tr><th>Phone</th><td>${escapeHtml(contactNo || '-')}</td></tr>
        <tr><th>Notes / Update</th><td>${escapeHtml(message || specialRequirements || '-')}</td></tr>
      </tbody>
    </table>
  `;

  const html = getEmailWrapper("Enquiry Updated", content);

  try {
    return await resend.emails.send({
      from: `OG Heavy Duty <${fromEmail}>`,
      to: [toEmail],
      subject: `[Enquiry Update] ${contactPerson} (${companyName || 'Residential'})`,
      html: html,
      replyTo: email,
    });
  } catch (error) {
    console.error("Failed to send updated email:", error);
    throw error;
  }
};

export const sendTestEmail = async (testToEmail, subject, htmlContent) => {
  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const finalHtml = htmlContent || '<p>OG Heavy Duty email integration test.</p>';
  try {
    const response = await resend.emails.send({
      from: `OG Heavy Duty Admin <${fromEmail}>`,
      to: [testToEmail],
      subject: `[TEST] ${subject || "Template Preview"}`,
      html: finalHtml,
    });
    return response;
  } catch (error) {
    console.error("Failed to send test email:", error);
    throw error;
  }
};
