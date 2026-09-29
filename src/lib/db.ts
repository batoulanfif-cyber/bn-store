import mysql from 'mysql2/promise';

const useSSL = process.env.DB_SSL === 'true' || process.env.DB_PORT === '4000';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bn_store',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  // TiDB Cloud / managed MySQL require TLS. Enabled via DB_SSL=true
  // (auto-enabled for TiDB's default port 4000).
  ...(useSSL ? { ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true } } : {}),
});

export async function query<T>(sql: string, params: any[] = []): Promise<T[]> {
  // NOTE: pool.query (text protocol) instead of pool.execute (binary
  // prepared-statement protocol). TiDB Cloud Serverless can drop the
  // server-side prepared handle between PREPARE and EXECUTE across its
  // gateway (high latency + connection migration), which makes every
  // execute() fail while plain queries work. Values are still escaped
  // client-side by mysql2, so placeholders remain injection-safe.
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}

export async function queryOne<T>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] || null;
}

export async function execute(sql: string, params: any[] = []): Promise<mysql.ResultSetHeader> {
  // Same reason as query(): text protocol, no server-side prepared handles.
  const [result] = await pool.query(sql, params);
  return result as mysql.ResultSetHeader;
}

export async function transaction<T>(callback: (conn: mysql.PoolConnection) => Promise<T>): Promise<T> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

export default pool;