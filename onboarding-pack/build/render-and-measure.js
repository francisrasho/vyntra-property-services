const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const EXEC = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
(async () => {
  const browser = await chromium.launch({ executablePath: EXEC });
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve('src/onboarding.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });
  // Measure fields relative to their .page
  const fields = await page.evaluate(() => {
    const pages = Array.from(document.querySelectorAll('.page'));
    const out = [];
    document.querySelectorAll('[data-field]').forEach(el => {
      const pg = el.closest('.page');
      const pi = pages.indexOf(pg);
      const r = el.getBoundingClientRect();
      const pr = pg.getBoundingClientRect();
      out.push({ name: el.getAttribute('data-field'), type: el.getAttribute('data-ftype'),
        page: pi, x: r.left - pr.left, y: r.top - pr.top, w: r.width, h: r.height });
    });
    return { fields: out, pageCount: pages.length };
  });
  fs.writeFileSync('build/fields.json', JSON.stringify(fields, null, 2));
  await page.pdf({ path: 'build/onboarding.base.pdf', format: 'A4', printBackground: true,
    margin: { top:'0', bottom:'0', left:'0', right:'0' } });
  await browser.close();
  console.log('pageCount:', fields.pageCount, '| fields:', fields.fields.length);
})().catch(e => { console.error(e); process.exit(1); });
