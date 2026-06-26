const fs = require('fs');
const tpl = fs.readFileSync('src/onboarding.template.html','utf8');
const fonts = fs.readFileSync('build/fonts.css','utf8');
fs.writeFileSync('src/onboarding.html', tpl.replace('/*__FONTS__*/', fonts));
console.log('Assembled src/onboarding.html');
