// /self-hosting/ is a marketing-oriented companion to the technical docs/self-hosting.html page.
// The existing docs page is technical ("how to deploy"); this page sells the commercial license,
// explains white-label / intranet use cases, answers the common enterprise buyer questions, and
// links into the technical guide and contact.
import { esc, faqLd, crumbsLd, SITE, REPO_URL, mailto } from '../tools/partials.mjs';
import { TRIAL_DAYS, REFUND_DAYS } from '../app/config.js';

const ico = (d) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
const I = {
  server: 'M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
  brand: 'M20 7h-7L9 3H4a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z',
  lock: 'M6 11h12v10H6zM9 11V7a3 3 0 016 0v4',
  users: 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z',
  code: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
};

const USE_CASES = [
  { icon: I.server, title: 'Run on your intranet', body: 'Deploy to an internal web server or static host behind your VPN or SSO gateway. No document contents leave your network.' },
  { icon: I.brand, title: 'White-label and rebrand', body: 'Replace the Clausery name, logo and brand colours with your firm\'s own wording under a commercial license. The AGPL requires that modified versions retain source access for their users; a commercial license removes that and lets you ship a branded version to clients.' },
  { icon: I.users, title: 'Deploy across teams', body: 'Roll out to a whole firm or department with shared template packs, onboarding, and a named contact for support. Volume pricing for seats beyond Team.' },
  { icon: I.lock, title: 'Air-gapped use', body: 'Once built, the site is static files that can be served from any HTTP server with no external requests — suitable for restricted networks.' },
  { icon: I.shield, title: 'Compliance documentation', body: 'On request we provide a DPA, security questionnaire responses and subprocessor list. See the public security overview and privacy policy first.' },
  { icon: I.code, title: 'Fork and extend', body: 'The full source is public under AGPLv3. For features you want built upstream, open an issue or pull request.' },
];

const FAQ = [
  ['What does self-hosting involve?', 'The site is a static build: HTML, CSS, JavaScript, the app modules, fonts and images. Serve those files from any static web server (nginx, Apache, Caddy, S3/CloudFront, GitHub Pages, Netlify, IIS, an internal file server). Nothing needs to run server-side, and there is no database to set up.'],
  ['Do I need a commercial license to run Clausery internally for my own team?', 'No. The AGPL permits internal use within an organisation without source redistribution. You only need a commercial license if you want to (a) remove the visible branding and ship a rebranded version to clients, (b) integrate the editor into a closed-source product, or (c) modify the code and run the modified version as a service for third parties without releasing the modifications.'],
  ['Can Clausery run completely offline / air-gapped?', 'Yes. Once built and served, the app makes no document-processing requests; the only requests are for its own files. If you disable the optional analytics and online-key checks, there are zero third-party requests. Offline license keys are verified with a cryptographic signature on-device.'],
  ['How is data stored when self-hosted?', 'Exactly the same as on the public site: in the user\'s own browser (IndexedDB). The self-hosted server never receives document contents and has no document database. You can change the CSP and CORS to further restrict what browsers may load.'],
  [`Is there a free trial for self-hosted?`, `You do not need one to evaluate — clone the public repository and run it locally. Pro features require a license, but you can start the ${TRIAL_DAYS}-day no-card trial in any running copy, including a local one.`],
  ['What does Enterprise / commercial licensing cost?', 'Enterprise pricing is by quote because deployments range from a single intranet instance to firm-wide rollouts with custom branding and template authoring. Email with your use case, number of users and whether you need branding removed.'],
];

