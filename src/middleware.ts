import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;

  // If logged in and trying to access "/", redirect to "/dashboard"
  if (request.nextUrl.pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If not logged in, block access to main pages (except /login, /register, /)
  const publicPaths = ['/', '/login', '/register', '/api', '/_next', '/favicon.ico'];
  const isPublic = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path));
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Adjust the matcher as needed to include/exclude specific paths
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};