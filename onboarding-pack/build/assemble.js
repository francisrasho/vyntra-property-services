const fs = require('fs');
const tpl = fs.readFileSync('src/onboarding.template.html', 'utf8');
const fonts = fs.readFileSync('build/fonts.css', 'utf8');

const dataUri = (p) => 'data:image/png;base64,' + fs.readFileSync(p).toString('base64');
const logoClear = dataUri('src/assets/logo-clear.png');

let html = tpl
  .replace('/*__FONTS__*/', fonts)
  .split('__LOGO_CLEAR__').join(logoClear);

// ---- Build the Table of Contents automatically from section order ----
// Each page is a <section class="page">. The TOC lists major sections in
// document order with their real page number, so it stays correct when pages
// are added or removed. Map the masthead section name -> TOC display title;
// the first page a section appears on is its TOC page number.
const TOC_TITLES = {
  'Welcome': 'Welcome',
  'How Vyntra Works': 'How Vyntra Works',
  'Code of Conduct': 'Code of Conduct',
  'Payment Policy': 'Payment Policy',
  'Break Policy': 'Break Policy',
  'Subcontractor Portal': 'Vyntra Subcontractor Portal',
  'Required Documents': 'Required Documents',
  'Contractor Agreement': 'Independent Contractor Agreement',
  'FAQ': 'Frequently Asked Questions',
  'Declaration': 'Declaration & Agreement',
  'What Happens Next': 'What Happens Next?',
};

const starts = [...html.matchAll(/<section class="page/g)].map(m => m.index);
const seen = new Set();
const entries = [];
for (let i = 0; i < starts.length; i++) {
  const chunk = html.slice(starts[i], starts[i + 1] ?? html.length);
  const page = i + 1; // i-th section = page i+1 (cover = page 1)
  const sm = chunk.match(/s-name">([^<]+)</);
  if (!sm) continue;
  const name = sm[1].trim();
  if (TOC_TITLES[name] && !seen.has(name)) {
    seen.add(name);
    entries.push({ title: TOC_TITLES[name], page });
  }
}
const tocHtml = entries.map((e, idx) =>
  `<li><span class="t-n">${idx + 1}</span><span class="t-t">${e.title}</span><span class="t-d"></span><span class="t-p">${e.page}</span></li>`
).join('\n      ');
html = html.replace('<!--TOC_LIST-->', tocHtml);

fs.writeFileSync('src/onboarding.html', html);
console.log('Assembled src/onboarding.html — TOC entries:', entries.length);
