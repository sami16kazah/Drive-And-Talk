import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Setting } from '@/models/Setting';
import { auth } from '@/auth';

export async function GET() {
  try {
    await connectDB();
    let settings = await Setting.findOne({ key: 'site_settings' });
    if (!settings) {
      settings = await Setting.create({
        key: 'site_settings',
        adminNotificationEmail: process.env.MAILJET_SENDER_EMAIL || 'info@drivetalk.nl',
        senderEmail: process.env.MAILJET_SENDER_EMAIL || 'info@drivetalk.nl',
        senderName: process.env.MAILJET_SENDER_NAME || 'Drive&Talk Academy',
      });
    }
    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('API GET /settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const { adminNotificationEmail, senderEmail, senderName } = body;

    let settings = await Setting.findOne({ key: 'site_settings' });
    if (!settings) {
      settings = new Setting({ key: 'site_settings' });
    }

    if (adminNotificationEmail) settings.adminNotificationEmail = adminNotificationEmail.trim();
    if (senderEmail) settings.senderEmail = senderEmail.trim();
    if (senderName) settings.senderName = senderName.trim();

    await settings.save();

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('API PUT /settings error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 500 });
  }
}