export const pages = [{
  path: 'self-hosting/', title: 'Self-host Clausery on your domain or intranet',
  description: 'Self-host or white-label Clausery: deploy the open-source generator to your domain or intranet. Optional commercial licensing for rebranding.',
  extraHead: `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: 'Clausery self-hosted / Enterprise', description: 'Commercial self-hosted and white-label license for Clausery: editable Word document generation deployed on your own domain or intranet.', brand: { '@type': 'Brand', name: 'Clausery' }, url: `${SITE}self-hosting/`, category: 'Business Software', offers: { '@type': 'Offer', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: `${SITE}contact/`, description: 'Custom-quoted Enterprise licenses; AGPL self-hosting is free.' } })}</script>` + faqLd(FAQ) + crumbsLd([['Home', ''], ['Self-hosting', 'self-hosting/']]),
  body: (rel) => `<section class="section">
  <div class="wrap">
    <div style="text-align:center;max-width:48rem;margin:0 auto 2.5rem">
      <div class="eyebrow">Self-hosting & white-label</div>
      <h1>Run Clausery on your own domain or intranet</h1>
      <p class="lead" style="margin:0 auto">Clausery is plain static files, so you can serve it from any web server behind your firewall. The AGPL covers internal use for free; an Enterprise license adds rebranding, firm-wide rollouts and a commercial agreement.</p>
      <div class="actions" style="margin-top:1.5rem"><a class="btn btn-primary btn-lg" href="${rel}contact/">Request a quote</a><a class="btn btn-lg" href="${rel}docs/self-hosting.html">Technical self-hosting guide</a></div>
      <p class="small muted" style="margin-top:.75rem">Or <a href="${REPO_URL}" rel="noopener">clone the repository</a> and run it locally in under a minute.</p>
    </div>

    <div class="grid grid-3">
${USE_CASES.map((u) => `      <div class="feature">
        <div class="ico" style="color:var(--accent)">${ico(u.icon)}</div>
        <h2 style="font-size:1.15rem;margin-top:.3rem">${esc(u.title)}</h2>
        <p>${esc(u.body)}</p>
      </div>`).join('\n')}
    </div>

    <div class="grid grid-2" style="margin-top:3rem">
      <div class="feature">
        <h2>What you get with a commercial license</h2>
        <ul style="padding-left:1.2rem;margin:.5rem 0 0">
          <li><strong>Permission to rebrand</strong> the app and client intake forms with your own name, logo and colours.</li>
          <li><strong>Permission to ship to clients</strong> as part of a closed-source product or service.</li>
          <li><strong>Onboarding call</strong> and template pack setup for your team.</li>
          <li><strong>Security documentation</strong> (DPA, subprocessor list, questionnaire responses) on request.</li>
          <li><strong>Volume pricing</strong> for larger teams; multi-year and SSO options on request.</li>
          <li><strong>Invoice and purchase-order</strong> payment; reply within 1 business day.</li>
        </ul>
      </div>
      <div class="feature">
        <h2>What you do not need a license for</h2>
        <ul style="padding-left:1.2rem;margin:.5rem 0 0">
          <li><strong>Running Clausery internally</strong> for your own team on an intranet or internal domain. The AGPL allows that.</li>
          <li><strong>Forking the repository</strong> for your own use, as long as modified versions served to third parties share their source.</li>
          <li><strong>Personal, freelance or small-business use</strong> of the public site or your own hosted copy.</li>
        </ul>
        <p style="margin-top:1rem"><strong>Still not sure?</strong> <a href="${rel}legal/license.html">Read the AGPL license</a> or <a href="${mailto('Self-hosting question')}">email to ask</a> — we will tell you when you do and do not need a commercial license.</p>
      </div>
    </div>

    <div class="feature" style="margin-top:2.5rem;padding:2rem;border-left:4px solid var(--accent)">
      <h2>How to get started</h2>
      <ol style="margin:.5rem 0 0;padding-left:1.2rem">
        <li><strong>Try it first.</strong> <a href="${rel}app/#/trial">Start the ${TRIAL_DAYS}-day free Pro trial</a> in the public app, no card, to confirm the product fits your workflow.</li>
        <li><strong>Clone and run locally.</strong> Follow the <a href="${rel}docs/self-hosting.html">technical self-hosting guide</a> — a local instance takes under a minute with Node.</li>
        <li><strong>Email us</strong> with the URL you plan to deploy to, how many users, and whether you need branding removed. We reply with pricing (or confirm that the AGPL covers your use case for free).</li>
        <li><strong>Deploy</strong> to your host of choice behind whatever VPN or SSO your organisation uses.</li>
      </ol>
      <p style="margin-top:1rem"><a class="btn btn-primary" href="${rel}contact/">Request a quote</a> <a class="btn" href="${rel}docs/self-hosting.html">Technical guide</a></p>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap" style="max-width:48rem">
    <h2 style="text-align:center">Self-hosting questions</h2>
    <div class="faq">
      ${FAQ.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('\n      ')}
    </div>
    <p class="small muted" style="text-align:center;margin-top:2rem">Clausery is software, not a law firm, and cannot advise on your legal situation. Have your counsel review the license terms for your specific deployment. See the <a href="${rel}legal/license.html">AGPL license</a> and <a href="${rel}legal/terms.html">terms</a>.</p>
  </div>
</section>

<section class="cta">
  <div class="wrap">
    <h2>Ready to run Clausery on your own infrastructure?</h2>
    <p class="lead" style="margin:0 auto">Clone the repository and try it locally in under a minute, or email to discuss a commercial license for rebranding or firm-wide rollout.</p>
    <div class="actions"><a class="btn btn-primary btn-lg" href="${rel}contact/">Request a quote</a><a class="btn btn-lg" href="${REPO_URL}" rel="noopener">Source on GitHub</a></div>
    <p class="small muted" style="margin-top:1rem">Public site · <a href="${rel}pricing/">Pricing</a> · <a href="${rel}customers/">Customers</a> · <a href="${rel}docs/security.html">Security</a> · ${REFUND_DAYS}-day money-back guarantee on paid plans.</p>
  </div>
</section>`,
}];
