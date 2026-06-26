const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
(async () => {
  const bytes = fs.readFileSync('build/onboarding.base.pdf');
  const pdf = await PDFDocument.load(bytes);
  const form = pdf.getForm();
  const pages = pdf.getPages();
  const { fields } = JSON.parse(fs.readFileSync('build/fields.json','utf8'));
  const PT = 0.75; // 72/96 css px -> pt
  const NAVY = rgb(0.06,0.09,0.16);

  for (const f of fields) {
    const page = pages[f.page];
    const ph = page.getHeight();
    const x = f.x * PT, w = f.w * PT, h = f.h * PT;
    const y = ph - (f.y + f.h) * PT;
    if (f.type === 'checkbox') {
      const cb = form.createCheckBox(f.name);
      cb.addToPage(page, { x, y, width: w, height: h,
        borderWidth: 0, borderColor: undefined, backgroundColor: undefined });
      cb.defaultUpdateAppearances();
    } else {
      const tf = form.createTextField(f.name);
      if (f.name === 'signature') { tf.setText(''); }
      tf.addToPage(page, { x: x+3, y: y+1, width: w-6, height: h-2,
        borderWidth: 0, backgroundColor: undefined, textColor: NAVY });
      tf.setFontSize(f.name === 'signature' ? 14 : 11);
    }
  }
  // Make fields look clean in viewers
  form.updateFieldAppearances();
  const out = await pdf.save();
  fs.writeFileSync('dist/Vyntra-Subcontractor-Onboarding-Pack.pdf', out);
  console.log('Wrote fillable PDF. Field names:', form.getFields().map(x=>x.getName()).join(', '));
})().catch(e=>{console.error(e);process.exit(1);});
