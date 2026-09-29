const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text().slice(0, 200)); });

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);

  const before = await page.evaluate(() => ({
    dir: document.documentElement.dir,
    hero: (document.querySelector('h1') || {}).innerText?.slice(0, 80),
    hasArBtn: !!Array.from(document.querySelectorAll('button')).find((b) => b.textContent.trim() === 'عربي'),
    buttons: Array.from(document.querySelectorAll('header button')).map((b) => b.textContent.trim()).slice(0, 6),
  }));
  console.log('BEFORE:', JSON.stringify(before, null, 1));

  const arBtn = page.locator('header button', { hasText: 'عربي' });
  if (await arBtn.count()) {
    await arBtn.first().click();
    await page.waitForTimeout(2000);
  } else {
    console.log('NO AR BUTTON FOUND');
  }

  const after = await page.evaluate(() => ({
    dir: document.documentElement.dir,
    lang: document.documentElement.lang,
    hero: (document.querySelector('h1') || {}).innerText?.slice(0, 80),
    localStorage: window.localStorage.getItem('bn_locale'),
  }));
  console.log('AFTER:', JSON.stringify(after, null, 1));
  await page.screenshot({ path: 'C:\\Users\\BOUTIQ~1\\AppData\\Local\\Temp\\opencode\\ar-test.png' });
  console.log('ERRORS:', errors.length ? errors.slice(0, 5) : 'none');
  await browser.close();
  process.exit(0);
})().catch((e) => { console.log('FAIL:', e.message.slice(0, 500)); process.exit(1); });
