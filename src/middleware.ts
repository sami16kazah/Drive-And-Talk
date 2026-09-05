import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { auth } from './auth';

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(req: NextRequest) {
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

  // Extract locale if present in pathname (/nl, /en)
  const localeMatch = pathname.match(/^\/(nl|en)($|\/)/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;

  // Check if target is admin login route
  const isAdminLogin =
    pathname === '/admin/login' ||
    pathname === `/${locale}/admin/login`;

  // Check if target is admin protected route (excluding login)
  const isAdminProtected =
    (pathname === '/admin' || pathname.startsWith('/admin/')) ||
    (pathname === `/${locale}/admin` || pathname.startsWith(`/${locale}/admin/`));

  if (isAdminLogin) {
    const session = await auth();
    const isAdmin = (session?.user as any)?.role === 'admin';
    if (isAdmin) {
      return NextResponse.redirect(new URL(`/${locale}/admin`, req.url));
    }
    return intlMiddleware(req);
  }

  if (isAdminProtected) {
    const session = await auth();
    const isAdmin = (session?.user as any)?.role === 'admin';

    if (!isAdmin) {
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, req.url));
    }
  }

  return intlMiddleware(req);
}

export const config = {
  // Match all request paths except api, _next, and files with extensions
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
