import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "@/app/lib/config";
import Testimonial from "@/app/models/Testimonial";
import { uploadFile, isUploadFile, deleteFile } from "@/lib/upload";
import { requirePermission } from "@/app/lib/auth";

const DEFAULT_TESTIMONIALS = [
  {
    name: "Rajesh Malhotra",
    role: "Managing Director",
    company: "Grand Imperial Banquets, Delhi NCR",
    equipment: "5.0 Ton Heavy-Duty Tower ACs",
    highlight: "14-Hour Continuous 50°C Run",
    stars: 5,
    quote:
      "During the severe 50°C Delhi heatwave in June, ordinary commercial ACs were repeatedly tripping at our banquet facility. OG Heavy Duty’s 5.0 Ton floor-standing tower units ran non-stop for 14 hours daily with zero thermal cutoff. Flawless cooling pull-down.",
    avatar: "",
    sort: 1,
    status: "active",
  },
  {
    name: "Dr. Arvind Singhal",
    role: "Head of Infrastructure & Facilities",
    company: "Lifeline Super-Speciality Hospital",
    equipment: "4.0 Ton Ceiling Cassette Systems",
    highlight: "24/7 Healthcare Duty Cycle",
    stars: 5,
    quote:
      "Our operation theaters and ICU recovery wards demand 24/7 continuous duty and whisper-quiet laminar airflow. OG Heavy Duty’s 4-way ceiling cassettes with hydrophilic blue fin coils have delivered steady performance without mold buildup or maintenance downtime.",
    avatar: "",
    sort: 2,
    status: "active",
  },
  {
    name: "Er. Sandeep Verma",
    role: "Chief MEP Project Consultant",
    company: "Northern Apex University Campus",
    equipment: "11.0 Ton Ducted Split Systems",
    highlight: "High Static Pressure Central Ducting",
    stars: 5,
    quote:
      "We retrofitted our 800-seat university auditorium with OG Heavy Duty 11.0 Ton ductable units. The external static pressure handled our custom acoustic ducting with ease, and power draw remained within the calculated specs despite extreme summer heat.",
    avatar: "",
    sort: 3,
    status: "active",
  },
  {
    name: "Pooja Iyer",
    role: "VP of Administration & Infrastructure",
    company: "TechVanguard Corporate Park, Gurugram",
    equipment: "2.0 Ton Inverter Split ACs",
    highlight: "170V Stabilizer-Free Operation",
    stars: 5,
    quote:
      "Energy efficiency and voltage stability were our top selection criteria. Grid voltage drops to 170V during summer peaks in our industrial zone, but OG Heavy Duty's dual rotary inverter split units ran stabilizer-free with zero compressor strain.",
    avatar: "",
    sort: 4,
    status: "active",
  },
];

// GET /api/testimonials (Public)
export async function GET() {
  try {
    await connectDB();
    let rows = await Testimonial.find().sort({ sort: 1, createdAt: 1 }).lean();

    // Auto-seed initial 4 commercial facility reviews if collection is completely empty
    if (!rows || rows.length === 0) {
      await Testimonial.insertMany(DEFAULT_TESTIMONIALS);
      rows = await Testimonial.find().sort({ sort: 1, createdAt: 1 }).lean();
    }

    return Response.json(rows);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/testimonials (Requires 'home' permission)
export async function POST(request) {
  const { user, error } = await requirePermission(request, 'home', 'create');
  if (error) return error;

  try {
    await connectDB();
    const contentType = request.headers.get("content-type") || "";

    let bodyData = {};
    let avatarUrl = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      bodyData = {
        name: formData.get("name") || "",
        role: formData.get("role") || "",
        company: formData.get("company") || "",
        equipment: formData.get("equipment") || "",
        highlight: formData.get("highlight") || "",
        stars: Number(formData.get("stars")) || 5,
        quote: formData.get("quote") || "",
        sort: Number(formData.get("sort")) || 1,
        status: formData.get("status") || "active",
      };

      const avatarFile = formData.get("avatar");
      if (isUploadFile(avatarFile)) {
        avatarUrl = await uploadFile(avatarFile, "testimonials", "testimonial");
        bodyData.avatar = avatarUrl;
      }
    } else {
      bodyData = await request.json();
    }

    if (!bodyData.name || !bodyData.quote) {
      return Response.json({ error: "Name and Quote are required" }, { status: 400 });
    }

    const created = await Testimonial.create({
      name: bodyData.name,
      role: bodyData.role || "",
      company: bodyData.company || "",
      equipment: bodyData.equipment || "",
      highlight: bodyData.highlight || "",
      stars: Number(bodyData.stars) || 5,
      quote: bodyData.quote,
      avatar: bodyData.avatar || "",
      sort: Number(bodyData.sort) || 1,
      status: bodyData.status || "active",
    });

    revalidatePath('/', 'layout');

    return Response.json({
      message: "Testimonial created successfully",
      data: created,
    }, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

