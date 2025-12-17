/**
 * Middleware - Server-side route protection
 *
 * This middleware runs on EVERY request to check authentication.
 * Admin routes are protected and will redirect to sign-in if not authenticated.
 *
 * SECURITY: This is server-side protection - client code never loads for unauthorized users.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const session = await auth();

    // No session or not admin = redirect to home
    if (!session || !session.user?.isAdmin) {
      console.log(`[Middleware] Blocked unauthorized access to ${pathname}`);
      return NextResponse.redirect(new URL('/', request.url));
    }

    console.log(`[Middleware] Admin access granted to ${pathname}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*', // Protect all admin routes
  ],
};
