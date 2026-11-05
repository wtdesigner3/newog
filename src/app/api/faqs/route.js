import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../lib/config";
import Faq from "../../models/Faq";
import { requirePermission } from "../../lib/auth";

export const DEFAULT_FAQS = [
  {
    category: "general",
    isVerified: true,
    question: "What are the various modes of payment accepted here?",
    answer:
      "You can make payment via Cash, Net Banking, UPI & Debit & Credit Cards. For commercial and institutional contracts, direct RTGS/NEFT bank transfers against official tax invoices are also accepted.",
    answerHtml:
      "<p>You can make payment via <strong>Cash, Net Banking, UPI &amp; Debit &amp; Credit Cards</strong>.</p><p class='mt-2'>For institutional, commercial, and government supply contracts, direct RTGS/NEFT bank transfers against official GST tax invoices are supported.</p>",
    sort: 1,
    status: "active",
  },
  {
    category: "general",
    isVerified: true,
    question: "Which is the nearest landmark to your Delhi showroom?",
    answer:
      "You can easily locate the establishment as it is in close proximity to Dominos, Adarsh Nagar. Our full registered showroom address is D-14, Rajan Babu Road, Adarsh Nagar, New Delhi - 110033.",
    answerHtml:
      "<p>You can easily locate the establishment as it is in <strong>close proximity to Dominos, Adarsh Nagar</strong>.</p><p class='mt-2'>Our complete showroom address is: <br/><strong>D-14, Rajan Babu Road, Adarsh Nagar, New Delhi - 110033</strong>.</p>",
    relatedLink: {
      label: "View Contact Information & Map",
      href: "/contact-us",
    },
    sort: 2,
    status: "active",
  },
  {
    category: "general",
    isVerified: true,
    question: "What are your showroom & office hours of operation?",
    answer:
      "The establishment is functional Monday through Sunday from 10:00 AM to 7:00 PM (Monday to Saturday: 10:00 AM - 7:30 PM for warehouse operations and corporate support).",
    answerHtml:
      "<p>The establishment is functional on:</p><ul class='list-disc pl-5 mt-2 space-y-1'><li><strong>Monday:</strong> 10:00 AM – 7:00 PM</li><li><strong>Tuesday:</strong> 10:00 AM – 7:00 PM</li><li><strong>Wednesday:</strong> 10:00 AM – 7:00 PM</li><li><strong>Thursday:</strong> 10:00 AM – 7:00 PM</li><li><strong>Friday:</strong> 10:00 AM – 7:00 PM</li><li><strong>Saturday:</strong> 10:00 AM – 7:00 PM</li><li><strong>Sunday:</strong> 10:00 AM – 7:00 PM</li></ul>",
    sort: 3,
    status: "active",
  },
  {
    category: "general",
    isVerified: true,
    question: "Is an EMI payment option available for air conditioner purchases?",
    answer:
      "Yes, EMI can be made using both debit and credit cards across major participating Indian banks.",
    answerHtml:
      "<p><strong>Yes, EMI can be made using both debit and credit cards</strong> across major participating Indian banks for qualifying in-store purchases and commercial transactions.</p>",
    sort: 4,
    status: "active",
  },
  {
    category: "technical",
    isVerified: true,
    question: "What makes OG Heavy Duty air conditioners suitable for severe tropical heatwaves (up to 52°C)?",
    answer:
      "OG Heavy Duty air conditioners are specifically designed for high-ambient tropical environments up to 52°C. They incorporate 100% heavy copper condenser and evaporator coils with corrosion-resistant blue fin coatings, heavy-gauge sheet metal cabinetry, and robust compressors designed to deliver sustained cooling without high-pressure thermal tripping.",
    answerHtml:
      "<p>OG Heavy Duty air conditioners are engineered specifically for high-ambient climates up to <strong>52°C</strong>. Key engineering differentiators include 100% Inner-Grooved Copper Coils, Anti-Corrosive Fin Coating, and High-Ambient Tropical Compressors tested up to 52°C.</p>",
    relatedLink: {
      label: "Explore Our Product Engineering",
      href: "/products/split-ac",
    },
    sort: 5,
    status: "active",
  },
  {
    category: "technical",
    isVerified: true,
    question: "What types of heavy-duty air conditioning systems does OG Heavy Duty manufacture?",
    answer:
      "We provide a comprehensive portfolio of high-ambient cooling solutions: Window AC (1.0 Ton and 1.5 Ton models), Split AC (1.5 Ton and 2.0 Ton Inverter & Fixed Speed models), Cassette AC (2.0 Ton and 2.5 Ton 4-way ceiling units), Floor Standing / Tower AC (2.0 Ton and 4.0 Ton units), and Ductable AC (2.0 Ton and 3.0 Ton concealed ducted systems).",
    answerHtml:
      "<p>Our standard product catalog covers Window ACs, Split ACs, Cassette ACs, Floor Standing Tower ACs, and Concealed Ducted HVAC systems.</p>",
    relatedLink: {
      label: "Browse Split Air Conditioners",
      href: "/products/split-ac",
    },
    sort: 6,
    status: "active",
  },
  {
    category: "sizing",
    isVerified: true,
    question: "How do I determine the right AC tonnage for my room or commercial space?",
    answer:
      "Cooling capacity depends on floor area, ceiling height, sunlight exposure, window orientation, and occupant load. For standard 10-foot ceilings: up to 120 sq ft typically requires 1.0 Ton; 120 to 180 sq ft requires 1.5 Ton; 180 to 240 sq ft requires 2.0 Ton. Top-floor spaces or commercial venues benefit from our interactive AC Sizing Calculator.",
    answerHtml:
      "<p>For standard 10-foot residential or office ceilings: Up to 120 sq. ft. = 1.0 Ton; 120–180 sq. ft. = 1.5 Ton; 180–240 sq. ft. = 2.0 Ton; Above 250 sq. ft. = 3.0 Ton+ Cassette or Ducted systems.</p>",
    relatedLink: {
      label: "Calculate Exact Capacity with AC Sizing Tool",
      href: "/ac-sizing",
    },
    sort: 7,
    status: "active",
  },
  {
    category: "technical",
    isVerified: true,
    question: "Why does OG Heavy Duty prioritize 100% copper coils over aluminum?",
    answer:
      "Copper possesses approximately double the thermal conductivity of aluminum, ensuring significantly faster heat dissipation and superior electrical efficiency. Copper is also structurally robust, ductile, and easily repairable via on-site brazing in the event of micro-leaks.",
    answerHtml:
      "<p>100% Copper coils offer superior heat transfer, high corrosion resistance, and simple on-site brazing repairability compared to aluminum.</p>",
    sort: 8,
    status: "active",
  },
  {
    category: "support",
    isVerified: true,
    question: "Does OG Heavy Duty provide HVAC solutions for government, corporate, and institutional clients?",
    answer:
      "Yes. OG Heavy Duty is a trusted supplier to government ministries, public sector enterprises, universities, healthcare institutions, and corporate facilities across India including CPWD, Delhi University, Ministry of Railways, JNU, State Bank of India, and ESIC.",
    answerHtml:
      "<p>Yes. OG Heavy Duty supplies turnkey HVAC solutions to CPWD, Ministry of Railways, University of Delhi, State Bank of India, and ESIC under GeM tender specs.</p>",
    relatedLink: {
      label: "View Verified Client Installations",
      href: "/clients",
    },
    sort: 9,
    status: "active",
  },
  {
    category: "support",
    isVerified: true,
    question: "What is the standard warranty coverage on OG Heavy Duty air conditioners?",
    answer:
      "Our air conditioners come with comprehensive manufacturer warranty coverage including standard coverage on the overall unit and extended warranty on the compressor. Full warranty policy terms and registration details are available in our Download Center.",
    answerHtml:
      "<p>OG Heavy Duty air conditioners include comprehensive standard unit warranty, extended multi-year protection on compressors, and 100% copper coil coverage.</p>",
    relatedLink: {
      label: "Download Official Warranty Policy Document",
      href: "/resources",
    },
    sort: 10,
    status: "active",
  },
  {
    category: "support",
    isVerified: true,
    question: "Where can I download product catalogues, error code charts, and user manuals?",
    answer:
      "Official technical documentation—including our 2026-2027 Master Product Catalogue, Diagnostic Error Code Reference, User Operating Manuals, and Warranty Terms—is freely accessible in PDF format from our Technical Resources & Download Center.",
    answerHtml:
      "<p>All official technical publications including product catalogues, error code charts, and operating manuals are freely downloadable in our Technical Resources.</p>",
    relatedLink: {
      label: "Visit Technical Resources & Download Center",
      href: "/resources",
    },
    sort: 11,
    status: "active",
  },
  {
    category: "support",
    isVerified: true,
    question: "How do I schedule an installation, site survey, or preventive maintenance service?",
    answer:
      "You can contact our customer service and technical support helpline at 011-35727834 or email us at info@ogheavyduty.in. You can also submit an online enquiry form, and an HVAC technical consultant will respond within 24 business hours.",
    answerHtml:
      "<p>Contact our support helpline at 011-35727834, WhatsApp +91 93199 77568, or submit an inquiry via our contact form.</p>",
    relatedLink: {
      label: "Submit an Online Service Request",
      href: "/contact-us",
    },
    sort: 12,
    status: "active",
  },
];

