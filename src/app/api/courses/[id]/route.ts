import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Course } from '@/models/Course';
import { auth } from '@/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const course = await Course.findById(params.id);
    if (!course) {
      // Try searching by slug
      const courseBySlug = await Course.findOne({ slug: params.id });
      if (!courseBySlug) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }
      return NextResponse.json(courseBySlug);
    }
    return NextResponse.json(course);
  } catch (error: any) {
    console.error('API GET /courses/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const updated = await Course.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('API PUT /courses/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const deleted = await Course.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API DELETE /courses/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
