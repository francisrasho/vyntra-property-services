import { chromium } from 'playwright';
import path from 'path';
const EXEC = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b = await chromium.launch({ executablePath: EXEC });
const pg = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1 });
await pg.goto('file://' + path.resolve('src/onboarding.html'), { waitUntil: 'networkidle' });
await pg.evaluate(() => document.fonts.ready);
const res = await pg.evaluate(() => {
  const out = [];
  document.querySelectorAll('.page').forEach((pageEl, i) => {
    const pad = pageEl.querySelector('.pad');
    const foot = pageEl.querySelector('.foot');
    const pr = pageEl.getBoundingClientRect();
    // overflow inside pad (content taller than the space it has)
    const padOverflow = pad ? Math.max(0, pad.scrollHeight - pad.clientHeight) : 0;
    // does foot (or last content) extend past the page bottom?
    let bottomMost = 0;
    pageEl.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom - pr.top > bottomMost) bottomMost = r.bottom - pr.top;
    });
    out.push({ page: i + 1, padOverflow: Math.round(padOverflow), contentBottom: Math.round(bottomMost), pageH: Math.round(pr.height) });
  });
  return out;
});
await b.close();
let bad = 0;
for (const r of res) {
  const over = r.padOverflow > 1 || r.contentBottom > r.pageH + 1;
  if (over) { bad++; console.log(`PAGE ${r.page}  OVERFLOW  padOverflow=${r.padOverflow}px contentBottom=${r.contentBottom}/${r.pageH}`); }
}
console.log(bad ? `\n${bad} page(s) overflow` : 'OK — no content overflow on any page');
