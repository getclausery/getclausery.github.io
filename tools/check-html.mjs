// Static checks for the deploy tree: every HTML page has lang, title, description and viewport; internal links
// and asset references resolve to files; no external scripts or stylesheets (part of the no-third-party promise);
// structured data parses, every indexable page has some, and navigation/section links have real targets.
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve, sep } from 'node:path';
import { globSync } from 'node:fs';
import { SITE } from './partials.mjs';
import { checkHtmlNavigation } from './html-navigation.mjs';

const root = process.cwd();
const files = globSync('**/*.html', { cwd: root, exclude: (f) => /^google[0-9a-f]+\.html$/.test(f) || f.startsWith('node_modules') || f.startsWith('test-results') || f.startsWith('playwright-report') });
const documents = new Map();
let problems = 0;
const fail = (f, msg) => { problems++; console.log(`${f}: ${msg}`); };
for (const f of files) {
  const html = readFileSync(join(root, f), 'utf8');
  documents.set(f, html);
  if (!/<html[^>]*\slang="/i.test(html)) fail(f, 'missing <html lang>');
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(f, 'missing <title>');
  if (!/<meta name="description" content="[^"]+"/i.test(html)) fail(f, 'missing meta description');
  if (!/<meta name="viewport"/i.test(html)) fail(f, 'missing viewport');
  if (!/<main[\s>]/i.test(html) && !/id="main"/.test(html)) fail(f, 'missing <main>');
  // Structured data must parse, and every page search engines may index carries some (at least a breadcrumb).
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const [, json] of ld) { try { if (!JSON.parse(json)['@context']) fail(f, 'structured data without @context'); } catch { fail(f, 'structured data is not valid JSON'); } }
  if (!ld.length && !/<meta name="robots" content="[^"]*noindex/i.test(html) && f !== '404.html') fail(f, 'no structured data');
  for (const m of html.matchAll(/<(?:script|link)[^>]+(?:src|href)="(https?:)?\/\/[^"]+"/gi)) if (!/rel="(?:canonical|noopener)"/.test(m[0])) fail(f, 'external script/stylesheet: ' + m[0].slice(0, 80));
  for (const m of html.matchAll(/(?:href|src)="([^"#?]+)(?:[#?][^"]*)?"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|data:|javascript:|tel:)/.test(url) || url === '') continue;
    let target = url.startsWith('/') ? join(root, url.slice(1)) : resolve(dirname(join(root, f)), url);
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
    if (!existsSync(target)) fail(f, 'broken link: ' + url);
  }
}
const fileCache = new Map();
const navigation = checkHtmlNavigation({ documents, site: SITE, fileExists: (file) => {
  if (fileCache.has(file)) return fileCache.get(file);
  const target = resolve(root, file);
  let found = false;
  if (target.startsWith(root + sep)) {
    try { found = existsSync(target) && statSync(target).isFile(); } catch { /* Not a usable local file. */ }
  }
  fileCache.set(file, found);
  return found;
} });
for (const { file, message } of navigation.failures) fail(file, message);
console.log(`${navigation.links} same-site navigation links and ${navigation.fragments} static fragment links checked (including absolute same-site URLs).`);
console.log(`${files.length} HTML files checked, ${problems} problem${problems === 1 ? '' : 's'}`);
process.exit(problems ? 1 : 0);
