import { revalidatePath } from "next/cache";
import { NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/app/lib/auth';
import { connectDB } from '@/app/lib/config';
import BackupLog from '@/app/models/BackupLog';
import mongoose from 'mongoose';

// GET /api/system/backup — List backup history (Super Admin Only)
export async function GET(req) {
  const { user, error } = await requireSuperAdmin(req);
  if (error) return error;

  try {
    await connectDB();
    const logs = await BackupLog.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('initiatedBy', 'name email');

    return NextResponse.json({ success: true, logs });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/system/backup — Generate secure database dump (Super Admin Only)
// Explicitly excludes user credentials to prevent credential export
export async function POST(req) {
  const { user, error } = await requireSuperAdmin(req);
  if (error) return error;

  try {
    await connectDB();

    const { type = 'manual' } = await req.json().catch(() => ({}));

    // Generate database dump excluding users credentials
    const db = mongoose.connection.db;
    const collections = await db.collections();
    
    const dumpData = {};
    let totalDocs = 0;

    for (const collection of collections) {
      const collectionName = collection.collectionName;

      // Exclude users collection to protect password hashes and administrative tokens
      if (collectionName.toLowerCase() === 'users') {
        continue;
      }

      const data = await collection.find({}).toArray();
      dumpData[collectionName] = data;
      totalDocs += data.length;
    }

    const payloadString = JSON.stringify(dumpData);
    const sizeBytes = Buffer.byteLength(payloadString, 'utf8');
    const fileName = `ogheavyduty_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;

    // Log the backup
    await BackupLog.create({
      type,
      status: 'success',
      sizeBytes,
      fileName,
      initiatedBy: user.id
    });

    revalidatePath('/', 'layout');
    return NextResponse.json({
      success: true,
      fileName,
      sizeBytes,
      totalDocs,
      data: dumpData
    });

  } catch (err) {
    console.error("[POST /api/system/backup] Backup generation error:", err);
    try {
      await BackupLog.create({
        type: 'manual',
        status: 'failed',
        fileName: `failed_backup_${Date.now()}.json`,
        initiatedBy: user.id
      });
    } catch (e) {}

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
