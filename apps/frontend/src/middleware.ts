import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/pos',
  '/billing',
  '/products',
  '/inventory',
  '/categories',
  '/vendors',
  '/purchases',
  '/stock-transfer',
  '/sales-reports',
  '/customers',
  '/subscription',
  '/outlets',
  '/store-profile',
  '/staff',
  '/notifications',
  '/support',
  '/profile',
  '/settings',
  '/tenants',
  '/packages',
  '/documents',
  '/contracts',
  '/promotions',
  '/referrals',
  '/payment',
  '/support-tickets',
  '/activity-logs',
  '/templates',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtected && !token) {
    const login = new URL('/login', request.url);
    login.searchParams.set('next', pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets).*)'],
};
