// Generic hub-adder tool. Reads HUBS array from a JSON file and inserts into site/hub-pages.mjs.
// Usage: node tools/add-hubs.mjs hubs-file.json
import fs from 'fs';
import path from 'path';

const file = process.argv[2];
if (!file) { console.error('Usage: node tools/add-hubs.mjs <hubs.json>'); process.exit(1); }

const HUBS = JSON.parse(fs.readFileSync(file, 'utf8'));

function q(s) {
  return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'";
}
function hubStr(h) {
  const lines = ['  {'];
  for (const [k, v] of Object.entries(h)) {
    if (k === 'introParagraphs') lines.push(`    introParagraphs: [${v.map(q).join(', ')}],`);
    else if (['bullets','howTo','related','faq'].includes(k)) lines.push(`    ${k}: [${v.map((r) => `[${r.map(q).join(', ')}]`).join(', ')}],`);
    else if (k === 'cta' || k === 'download') {
      const items = Object.entries(v).map(([kk,vv]) => `${kk}: ${q(vv)}`).join(', ');
      lines.push(`    ${k}: { ${items} }${k === 'cta' ? ',' : ''}`);
    } else lines.push(`    ${k}: ${q(v)},`);
  }
  lines.push('  }');
  return lines.join('\n');
}

const target = 'site/hub-pages.mjs';
let src = fs.readFileSync(target, 'utf8');
const marker = '\n];\n\n\nfunction hubBody';
const last = src.lastIndexOf('  }\n' + marker.slice(1));
if (last < 0) { console.error('marker not found'); process.exit(1); }
const newBlock = '\n  },\n' + HUBS.map(hubStr).join(',\n') + marker;
src = src.slice(0, last) + newBlock + src.slice(last + ('  }' + marker).length);
fs.writeFileSync(target, src);
console.log('Added', HUBS.length, 'hubs to', target);
