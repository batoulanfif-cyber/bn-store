import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, execute } from '@/lib/db';
import { requireAdmin } from '@/lib/requireAdmin';
import type { Product, ProductInput, PaginatedResponse, ApiResponse } from '@/lib/db-types';

// These routes need a live DB + request cookies: never prerender at build time.
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const active = searchParams.get('active');
    const search = searchParams.get('search');
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params: unknown[] = [];

    if (active !== null) {
      whereClause += ' AND is_active = ?';
      params.push(active === 'true');
    } else {
      whereClause += ' AND is_active = TRUE';
    }

    if (category) {
      whereClause += ' AND category = ?';
      params.push(category);
    }

    if (featured === 'true') {
      whereClause += ' AND is_featured = TRUE';
    }

    if (search) {
      whereClause += ' AND (name LIKE ? OR brand LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const countSql = `SELECT COUNT(*) as total FROM products ${whereClause}`;
    const [{ total }] = await query<{ total: number }>(countSql, params);

    const sql = `
      SELECT * FROM products 
      ${whereClause} 
      ORDER BY is_featured DESC, created_at DESC 
      LIMIT ? OFFSET ?
    `;
    const products = await query<Product>(sql, [...params, limit, offset]);

    const response: PaginatedResponse<Product> = {
      data: products.map(p => ({
        ...p,
        price: Number(p.price),
        original_price: p.original_price ? Number(p.original_price) : null,
        rating: Number(p.rating),
        images: p.images ? JSON.parse(p.images as unknown as string) : null,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const body = await request.json() as ProductInput;
    const { brand, name, slug, description, price, original_price, stock, image, images, rating, review_count, badge, is_active, is_featured, category } = body;

    if (!brand || !name || !slug || price === undefined || stock === undefined || !image) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await queryOne<{ id: number }>('SELECT id FROM products WHERE slug = ?', [slug]);
    if (existing) {
      return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 400 });
    }

    const result = await execute(
      `INSERT INTO products (brand, name, slug, description, price, original_price, stock, image, images, rating, review_count, badge, is_active, is_featured, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [brand, name, slug, description || null, price, original_price || null, stock, image, images ? JSON.stringify(images) : null, rating || 0, review_count || 0, badge || null, is_active !== false, is_featured || false, category || null]
    );

    const product = await queryOne<Product>('SELECT * FROM products WHERE id = ?', [result.insertId]);
    
    return NextResponse.json({ 
      success: true, 
      data: product ? { ...product, price: Number(product.price), original_price: product.original_price ? Number(product.original_price) : null, rating: Number(product.rating), images: product.images ? JSON.parse(product.images as unknown as string) : null } : null 
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}