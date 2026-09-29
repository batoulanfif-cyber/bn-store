import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, execute } from '@/lib/db';
import { requireAdmin } from '@/lib/requireAdmin';
import type { Product, ProductInput, ApiResponse } from '@/lib/db-types';

// These routes need a live DB + request cookies: never prerender at build time.
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await queryOne<Product>('SELECT * FROM products WHERE id = ?', [id]);
    
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        price: Number(product.price),
        original_price: product.original_price ? Number(product.original_price) : null,
        rating: Number(product.rating),
        images: product.images ? JSON.parse(product.images as unknown as string) : null,
      }
    });
  } catch (error) {
    console.error('GET /api/products/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const { id } = await params;
    const body = await request.json() as Partial<ProductInput>;
    
    const existing = await queryOne<{ id: number; slug: string }>('SELECT id, slug FROM products WHERE id = ?', [id]);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    if (body.slug && body.slug !== existing.slug) {
      const slugExists = await queryOne<{ id: number }>('SELECT id FROM products WHERE slug = ? AND id != ?', [body.slug, id]);
      if (slugExists) {
        return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 400 });
      }
    }

    const fields: string[] = [];
    const values: unknown[] = [];

    const allowedFields = ['brand', 'name', 'slug', 'description', 'price', 'original_price', 'stock', 'image', 'images', 'rating', 'review_count', 'badge', 'is_active', 'is_featured', 'category'];
    
    for (const field of allowedFields) {
      if (body[field as keyof ProductInput] !== undefined) {
        fields.push(`${field} = ?`);
        let value = body[field as keyof ProductInput];
        if (field === 'images' && value) {
          value = JSON.stringify(value);
        }
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);
    await execute(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);

    const product = await queryOne<Product>('SELECT * FROM products WHERE id = ?', [id]);
    
    return NextResponse.json({
      success: true,
      data: product ? { ...product, price: Number(product.price), original_price: product.original_price ? Number(product.original_price) : null, rating: Number(product.rating), images: product.images ? JSON.parse(product.images as unknown as string) : null } : null
    });
  } catch (error) {
    console.error('PUT /api/products/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const { id } = await params;
    const existing = await queryOne<{ id: number }>('SELECT id FROM products WHERE id = ?', [id]);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    await execute('DELETE FROM products WHERE id = ?', [id]);
    
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}