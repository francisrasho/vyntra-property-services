const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
(async () => {
  const pdf = await PDFDocument.load(fs.readFileSync('dist/Vyntra-Contractor-Declaration-and-Agreement.pdf'));
  const form = pdf.getForm();
  ['doc_abn','doc_pli','doc_licence','doc_bank','doc_emergency',
   'agree_ica','agree_conduct','agree_payment','agree_safety','agree_conf','agree_privacy','agree_nonsolicit','agree_accuracy']
   .forEach(n => form.getCheckBox(n).check());
  const set = {full_name:'Jordan Blake', abn:'12 345 678 901', company_name:'Blake Maintenance',
    mobile:'0412 345 678', email:'jordan@blakemaint.com.au', sign_date:'26/06/2026', signature:'Jordan Blake'};
  Object.entries(set).forEach(([k,v]) => form.getTextField(k).setText(v));
  form.updateFieldAppearances();
  fs.writeFileSync('build/filled.pdf', await pdf.save());
  console.log('filled OK; fields:', form.getFields().length);
})().catch(e=>{console.error(e);process.exit(1);});
