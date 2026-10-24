// Static Core Web Vitals guardrails for the generated site. Field data needs real visitors, but most avoidable LCP,
// CLS and render-blocking regressions are visible in the HTML: an unsized or lazy-loaded hero image, a synchronous
// script in <head>, a second stylesheet, or a template preview that only loads after the first screen.
//
// The budgets are deliberately small: one stylesheet, one deferred site script, the tiny inline theme, dimensions on
// every image, and an eager, high-priority LCP image on the home page and each template page.
import { readFileSync, statSync, existsSync } from 'node:fs';

const failures = [];
const fail = (file, message) => failures.push(`${file}: ${message}`);
const fileFor = (url) => { const path = new URL(url).pathname.slice(1); return !path || path.endsWith('/') ? path + 'index.html' : path; };
const urls = [...readFileSync('sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
const bytes = (file) => statSync(file).size;
let maxHtml = 0;
let blockingMax = 0;

for (const url of urls) {
  const file = fileFor(url);
  const html = readFileSync(file, 'utf8');
  maxHtml = Math.max(maxHtml, Buffer.byteLength(html));
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] || '';
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag);
  // The first screen is the H1 and lead, before the first section heading; images further down should be lazy.
  const firstH2 = main.indexOf('<h2');
  const firstSection = main.slice(0, firstH2 === -1 ? Math.min(main.length, 1500) : firstH2);
  const firstSectionImages = [...firstSection.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag);

  for (const img of images) {
    const attr = (name) => img.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
    const src = attr('src') || '';
    const width = Number(attr('width'));
    const height = Number(attr('height'));
    if (!width || !height) fail(file, `image has no width/height: ${img.slice(0, 100)}`);
    if (!/\.svg$/.test(src) && !/decoding="async"/.test(img)) fail(file, `raster image is missing decoding="async": ${src}`);
    if (/fetchpriority="high"/.test(img) && /loading="lazy"/.test(img)) fail(file, `LCP image is lazy-loaded: ${src}`);
    if (src && !src.startsWith('http')) {
      const target = new URL(src, new URL(url)).pathname.slice(1);
      if (target && !existsSync(target)) fail(file, `image file is missing: ${src}`);
    }
  }
  for (const img of firstSectionImages) {
    const src = img.match(/src="([^"]+)"/)?.[1] || '';
    const width = Number(img.match(/width="(\d+)"/)?.[1] || 0);
    const height = Number(img.match(/height="(\d+)"/)?.[1] || 0);
    if (/loading="lazy"/.test(img) && width * height >= 120 * 120) fail(file, `large image in the first screen is lazy-loaded: ${src}`);
  }
  for (const [tag] of html.matchAll(/<iframe\b[^>]*>/g)) if (!/loading="lazy"/.test(tag)) fail(file, 'iframe is not lazy-loaded');
  for (const [tag] of html.matchAll(/<picture>[\s\S]*?<\/picture>/g)) {
    if (!/<source\b[^>]*type="image\/webp"/.test(tag)) fail(file, 'picture has no WebP source');
    if (!/<img\b[^>]*width="\d+"[^>]*height="\d+"/.test(tag)) fail(file, 'picture has no sized fallback img');
  }

  // Render-blocking: one stylesheet, no synchronous scripts, no inline scripts larger than the theme.
  const styles = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)].map(([tag]) => tag.match(/href="([^"]+)"/)?.[1] || '');
  if (styles.length > 1) fail(file, `loads ${styles.length} stylesheets (budget: 1)`);
  for (const [tag] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    const attrs = tag.match(/<script\b([^>]*)>/)?.[1] || '';
    const body = tag.match(/<script\b[^>]*>([\s\S]*?)<\/script>/)?.[1] || '';
    if (/type="application\/ld\+json"/.test(attrs)) continue;
    // Speculation rules (prerender/prefetch hints) are processed by the browser off
    // the main thread; they don't parse as JS and don't block rendering.
    if (/type="speculationrules"/.test(attrs)) continue;
    const src = attrs.match(/src="([^"]+)"/)?.[1];
    if (src) {
      if (!/\b(defer|async)\b/.test(attrs) && !/type="module"/.test(attrs)) fail(file, `synchronous script blocks rendering: ${src}`);
    } else if (body.trim().length > 500) fail(file, `inline script of ${body.trim().length} bytes blocks parsing`);
  }
  const blocking = styles.length + [...html.matchAll(/<script\b[^>]*src="[^"]+"[^>]*>/g)].filter(([tag]) => !/\b(defer|async)\b/.test(tag) && !/type="module"/.test(tag)).length;
  blockingMax = Math.max(blockingMax, blocking);
  if (blocking > 2) fail(file, `${blocking} render-blocking resources (budget: 2)`);
}
if (maxHtml > 80_000) fail('site', `largest page is ${maxHtml} bytes (budget: 80,000)`); // v1.72: measured after external search-index

