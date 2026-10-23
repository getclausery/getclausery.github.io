// Stamps every deployed JS, CSS and SVG file with an AGPL CMI (copyright management
// information) banner as its first non-empty line. 17 U.S.C. §1202 makes it a
// separate civil and (since 2024, under the CASE Act) statutory offense to remove
// CMI in order to conceal infringement — an attacker who strips the visible
// footer is still liable for stripping this comment, even if they think they've
// "branded out" the product.
//
// Run from tools/release.mjs so the banner is regenerated on every build without
// hand-editing checked-in files. The banner is short (one line), uses the
// language-specific comment style, and is prepended before any existing notice
// only if it isn't already present (idempotent on repeated builds).
import { readFileSync, writeFileSync, globSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const year = new Date().getUTCFullYear();
const BANNER_JS = `/* Clausery <https://getclausery.github.io> — (C) ${year} Clausery. AGPL-3.0-or-later WITH Clausery-Trademark-Exception. Removing this notice is removal of copyright management information under 17 U.S.C. 1202. Source: https://github.com/getclausery/getclausery.github.io */\n`;
const BANNER_CSS = `/* Clausery <https://getclausery.github.io> — (C) ${year} Clausery. AGPL-3.0-or-later WITH Clausery-Trademark-Exception. Removing this notice is removal of CMI under 17 U.S.C. 1202. */\n`;
const BANNER_SVG = `<!-- Clausery (C) ${year} Clausery. AGPL-3.0-or-later WITH Trademark Exception. Source: https://github.com/getclausery/getclausery.github.io -->\n`;

const targets = [
  { pattern: 'app/**/*.js', banner: BANNER_JS, skipIfAlreadyHas: 'Clausery <https://getclausery.github.io>' },
  { pattern: 'vendor/*.js', banner: BANNER_JS, skipIfAlreadyHas: 'Clausery <https://getclausery.github.io>' },
  { pattern: 'app/*.css', banner: BANNER_CSS, skipIfAlreadyHas: 'Clausery <https://getclausery.github.io>' },
  { pattern: 'site.css', banner: BANNER_CSS, skipIfAlreadyHas: 'Clausery <https://getclausery.github.io>' },
  { pattern: 'site.js', banner: BANNER_JS, skipIfAlreadyHas: 'Clausery <https://getclausery.github.io>' },
  { pattern: 'sw.js', banner: BANNER_JS, skipIfAlreadyHas: 'Clausery <https://getclausery.github.io>' },
  { pattern: 'free-tools/embed/*.js', banner: BANNER_JS, skipIfAlreadyHas: 'Clausery <https://getclausery.github.io>' },
  { pattern: 'assets/*.svg', banner: BANNER_SVG, skipIfAlreadyHas: 'Clausery (C)' },
];

// Files that are vendored third-party source (with their own upstream licenses)
// must keep the CMI banner on the bundled file we ship (which already says
// "Clausery vendored document engine") but we must not replace the upstream
// license header inside node_modules. The pattern list above only covers
// deployed outputs, never sources under node_modules or src/, so no exclusion
// list is needed.

let stamped = 0;
for (const t of targets) {
  for (const file of globSync(t.pattern)) {
    let src = readFileSync(file, 'utf8');
    // Skip files that already carry the exact banner (idempotent) or are
    // minified vendor output whose existing banner mentions Clausery already
    // (the build-vendor banner is already a Clausery notice).
    if (src.includes(t.skipIfAlreadyHas)) continue;
    // For JS/CSS, insert the banner after any shebang or initial comment block
    // that already belongs to us, so we don't stack duplicates. The simple rule:
    // prepend. This is fine because nothing we ship depends on being the first
    // byte of the file.
    if (file.endsWith('.svg')) {
      // SVGs must start with <?xml ?> or <svg; insert right after the <?xml ?>
      // prolog if present, otherwise at the top after any initial <!DOCTYPE>.
      const xmlDecl = src.match(/^(<\?xml[^?]*\?>\s*)/);
      const doctype = src.match(/^(<!DOCTYPE[^>]*>\s*)/i);
      const skip = (xmlDecl ? xmlDecl[0].length : 0) + (!xmlDecl && doctype ? doctype[0].length : 0);
      src = src.slice(0, skip) + t.banner + src.slice(skip);
    } else {
      src = t.banner + src;
    }
    writeFileSync(file, src);
    stamped++;
  }
}
console.log(`cmi-banner: stamped ${stamped} JS/CSS/SVG files (v${pkg.version})`);
