import { NextResponse } from 'next/server';
import { connectDBSafe, getDBStatus } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  await connectDBSafe({ silent: true });
  const dbInfo = getDBStatus();
  const latencyMs = Date.now() - startTime;

  return NextResponse.json({
    status: dbInfo.connected ? 'healthy' : 'degraded',
    system: 'OG Heavy Duty Next.js Modernization Foundation',
    version: '6.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbInfo.state,
      connected: dbInfo.connected,
      latencyMs,
      target: dbInfo.maskedUri,
    },
    services: {
      storage: process.env.USE_CLOUD_STORAGE === 'true' ? 'cloudinary' : 'local_disk',
      email: process.env.RESEND_API_KEY ? 'resend_configured' : 'not_configured',
    },
  });
}
