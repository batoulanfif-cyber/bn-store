import { query, queryOne } from './db';
import type { Order, OrderItem, OrderWithItems } from './db-types';

function normalize(order: Order, items: OrderItem[]): OrderWithItems {
  return {
    ...(order as OrderWithItems),
    subtotal: Number(order.subtotal),
    shipping_cost: Number(order.shipping_cost),
    total: Number(order.total),
    items: (items || []).map((i) => ({
      ...i,
      product_price: Number(i.product_price),
      subtotal: Number(i.subtotal),
    })),
  };
}

/** Fetch one order + its items (no JSON_ARRAYAGG → works on MariaDB 10.4 too). */
export async function getOrderWithItems(id: number | string): Promise<OrderWithItems | null> {
  const order = await queryOne<Order>('SELECT * FROM orders WHERE id = ?', [id]);
  if (!order) return null;
  const items = await query<OrderItem>('SELECT * FROM order_items WHERE order_id = ? ORDER BY id', [order.id]);
  return normalize(order, items);
}

/** Paginated order list with items attached. */
export async function listOrdersWithItems(opts: { status?: string | null; page: number; limit: number }) {
  const { status, page, limit } = opts;
  const offset = (page - 1) * limit;
  const where = status ? 'WHERE status = ?' : 'WHERE 1=1';
  const params: any[] = status ? [status] : [];

  const [{ total }] = await query<{ total: number }>(`SELECT COUNT(*) as total FROM orders ${where}`, params);
  const orders = await query<Order>(`SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, limit, offset]);

  const data: OrderWithItems[] = [];
  for (const o of orders) {
    const items = await query<OrderItem>('SELECT * FROM order_items WHERE order_id = ? ORDER BY id', [o.id]);
    data.push(normalize(o, items));
  }
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}
