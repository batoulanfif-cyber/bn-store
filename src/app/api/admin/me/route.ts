import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { queryOne } from '@/lib/db';
import type { AdminUser, ApiResponse } from '@/lib/db-types';

// Auth routes need request cookies + live DB: never prerender at build time.
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = await getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const admin = await queryOne<AdminUser>('SELECT id, email, name, role, is_active, last_login, created_at FROM admin_users WHERE id = ? AND is_active = TRUE', [payload.id]);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 401 });
    }

    return NextResponse.json({ success: true, data: admin });
  } catch (error) {
    console.error('GET /api/admin/me error:', error);
    return NextResponse.json({ success: false, error: 'Failed to get user' }, { status: 500 });
  }
}