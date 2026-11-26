import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { SiteContent } from '@/models/SiteContent';
import { CONTENT_TAG, contentDefaults, getContent, isContentScope } from '@/lib/content';
import { deepMerge } from '@/lib/contentUtils';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const session = await auth();
  return !!session && (session.user as any)?.role === 'admin';
}

function invalidate() {
  revalidateTag(CONTENT_TAG);
  revalidatePath('/', 'layout');
}

// Public: returns the merged content (defaults + overrides) and the defaults for a scope.
export async function GET(req: NextRequest) {
  const scope = new URL(req.url).searchParams.get('scope') || 'global';
  if (!isContentScope(scope)) {
    return NextResponse.json({ error: 'Invalid scope' }, { status: 400 });
  }
  try {
    const data = await getContent(scope);
    return NextResponse.json({ scope, data, defaults: contentDefaults[scope] });
  } catch (error: any) {
    console.error('API GET /content error:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

// Admin: save the full content tree for a scope.
export async function PUT(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { scope, data } = body || {};
    if (!isContentScope(scope) || typeof data !== 'object' || data === null || Array.isArray(data)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Normalise against defaults so the stored tree always has the expected shape/types.
    const normalised = deepMerge(contentDefaults[scope], data);

    await connectDB();
    await SiteContent.findOneAndUpdate(
      { key: scope },
      { $set: { data: normalised } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    invalidate();
    return NextResponse.json({ scope, data: normalised });
  } catch (error: any) {
    console.error('API PUT /content error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save content' }, { status: 500 });
  }
}

// Admin: reset a scope back to the built-in defaults.
export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const scope = new URL(req.url).searchParams.get('scope');
  if (!isContentScope(scope)) {
    return NextResponse.json({ error: 'Invalid scope' }, { status: 400 });
  }
  try {
    await connectDB();
    await SiteContent.deleteOne({ key: scope });
    invalidate();
    return NextResponse.json({ scope, data: contentDefaults[scope] });
  } catch (error: any) {
    console.error('API DELETE /content error:', error);
    return NextResponse.json({ error: 'Failed to reset content' }, { status: 500 });
  }
}
