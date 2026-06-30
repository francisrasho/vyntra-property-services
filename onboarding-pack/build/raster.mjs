import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createCanvas } from '@napi-rs/canvas';
import fs from 'fs';

const file = process.argv[2];
const pagesWanted = process.argv[3].split(',').map(Number);
const data = new Uint8Array(fs.readFileSync(file));
const doc = await pdfjsLib.getDocument({ data, disableFontFace: false }).promise;
for (const pn of pagesWanted) {
  const page = await doc.getPage(pn);
  const viewport = page.getViewport({ scale: 1.6 });
  const canvas = createCanvas(viewport.width, viewport.height);
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport, canvasFactory: {
    create: (w, h) => { const c = createCanvas(w, h); return { canvas: c, context: c.getContext('2d') }; },
    reset: (o, w, h) => { o.canvas.width = w; o.canvas.height = h; },
    destroy: (o) => { o.canvas.width = 0; o.canvas.height = 0; },
  }}).promise;
  const out = `build/raster-p${String(pn).padStart(2, '0')}.png`;
  fs.writeFileSync(out, canvas.toBuffer('image/png'));
  console.log('wrote', out);
}
