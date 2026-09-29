import { NextResponse } from 'next/server';
import { clearTokenCookie } from '@/lib/auth';

// Auth routes need request cookies: never prerender at build time.
export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  response.headers.set('Set-Cookie', clearTokenCookie());
  return response;
}