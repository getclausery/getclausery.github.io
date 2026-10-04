import { faqLd, SITE, ONLINE_KEYS } from '../tools/partials.mjs';
import { CHECKOUT_URLS, KEY_REQUEST_URL } from '../app/config.js';

// The page is built for the checkout setup in app/config.js, so crawlers and visitors without scripts see the right
// buttons; pricing/checkout.js applies the same config at runtime for deployments that edit it without rebuilding.
const CHECKOUT = Object.values(CHECKOUT_URLS).some(Boolean);
const buy = (plan, name, cls) => CHECKOUT_URLS[plan] ? `<a class="${cls}" href="${CHECKOUT_URLS[plan]}" rel="noopener" data-checkout="${plan}">Get ${name}</a>`
  : `<a class="${cls}" href="${KEY_REQUEST_URL}&amp;title=${encodeURIComponent(name + ' key request')}" rel="noopener" data-checkout="${plan}">Request a ${name} key</a>`;

// Questions shown at the foot of the page and published as FAQPage data.
const FAQ = [
  ['Is there a free trial of Pro?', 'The Free plan has no time limit, so you can evaluate the core product for as long as you like. If you need to test a Pro feature before buying, request a 14-day trial key.'],
  ['What happens when a license expires?', 'The app falls back to the Free plan. Everything you created stays on your device and keeps working; only the Pro-gated features pause until you renew.'],
  ['Do you offer discounts for legal aid, nonprofits or education?', 'Yes: 50% off Pro and Team. Say which organisation you work for when you request a key.'],
  ONLINE_KEYS ? ['Does the app contact a server to check my license?', 'Only for keys bought online: the app checks the key with Lemon Squeezy, our payment provider, when you activate it and about once a week, and keeps working offline for up to 30 days between checks. Only the key is sent; your templates, answers and documents never leave your browser. Firms that need no network at all can ask for an offline key.']
    : ['Does the app contact a server to check my license?', 'No. A license key is verified on your device with a cryptographic signature, so it works offline and nothing is sent anywhere.'],
  ['Can I get an invoice or pay by bank transfer?', 'Team and Enterprise customers can pay by invoice. Ask for one when you request a key.'],
];
// The paid plans as structured data, so search engines can read the prices on this page.
const offer = (name, price, unitText) => ({ '@type': 'Offer', name, price, priceCurrency: 'USD', url: SITE + 'pricing/', priceSpecification: { '@type': 'UnitPriceSpecification', price, priceCurrency: 'USD', unitText } });
const plansLd = `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Clausery', applicationCategory: 'BusinessApplication', operatingSystem: 'Any (web browser)', url: SITE,
  offers: [offer('Free', '0', 'every library template and up to 3 of your own'), offer('Pro, monthly', '19', 'per user per month'), offer('Pro, yearly', '190', 'per user per year'), offer('Team, 5 seats', '49', 'per month')] })}</script>`;