// GET /api/faqs (Public)
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }

    let rows = await Faq.find(query).sort({ sort: 1, createdAt: 1 }).lean();

    // Auto-seed if collection is completely empty
    if ((!rows || rows.length === 0) && (!category || category === 'all')) {
      await Faq.insertMany(DEFAULT_FAQS);
      rows = await Faq.find().sort({ sort: 1, createdAt: 1 }).lean();
    }

    return Response.json(rows);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/faqs (Requires 'inner_pages' permission)
export async function POST(request) {
  const { user, error } = await requirePermission(request, 'inner_pages', 'create');
  if (error) return error;

  try {
    await connectDB();
    const body = await request.json();

    if (!body.question?.trim() || !body.answer?.trim()) {
      return Response.json({ error: "Question and Answer are required" }, { status: 400 });
    }

    const created = await Faq.create({
      question: body.question.trim(),
      answer: body.answer.trim(),
      answerHtml: body.answerHtml || body.answer.trim(),
      category: body.category || "general",
      isVerified: body.isVerified ?? true,
      relatedLink: {
        label: body.relatedLink?.label || "",
        href: body.relatedLink?.href || "",
      },
      sort: Number(body.sort) || 1,
      status: body.status || "active",
    });

    revalidatePath('/faq', 'page');

    return Response.json({
      message: "FAQ created successfully",
      data: created,
    }, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

