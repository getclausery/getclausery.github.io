// Renders the first page of every library template as an image (assets/previews/<slug>.jpg) for its template page and
// its DigitalDocument data, so the templates can be seen at a glance and appear in image search.
// Run with `npm run previews` after adding or changing a template. Needs Chromium (Playwright), so it is not part of
// `npm run build`; tests/unit/site.test.mjs checks that every template has an up-to-date preview.
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { LIB } from '../site/library.mjs';
import { PREVIEW_SIZE, PREVIEW_DIR as OUT, PREVIEW_HASHES as STAMP, previewPage as page, previewHash as hashOf } from './preview.mjs';

mkdirSync(OUT, { recursive: true });
const stamps = existsSync(STAMP) ? JSON.parse(readFileSync(STAMP, 'utf8')) : {};
const todo = LIB.filter((t) => process.argv.includes('--all') || stamps[t.slug] !== hashOf(t) || !existsSync(`${OUT}/${t.slug}.jpg`));
const browser = await chromium.launch();
try {
  const p = await browser.newPage({ viewport: PREVIEW_SIZE, deviceScaleFactor: 1 });
  for (const t of todo) {
    await p.setContent(page(t));
    writeFileSync(`${OUT}/${t.slug}.jpg`, await p.screenshot({ type: 'jpeg', quality: 70, clip: { x: 0, y: 0, ...PREVIEW_SIZE } }));
    stamps[t.slug] = hashOf(t);
  }
} finally { await browser.close(); }
writeFileSync(STAMP, JSON.stringify(Object.fromEntries(Object.entries(stamps).filter(([s]) => LIB.some((t) => t.slug === s)).sort()), null, 1) + '\n');
console.log(`previews: ${todo.length} rendered, ${LIB.length - todo.length} unchanged`);
