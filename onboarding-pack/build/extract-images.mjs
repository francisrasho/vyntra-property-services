import fs from 'fs';
import readline from 'readline';

const JSONL = '/root/.claude/projects/-home-user-vyntra-property-services/675f4c43-4c0d-53ea-be23-f9890ec97876.jsonl';
const outDir = 'build/uploads';
fs.mkdirSync(outDir, { recursive: true });

const rl = readline.createInterface({ input: fs.createReadStream(JSONL), crlfDelay: Infinity });
let idx = 0;
const found = [];

function walk(node, role) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(n => walk(n, role)); return; }
  // image block: { type:'image', source:{ type:'base64', media_type, data } }
  const src = node.source || (node.type === 'base64' ? node : null);
  if (src && typeof src === 'object' && src.media_type && /^image\//.test(src.media_type) && src.data) {
    const ext = src.media_type.split('/')[1];
    const buf = Buffer.from(src.data, 'base64');
    const name = `${outDir}/img-${String(idx).padStart(3, '0')}-${role || 'x'}-${ext}-${buf.length}.${ext}`;
    fs.writeFileSync(name, buf);
    found.push({ name, ext, bytes: buf.length, role });
    idx++;
  }
  for (const k of Object.keys(node)) { if (k !== 'source') walk(node[k], node.role || role); }
}

for await (const line of rl) {
  if (!line.trim()) continue;
  let obj; try { obj = JSON.parse(line); } catch { continue; }
  walk(obj, obj.message?.role || obj.role);
}
// report non-png (likely user uploads) and large images
found.filter(f => f.ext !== 'png' || f.bytes > 400000)
     .forEach(f => console.log(f.bytes, f.ext, f.role, f.name));
console.log('---total images:', found.length);
