import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Review } from '@/models/Review';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    const filter: any = {};
    if (courseId) {
      filter.courseId = courseId;
    }

    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error('API GET /reviews error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Authentication required to post a review' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { courseId, rating, comment } = body;

    if (!courseId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required review fields' }, { status: 400 });
    }

    const review = await Review.create({
      courseId,
      userId: (session.user as any).id || session.user.email || 'user',
      userName: session.user.name || 'Student',
      userAvatar: session.user.image || '',
      rating: Number(rating),
      comment: String(comment).trim(),
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    console.error('API POST /reviews error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit review' }, { status: 500 });
  }
}
