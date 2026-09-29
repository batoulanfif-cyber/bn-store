import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

/** Returns an error response if the caller is not an admin, else null. */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const token = await getTokenFromRequest(request);
  if (!token) {
    return NextResponse.json({ success: false, error: 'Non authentifié — connectez-vous.' }, { status: 401 });
  }
  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ success: false, error: 'Session invalide.' }, { status: 401 });
  }
  return null;
}
