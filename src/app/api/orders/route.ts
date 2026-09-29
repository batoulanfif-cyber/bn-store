import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { requireAdmin } from '@/lib/requireAdmin';
import { getOrderWithItems, listOrdersWithItems } from '@/lib/orders';
import type { CheckoutData } from '@/lib/db-types';

// These routes need a live DB + request cookies: never prerender at build time.
export const dynamic = 'force-dynamic';

function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `BN${year}${month}${day}${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CheckoutData;
    const { customer_name, customer_phone, customer_wilaya, customer_address, customer_notes, items } = body;

    if (!customer_name || !customer_phone || !customer_wilaya || !customer_address || !items?.length) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const productIds = items.map(i => i.product_id);
    const placeholders = productIds.map(() => '?').join(',');
    const products = await query<{ id: number; price: number; stock: number; name: string; brand: string }>(
      `SELECT id, price, stock, name, brand FROM products WHERE id IN (${placeholders}) AND is_active = TRUE`,
      productIds
    );

    if (products.length !== items.length) {
      return NextResponse.json({ success: false, error: 'Some products not found or inactive' }, { status: 400 });
    }

    for (const item of items) {
      const product = products.find(p => p.id === item.product_id);
      if (!product || product.stock < item.quantity) {
        return NextResponse.json({ success: false, error: `Insufficient stock for ${product?.name}` }, { status: 400 });
      }
    }

    const orderNumber = generateOrderNumber();
    let subtotal = 0;
    const orderItems: Array<{ product_id: number; product_brand: string; product_name: string; product_price: number; quantity: number; subtotal: number }> = [];

    for (const item of items) {
      const product = products.find(p => p.id === item.product_id)!;
      const itemSubtotal = Number(product.price) * item.quantity;
      subtotal += itemSubtotal;
      orderItems.push({
        product_id: product.id,
        product_brand: product.brand,
        product_name: product.name,
        product_price: Number(product.price),
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });
    }

    const shippingCost = subtotal >= 6000 ? 0 : 500;
    const total = subtotal + shippingCost;

    const orderResult = await execute(
      `INSERT INTO orders (order_number, customer_name, customer_phone, customer_wilaya, customer_address, customer_notes, subtotal, shipping_cost, total, status, payment_method, payment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'cod', 'pending')`,
      [orderNumber, customer_name, customer_phone, customer_wilaya, customer_address, customer_notes || null, subtotal, shippingCost, total]
    );

    const orderId = orderResult.insertId;

    for (const item of orderItems) {
      await execute(
        `INSERT INTO order_items (order_id, product_id, product_brand, product_name, product_price, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.product_brand, item.product_name, item.product_price, item.quantity, item.subtotal]
      );
      await execute('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
    }

    const order = await getOrderWithItems(orderId);

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const offset = (page - 1) * limit;

    const response = await listOrdersWithItems({ status, page, limit });

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}