// The home page must preload its LCP image and name it at high priority.
const home = readFileSync('index.html', 'utf8');
const hero = home.match(/<picture>[\s\S]*?screenshot-invoice[\s\S]*?<\/picture>/)?.[0] || '';
if (!/fetchpriority="high"/.test(hero)) fail('index.html', 'hero image is not fetchpriority="high"');
if (/loading="lazy"/.test(hero)) fail('index.html', 'hero image is lazy-loaded');
if (!/<link rel="preload" as="image" type="image\/webp"/.test(home)) fail('index.html', 'hero image is not preloaded');
if (!/loading="eager"/.test(hero)) fail('index.html', 'hero image should be eager');
for (const file of ['assets/screenshot-invoice.webp', 'assets/screenshot-invoice-800.webp']) {
  if (!existsSync(file)) fail(file, 'LCP image variant is missing');
  else if (bytes(file) > 100_000) fail(file, `LCP image variant is ${bytes(file)} bytes (budget: 100,000)`);
}
if (!/<source type="image\/webp"/.test(hero)) fail('index.html', 'hero picture has no WebP source');
if (!/sizes="[^"]+"/.test(hero)) fail('index.html', 'hero picture has no sizes attribute');

// Each template page's preview is its likely LCP image: eager, high priority, WebP, and reasonably small.
for (const url of urls.filter((u) => /\/templates\/[^/]+\.html$/.test(u) && !u.endsWith('/templates/'))) {
  const file = fileFor(url);
  const html = readFileSync(file, 'utf8');
  const slug = new URL(url).pathname.split('/').pop().replace(/\.html$/, '');
  if (!html.includes(`assets/previews/${slug}.webp`)) fail(file, 'template preview has no WebP source');
  if (!new RegExp(`<picture><source[^>]+previews/${slug}\\.webp[^>]*>.*?fetchpriority="high"`).test(html)) fail(file, 'template preview is not high priority');
  if (existsSync(`assets/previews/${slug}.webp`) && bytes(`assets/previews/${slug}.webp`) > 120_000) fail(file, 'template preview WebP is over 120,000 bytes');
}

// Stylesheets and the site script stay small enough to render quickly.
const css = bytes('site.css');
const js = bytes('site.js');
if (css > 45_000) fail('site.css', `${css} bytes (budget: 45,000)`);
if (js > 18_000) fail('site.js', `${js} bytes (budget: 18,000)`); // 15302 v1.72; 17301 v1.76 adds /search/ live filter
if (/@import\b/.test(readFileSync('site.css', 'utf8'))) fail('site.css', 'uses @import, which adds a blocking request');

if (failures.length) {
  console.error(failures.join('\n'));
  console.error(`\nCore Web Vitals checks failed: ${failures.length} problem${failures.length === 1 ? '' : 's'}.`);
  process.exitCode = 1;
} else {
  console.log(`Core Web Vitals checks passed: ${urls.length} pages, max ${maxHtml} bytes of HTML, at most ${blockingMax} blocking resources, hero and template previews eager with WebP, CSS ${css} bytes, JS ${js} bytes.`);
}
