import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { queryOne } from '@/lib/db';
import { createToken, setTokenCookie } from '@/lib/auth';
import type { AdminUser, ApiResponse } from '@/lib/db-types';

// Auth routes need request cookies + live DB: never prerender at build time.
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { email: string; password: string };
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 });
    }

    const admin = await queryOne<AdminUser>('SELECT * FROM admin_users WHERE email = ? AND is_active = TRUE', [email]);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    await execute('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [admin.id]);

    const token = await createToken({ id: admin.id, email: admin.email, role: admin.role });
    const cookie = setTokenCookie(token);

    const response = NextResponse.json({
      success: true,
      data: { id: admin.id, email: admin.email, name: admin.name, role: admin.role }
    });
    response.headers.set('Set-Cookie', cookie);
    return response;
  } catch (error) {
    console.error('POST /api/admin/login error:', error);
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}

async function execute(sql: string, params: unknown[]): Promise<void> {
  const { query } = await import('@/lib/db');
  await query(sql, params);
}