import { revalidatePath } from "next/cache";
import { NextResponse } from 'next/server';
import { connectDB } from 'src/app/lib/config';
import ErrorLog from 'src/app/models/ErrorLog';
import { requireSuperAdmin } from 'src/app/lib/auth';

// GET /api/system/errors — List error logs (Super Admin Only)
export async function GET(req) {
  const { user, error } = await requireSuperAdmin(req);
  if (error) return error;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      ErrorLog.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ErrorLog.countDocuments()
    ]);
    return NextResponse.json({ success: true, data: logs, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// POST /api/system/errors — Client 404/Error reporter (Public client exception logging)
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json().catch(() => ({}));
    const { path, referrer, userAgent, ip, statusCode } = body;
    if (!path || typeof path !== 'string') {
      return NextResponse.json({ success: false, error: 'path required' }, { status: 400 });
    }
    const cleanPath = path.substring(0, 500);

    // Avoid duplicate recent logs for the same path (within 1 minute)
    const recent = await ErrorLog.findOne({ path: cleanPath, createdAt: { $gte: new Date(Date.now() - 60_000) } });
    if (recent) return NextResponse.json({ success: true, duplicate: true });
    
    const log = await ErrorLog.create({
      path: cleanPath,
      referrer: typeof referrer === 'string' ? referrer.substring(0, 500) : '',
      userAgent: typeof userAgent === 'string' ? userAgent.substring(0, 500) : '',
      ip: typeof ip === 'string' ? ip.substring(0, 100) : '',
      statusCode: Number(statusCode) || 404
    });
    
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, data: log });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// PUT /api/system/errors — Mark error resolved (Super Admin Only)
export async function PUT(req) {
  const { user, error } = await requireSuperAdmin(req);
  if (error) return error;

  try {
    await connectDB();
    const { id, resolved } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
    const updated = await ErrorLog.findByIdAndUpdate(id, { resolved: Boolean(resolved) }, { new: true });
    
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, data: updated });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// DELETE /api/system/errors — Purge error logs (Super Admin Only)
export async function DELETE(req) {
  const { user, error } = await requireSuperAdmin(req);
  if (error) return error;

  try {
    await connectDB();
    const body = await req.json().catch(() => ({}));
    if (body?.id) {
      await ErrorLog.findByIdAndDelete(body.id);
    } else {
      await ErrorLog.deleteMany({});
    }
    
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
