import { faqLd, crumbsLd, SITE, ONLINE_KEYS } from '../tools/partials.mjs';
import { CHECKOUT_URLS, KEY_REQUEST_URL, CONTACT_EMAIL, PRICES, YEARLY_MONTHS_FREE, TRIAL_DAYS, REFUND_DAYS, keyRequestUrl, mailto } from '../app/config.js';
import { PLANS } from '../app/lib/license.js';
import { FREE_BULK_ROWS } from '../app/lib/bulk.js';
import { LIB } from './library.mjs';

// The page is built for the checkout setup in app/config.js, so crawlers and visitors without scripts see the right
// buttons; pricing/checkout.js applies the same config at runtime for deployments that edit it without rebuilding.
const CHECKOUT = Object.values(CHECKOUT_URLS).some(Boolean);
const buy = (plan, name, cls) => CHECKOUT_URLS[plan] ? `<a class="${cls}" href="${CHECKOUT_URLS[plan]}" rel="noopener" data-checkout="${plan}">Get ${name}</a>`
  : `<a class="${cls}" href="${keyRequestUrl(name)}" data-checkout="${plan}">Request a ${name} key</a>`;
// The one-time Pro purchase is offered only once its checkout link exists (see CHECKOUT_URLS in app/config.js).
const LIFETIME = !!CHECKOUT_URLS.lifetime;

// Questions shown at the foot of the page and published as FAQPage data.
const FAQ = [
  ['Is there a free trial of Pro?', `Yes. Start it in the app with one click: every Pro feature for ${TRIAL_DAYS} days, with no card, no account and no email. The trial runs in your browser and simply ends. Nothing renews, and you keep everything you made. The Free plan itself has no time limit.`],
  ['Is there a money-back guarantee?', `Yes. If Clausery is not right for you, email ${CONTACT_EMAIL} within ${REFUND_DAYS} days of your first payment for a plan and we will refund it in full. No forms, and you do not need to give a reason.`],
  ['What is the “Made with Clausery” line?', 'On the Free plan, documents made in the app from library templates end with one small line, “Made with Clausery”, linked to this site. It is how a free product finds new users. Pro, Team and the free trial leave it out, and documents made from your own templates never have it.'],
  ...(LIFETIME ? [['What does Lifetime Pro include?', `One payment of $${PRICES.lifetime} for Pro for one named user, for as long as Clausery is offered, including updates and with nothing to renew. Like monthly Pro, it activates in up to five browser profiles.`]] : []),
  ['What happens when a license expires?', 'The app falls back to the Free plan. Everything you created stays on your device and keeps working; only the Pro-gated features pause until you renew.'],
  ['Do you offer discounts for legal aid, nonprofits or education?', 'Yes: 50% off Pro and Team. Contact getclausery@gmail.com with your organisation details before buying so we can arrange the discount.'],
  ONLINE_KEYS ? ['Does the app contact a server to check my subscription?', 'The app activates your purchase automatically when you select Open Clausery after payment or in your receipt email. Behind the scenes, Lemon Squeezy supplies a license credential, which the app checks on activation and about once a week. It works offline for up to 30 days between checks. The credential and browser activation ID are sent, not your templates, answers or documents. Anonymous app usage counts are separate and contain nothing you type. Businesses that need no network can ask for an offline license.']
    : ['Does the app contact a server to check my license?', 'No. A license key is verified on your device with a cryptographic signature, so it works offline and nothing is sent anywhere.'],
  ['Can I get an invoice or pay by bank transfer?', 'Team and Enterprise customers can pay by invoice. Ask for one when you request a key.'],
  ['How do I activate my purchase?', 'After paying, select Open Clausery on the confirmation page or in your receipt email. Your plan activates automatically and opens the app, with no separate account and no key to copy. Use that receipt button on another device too. Keep the access link private.'],
  ['How many devices can use a plan?', 'Pro is for one named user and allows activation in up to five browser profiles. Team covers five named users and allows up to fifteen browser profiles. In an unused browser, go to Settings → Advanced activation → Remove from this browser to free an activation, or contact support if you cannot access it.'],
  ['How do I add Team seats?', `The online Team checkout covers five named users at $${PRICES.team}/month. Additional seats cost $${PRICES.teamSeat} per user/month and are arranged by request at ${CONTACT_EMAIL}. Contact us before purchasing for a larger team.`],
];
// The paid plans as structured data, so search engines can read the prices on this page.
const offer = (name, price, unitText) => ({ '@type': 'Offer', name, price, priceCurrency: 'USD', url: SITE + 'pricing/', priceSpecification: { '@type': 'UnitPriceSpecification', price, priceCurrency: 'USD', unitText } });
const plansLd = `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Clausery', applicationCategory: 'BusinessApplication', operatingSystem: 'Any (web browser)', url: SITE,
  offers: [offer('Free', '0', 'every library template and up to 3 of your own'), offer('Pro, monthly', String(PRICES.pro), 'per user per month'), offer('Pro, yearly', String(PRICES.proYearly), 'per user per year'),
    ...(LIFETIME ? [offer('Pro, lifetime', String(PRICES.lifetime), 'one-time payment per user')] : []), offer('Team, 5 seats', String(PRICES.team), 'per month')] })}</script>`;

