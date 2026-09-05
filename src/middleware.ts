import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { auth } from './auth';

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Check if target pathname is an admin login route (allow access)
  const isAdminLoginRoute =
    pathname.includes('/admin/login') ||
    pathname.match(/^\/(nl|en)\/admin\/login(\/.*)?$/);

  if (isAdminLoginRoute) {
    return intlMiddleware(req);
  }

  // Check if target pathname is an admin protected route
  const isAdminRoute =
    pathname.includes('/admin') ||
    pathname.match(/^\/(nl|en)\/admin(\/.*)?$/);

  if (isAdminRoute) {
    const session = await auth();
    const userRole = (session?.user as any)?.role;

    if (!session || userRole !== 'admin') {
      const localeMatch = pathname.match(/^\/(nl|en)/);
      const currentLocale = localeMatch ? localeMatch[1] : 'nl';
      const redirectUrl = new URL(`/${currentLocale}/admin/login`, req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return intlMiddleware(req);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(nl|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
};
