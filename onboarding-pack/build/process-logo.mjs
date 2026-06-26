import sharp from 'sharp';
import fs from 'fs';

const SRC = 'src/assets/logo-source.webp';   // transparent, tagline-free lockup (1536x1024)
const ASSETS = 'src/assets';
fs.mkdirSync(ASSETS, { recursive: true });

// "VYNTRA" wordmark region (white) in SOURCE coords — used when recolouring for light backgrounds.
const VYNTRA = { x0: 600, x1: 1450, y0: 365, y1: 518 };

// Optionally recolour the white VYNTRA wordmark -> navy (gold VP / PROPERTY SERVICES untouched).
async function build({ recolorWordmark = false } = {}) {
  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels, W = info.width;
  if (recolorWordmark) {
    for (let i = 0; i < data.length; i += ch) {
      const p = i / ch, x = p % W, y = (p / W) | 0;
      const a = data[i + 3];
      if (a < 40) continue;
      if (x < VYNTRA.x0 || x > VYNTRA.x1 || y < VYNTRA.y0 || y > VYNTRA.y1) continue;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (Math.min(r, g, b) > 150) { data[i] = 0x0F; data[i + 1] = 0x17; data[i + 2] = 0x2A; }
    }
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: ch } }).png();
}

const PAD = { top: 12, bottom: 12, left: 12, right: 12, background: { r: 0, g: 0, b: 0, alpha: 0 } };

// Cover / dark backgrounds: white VYNTRA, transparent
const clearBuf = await (await build()).trim({ threshold: 10 }).extend(PAD).png().toBuffer();
await sharp(clearBuf).toFile(`${ASSETS}/logo-clear.png`);
await sharp(clearBuf).flatten({ background: '#0F172A' }).png().toFile(`${ASSETS}/logo-on-navy.png`);

// Light backgrounds (page headers): navy VYNTRA, transparent
const lightBuf = await (await build({ recolorWordmark: true })).trim({ threshold: 10 }).extend(PAD).png().toBuffer();
await sharp(lightBuf).toFile(`${ASSETS}/logo-light.png`);

for (const f of ['logo-clear.png', 'logo-on-navy.png', 'logo-light.png']) {
  const m = await sharp(`${ASSETS}/${f}`).metadata();
  console.log(f, m.width + 'x' + m.height);
}
