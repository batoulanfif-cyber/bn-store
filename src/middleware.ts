import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

const adminPaths = ['/admin'];
const apiAdminPaths = ['/api/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = adminPaths.some(path => pathname.startsWith(path));
  const isAdminApi = apiAdminPaths.some(path => pathname.startsWith(path));
  
  if (isAdminPage || isAdminApi) {
    if (pathname === '/admin/login' || pathname === '/api/admin/login' || pathname === '/api/admin/logout') {
      return NextResponse.next();
    }

    const token = await getTokenFromRequest(request);
    if (!token) {
      if (isAdminApi) {
        return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
      }
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      if (isAdminApi) {
        return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
      }
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};