import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { SuccessStory } from '@/models/SuccessStory';
import { auth } from '@/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const updated = await SuccessStory.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('API PUT /stories/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update story' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const deleted = await SuccessStory.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API DELETE /stories/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete story' }, { status: 500 });
  }
}
