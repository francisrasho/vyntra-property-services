const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const EXEC = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
(async () => {
  fs.mkdirSync('previews', { recursive: true });
  const browser = await chromium.launch({ executablePath: EXEC });
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.resolve('src/onboarding.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const pages = await page.$$('.page');
  const heights = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.page')).map(p => p.scrollHeight));
  for (let i = 0; i < pages.length; i++) {
    await pages[i].screenshot({ path: `previews/page-${String(i + 1).padStart(2, '0')}.png` });
  }
  await browser.close();
  // A4 page is 1123px tall at 96dpi; flag overflow
  const over = heights.map((h, i) => ({ p: i + 1, h })).filter(o => o.h > 1124);
  console.log('page heights:', heights.join(', '));
  console.log(over.length ? 'OVERFLOW: ' + JSON.stringify(over) : 'All pages fit within A4.');
})().catch(e => { console.error(e); process.exit(1); });
