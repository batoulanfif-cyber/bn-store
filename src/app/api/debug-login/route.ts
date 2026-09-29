import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// TEMPORARY — removed after diagnosing production login failure.
export const dynamic = 'force-dynamic';

export async function GET() {
  const steps: Record<string, string> = {};
  try {
    steps.import_db = 'ok';
    const { query } = await import('@/lib/db');
    steps.query_admin = 'running';
    const rows = await query<{ id: number; email: string; password_hash: unknown }>(
      'SELECT id, email, password_hash FROM admin_users WHERE email = ?',
      ['admin@bnstore.dz']
    );
    steps.query_admin = `ok rows=${rows.length} hashType=${typeof rows[0]?.password_hash} hashLen=${String(rows[0]?.password_hash || '').length}`;
    steps.compare = 'running';
    const valid = await bcrypt.compare('admin123', String(rows[0]?.password_hash || ''));
    steps.compare = `ok valid=${valid}`;
    steps.update = 'running';
    await query('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [rows[0].id]);
    steps.update = 'ok';
    steps.token = 'running';
    const { createToken } = await import('@/lib/auth');
    const token = await createToken({ id: rows[0].id, email: rows[0].email, role: 'admin' });
    steps.token = `ok len=${token.length}`;
    return NextResponse.json({ ok: true, steps });
  } catch (e: unknown) {
    const err = e as { message?: string; code?: string; stack?: string };
    steps.failed = `${err?.code || ''} ${err?.message || String(e)}`.trim();
    steps.stack = String(err?.stack || '').split('\n').slice(0, 4).join(' | ');
    return NextResponse.json({ ok: false, steps });
  }
}
