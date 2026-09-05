import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { EnrollmentContact } from '@/models/EnrollmentContact';
import { Course } from '@/models/Course';
import { notifyAdminOfLead } from '@/lib/mailjet';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const filter: any = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const leads = await EnrollmentContact.find(filter)
      .populate('courseId', 'title slug category price')
      .sort({ createdAt: -1 });

    return NextResponse.json(leads);
  } catch (error: any) {
    console.error('API GET /leads error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { type, courseId, firstName, lastName, email, phone, notes } = body;

    if (!type || !firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let courseTitle = '';
    if (courseId) {
      const course = await Course.findById(courseId);
      if (course) {
        courseTitle = course.title.en || course.title.nl || '';
      }
    }

    const lead = await EnrollmentContact.create({
      type,
      courseId: courseId || undefined,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      notes: notes ? notes.trim() : '',
      status: 'pending',
      replyHistory: [],
    });

    // Fire Mailjet Admin Notification async in background
    notifyAdminOfLead({
      type,
      firstName,
      lastName,
      email,
      phone,
      notes,
      courseTitle,
    }).catch((err) => console.error('Failed to dispatch admin lead notification email:', err));

    return NextResponse.json(lead, { status: 201 });
  } catch (error: any) {
    console.error('API POST /leads error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit inquiry' }, { status: 500 });
  }
}