// The plan matrix is derived from the same configuration the app uses (PLANS) and the same constants the plan cards
// read, so a price, a template allowance or a feature flag cannot differ between the table, the cards and the app.
const ownTemplates = (plan) => (plan.maxTemplates === Infinity ? 'Unlimited' : `Up to ${plan.maxTemplates}`);
const flag = (on) => (on ? 'Yes' : '—');
const MATRIX = [
  ['Price', '$0, no time limit', `$${PRICES.pro} per user per month, or $${PRICES.proYearly} per year`, `$${PRICES.team} per month, 5 seats included`, 'Custom'],
  [`All ${LIB.length} library templates`, 'Every one', 'Every one', 'Every one', 'Every one'],
  ['Your own Word templates', ownTemplates(PLANS.free), ownTemplates(PLANS.pro), ownTemplates(PLANS.team), ownTemplates(PLANS.enterprise)],
  ['Documents from a spreadsheet', `Up to ${FREE_BULK_ROWS}`, flag(PLANS.pro.bulk) === 'Yes' ? 'Unlimited' : '—', 'Unlimited', 'Unlimited'],
  ['Calculations in your own templates', flag(PLANS.free.computed), flag(PLANS.pro.computed), flag(PLANS.team.computed), flag(PLANS.enterprise.computed)],
  ['Remove the “Made with Clausery” line', flag(PLANS.free.unbranded), flag(PLANS.pro.unbranded), flag(PLANS.team.unbranded), flag(PLANS.enterprise.unbranded)],
  ['Encrypted workspace (AES-256-GCM)', flag(PLANS.free.vault), flag(PLANS.pro.vault), flag(PLANS.team.vault), flag(PLANS.enterprise.vault)],
  ['Client intake forms', flag(PLANS.free.intake), flag(PLANS.pro.intake), flag(PLANS.team.intake), flag(PLANS.enterprise.intake)],
  ['Template packs', flag(PLANS.free.packs), flag(PLANS.pro.packs), flag(PLANS.team.packs), flag(PLANS.enterprise.packs)],
  ['Support', 'Email', 'Priority', 'Priority, plus an onboarding call', 'Security documentation and a DPA'],
  ['Self-hosted on your domain or intranet', '—', '—', '—', 'Yes'],
];

