import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { queryOne, execute } from '@/lib/db';
import { requireAdmin } from '@/lib/requireAdmin';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import type { AdminUser } from '@/lib/db-types';

// Admin password change: never prerender at build time.
export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const body = (await request.json()) as { currentPassword?: string; newPassword?: string };
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: 'Current and new passwords are required' }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, error: 'New password must be at least 8 characters' }, { status: 400 });
    }

    const token = await getTokenFromRequest(request);
    const payload = token ? await verifyToken(token) : null;
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
    }

    const admin = await queryOne<AdminUser>('SELECT * FROM admin_users WHERE id = ? AND is_active = TRUE', [payload.id]);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin not found' }, { status: 404 });
    }

    const valid = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 });
    }

    const hash = await bcrypt.hash(newPassword, 12);
    await execute('UPDATE admin_users SET password_hash = ? WHERE id = ?', [hash, admin.id]);

    return NextResponse.json({ success: true, message: 'Password updated' });
  } catch (error) {
    console.error('PUT /api/admin/password error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update password' }, { status: 500 });
  }
}
