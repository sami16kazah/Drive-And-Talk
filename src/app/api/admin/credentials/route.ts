import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Setting } from '@/models/Setting';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    let settings = await Setting.findOne({ key: 'site_settings' });
    if (!settings) {
      settings = await Setting.create({
        key: 'site_settings',
        adminLoginEmail: 'info@drivetalk.nl',
        adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
      });
    }

    return NextResponse.json({
      adminLoginEmail: settings.adminLoginEmail || 'info@drivetalk.nl',
    });
  } catch (error: any) {
    console.error('GET /api/admin/credentials error:', error);
    return NextResponse.json({ error: 'Failed to fetch credentials' }, { status: 500 });
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
    const { newEmail, currentPassword, newPassword } = body;

    let settings = await Setting.findOne({ key: 'site_settings' });
    if (!settings) {
      settings = new Setting({
        key: 'site_settings',
        adminLoginEmail: 'info@drivetalk.nl',
        adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
      });
    }

    const currentSavedPassword = settings.adminPassword || process.env.ADMIN_PASSWORD || 'admin123';

    // Verify current password
    if (currentPassword !== currentSavedPassword) {
      return NextResponse.json(
        { error: 'Het huidige wachtwoord is onjuist.' },
        { status: 400 }
      );
    }

    // Update Email if provided
    if (newEmail && newEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmail.trim())) {
        return NextResponse.json(
          { error: 'Ongeldig e-mailadres formaat.' },
          { status: 400 }
        );
      }
      settings.adminLoginEmail = newEmail.trim().toLowerCase();
    }

    // Update Password if provided
    if (newPassword && newPassword.trim()) {
      if (newPassword.trim().length < 6) {
        return NextResponse.json(
          { error: 'Het nieuwe wachtwoord moet minimaal 6 tekens lang zijn.' },
          { status: 400 }
        );
      }
      settings.adminPassword = newPassword.trim();
    }

    await settings.save();

    return NextResponse.json({
      success: true,
      message: 'Beheerdersgegevens succesvol bijgewerkt in de database.',
      adminLoginEmail: settings.adminLoginEmail,
    });
  } catch (error: any) {
    console.error('PUT /api/admin/credentials error:', error);
    return NextResponse.json(
      { error: error.message || 'Fout bij het bijwerken van inloggegevens.' },
      { status: 500 }
    );
  }
}
