import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../lib/config";
import Milestone from "../../models/Milestone";
import { requirePermission } from "../../lib/auth";

const DEFAULT_MILESTONES = [
  {
    badge: "Thermal Standard",
    valueType: "number",
    target: 52,
    suffix: "°C",
    formatNumber: false,
    textValue: "",
    label: "Extreme Ambient Ceiling",
    subtext: "Continuous cooling engineered & tested up to 52°C tropical peak",
    icon: "ThermometerSnowflake",
    sort: 1,
    status: "active",
  },
  {
    badge: "Cu-DHP Grade",
    valueType: "number",
    target: 100,
    suffix: "%",
    formatNumber: false,
    textValue: "",
    label: "Pure Copper Construction",
    subtext: "Inner-grooved condenser & evaporator rifled copper coils",
    icon: "Layers",
    sort: 2,
    status: "active",
  },
  {
    badge: "Proven Scale",
    valueType: "number",
    target: 50000,
    suffix: "+",
    formatNumber: true,
    textValue: "",
    label: "Commercial Units Deployed",
    subtext: "Operational across universities, hospitals, corporate & state complexes",
    icon: "Building2",
    sort: 3,
    status: "active",
  },
  {
    badge: "National Reach",
    valueType: "text",
    target: 0,
    suffix: "",
    formatNumber: false,
    textValue: "Pan-India",
    label: "Service & Distribution",
    subtext: "Rapid technician dispatch, certified spares & authorized partner hubs",
    icon: "MapPin",
    sort: 4,
    status: "active",
  },
];

// GET /api/milestones (Public)
export async function GET() {
  try {
    await connectDB();
    let rows = await Milestone.find().sort({ sort: 1, createdAt: 1 }).lean();

    // Auto-seed if collection is completely empty
    if (!rows || rows.length === 0) {
      await Milestone.insertMany(DEFAULT_MILESTONES);
      rows = await Milestone.find().sort({ sort: 1, createdAt: 1 }).lean();
    }

    return Response.json(rows);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/milestones (Requires 'home' permission)
export async function POST(request) {
  const { user, error } = await requirePermission(request, 'home', 'create');
  if (error) return error;

  try {
    await connectDB();
    const body = await request.json();

    const created = await Milestone.create({
      badge: body.badge || "Milestone",
      valueType: body.valueType || (body.textValue ? "text" : "number"),
      target: Number(body.target) || 0,
      suffix: body.suffix || "",
      formatNumber: Boolean(body.formatNumber),
      textValue: body.textValue || "",
      label: body.label || "",
      subtext: body.subtext || "",
      icon: body.icon || "Award",
      sort: Number(body.sort) || 1,
      status: body.status || "active",
    });

    revalidatePath('/', 'layout');
    revalidatePath('/about-us', 'page');

    return Response.json({
      message: "Milestone created successfully",
      data: created,
    }, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

