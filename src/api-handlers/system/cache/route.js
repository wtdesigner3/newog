import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireSuperAdmin } from '@/app/lib/auth';
import { logActivity } from '@/lib/logger';

export async function POST(request) {
  const { user, error } = await requireSuperAdmin(request);
  if (error) return error;

  try {
    const body = await request.json().catch(() => ({}));
    const { type, target } = body;

    if (!type) {
      return NextResponse.json({ success: false, error: 'Cache purge type is required' }, { status: 400 });
    }

    let actionDetails = '';

    switch (type) {
      case 'path':
        if (!target) return NextResponse.json({ success: false, error: 'Path is required' }, { status: 400 });
        revalidatePath(target);
        actionDetails = `Revalidated specific path: ${target}`;
        break;

      case 'tag':
        if (!target) return NextResponse.json({ success: false, error: 'Tag is required' }, { status: 400 });
        revalidateTag(target);
        actionDetails = `Revalidated specific cache tag: ${target}`;
        break;

      case 'all':
        revalidatePath('/', 'layout');
        actionDetails = 'Purged entire Next.js application cache globally';
        break;
        
      case 'redis':
      case 'cdn':
        return NextResponse.json({ success: false, error: 'Service not configured in environment.' }, { status: 501 });

      default:
        return NextResponse.json({ success: false, error: 'Invalid cache purge type' }, { status: 400 });
    }

    await logActivity(
      'Cache Purge',
      'System Settings',
      `Cache purge executed (${actionDetails}) by ${user.email}.`,
      user.doc,
      request.headers.get("x-forwarded-for") || "unknown"
    ).catch(() => {});

    return NextResponse.json({
      success: true,
      message: 'Cache successfully purged',
      details: actionDetails
    });

  } catch (err) {
    console.error('Cache Revalidation Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to purge cache' }, { status: 500 });
  }
}
