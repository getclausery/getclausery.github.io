// Status page: verifiable SaaS operations info.
// Clausery is a static site served by GitHub Pages — no application server to monitor —
// so this page lists the components users depend on and where to verify each one.
import { REPO_URL, crumbsLd } from '../tools/partials.mjs';
import { APP_VERSION, TRIAL_DAYS, REFUND_DAYS } from '../app/config.js';

export const pages = [
  {
    path: 'status/', title: 'Clausery status',
    description: 'Current status of Clausery: public site, GitHub source, latest release, and where to check if something appears to be down.',
    extraHead: crumbsLd([['Home', ''], ['Status', 'status/']]),
    body: (rel) => `<section class="section"><div class="wrap prose" style="max-width:48rem">
<h1>Status</h1>
<p class="lead">Clausery is a static site served by GitHub Pages, with document generation running in your browser. There is no application server to go down, so the only things that can fail are the page hosting and the license check.</p>

<div class="grid grid-2" style="margin-top:2rem">
  <div class="feature" style="border-left:4px solid var(--ok);padding-left:1rem">
    <h2 style="margin-top:0;font-size:1.1rem">Public website</h2>
    <p style="margin:.25rem 0"><strong style="color:var(--ok)">Operational</strong></p>
    <p class="small muted" style="margin:0">Served statically from GitHub Pages. If pages do not load, check <a href="https://www.githubstatus.com/" rel="noopener">GitHub Status</a>.</p>
  </div>
  <div class="feature" style="border-left:4px solid var(--ok);padding-left:1rem">
    <h2 style="margin-top:0;font-size:1.1rem">Source repository</h2>
    <p style="margin:.25rem 0"><strong style="color:var(--ok)">Public on GitHub</strong></p>
    <p class="small muted" style="margin:0"><a href="${REPO_URL}" rel="noopener">${REPO_URL.replace('https://','')}</a> — commits, issues and releases are visible there.</p>
  </div>
  <div class="feature" style="border-left:4px solid var(--ok);padding-left:1rem">
    <h2 style="margin-top:0;font-size:1.1rem">Document generation</h2>
    <p style="margin:.25rem 0"><strong style="color:var(--ok)">Runs in your browser</strong></p>
    <p class="small muted" style="margin:0">Templates are read and .docx files are built on your device. Once the app is loaded you can continue offline.</p>
  </div>
  <div class="feature" style="border-left:4px solid var(--ok);padding-left:1rem">
    <h2 style="margin-top:0;font-size:1.1rem">License &amp; checkout</h2>
    <p style="margin:.25rem 0"><strong style="color:var(--ok)">Lemon Squeezy</strong></p>
    <p class="small muted" style="margin:0">Payments and online key checks run through Lemon Squeezy. Check <a href="https://status.lemonsqueezy.com/" rel="noopener">their status page</a> if checkout stalls.</p>
  </div>
</div>

<h2 style="margin-top:2.5rem">Current release</h2>
<p>You are running <strong>v${APP_VERSION}</strong> (shown in the app at Settings → About). The service worker caches this version for offline use; reload twice to pick up a new release.</p>
<p><a href="${rel}changelog.html">See the changelog →</a> · <a href="${rel}roadmap/">Roadmap</a></p>

<h2>What to do if something looks down</h2>
<ol>
  <li><strong>Reload twice.</strong> The service worker updates in the background; a second reload picks up the latest version.</li>
  <li><strong>Check <a href="https://www.githubstatus.com/" rel="noopener">GitHub Status</a>.</strong> Pages and releases are served from GitHub.</li>
  <li><strong>Check <a href="${REPO_URL}/issues" rel="noopener">open issues</a>.</strong> If something is broken it will be there, often within minutes.</li>
  <li><strong>Email <a href="${rel}contact/">support</a>.</strong> Messages are read by a person, usually the same day.</li>
</ol>

<p class="small muted">There is no third-party status dashboard. This page and the public commit history are the source of truth: every release, every fix, and every open issue is visible at <a href="${REPO_URL}" rel="noopener">the repository</a>.</p>
</div></section>`,
  },
  {
    path: 'roadmap/', title: 'Clausery roadmap',
    description: 'What has shipped recently and what is being worked on next for Clausery, with links to the changelog and GitHub issues.',
    extraHead: crumbsLd([['Home', ''], ['Roadmap', 'roadmap/']]),
    body: (rel) => `<section class="section"><div class="wrap prose" style="max-width:48rem">
<h1>Roadmap</h1>
<p class="lead">What has shipped recently, what is being worked on now, and how to influence what comes next. Every shipped item is in the <a href="${rel}changelog.html">changelog</a>; everything else is tracked in public GitHub issues.</p>

<h2>Recently shipped</h2>
<ul>
  <li><strong>v${APP_VERSION}</strong> — ${TRIAL_DAYS}-day free Pro trial with no card, ${REFUND_DAYS}-day money-back guarantee, refined plan cards, and the current UI/UX polish pass. <a href="${rel}changelog.html">Full changelog →</a></li>
  <li>Online checkout through Lemon Squeezy with automatic activation (no key to copy).</li>
  <li>Origin-guarded service worker, per-file attestation manifest, and other anti-clone / provenance protections.</li>
  <li>Client intake forms, encrypted workspace (AES-256-GCM), and template packs for teams.</li>
</ul>

<h2>In progress</h2>
<p>Tracked in public GitHub issues — votes and comments there help prioritise:</p>
<ul>
  <li>More templates requested by users (see <a href="${REPO_URL}/issues?q=is%3Aissue+is%3Aopen+label%3Atemplate" rel="noopener">template requests</a>).</li>
  <li>Additional invoice presets for more trades and countries.</li>
  <li>Small UX polish drawn from the <a href="${rel}docs/faq.html">frequently asked questions</a>.</li>
</ul>

<h2>How to influence it</h2>
<ul>
  <li><strong>Request a template.</strong> The most-requested documents are built first. Email from the <a href="${rel}contact/">contact page</a>.</li>
  <li><strong>Upvote or comment on an issue.</strong> Open issues at <a href="${REPO_URL}/issues" rel="noopener">GitHub</a> are read and triaged.</li>
  <li><strong>Report a bug.</strong> Problems that affect document correctness take priority over everything else.</li>
</ul>

<p class="small muted">There is no separate backlog tool. The changelog, this page and the GitHub issue tracker are the only places work is tracked.</p>
</div></section>`,
  },
];
