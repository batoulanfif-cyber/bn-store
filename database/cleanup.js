const mysql = require('mysql2/promise');

(async () => {
  const c = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'bn_store' });
  const [o] = await c.query('SELECT o.id, o.order_number, o.customer_name, o.total, (SELECT COUNT(*) FROM order_items i WHERE i.order_id = o.id) AS items FROM orders o');
  console.log('ORDERS:', JSON.stringify(o));
  // remove obvious test leftovers (customer_name = Test Client)
  const [t] = await c.query("SELECT id FROM orders WHERE customer_name = 'Test Client'");
  for (const r of t) {
    const [items] = await c.query('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [r.id]);
    for (const it of items) {
      await c.query('UPDATE products SET stock = stock + ? WHERE id = ?', [it.quantity, it.product_id]);
    }
    await c.query('DELETE FROM order_items WHERE order_id = ?', [r.id]);
    await c.query('DELETE FROM orders WHERE id = ?', [r.id]);
  }
  console.log('REMOVED TEST LEFTOVERS:', t.length);
  const [s] = await c.query('SELECT id, name, stock FROM products ORDER BY id LIMIT 5');
  console.log('STOCK:', JSON.stringify(s));
  await c.end();
  process.exit(0);
})().catch((e) => { console.log('FAIL:', e.message); process.exit(1); });
