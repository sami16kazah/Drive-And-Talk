import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignore static assets, next internal files, and API endpoints
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Handle internationalization routing
  return intlMiddleware(req);
}

export const config = {
  // Match all request paths except api, _next, and files with extensions
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
