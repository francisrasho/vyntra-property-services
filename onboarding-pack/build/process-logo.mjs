import sharp from 'sharp';
import fs from 'fs';

const SRC = 'src/assets/logo-source.webp';   // transparent, tagline-free lockup (1536x1024)
const ASSETS = 'src/assets';
fs.mkdirSync(ASSETS, { recursive: true });

// The logo is used as-is (no recolouring) — the white VYNTRA wordmark is preserved.
// It sits on navy everywhere: the cover background and a navy "plate" in page headers.
const PAD = { top: 14, bottom: 14, left: 14, right: 14, background: { r: 0, g: 0, b: 0, alpha: 0 } };

const clearBuf = await sharp(SRC).ensureAlpha().trim({ threshold: 10 }).extend(PAD).png({ compressionLevel: 9 }).toBuffer();

// Transparent lockup (white wordmark) — used on the cover and on the navy header plate.
await sharp(clearBuf).toFile(`${ASSETS}/logo-clear.png`);
// Same lockup flattened on brand navy — used in the DOCX cover band and running header.
await sharp(clearBuf).flatten({ background: '#0F172A' }).png({ compressionLevel: 9 }).toFile(`${ASSETS}/logo-on-navy.png`);

for (const f of ['logo-clear.png', 'logo-on-navy.png']) {
  const m = await sharp(`${ASSETS}/${f}`).metadata();
  console.log(f, m.width + 'x' + m.height);
}