export const pages = [{
  path: 'pricing/', title: 'Pricing', extraHead: plansLd + faqLd(FAQ),
  description: 'Clausery pricing: every library template free, plus three of your own. Pro from $19 per user per month for unlimited templates, calculations and encryption.',
  body: (rel) => `
<section class="section">
  <div class="wrap">
    <div style="text-align:center;max-width:44rem;margin:0 auto 2.5rem">
      <h1>Simple pricing. No per-document fees.</h1>
      <p class="lead" style="margin:0 auto">${ONLINE_KEYS ? 'Every plan runs entirely in your browser, and your documents never leave it. Buy online and your license key arrives straight away.' : 'Every plan runs entirely in your browser. A license is a signed key that unlocks features offline; it never checks in with a server.'}</p>
    </div>
    <div class="plans">
      <div class="plan">
        <h3>Free</h3>
        <p class="muted">For trying it out and small practices.</p>
        <p class="price">$0</p>
        <ul>
          <li>Every template in the free library</li>
          <li>Up to 3 of your own templates</li>
          <li>Unlimited drafts and documents</li>
          <li>Conditional clauses and repeating groups</li>
          <li>Preview, .docx download, print to PDF</li>
          <li>Backups and answer files</li>
          <li class="no">Calculations</li>
          <li class="no">Encrypted workspace</li>
          <li class="no">Client intake forms</li>
        </ul>
        <a class="btn" href="${rel}app/">Open the app</a>
      </div>
      <div class="plan featured">
        <span class="badge" style="position:absolute;top:-.8rem;left:1.5rem">Most popular</span>
        <h3>Pro</h3>
        <p class="muted">For solo practitioners and professionals.</p>
        <p class="price">$19 <small>/ user / month</small></p>
        <p class="small muted">or $190 per year</p>
        <ul>
          <li>Unlimited templates</li>
          <li>Everything in Free</li>
          <li>Calculations and computed fields</li>
          <li>Encrypted workspace with auto-lock</li>
          <li>Client intake forms</li>
          <li>Template packs</li>
          <li>Priority support</li>
        </ul>
        ${buy('pro', 'Pro', 'btn btn-primary')}
      </div>
      <div class="plan">
        <h3>Team</h3>
        <p class="muted">For firms and departments up to 25 people.</p>
        <p class="price">$49 <small>/ month</small></p>
        <p class="small muted">5 seats included, $9 per extra seat</p>
        <ul>
          <li>Everything in Pro</li>
          <li>Seat-based team license</li>
          <li>Shared template packs and onboarding call</li>
          <li>Priority support</li>
        </ul>
        ${buy('team', 'Team', 'btn')}
      </div>
      <div class="plan">
        <h3>Enterprise</h3>
        <p class="muted">For larger firms with IT and compliance requirements.</p>
        <p class="price">Custom</p>
        <ul>
          <li>Everything in Team</li>
          <li>Self-hosted on your domain or intranet</li>
          <li>Custom branding of the app and intake forms</li>
          <li>Template authoring services</li>
          <li>Security documentation and DPA</li>
          <li>Invoicing and volume pricing</li>
        </ul>
        <a class="btn" href="${rel}contact/">Talk to us</a>
      </div>
    </div>
    <p class="small muted" style="text-align:center;margin-top:1.5rem">Prices in USD, excluding VAT/sales tax where applicable. Licenses are per named user; a Team license covers a number of seats.</p>
  </div>
</section>

<section class="section section-alt" id="buy">
  <div class="wrap" style="max-width:48rem">
    <h2>How buying works</h2>
    <ol${CHECKOUT ? '' : ' hidden'} data-when-checkout>
      <li><strong>Check out</strong> through our hosted payment page${ONLINE_KEYS ? ' (Lemon Squeezy). Your license key is on the confirmation page and in your receipt email straight away.' : '. You receive a license key by email within minutes.'}</li>
      <li><strong>Paste the key</strong> in the app under Settings → License. ${ONLINE_KEYS ? 'The app checks it with Lemon Squeezy when you activate it and about once a week, sending only the key; your documents never leave your browser.' : 'The key is verified offline with a cryptographic signature; the app never contacts a license server.'}</li>
      <li><strong>Use it on every device</strong> you work from. ${ONLINE_KEYS ? 'Renewals apply on their own, and you can cancel or switch plans any time from the customer portal.' : 'Keep the key somewhere safe; it is your proof of purchase.'}</li>
    </ol>
    <div${CHECKOUT ? ' hidden' : ''} data-when-no-checkout>
      <p>Online checkout is not open yet, so keys are issued on request:</p>
      <ol>
        <li><strong>Request a key</strong> with the form on GitHub. Say which plan you want, and whether you want a 14-day trial first. Requests are public, so do not include your email address or anything confidential.</li>
        <li><strong>We reply in the request</strong> with how to pay and how we will send the key privately.</li>
        <li><strong>Paste the key</strong> in the app under Settings → License. It is verified offline with a cryptographic signature; the app never contacts a license server.</li>
      </ol>
      <p><a class="btn btn-primary" href="${KEY_REQUEST_URL}" rel="noopener">Request a key</a></p>
    </div>
    <p class="small muted">Every template in the <a href="${rel}templates/">free library</a> stays free on every plan, with unlimited documents.</p>
  </div>
</section>

<section class="section" id="compare">
  <div class="wrap" style="max-width:52rem">
    <h2>What the alternatives cost</h2>
    <p class="muted">Prices as of 2026, for orientation. They are good products for firms that are comfortable with cloud processing of client data.</p>
    <div class="table-wrap">
    <table class="compare">
      <thead><tr><th scope="col">Product</th><th scope="col">Price</th><th scope="col">Where documents are processed</th></tr></thead>
      <tbody>
        <tr><td>Gavel (document automation)</td><td>Lite from about $83 to $99 per month; higher tiers about $250 to $417 per month (vendor pricing page)</td><td>Vendor cloud</td></tr>
        <tr><td>Clio Draft</td><td>Quote-based; third-party 2026 guides report roughly $49 to $149 per user per month</td><td>Vendor cloud</td></tr>
        <tr><td>Proposal and contract suites (PandaDoc, Better Proposals)</td><td>$13 to $49 per user per month</td><td>Vendor cloud</td></tr>
        <tr><td><strong>Clausery Pro</strong></td><td><strong>$19 per user per month</strong></td><td><strong>Your browser</strong></td></tr>
      </tbody>
    </table>
    </div>
    <p class="small muted">Sources: vendor pricing pages and 2026 comparison articles (Capterra, SaaSworthy, Owlesq, ClientStackLab). Prices change; check the vendors for current figures.</p>
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
<script type="module" src="${rel}pricing/checkout.js"></script>`,
}];
