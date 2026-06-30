const { chromium } = require('playwright');
const path = require('path');
const EXEC = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
async function render(htmlPath, pdfPath) {
  const browser = await chromium.launch({ executablePath: EXEC });
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve(htmlPath), { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' } });
  await browser.close();
}
module.exports = { render };
if (require.main === module) {
  render(process.argv[2], process.argv[3]).then(() => console.log('Rendered', process.argv[3])).catch(e => { console.error(e); process.exit(1); });
}
