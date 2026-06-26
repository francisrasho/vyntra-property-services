const { chromium } = require('playwright');
const path = require('path');
const EXEC = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
(async () => {
  const browser = await chromium.launch({ executablePath: EXEC });
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.resolve('src/onboarding.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const pages = await page.$$('.page');
  const want = [0, 1, 2, 3, 5, 6, 8, 14];
  for (const i of want) {
    await pages[i].screenshot({ path: `build/p${String(i + 1).padStart(2, '0')}.png` });
  }
  await browser.close();
  console.log('shots done:', want.length);
})().catch(e => { console.error(e); process.exit(1); });
