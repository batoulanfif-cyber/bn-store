const mysql = require('mysql2/promise');

(async () => {
  const c = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'bn_store' });
  const [r] = await c.query(
    'SELECT TABLE_NAME, CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE REFERENCED_TABLE_NAME = ? AND TABLE_SCHEMA = ?',
    ['products', 'bn_store']
  );
  console.log('FKS:', JSON.stringify(r));
  for (const t of ['cart', 'wishlist', 'product_images', 'reviews']) {
    try {
      const [n] = await c.query('SELECT COUNT(*) AS n FROM ' + t);
      console.log(t + ': ' + n[0].n);
    } catch (e) { console.log(t + ' err'); }
  }
  await c.end();
  process.exit(0);
})().catch((e) => { console.log('FAIL:', e.message); process.exit(1); });
