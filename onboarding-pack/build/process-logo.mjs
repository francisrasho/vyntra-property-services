import sharp from 'sharp';
import fs from 'fs';

const SRC = 'src/assets/logo-source.webp';
const ASSETS = 'src/assets';
fs.mkdirSync(ASSETS, { recursive: true });

// Tagline ("PROFESSIONAL • RELIABLE • RESULTS") bounding box in SOURCE coords (1360x907).
// It sits to the RIGHT of the gold divider and BELOW "PROPERTY SERVICES", clear of the VP.
const TAGLINE = { x0: 500, x1: 1310, y0: 516, y1: 580 };
// "VYNTRA" wordmark region (white) — used when recolouring for light backgrounds.
const VYNTRA = { x0: 540, x1: 1320, y0: 330, y1: 458 };

// Returns a sharp PNG with navy keyed to transparent, tagline erased, and
// (optionally) the white VYNTRA wordmark recoloured to navy for light backgrounds.
async function build({ recolorWordmark = false } = {}) {
  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels, W = info.width;
  for (let i = 0; i < data.length; i += ch) {
    const p = i / ch, x = p % W, y = (p / W) | 0;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const m = Math.max(r, g, b);
    // 1) key navy background
    if ((b >= r) && (m < 118)) { data[i + 3] = 0; continue; }
    // 2) erase tagline
    if (x >= TAGLINE.x0 && x <= TAGLINE.x1 && y >= TAGLINE.y0 && y <= TAGLINE.y1) { data[i + 3] = 0; continue; }
    // 3) recolour white wordmark -> navy (gold stays gold: gold has r-b large)
    if (recolorWordmark && x >= VYNTRA.x0 && x <= VYNTRA.x1 && y >= VYNTRA.y0 && y <= VYNTRA.y1
        && (r - b) < 45 && m > 120) {
      data[i] = 0x0F; data[i + 1] = 0x17; data[i + 2] = 0x2A;
    }
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: ch } }).png();
}

const PAD = { top: 10, bottom: 10, left: 10, right: 10, background: { r: 0, g: 0, b: 0, alpha: 0 } };

// Cover / dark backgrounds: white VYNTRA, transparent
const clearBuf = await (await build()).trim({ threshold: 8 }).extend(PAD).png().toBuffer();
await sharp(clearBuf).toFile(`${ASSETS}/logo-clear.png`);
await sharp(clearBuf).flatten({ background: '#0F172A' }).png().toFile(`${ASSETS}/logo-on-navy.png`);

// Light backgrounds (page headers): navy VYNTRA, transparent
const lightBuf = await (await build({ recolorWordmark: true })).trim({ threshold: 8 }).extend(PAD).png().toBuffer();
await sharp(lightBuf).toFile(`${ASSETS}/logo-light.png`);

for (const f of ['logo-clear.png', 'logo-on-navy.png', 'logo-light.png']) {
  const m = await sharp(`${ASSETS}/${f}`).metadata();
  console.log(f, m.width + 'x' + m.height);
}
