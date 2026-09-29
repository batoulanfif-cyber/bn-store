import { SignJWT, jwtVerify } from 'jose';
import type { AdminUser } from './db-types';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'bn-store-super-secret-jwt-key-change-in-production-min-32-chars');

export async function createToken(user: Pick<AdminUser, 'id' | 'email' | 'role'>): Promise<string> {
  return new SignJWT({ id: user.id, email: user.email, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || '7d')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<{ id: number; email: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return { id: payload.id as number, email: payload.email as string, role: payload.role as string };
  } catch {
    return null;
  }
}

export async function getTokenFromRequest(request: Request): Promise<string | null> {
  const cookie = request.headers.get('cookie');
  if (!cookie) return null;
  
  const match = cookie.match(/admin_token=([^;]+)/);
  return match ? match[1] : null;
}

export function setTokenCookie(token: string): string {
  const isProduction = process.env.NODE_ENV === 'production';
  return `admin_token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax${isProduction ? '; Secure' : ''}`;
}

export function clearTokenCookie(): string {
  const isProduction = process.env.NODE_ENV === 'production';
  return `admin_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${isProduction ? '; Secure' : ''}`;
}