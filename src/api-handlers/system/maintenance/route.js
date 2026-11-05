import { NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/app/lib/auth';
import { logActivity } from '@/lib/logger';
import { connectDB } from '@/app/lib/config';
import GlobalSetting from '@/app/models/GlobalSetting';
import { revalidatePath } from 'next/cache';

// GET /api/system/maintenance (Public check for site maintenance status)
export async function GET() {
  try {
    await connectDB();
    const settings = await GlobalSetting.findOne().lean();
    
    return NextResponse.json({
      success: true,
      maintenance: {
        isMaintenanceMode: settings?.isMaintenanceMode || false,
        maintenanceMessage: settings?.maintenanceMessage || '',
        emergencyShutdown: settings?.emergencyShutdown || false,
      }
    });
  } catch (error) {
    console.error('Fetch Maintenance Settings Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT /api/system/maintenance (Super Admin Only)
export async function PUT(request) {
  const { user, error } = await requireSuperAdmin(request);
  if (error) return error;

  try {
    const { isMaintenanceMode, maintenanceMessage, emergencyShutdown } = await request.json();

    await connectDB();
    
    let settings = await GlobalSetting.findOne();
    if (!settings) {
      settings = new GlobalSetting();
    }

    const changes = [];
    if (settings.isMaintenanceMode !== isMaintenanceMode) changes.push(`Maintenance Mode: ${isMaintenanceMode ? 'ON' : 'OFF'}`);
    if (settings.emergencyShutdown !== emergencyShutdown) changes.push(`Emergency Shutdown: ${emergencyShutdown ? 'ON' : 'OFF'}`);
    
    settings.isMaintenanceMode = Boolean(isMaintenanceMode);
    settings.maintenanceMessage = String(maintenanceMessage || '');
    settings.emergencyShutdown = Boolean(emergencyShutdown);

    await settings.save();

    revalidatePath('/', 'layout');

    if (changes.length > 0) {
      await logActivity(
        'Maintenance Mode',
        'System Settings',
        `Maintenance state updated (${changes.join(', ')}) by ${user.email}.`,
        user.doc,
        request.headers.get("x-forwarded-for") || "unknown"
      ).catch(() => {});
    }

    return NextResponse.json({ success: true, message: 'Maintenance settings updated successfully' });
  } catch (err) {
    console.error('Update Maintenance Settings Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
