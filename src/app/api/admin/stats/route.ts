import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { queryOne } from '@/lib/db';

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

    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      cancelledOrders,
      totalSales
    ] = await Promise.all([
      queryOne<{ total_orders: number }>('SELECT COUNT(*) as total_orders FROM orders'),
      queryOne<{ pending_orders: number }>('SELECT COUNT(*) as pending_orders FROM orders WHERE status = "pending"'),
      queryOne<{ confirmed_orders: number }>('SELECT COUNT(*) as confirmed_orders FROM orders WHERE status IN ("confirmed", "processing", "shipped")'),
      queryOne<{ cancelled_orders: number }>('SELECT COUNT(*) as cancelled_orders FROM orders WHERE status = "cancelled"'),
      queryOne<{ total_sales: number }>('SELECT COALESCE(SUM(total), 0) as total_sales FROM orders WHERE status NOT IN ("cancelled")')
    ]);

    return NextResponse.json({
      success: true,
      data: {
        total_orders: totalOrders?.total_orders || 0,
        pending_orders: pendingOrders?.pending_orders || 0,
        confirmed_orders: confirmedOrders?.confirmed_orders || 0,
        cancelled_orders: cancelledOrders?.cancelled_orders || 0,
        total_sales: Number(totalSales?.total_sales || 0),
      }
    });
  } catch (error) {
    console.error('GET /api/admin/stats error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
  }
}