const mysql = require('mysql2/promise');

(async () => {
  const c = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'bn_store' });
  const [v] = await c.query('SELECT VERSION() AS v');
  console.log('DB VERSION:', v[0].v);
  try {
    const [r] = await c.query(
      "SELECT o.id, JSON_ARRAYAGG(JSON_OBJECT('id', oi.id, 'product_id', oi.product_id)) AS items FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id GROUP BY o.id LIMIT 1"
    );
    console.log('AGG OK:', JSON.stringify(r));
  } catch (e) { console.log('AGG FAIL:', e.message.slice(0, 200)); }
  await c.end();
  process.exit(0);
})().catch((e) => { console.log('FAIL:', e.message); process.exit(1); });
