import { createCanvas, loadImage } from '@napi-rs/canvas';
import fs from 'fs';

const cols = 4, rows = 5, n = 21;
const tw = 360, th = Math.round(360 * 297 / 210); // A4 ratio thumb
const gap = 22, pad = 30;
const W = pad * 2 + cols * tw + (cols - 1) * gap;
const H = pad * 2 + rows * th + (rows - 1) * gap;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#0F172A'; ctx.fillRect(0, 0, W, H);
ctx.fillStyle = '#D4AF37'; ctx.fillRect(0, 0, W, 8);
for (let i = 0; i < n; i++) {
  const img = await loadImage(`previews/page-${String(i + 1).padStart(2, '0')}.png`);
  const c = i % cols, r = Math.floor(i / cols);
  const x = pad + c * (tw + gap), y = pad + r * (th + gap);
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6;
  ctx.fillStyle = '#fff'; ctx.fillRect(x, y, tw, th);
  ctx.restore();
  ctx.drawImage(img, x, y, tw, th);
  ctx.strokeStyle = 'rgba(212,175,55,0.35)'; ctx.lineWidth = 1; ctx.strokeRect(x + .5, y + .5, tw - 1, th - 1);
}
fs.writeFileSync('previews/_contact-sheet.png', canvas.toBuffer('image/png'));
console.log('contact sheet written', W + 'x' + H);
