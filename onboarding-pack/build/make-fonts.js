const fs = require('fs');
const dir = '/home/user/vyntra-property-services/.claude/skills/ui-styling/canvas-fonts';
const faces = [
  ['Outfit', 400, 'normal', 'Outfit-Regular.ttf'],
  ['Outfit', 700, 'normal', 'Outfit-Bold.ttf'],
  ['Work Sans', 400, 'normal', 'WorkSans-Regular.ttf'],
  ['Work Sans', 700, 'normal', 'WorkSans-Bold.ttf'],
  ['Work Sans', 400, 'italic', 'WorkSans-Italic.ttf'],
];
let css = '';
for (const [fam, wt, style, file] of faces) {
  const b64 = fs.readFileSync(`${dir}/${file}`).toString('base64');
  css += `@font-face{font-family:'${fam}';font-style:${style};font-weight:${wt};font-display:swap;src:url(data:font/ttf;base64,${b64}) format('truetype');}\n`;
}
fs.writeFileSync('build/fonts.css', css);
console.log('fonts.css written:', (css.length/1024).toFixed(0), 'KB');
