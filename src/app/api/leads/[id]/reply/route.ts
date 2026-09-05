import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { EnrollmentContact } from '@/models/EnrollmentContact';
import { sendAdminReplyToUser } from '@/lib/mailjet';
import { auth } from '@/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { replySubject, replyMessage } = body;

    if (!replySubject || !replyMessage) {
      return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
    }

    const lead = await EnrollmentContact.findById(params.id);
    if (!lead) {
      return NextResponse.json({ error: 'Lead inquiry not found' }, { status: 404 });
    }

    // 1. Dispatch Mailjet Email to User
    const emailResult = await sendAdminReplyToUser({
      toEmail: lead.email,
      toName: `${lead.firstName} ${lead.lastName}`,
      replySubject: replySubject.trim(),
      replyMessage: replyMessage.trim(),
    });

    if (!emailResult.success) {
      console.warn('Mailjet reply failed to send email, but updating database history:', emailResult.error);
    }

    // 2. Append to replyHistory and update status to 'replied'
    lead.replyHistory.push({
      message: replyMessage.trim(),
      subject: replySubject.trim(),
      sentAt: new Date(),
    });
    lead.status = 'replied';

    await lead.save();

    return NextResponse.json({
      success: true,
      lead,
      emailSent: emailResult.success,
    });
  } catch (error: any) {
    console.error('API POST /leads/[id]/reply error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send reply' }, { status: 500 });
  }
}
