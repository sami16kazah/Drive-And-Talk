import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Course } from '@/models/Course';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const filter: any = {};
    if (!includeInactive) {
      filter.isActive = true;
    }
    if (category && category !== 'all' && category !== 'All') {
      filter.category = category;
    }

    const courses = await Course.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(courses);
  } catch (error: any) {
    console.error('API GET /courses error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
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

    const { title, slug, description, category, price, imageUrl, cloudinaryPublicId, isActive } = body;

    if (!title?.en || !title?.nl || !slug || !description?.en || !description?.nl || !category || price === undefined) {
      return NextResponse.json({ error: 'Missing required course fields' }, { status: 400 });
    }

    const existing = await Course.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: 'Course slug already exists' }, { status: 400 });
    }

    const course = await Course.create({
      title,
      slug,
      description,
      category,
      price: Number(price),
      imageUrl: imageUrl || '',
      cloudinaryPublicId: cloudinaryPublicId || '',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    console.error('API POST /courses error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create course' }, { status: 500 });
  }
}