export const pages = [{
  path: 'pricing/', title: `Pricing — free forever, or Pro $${PRICES.pro}/mo (no card trial)`, extraHead: plansLd + faqLd(FAQ) + crumbsLd([['Home', ''], ['Pricing', 'pricing/']]),
  description: `Free forever: ${LIB.length} Word templates, three of your own, unlimited documents. Pro is $${PRICES.pro}/user/month for unlimited templates, calculations, encryption and bulk-from-spreadsheet. ${TRIAL_DAYS}-day free trial (no card), ${REFUND_DAYS}-day refund.`,
  body: (rel) => `
<section class="section">
  <div class="wrap">
    <div style="text-align:center;max-width:44rem;margin:0 auto 2.5rem">
      <h1>Simple pricing. No per-document fees.</h1>
      <p class="lead" style="margin:0 auto">${ONLINE_KEYS ? 'Choose a plan, pay securely, then select Open Clausery. Your plan activates automatically. No separate account or key to copy; your documents stay on your device.' : 'Every plan runs entirely in your browser. A license is a signed key that unlocks features offline; it never checks in with a server.'}</p>
      <ul class="assurances">
        <li>${TRIAL_DAYS}-day free Pro trial: no card, nothing renews</li>
        <li>${REFUND_DAYS}-day money-back guarantee</li>
        <li>Your documents stay on your device</li>
      </ul>
      <div class="trust-logos">
        <span title="Public source on GitHub">${''}<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"/></svg> Source on GitHub</span>
        <span title="Featured launch product">${''}<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 0l2 5h5l-4 3 1.5 5L8 10l-4.5 3L5 8 1 5h5z" fill="#f59e0b"/></svg> Featured on Fazier</span>
        <span title="No ads or third-party tracking">${''}<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg> No ads, no tracking cookies</span>
        <span title="SOC2-style data practice: everything stays local">${''}<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Encrypted local workspace</span>
      </div>
    </div>
    <div class="billing-toggle" role="tablist" aria-label="Billing period">
      <button type="button" role="tab" aria-selected="true" data-billing="monthly" class="active">Monthly</button>
      <button type="button" role="tab" aria-selected="false" data-billing="yearly">Yearly <span class="save-badge">Save ${YEARLY_MONTHS_FREE} months</span></button>
    </div>
    <div class="plans">
      <div class="plan">
        <h3>Free</h3>
        <p class="muted">For everyday invoices, quotes and receipts.</p>
        <p class="price">$0</p>
        <p class="small muted">Forever. No card, no email.</p>
        <ul>
          <li>Every template in the free library</li>
          <li>Up to 3 of your own templates</li>
          <li>Unlimited drafts and documents</li>
          <li>Conditional clauses and repeating groups</li>
          <li>Preview, .docx download, print to PDF</li>
          <li>Backups and answer files</li>
          <li>Calculations in library templates</li>
          <li>Up to 5 documents per spreadsheet</li>
          <li class="no">Remove the “Made with Clausery” line from library documents</li>
          <li class="no">Calculations in your own templates</li>
          <li class="no">Encrypted workspace</li>
          <li class="no">Client intake forms</li>
        </ul>
        <a class="btn" href="${rel}app/">Open the app</a>
        <p class="small muted" style="text-align:center;margin:.6rem 0 0">No signup.</p>
      </div>
      <div class="plan featured">
        <span class="plan-ribbon">FREE TRIAL — NO CARD</span>
        <span class="badge" style="position:absolute;top:.7rem;right:1rem">Pro</span>
        <h3>Pro</h3>
        <p class="muted">For freelancers and small businesses who send documents every week.</p>
        <p class="price"><span class="price-mo">$${PRICES.pro}</span><span class="price-yr">$${Math.round(PRICES.proYearly/12)}</span> <small><span class="price-mo">/ user / month</span><span class="price-yr">/ user / month, billed yearly</span></small></p>
        <p class="small muted price-mo">or $${PRICES.proYearly} per year (${YEARLY_MONTHS_FREE} months free) — <button type="button" data-billing="yearly" style="background:none;border:0;padding:0;color:inherit;text-decoration:underline;cursor:pointer;font:inherit">switch to yearly</button></p>
        <p class="small muted price-yr">$${PRICES.proYearly} billed once a year — <button type="button" data-billing="monthly" style="background:none;border:0;padding:0;color:inherit;text-decoration:underline;cursor:pointer;font:inherit">switch to monthly</button></p>
        <ul>
          <li>Everything in Free</li>
          <li><strong>No “Made with Clausery” line</strong> on your documents</li>
          <li>Unlimited templates of your own</li>
          <li>Calculations and computed fields in your own templates</li>
          <li>Unlimited documents from a spreadsheet</li>
          <li>Encrypted workspace with auto-lock</li>
          <li>Client intake forms</li>
          <li>Template packs</li>
          <li>Priority support</li>
        </ul>
        ${buy('pro', 'Start Pro monthly', 'btn btn-primary btn-lg')}
        <div style="margin-top:.6rem">${buy('proYearly', 'Pro yearly — best value', 'btn')}</div>
        <a class="trial-link" href="${rel}app/#/trial">or try Pro free for ${TRIAL_DAYS} days — no card, nothing renews</a>
        <p class="small refund-note"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>${REFUND_DAYS}-day money-back guarantee, no forms.</p>
      </div>
      <div class="plan">
        <h3>Team</h3>
        <p class="muted">For businesses sharing templates across a team.</p>
        <p class="price">$${PRICES.team} <small>/ month</small></p>
        <p class="small muted">5 seats included. <a href="${mailto('Clausery Team extra seats')}">$${PRICES.teamSeat} per extra seat/month by request</a>.</p>
        <ul>
          <li>Everything in Pro</li>
          <li>Seat-based team license</li>
          <li>Shared template packs and onboarding call</li>
          <li>Priority support</li>
          <li>${TRIAL_DAYS}-day free trial for the team</li>
        </ul>
        ${buy('team', 'Start Team free trial', 'btn btn-primary')}
      </div>
      <div class="plan plan-enterprise">
        <h3>Enterprise</h3>
        <p class="muted">For organisations with deployment, compliance or white-label requirements.</p>
        <p class="price">Custom</p>
        <ul>
          <li>Everything in Team</li>
          <li>Self-hosted on your domain or intranet</li>
          <li><strong>Commercial license</strong> and custom branding</li>
          <li>Template authoring services</li>
          <li>Security documentation, DPA, invoicing</li>
          <li>Volume pricing and SSO (on request)</li>
        </ul>
        <a class="btn btn-ink" href="${rel}self-hosting/">Self-hosting &amp; Enterprise</a>
        <p class="small muted" style="text-align:center;margin:.6rem 0 0"><a href="${rel}contact/">Request a quote</a> · reply within 1 business day.</p>
      </div>
    </div>
    <h2 style="margin-top:2.5rem">Compare the plans side by side</h2>
    <p class="lead" style="margin-bottom:1.5rem">The table is generated from the same plan configuration the app uses, so it cannot drift from the plan cards above.</p>
    <div class="table-wrap" tabindex="0"><table class="compare">
    <thead><tr><th scope="col">&nbsp;</th><th scope="col">Free</th><th scope="col">Pro</th><th scope="col">Team</th><th scope="col">Enterprise</th></tr></thead>
    <tbody>
${MATRIX.map(([label, ...cells]) => `<tr><th scope="row">${label}</th>${cells.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('\n')}
    </tbody></table></div>
    <p class="small muted" style="margin-top:.75rem">Licenses are per named user. Team covers five seats; extra seats are $${PRICES.teamSeat} per user per month by request. Prices are in USD, excluding VAT/sales tax where applicable.</p>
${LIFETIME ? `    <div class="feature lifetime" id="lifetime">
      <div><h3>Prefer to pay once? Lifetime Pro, $${PRICES.lifetime}</h3>
      <p>Every Pro feature for one named user, for as long as Clausery is offered, including updates. One payment and nothing to renew.</p></div>
      ${buy('lifetime', 'Lifetime Pro', 'btn')}
    </div>
` : ''}    <p class="small muted" style="text-align:center;margin-top:1.5rem"><strong>${REFUND_DAYS}-day money-back guarantee</strong> on your first payment for a plan: email us and we refund it in full. Prices in USD, excluding VAT/sales tax where applicable. Licenses are per named user; a Team license covers a number of seats.</p>
  </div>
</section>

<section class="section section-alt" id="buy">
  <div class="wrap" style="max-width:48rem">
    <h2>How buying works</h2>
    <ol${CHECKOUT ? '' : ' hidden'} data-when-checkout>
      <li><strong>Choose a plan and pay</strong> through our secure hosted checkout${ONLINE_KEYS ? ' (Lemon Squeezy).' : '. You receive a license key by email within minutes.'}</li>
      <li>${ONLINE_KEYS ? '<strong>Select Open Clausery</strong> after payment or in your receipt email. Your plan activates automatically and the app opens, ready to use. No separate account or key to copy.' : '<strong>Paste the key</strong> in the app under Settings → Advanced activation. The key is verified offline with a cryptographic signature; the app never contacts a license server.'}</li>
      <li><strong>Start making documents.</strong> ${ONLINE_KEYS ? 'For another device, use the receipt button there. Renewals apply automatically; manage billing or cancel from app Settings. Keep the receipt access link private. For a change between Pro and Team or more seats, contact us.' : 'Keep the key somewhere safe; it is your proof of purchase.'}</li>
    </ol>
    <div${CHECKOUT ? ' hidden' : ''} data-when-no-checkout>
      <p>Online checkout is not open yet, so keys are issued on request:</p>
      <ol>
        <li><strong>Email ${CONTACT_EMAIL}</strong>. Say which plan you want and how many people will use it. No account is needed.</li>
        <li><strong>We reply by email</strong> with how to pay and send the key.</li>
        <li><strong>Paste the key</strong> in the app under Settings → License. An offline key is verified with a cryptographic signature entirely on this device.</li>
      </ol>
      <p><a class="btn btn-primary" href="${KEY_REQUEST_URL}">Request a key by email</a> <span class="small muted">or write to ${CONTACT_EMAIL}</span></p>
    </div>
    <p id="try-first">Not sure yet? <a href="${rel}app/#/trial">Start the ${TRIAL_DAYS}-day free trial</a> in the app first: it unlocks every Pro feature in your browser with no card and no account, then simply ends.</p>
    <p class="small muted">Every template in the <a href="${rel}templates/">free library</a> stays free on every plan, with unlimited documents.</p>
  </div>
</section>

<section class="section" id="compare">
  <div class="wrap" style="max-width:52rem">
    <h2>Choose a plan for the work you actually do</h2>
    <p class="muted">Start with Free for library invoices, quotes and receipts. Upgrade when your own document workflow needs the additional features.</p>
    <div class="table-wrap">
    <table class="compare">
      <thead><tr><th scope="col">Your work</th><th scope="col">Plan</th><th scope="col">What to expect</th></tr></thead>
      <tbody>
        <tr><td>Use library invoices, quotes and receipts</td><td>Free · $0</td><td>Unlimited library documents, calculated totals and editable Word output, with a small “Made with Clausery” line.</td></tr>
        <tr><td>Try your own Word templates</td><td>Free · $0</td><td>Up to three own templates, with unlimited drafts and documents.</td></tr>
        <tr><td>Send documents without the Clausery line</td><td>Pro · $${PRICES.pro}/user/month or $${PRICES.proYearly}/user/year</td><td>Every library document without the “Made with Clausery” line, plus unlimited documents from a spreadsheet.</td></tr>
        <tr><td>Automate more of your own documents</td><td>Pro · $${PRICES.pro}/user/month or $${PRICES.proYearly}/user/year</td><td>Unlimited own templates, own-template calculations, encryption and intake forms.</td></tr>
        <tr><td>Share approved templates with colleagues</td><td>Team · $${PRICES.team}/month for 5 seats</td><td>Pro features, template packs, onboarding and seat-based licensing.</td></tr>
      </tbody>
    </table>
    </div>
    <p class="small muted">Free library templates do not count toward your own-template limit. <a href="${rel}business-document-kit/">Download the six-template business kit</a> to get started.</p>
  </div>
</section>

<section class="section section-alt" id="faq">
  <div class="wrap" style="max-width:48rem">
    <h2>Pricing questions</h2>
    <div class="faq">
      ${FAQ.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('\n      ')}
    </div>
  </div>
</section>
<style>
.billing-toggle{display:inline-flex;background:var(--surface-2);border:1px solid var(--border);border-radius:999px;padding:.25rem;margin:0 auto 1.5rem;gap:.2rem;width:max-content}
.billing-toggle button{background:none;border:0;padding:.5rem 1.1rem;border-radius:999px;font:inherit;font-weight:600;color:var(--muted);cursor:pointer;transition:background .15s,color .15s;display:inline-flex;align-items:center;gap:.4rem}
.billing-toggle button.active{background:var(--surface);color:var(--text);box-shadow:0 1px 3px rgba(0,0,0,.08)}
.save-badge{background:var(--ok-soft);color:var(--ok);font-size:.68rem;font-weight:700;padding:.1rem .45rem;border-radius:999px;letter-spacing:.01em}
.plans{position:relative}
.plan-ribbon{position:absolute;top:-.75rem;left:1.1rem;background:linear-gradient(135deg,var(--accent) 0%,var(--accent-hover) 100%);color:var(--accent-text);font-size:.65rem;font-weight:800;letter-spacing:.12em;padding:.25rem .65rem;border-radius:4px;box-shadow:0 4px 10px -4px rgba(15,118,110,.5)}
.price-yr{display:none}
body.billing-yearly .price-mo{display:none}
body.billing-yearly .price-yr{display:inline}
body.billing-yearly .plan .price small{display:none}
.trust-logos{display:flex;flex-wrap:wrap;justify-content:center;gap:.5rem 1.25rem;margin-top:1.2rem;font-size:.8rem;color:var(--muted)}
.trust-logos span{display:inline-flex;align-items:center;gap:.35rem}
@media (max-width:600px){.billing-toggle{font-size:.9rem}.trust-logos{font-size:.74rem;gap:.4rem .9rem}}
</style>
<script src="${rel}pricing/billing-toggle.js" defer></script>`,
}];
