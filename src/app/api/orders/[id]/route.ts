import { NextRequest, NextResponse } from 'next/server';
import { queryOne, execute } from '@/lib/db';
import { requireAdmin } from '@/lib/requireAdmin';
import { getOrderWithItems } from '@/lib/orders';
import type { Order } from '@/lib/db-types';

const validStatuses: Order['status'][] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

// These routes need a live DB + request cookies: never prerender at build time.
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const { id } = await params;
    const order = await getOrderWithItems(id);

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('GET /api/orders/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const { id } = await params;
    const body = await request.json() as { status?: Order['status']; payment_status?: Order['payment_status'] };

    const existing = await queryOne<{ id: number; status: Order['status'] }>('SELECT id, status FROM orders WHERE id = ?', [id]);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const updates: string[] = [];
    const values: unknown[] = [];

    if (body.status && validStatuses.includes(body.status)) {
      updates.push('status = ?');
      values.push(body.status);
      
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      switch (body.status) {
        case 'confirmed':
          updates.push('confirmed_at = ?');
          values.push(now);
          break;
        case 'shipped':
          updates.push('shipped_at = ?');
          values.push(now);
          break;
        case 'delivered':
          updates.push('delivered_at = ?');
          values.push(now);
          break;
        case 'cancelled':
          updates.push('cancelled_at = ?');
          values.push(now);
          break;
      }
    }

    if (body.payment_status && ['pending', 'paid', 'failed'].includes(body.payment_status)) {
      updates.push('payment_status = ?');
      values.push(body.payment_status);
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid fields to update' }, { status: 400 });
    }

    values.push(id);
    await execute(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`, values);

    const order = await getOrderWithItems(id);

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('PUT /api/orders/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}