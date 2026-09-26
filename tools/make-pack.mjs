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
