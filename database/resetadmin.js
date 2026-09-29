const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

(async () => {
  const c = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'bn_store' });
  const hash = bcrypt.hashSync('admin123', 12);
  await c.query('UPDATE admin_users SET password_hash = ?, is_active = 1 WHERE email = ?', [hash, 'admin@bnstore.dz']);
  const [r] = await c.query('SELECT id, email, name, is_active FROM admin_users');
  console.log('ADMINS:', JSON.stringify(r));
  await c.end();
  process.exit(0);
})().catch((e) => { console.log('FAIL:', e.message); process.exit(1); });
