import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const PROTECTED_PREFIXES = ['/dashboard', '/resume'];
// Paths that logged-in users should not see
const AUTH_ONLY_PATHS = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const isAuthenticated = Boolean(token);

  // If trying to access a protected page without a token, redirect to login
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and hitting login/signup, redirect to dashboard
  if (AUTH_ONLY_PATHS.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image, favicon.ico, api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
