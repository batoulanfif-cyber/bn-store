import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// TEMPORARY debug route — removed after diagnosing production DB connectivity.
export const dynamic = 'force-dynamic';

export async function GET() {
  const started = Date.now();
  const info = {
    host: process.env.DB_HOST || '(missing)',
    port: process.env.DB_PORT || '(missing)',
    user: process.env.DB_USER || '(missing)',
    db: process.env.DB_NAME || '(missing)',
    ssl: process.env.DB_SSL || '(missing)',
    hasPassword: Boolean(process.env.DB_PASSWORD),
  };
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
      connectTimeout: 10000,
    });
    const [rows] = await conn.query('SELECT COUNT(*) AS n FROM products');
    await conn.end();
    return NextResponse.json({ ok: true, latencyMs: Date.now() - started, count: (rows as { n: number }[])[0].n, info: { ...info } });
  } catch (e: unknown) {
    const err = e as { message?: string; code?: string; errno?: number; fatal?: boolean };
    return NextResponse.json({
      ok: false,
      latencyMs: Date.now() - started,
      error: err?.message || String(e),
      code: err?.code || null,
      errno: err?.errno ?? null,
      info,
    });
  }
}
