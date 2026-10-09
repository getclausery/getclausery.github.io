import { faqLd, SITE, ONLINE_KEYS } from '../tools/partials.mjs';
import { CHECKOUT_URLS, KEY_REQUEST_URL, CONTACT_EMAIL, keyRequestUrl, mailto } from '../app/config.js';

// The page is built for the checkout setup in app/config.js, so crawlers and visitors without scripts see the right
// buttons; pricing/checkout.js applies the same config at runtime for deployments that edit it without rebuilding.
const CHECKOUT = Object.values(CHECKOUT_URLS).some(Boolean);
const buy = (plan, name, cls) => CHECKOUT_URLS[plan] ? `<a class="${cls}" href="${CHECKOUT_URLS[plan]}" rel="noopener" data-checkout="${plan}">Get ${name}</a>`
  : `<a class="${cls}" href="${keyRequestUrl(name)}" data-checkout="${plan}">Request a ${name} key</a>`;

// Questions shown at the foot of the page and published as FAQPage data.
const FAQ = [
  ['Is there a free trial of Pro?', 'The Free plan has no time limit, so you can evaluate the core product for as long as you like. If you need to test a Pro feature before buying, request a 14-day trial key.'],
  ['What happens when a license expires?', 'The app falls back to the Free plan. Everything you created stays on your device and keeps working; only the Pro-gated features pause until you renew.'],
  ['Do you offer discounts for legal aid, nonprofits or education?', 'Yes: 50% off Pro and Team. Contact getclausery@gmail.com with your organisation details before buying so we can arrange the discount.'],
  ONLINE_KEYS ? ['Does the app contact a server to check my license?', 'For keys bought online, the app checks the key with Lemon Squeezy when you activate it and about once a week, and keeps working offline for up to 30 days between checks. It sends the key and this browser\'s activation ID, not your templates, answers or documents. Anonymous app usage counts are separate and contain nothing you type. Businesses that need no network can ask for an offline key.']
    : ['Does the app contact a server to check my license?', 'No. A license key is verified on your device with a cryptographic signature, so it works offline and nothing is sent anywhere.'],
  ['Can I get an invoice or pay by bank transfer?', 'Team and Enterprise customers can pay by invoice. Ask for one when you request a key.'],
  ['How many devices can use a license?', 'Pro is for one named user and allows activation in up to five browser profiles. Team covers five named users and allows up to fifteen browser profiles. Remove the license in an unused browser to free an activation, or contact support if you cannot access it.'],
  ['How do I add Team seats?', 'The online Team checkout covers five named users at $49/month. Additional seats cost $9 per user/month and are arranged by request at getclausery@gmail.com. Contact us before purchasing for a larger team.'],
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
        <p class="muted">For everyday invoices, quotes and receipts.</p>
        <p class="price">$0</p>
        <ul>
          <li>Every template in the free library</li>
          <li>Up to 3 of your own templates</li>
          <li>Unlimited drafts and documents</li>
          <li>Conditional clauses and repeating groups</li>
          <li>Preview, .docx download, print to PDF</li>
          <li>Backups and answer files</li>
          <li>Calculations in library templates</li>
          <li>Up to 5 documents per spreadsheet</li>
          <li class="no">Calculations in your own templates</li>
          <li class="no">Encrypted workspace</li>
          <li class="no">Client intake forms</li>
        </ul>
        <a class="btn" href="${rel}app/">Open the app</a>
      </div>
      <div class="plan featured">
        <span class="badge" style="position:absolute;top:-.8rem;left:1.5rem">Most popular</span>
        <h3>Pro</h3>
        <p class="muted">For freelancers and businesses automating their own templates.</p>
        <p class="price">$19 <small>/ user / month</small></p>
        <p class="small muted">or $190 per year</p>
        <ul>
          <li>Unlimited templates</li>
          <li>Everything in Free</li>
          <li>Calculations and computed fields in your own templates</li>
          <li>Unlimited documents from a spreadsheet</li>
          <li>Encrypted workspace with auto-lock</li>
          <li>Client intake forms</li>
          <li>Template packs</li>
          <li>Priority support</li>
        </ul>
        ${buy('pro', 'Pro monthly', 'btn btn-primary')}
        <div style="margin-top:.6rem">${buy('proYearly', 'Pro yearly', 'btn')}</div>
      </div>
      <div class="plan">
        <h3>Team</h3>
        <p class="muted">For businesses sharing templates across a team.</p>
        <p class="price">$49 <small>/ month</small></p>
        <p class="small muted">5 seats included. <a href="${mailto('Clausery Team extra seats')}">$9 per extra seat/month by request</a>.</p>
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
        <p class="muted">For organisations with deployment and support requirements.</p>
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
      <li><strong>Paste the key</strong> in the app under Settings → License. ${ONLINE_KEYS ? 'The app checks it with Lemon Squeezy when you activate it and about once a week, sending the key and this browser\'s activation ID; your documents never leave your browser.' : 'The key is verified offline with a cryptographic signature; the app never contacts a license server.'}</li>
      <li><strong>Activate your other devices</strong> within your plan's browser limit. ${ONLINE_KEYS ? 'Renewals apply automatically. Manage billing or cancel from the customer portal linked in app Settings. For a change between Pro and Team or more seats, contact us.' : 'Keep the key somewhere safe; it is your proof of purchase.'}</li>
    </ol>
    <div${CHECKOUT ? ' hidden' : ''} data-when-no-checkout>
      <p>Online checkout is not open yet, so keys are issued on request:</p>
      <ol>
        <li><strong>Email ${CONTACT_EMAIL}</strong>. Say which plan you want, how many people will use it, and whether you want a 14-day trial first. No account is needed.</li>
        <li><strong>We reply by email</strong> with how to pay and send the key.</li>
        <li><strong>Paste the key</strong> in the app under Settings → License. An offline key is verified with a cryptographic signature entirely on this device.</li>
      </ol>
      <p><a class="btn btn-primary" href="${KEY_REQUEST_URL}">Request a key by email</a> <span class="small muted">or write to ${CONTACT_EMAIL}</span></p>
    </div>
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
        <tr><td>Use library invoices, quotes and receipts</td><td>Free · $0</td><td>Unlimited library documents, calculated totals and editable Word output.</td></tr>
        <tr><td>Try your own Word templates</td><td>Free · $0</td><td>Up to three own templates, with unlimited drafts and documents.</td></tr>
        <tr><td>Automate more of your own documents</td><td>Pro · $19/user/month or $190/user/year</td><td>Unlimited own templates, own-template calculations, encryption and intake forms.</td></tr>
        <tr><td>Share approved templates with colleagues</td><td>Team · $49/month for 5 seats</td><td>Pro features, template packs, onboarding and seat-based licensing.</td></tr>
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
<script type="module" src="${rel}pricing/checkout.js"></script>`,
}];
