const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

(async () => {
  const dir = __dirname;
  const c = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'bn_store', multipleStatements: true });

  let old;
  try {
    const [rows] = await c.query(
      'SELECT p.*, b.name AS brand_name, cat.slug AS cat_slug FROM products p LEFT JOIN brands b ON b.id=p.brand_id LEFT JOIN categories cat ON cat.id=p.category_id'
    );
    old = rows;
    console.log('OLD PRODUCTS (live):', old.length);
    fs.writeFileSync(path.join(dir, 'old-products.json'), JSON.stringify(old, null, 1));
  } catch (e) {
    old = JSON.parse(fs.readFileSync(path.join(dir, 'old-products.json'), 'utf8'));
    console.log('OLD PRODUCTS (from backup json):', old.length);
  }

  await c.query('SET FOREIGN_KEY_CHECKS=0');
  await c.query('DROP TABLE IF EXISTS order_items');
  await c.query('DROP TABLE IF EXISTS orders');
  await c.query('DROP TABLE IF EXISTS products');
  // old leftover tables (unused by the app) still hold FKs pointing at products()
  const fks = [
    ['cart', 'fk_cart_product'],
    ['product_images', 'fk_product_images_product'],
    ['reviews', 'fk_reviews_product'],
    ['wishlist', 'fk_wishlist_product'],
  ];
  for (const [t, k] of fks) {
    try { await c.query('ALTER TABLE ' + t + ' DROP FOREIGN KEY ' + k); console.log('dropped FK', k); }
    catch (e) { console.log('FK skip', k); }
  }
  await c.query('SET FOREIGN_KEY_CHECKS=1');

  let sql = fs.readFileSync(path.join(dir, 'schema.sql'), 'utf8');
  sql = sql.split('\n').filter((l) => !/CREATE DATABASE/i.test(l) && !/^USE /i.test(l.trim())).join('\n');
  sql = sql.split('-- Insert sample products')[0];
  const stmts = sql.split(/;\s*\n/).map((s) => s.trim()).filter(Boolean);
  console.log('STATEMENTS:', stmts.length);
  for (const s of stmts) {
    try { await c.query(s); console.log('OK:', s.slice(0, 60).replace(/\n/g, ' ')); }
    catch (e) { console.log('STMT FAIL:', e.message.slice(0, 160), '<<', s.slice(0, 80).replace(/\n/g, ' ')); }
  }
  console.log('TABLES REBUILT');

  let n = 0;
  for (const p of old) {
    const onSale = p.sale_price != null && Number(p.sale_price) > 0;
    const price = onSale ? Number(p.sale_price) : Number(p.price);
    const orig = onSale ? Number(p.price) : null;
    const slug = p.slug || ('p-' + p.id);
    const img = p.image_path || '/images/hero-lipstick.jpg';
    await c.query(
      'INSERT INTO products (brand,name,slug,description,price,original_price,stock,image,rating,review_count,badge,is_active,is_featured,category) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [p.brand_name || 'BN', p.name, slug, p.description || null, price, orig, p.stock_quantity || 0, img, 4.5, 0, null, p.is_active ? 1 : 0, p.is_featured ? 1 : 0, p.cat_slug || null]
    );
    n++;
  }
  await c.query("UPDATE products SET image='/images/hero-lipstick.jpg', is_featured=1 WHERE name LIKE '%Rouge Pur Couture%' LIMIT 1");
  const [chk] = await c.query('SELECT COUNT(*) AS n FROM products');
  const [feat] = await c.query('SELECT id,brand,name,price,stock,image,category FROM products WHERE is_featured=1 LIMIT 5');
  console.log('MIGRATED:', n, '| NOW:', chk[0].n);
  console.log('FEATURED:', JSON.stringify(feat));
  await c.end();
  process.exit(0);
})().catch((e) => { console.log('FAIL:', e.message); process.exit(1); });
