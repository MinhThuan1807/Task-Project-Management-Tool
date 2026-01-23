import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const pathname = request.nextUrl.pathname;

  const publicPaths = ['/', '/login', '/register'];

  const isPublic = publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'));

  // Logged in user không vào login/register
  if (token && (pathname === '/' || pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Chưa login mà vào private route
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Adjust the matcher as needed to include/exclude specific paths
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
    '/dashboard/:path*',
    '/chat/:path*',
    '/report/:path*',
    '/project/:path*',
  ],
};