const fs = require('fs');
const tpl = fs.readFileSync('src/onboarding.template.html', 'utf8');
const fonts = fs.readFileSync('build/fonts.css', 'utf8');

const dataUri = (p) => 'data:image/png;base64,' + fs.readFileSync(p).toString('base64');
const logoClear = dataUri('src/assets/logo-clear.png');

const html = tpl
  .replace('/*__FONTS__*/', fonts)
  .split('__LOGO_CLEAR__').join(logoClear);

fs.writeFileSync('src/onboarding.html', html);
console.log('Assembled src/onboarding.html');
