import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { SuccessStory } from '@/models/SuccessStory';
import { auth } from '@/auth';

export async function GET() {
  try {
    await connectDB();
    const stories = await SuccessStory.find().sort({ date: -1 });
    return NextResponse.json(stories);
  } catch (error: any) {
    console.error('API GET /stories error:', error);
    return NextResponse.json({ error: 'Failed to fetch success stories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const { studentName, courseTaken, story, imageUrl, cloudinaryPublicId, date } = body;

    if (!studentName || !courseTaken || !story?.en || !story?.nl) {
      return NextResponse.json({ error: 'Missing required story fields' }, { status: 400 });
    }

    const newStory = await SuccessStory.create({
      studentName: studentName.trim(),
      courseTaken: courseTaken.trim(),
      story,
      imageUrl: imageUrl || '',
      cloudinaryPublicId: cloudinaryPublicId || '',
      date: date ? new Date(date) : new Date(),
    });

    return NextResponse.json(newStory, { status: 201 });
  } catch (error: any) {
    console.error('API POST /stories error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create story' }, { status: 500 });
  }
}
