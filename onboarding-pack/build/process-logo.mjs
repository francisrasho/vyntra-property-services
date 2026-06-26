import sharp from 'sharp';
import fs from 'fs';

const SRC = 'src/assets/logo-source.webp';
const ASSETS = 'src/assets';
fs.mkdirSync(ASSETS, { recursive: true });

// Key out the navy background -> transparent.
// Background is navy (blue-dominant + dark); logo is gold (red-dominant) or white (bright).
async function keyNavy(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  for (let i = 0; i < data.length; i += ch) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const m = Math.max(r, g, b);
    const isNavy = (b >= r) && (m < 118);              // dark + blue-leaning => background
    if (isNavy) { data[i + 3] = 0; }
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: ch } }).png();
}

const PAD = { extend: { top: 10, bottom: 10, left: 10, right: 10, background: { r: 0, g: 0, b: 0, alpha: 0 } } };

// 1) Full transparent lockup (trimmed + safe transparent padding)
const clear = await keyNavy(SRC);
const clearTrimmed = await clear.clone().trim({ threshold: 8 }).extend(PAD.extend).png().toBuffer();
await sharp(clearTrimmed).toFile(`${ASSETS}/logo-clear.png`);

// 2) Full lockup flattened on the brand navy (for DOCX / any light bg)
await sharp(clearTrimmed).flatten({ background: '#0F172A' }).png().toFile(`${ASSETS}/logo-on-navy.png`);

// 3) VP monogram only — crop the left region (excludes the gold divider), then key + trim
const crop = { left: 85, top: 285, width: 375, height: 330 }; // VP bounding box (approx)
const vpBuf = await sharp(SRC).extract(crop).toBuffer();
const vpClear = await keyNavy(vpBuf);
await vpClear.trim({ threshold: 8 }).extend(PAD.extend).toFile(`${ASSETS}/logo-mark.png`);

for (const f of ['logo-clear.png', 'logo-on-navy.png', 'logo-mark.png']) {
  const m = await sharp(`${ASSETS}/${f}`).metadata();
  console.log(f, m.width + 'x' + m.height);
}
