// Social "link in bio" landing page. Designed for mobile, where every tap from TikTok/Reels/Shorts/LinkedIn/X lands.
import { REPO_URL, mailto } from '../tools/partials.mjs';
import { PRICES, TRIAL_DAYS, REFUND_DAYS } from '../app/config.js';
import { LIB } from './library.mjs';

const BIG_BUTTON = (href, label, sub, color = 'accent') =>
  `<a class="bio-link bio-link-${color}" href="${href}"><span class="bio-label">${label}</span>${sub ? `<span class="bio-sub">${sub}</span>` : ''}</a>`;

const LIB_LENGTH = LIB.length;
const proCta = `Pro — $${PRICES.pro}/mo`;
const proSub = `${TRIAL_DAYS}-day free trial, ${REFUND_DAYS}-day refund`;

export const pages = [{
  path: 'go/',
  title: 'Clausery — make an invoice, no signup',
  description: 'Free Word invoices, quotes and receipts — no account, no card, editable .docx that stays on your device. Open the app, read the proof, or browse templates. (Not the compliance platform at clausery.ai.)',
  noindex: true,
  layout: 'embed',
  extraHead: `<link rel="icon" sizes="any" href="../assets/icon.svg" type="image/svg+xml">
<link rel="icon" sizes="16x16 32x32 48x48" href="../favicon.ico" type="image/x-icon">
<link rel="apple-touch-icon" href="../assets/icon-192.png">
<link rel="mask-icon" href="../assets/icon.svg" color="#2dd4bf">
<link rel="security" href="../.well-known/security.txt">
<link rel="search" type="application/opensearchdescription+xml" title="Clausery templates" href="../opensearch.xml">
<link rel="manifest" href="../app/manifest.webmanifest">
<meta name="theme-color" content="#0f1d2e">
<meta name="color-scheme" content="dark">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
<meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
<meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), payment=(), display-capture=()">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'self'; upgrade-insecure-requests">
<link rel="stylesheet" href="../site.css">
<style>
.bio { background: linear-gradient(180deg, #0f1d2e 0%, #0b1522 100%); min-height: 100vh; color: #e6edf5; padding: 3.25rem 1.25rem 4rem; }
.bio-wrap { max-width: 480px; margin: 0 auto; text-align: center; }
.bio-logo { width: 96px; height: 96px; margin: 0 auto 1rem; border-radius: 24px; background: ${'#2997ff'}; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 56px; font-weight: 800; box-shadow: 0 10px 30px rgba(41,151,255,0.35); }
.bio h1 { font-size: 1.9rem; margin: 0 0 .35rem; letter-spacing: -0.02em; }
.bio p.lead { color: #9fb0c6; margin: 0 auto 1.75rem; max-width: 360px; line-height: 1.45; font-size: 1.02rem; }
.bio-checks { list-style: none; padding: 0; margin: 0 auto 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: .6rem 1rem; max-width: 380px; color: #cfe0f3; font-size: .95rem; text-align: left; }
.bio-checks li { display: flex; align-items: center; gap: .5rem; }
.bio-checks li::before { content: "✓"; color: #22c55e; font-weight: 800; }
.bio-links { display: grid; gap: .75rem; }
.bio-link { display: block; padding: 1rem 1.2rem; border-radius: 16px; text-decoration: none; color: #fff; font-weight: 600; border: 1px solid rgba(255,255,255,0.08); transition: transform .1s ease, border-color .15s ease, background .15s ease; position: relative; overflow: hidden; }
.bio-link:active { transform: scale(0.98); }
.bio-link-accent { background: linear-gradient(135deg, #2997ff 0%, #1f7edb 100%); border-color: #2997ff; box-shadow: 0 8px 24px rgba(41,151,255,0.35); }
.bio-link-ink { background: #ffffff; color: #0f1d2e; border-color: #fff; }
.bio-link-green { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); border-color: #16a34a; }
.bio-link-ghost { background: rgba(255,255,255,0.04); }
.bio-link-ghost:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.18); }
.bio-label { display: block; font-size: 1.08rem; }
.bio-sub { display: block; font-size: .82rem; opacity: .85; font-weight: 400; margin-top: .15rem; }
.bio-link-ink .bio-sub { opacity: .7; }
.bio-foot { margin-top: 2rem; font-size: .82rem; color: #7a8ba3; line-height: 1.5; }
.bio-foot a { color: #9fb0c6; }
.bio-socials { display: flex; justify-content: center; gap: 1rem; margin-top: 1.25rem; }
.bio-socials a { color: #7a8ba3; text-decoration: none; font-size: .85rem; padding: .4rem .7rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); }
.bio-socials a:hover { color: #cfe0f3; border-color: rgba(255,255,255,0.2); }
@media (max-width: 400px) { .bio-checks { grid-template-columns: 1fr; max-width: 260px; } }
body.embed { background: #0b1522; }
body.embed { padding: 0; }
.bio a { color: inherit; }
</style>`,
  body: (rel) => `<div class="bio"><div class="bio-wrap">
  <a class="bio-logo" href="${rel}" aria-label="Clausery home">C</a>
  <h1>Clausery</h1>
  <p class="lead">Free Word invoices, quotes and receipts. No account, no card — documents are made on your device, not uploaded.</p>
  <p class="foot-note" style="font-size:.78rem;color:#7a8ba3;margin:-.75rem 0 1.3rem;line-height:1.4">Free Word templates for small business &amp; freelancers. Not the enterprise compliance platform at <a href="https://www.clausery.ai/" rel="noopener" style="color:#9fb0c6">clausery.ai</a> — same name, different company.</p>
  <ul class="bio-checks">
    <li>No signup</li>
    <li>No card to start</li>
    <li>Editable Word .docx</li>
    <li>Stays on your device</li>
    <li>87 templates free</li>
    <li>Public source code</li>
  </ul>
  <div class="bio-links">
    ${BIG_BUTTON(`${rel}app/#/start/invoice`, 'Make a free invoice →', 'Downloads as Word in 60 seconds · no signup', 'ink')}
    ${BIG_BUTTON(`${rel}business-document-kit/`, 'Free 6-template business kit', 'One zip · quote, invoice, receipt, SOW + more', 'green')}
    ${BIG_BUTTON(`${rel}templates/`, `All ${LIB_LENGTH} free Word templates`, 'Invoices, NDAs, contracts, letters, forms', 'accent')}
    ${BIG_BUTTON(`${rel}invoice-templates/`, 'Invoice templates by trade/country', 'Freelance, construction, UK VAT, US sales tax…', 'ghost')}
    ${BIG_BUTTON(`${rel}why-clausery/`, 'Why Clausery is different', 'The no-signup proof in one page', 'ghost')}
    ${BIG_BUTTON(`${rel}pricing/`, proCta, proSub, 'ghost')}
    ${BIG_BUTTON(`${rel}compare/`, 'Compare vs HoneyBook, LawDepot…', '11 side-by-side pages', 'ghost')}
    ${BIG_BUTTON(mailto('Saw your short video'), 'Email the maker', 'Questions, template requests, anything', 'ghost')}
  </div>
  <div class="bio-socials">
    <a href="${rel}changelog.html">Changelog</a>
    <a href="${REPO_URL}" rel="noopener">GitHub</a>
    <a href="${rel}press/">Press kit</a>
  </div>
  <p class="bio-foot">getclausery.github.io · works offline once loaded · Pro is $${PRICES.pro}/user/month with a ${TRIAL_DAYS}-day free trial and a ${REFUND_DAYS}-day money-back guarantee.</p>
</div></div>`,
}];
