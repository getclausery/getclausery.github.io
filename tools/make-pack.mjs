// Builds samples/clausery-word-templates.zip: every library template in one download, in a folder per category, with
// a README that links each file to its page. Deterministic (fixed dates, sorted entries) so rebuilds leave no diff.
// Run after make-samples.mjs, which writes the .docx files it packs.
import { readFileSync, writeFileSync } from 'node:fs';
import JSZip from 'jszip';
import { LIB, CATEGORY_ORDER, PACK_FILE } from '../site/library.mjs';
import { SITE } from './partials.mjs';

const FIXED_DATE = new Date('2026-09-24T00:00:00Z');
const safe = (s) => s.replace(/[\\/:*?"<>|]/g, '').trim();
const zip = new JSZip();
const lines = [
  'Clausery: free Word templates',
  '',
  `${LIB.length} templates, in a folder per category. Each is an ordinary .docx file.`,
  '',
  'Two ways to use them:',
  '1. Open a file in Word and replace each {tag} with your own details. Sections such as {#has_deposit}...{/has_deposit} are optional: keep the text inside if it applies, and delete it if not. Text inside {^has_deposit}...{/has_deposit} is the opposite: keep it only if the option does not apply.',
  `2. Or open the template's page below and click "Fill it in now". Clausery asks a few questions and builds the finished document in your browser. Nothing is uploaded.`,
  '',
  'These are general samples, not legal advice. Have them reviewed for your jurisdiction before use.',
  '',
];
for (const [category, label] of CATEGORY_ORDER) {
  const items = LIB.filter((t) => t.category === category);
  if (!items.length) continue;
  lines.push(label.toUpperCase());
  for (const t of items) {
    const name = `${safe(label)}/${safe(t.name)}.docx`;
    zip.file(name, readFileSync(`samples/${t.file}`), { date: FIXED_DATE, createFolders: false });
    lines.push(`- ${t.name}: ${SITE}templates/${t.slug}.html`);
  }
  lines.push('');
}
lines.push(`All templates, guides and free tools: ${SITE}`);
zip.file('README.txt', lines.join('\r\n') + '\r\n', { date: FIXED_DATE, createFolders: false });
const packed = LIB.filter((t) => CATEGORY_ORDER.some(([c]) => c === t.category)).length;
if (packed !== LIB.length) throw new Error(`${LIB.length - packed} templates have a category that is not in CATEGORY_ORDER`);
writeFileSync(`samples/${PACK_FILE}`, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 9 }, platform: 'UNIX' }));
console.log(`wrote samples/${PACK_FILE} (${LIB.length} templates)`);

// A smaller, task-focused download for freelancers, resource lists and small business audiences.
const businessSlugs = ['quote', 'statement-of-work', 'invoice', 'payment-receipt', 'purchase-order', 'credit-note'];
const business = businessSlugs.map((slug) => LIB.find((t) => t.slug === slug));
if (business.some((t) => !t)) throw new Error('Business kit: missing library template');
const kit = new JSZip();
for (const t of business) kit.file(`${safe(t.name)}.docx`, readFileSync(`samples/${t.file}`), { date: FIXED_DATE, createFolders: false });
kit.file('README.txt', [
  'Clausery: free small business document kit', '',
  'Six ordinary Word templates: quote, statement of work, invoice, payment receipt, purchase order and credit note.', '',
  'QUICKEST WAY TO MAKE A COMPLETED DOCUMENT',
  'Open the matching resource page below and choose the online questionnaire. Fill in your details, review the amounts and download an editable .docx. No account is required. Document contents are processed on your device.', '',
  'IF YOU EDIT THE TEMPLATE DIRECTLY IN WORD',
  'These files contain placeholder tags; they are not finished documents.',
  'Replace each {tag} with your details. For {#condition}...{/condition}, keep the enclosed text only if it applies, and remove both markers. For {^condition}...{/condition}, keep the enclosed text only if the condition does not apply. For repeating lists, copy the enclosed row or paragraph for each item and remove the markers. Calculate and check all totals yourself when editing directly in Word. The online questionnaire handles these steps for you.', '',
  'BEFORE SENDING',
  'Check names, document references, dates, agreed scope, prices, payment details, totals and tax settings. Record payments as received only after they arrive. Keep a copy of the version you send. Download an app backup before clearing browser data or moving to another device.', '',
  'RESOURCE PAGES',
  ...business.map((t) => `${t.name}: ${SITE}templates/${t.slug}.html`), '',
  `Deposit, hourly and final invoices: ${SITE}invoice-templates/`,
  `Kit and setup checklist: ${SITE}business-document-kit/`,
  `Contact: ${SITE}contact/`, '',
  'These are general document samples. You are responsible for their content and for the requirements that apply to your business and location.', '',
].join('\r\n'), { date: FIXED_DATE, createFolders: false });
writeFileSync('samples/clausery-small-business-kit.zip', await kit.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 9 }, platform: 'UNIX' }));
console.log('wrote samples/clausery-small-business-kit.zip (6 templates and instructions)');
