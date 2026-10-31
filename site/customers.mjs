// /customers/ page: who uses Clausery and how, drawn from the existing audience pages
// (freelancers, consultants, landlords, HR teams, law firms) plus solo-business trades.
// Every claim links through to an existing /for/ or /invoice-templates/ page — no invented testimonials.
import { esc, faqLd, crumbsLd, REPO_URL, ico } from '../tools/partials.mjs';
import { LIB } from './library.mjs';
import { TRIAL_DAYS, REFUND_DAYS, PRICES } from '../app/config.js';
import { PRESETS } from '../app/lib/presets.js';

const I = { bolt: 'M13 2L4 14h7l-1 8 9-12h-7z', file: 'M6 3h8l4 4v14H6zM14 3v4h4', calc: 'M4 3h16v18H4zM8 7h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2M16 16h0', shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', users: 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z', lock: 'M6 11h12v10H6zM9 11V7a3 3 0 016 0v4' };

const SEGMENTS = [
  { slug: 'freelancers', title: 'Freelancers & solo creators',
    icon: I.bolt,
    who: 'Designers, writers, developers, photographers, videographers, coaches and tutors who send invoices and contracts themselves.',
    do: ['Invoice by the hour, day or project with line-item calculations and tax', 'Quote a fixed scope, then turn it into an invoice when accepted', 'Send a simple freelance contract or statement of work before starting work', 'Remember business details, bank details and the next invoice number'],
    tpls: ['invoice', 'quote', 'independent-contractor-agreement', 'freelance-writing-contract', 'graphic-design-contract', 'web-design-contract', 'photography-contract', 'tutoring-agreement', 'personal-training-agreement', 'coaching-agreement'],
    cta: { page: 'for/freelancers.html', label: 'Freelancers →' } },
  { slug: 'consultants', title: 'Consultants & agencies',
    icon: I.users,
    who: 'Solo consultants and small agencies on retainers or fixed-fee engagements, often with deposit invoices and change orders.',
    do: ['Engagement letters, consulting agreements and retainers', 'Deposit invoice + final invoice pairs', 'Change orders when scope moves mid-project', 'Reusing the same SOW template across clients'],
    tpls: ['consulting-agreement', 'retainer-agreement', 'statement-of-work', 'service-agreement', 'deposit-invoice', 'change-order-form', 'invoice'],
    cta: { page: 'for/consultants.html', label: 'Consultants →' } },
  { slug: 'landlords', title: 'Landlords & property managers',
    icon: I.shield,
    who: 'Small-scale landlords, housemates letting a room, and property managers who prepare the same paperwork for every tenancy.',
    do: ['Lease agreements, roommate agreements and subleases', 'Rent receipts for every payment a tenant makes', 'Notice to vacate, rent increases and late-rent reminders', 'Security deposit return letters'],
    tpls: ['residential-lease-agreement', 'roommate-agreement', 'sublease-agreement', 'rent-receipt', 'notice-to-vacate', 'rent-increase-letter', 'late-rent-notice', 'security-deposit-return-letter', 'rental-application', 'move-in-checklist'],
    cta: { page: 'for/landlords.html', label: 'Landlords →' } },
  { slug: 'hr-teams', title: 'Small HR teams & founders',
    icon: I.file,
    who: 'Founders and HR managers at small companies who write offer letters, employment contracts and routine HR letters.',
    do: ['Offer letters, employment agreements and NDAs for new hires', 'Warnings, promotions, reference requests and resignations', 'Internship offers, employment verification and severance', 'Employee vs contractor NDA variants'],
    tpls: ['offer-letter', 'employment-agreement', 'employee-nda', 'mutual-nda', 'non-compete-agreement', 'two-weeks-notice-letter', 'promotion-letter', 'employment-verification-letter', 'reference-letter', 'resignation-letter', 'job-description'],
    cta: { page: 'for/hr-teams.html', label: 'HR teams →' } },
  { slug: 'service-businesses', title: 'Service & trades businesses',
    icon: I.calc,
    who: 'Cleaners, contractors, handypersons, landscapers, caterers, pet sitters and other service businesses billing per job.',
    do: ['Quotes that become invoices when accepted', 'Equipment rental and service agreements', 'Liability waivers for high-risk work', 'Invoices tailored to the trade'],
    tpls: ['quote', 'invoice', 'cleaning-services-contract', 'construction-contractor', 'handyman', 'landscaping', 'catering-contract', 'equipment-rental-agreement', 'liability-waiver', 'pet-sitting-agreement'],
    cta: { page: 'invoice-templates/', label: 'Trade invoice templates' } },
  { slug: 'law-firms', title: 'Small firms & solo practitioners',
    icon: I.lock,
    who: 'Solo lawyers and small firms who draft repetitive documents for clients and want templates that never leave the firm\'s device.',
    do: ['Client intake forms that run as standalone HTML (no portal)', 'Engagement letters and fee agreements from Word precedents', 'Encrypted workspace for stored drafts (AES-256-GCM)', 'Self-host on a firm domain or intranet with a commercial license'],
    tpls: ['engagement-letter', 'consulting-agreement', 'mutual-nda', 'independent-contractor-agreement', 'hold-harmless-agreement', 'general-release'],
    cta: { page: 'for/law-firms.html', label: 'Law firms →' } },
];

const tpl = (slug) => LIB.find((t) => t.slug === slug);

const FAQ = [
  ['Do I need an account for any of this?', `No. Every template in the free library is free with no sign-up. Start from any “Fill it in” button and download a finished Word document. Pro ($${PRICES.pro}/mo after a ${TRIAL_DAYS}-day no-card trial) removes the “Made with Clausery” line and unlocks unlimited own templates, calculations, encryption and bulk-from-spreadsheet.`],
  ['Which plans include which features?', `See the pricing page for the full comparison. Free: all ${LIB.length} library templates, up to three of your own, unlimited documents. Pro: unlimited own templates, calculations, encrypted workspace, intake forms, unlimited bulk-from-spreadsheet. Team: five seats, onboarding, shared template packs. Enterprise: commercial license, self-hosting, custom branding.`],
  ['Can my whole team share templates?', 'Yes. Pro works per user for individuals; Team covers five named users with shared template packs and an onboarding call. Enterprise adds self-hosting and a commercial license for white-label or intranet deployments.'],
  ['What is the money-back guarantee?', `If Clausery is not right for you, email within ${REFUND_DAYS} days of your first payment for a full refund. No forms, and you do not need to give a reason.`],
];

export const pages = [{
  path: 'customers/', title: 'Who uses Clausery',
  description: `Who uses Clausery: freelancers, consultants, agencies, landlords, HR teams, service businesses and small law firms.`,
  extraHead: faqLd(FAQ) + crumbsLd([['Home', ''], ['Customers', 'customers/']]),
  body: (rel) => `<section class="section">
  <div class="wrap">
    <div style="text-align:center;max-width:46rem;margin:0 auto 2.5rem">
      <div class="eyebrow">Customers & use cases</div>
      <h1>Who uses Clausery</h1>
      <p class="lead" style="margin:0 auto">People and small businesses who send the same kinds of Word documents again and again, and do not want to upload client details to a document server.</p>
      <p class="small muted" style="margin-top:.5rem">Every scenario below links to a real page with templates and guidance — no invented quotes.</p>
    </div>

    <div class="grid grid-3" style="margin-top:2rem">
${SEGMENTS.map((s) => {
        return `      <div class="feature customer-card">
        <div class="ico" style="color:var(--accent)">${ico(s.icon)}</div>
        <h2 style="font-size:1.2rem;margin-top:.3rem">${esc(s.title)}</h2>
        <p>${esc(s.who)}</p>
        <p class="small muted" style="margin-bottom:.2rem"><strong>Used for</strong></p>
        <ul class="customer-do" style="margin:.25rem 0 1rem;padding-left:1.1rem;font-size:.92rem;color:var(--muted)">
${s.do.map((d) => `          <li>${esc(d)}</li>`).join('\n')}
        </ul>
        <p class="small" style="margin-top:auto"><strong>Popular templates:</strong> ${s.tpls.slice(0, 4).map((slug) => { const t = tpl(slug); return t ? `<a href="${rel}templates/${slug}.html">${esc(t.name)}</a>` : ''; }).filter(Boolean).join(' · ')}${s.tpls.length > 4 ? `, <a href="${rel}templates/">more</a>` : ''}</p>
        <p style="margin-top:.75rem"><a class="btn btn-sm" href="${rel}${s.cta.page}">${esc(s.cta.label)}</a></p>
      </div>`; }).join('\n')}
    </div>

    <div class="grid grid-2" style="margin-top:3rem">
      <div class="feature">
        <h2>By country</h2>
        <p>Invoices are pre-set for the tax rules that apply in each country: VAT in the UK and EU, GST/HST in Canada, GST in Australia and New Zealand, South African VAT, and US-style invoices with optional sales tax.</p>
        <p><a href="${rel}invoice-templates/uk-vat-invoice.html">UK VAT invoice</a> · <a href="${rel}invoice-templates/ireland-vat-invoice.html">Irish VAT</a> · <a href="${rel}invoice-templates/australia-tax-invoice.html">Australian GST</a> · <a href="${rel}invoice-templates/new-zealand-gst-invoice.html">NZ GST</a> · <a href="${rel}invoice-templates/canada-gst-hst-invoice.html">Canada GST/HST</a> · <a href="${rel}invoice-templates/south-africa-tax-invoice.html">South Africa VAT</a></p>
      </div>
      <div class="feature">
        <h2>By trade</h2>
        <p>Invoice templates for common trades come pre-filled with typical line items and categories so you do not start from a blank page.</p>
        <p>${Object.entries(PRESETS.invoice).slice(0, 10).map(([slug, p]) => `<a href="${rel}invoice-templates/${slug}.html">${esc(p.name)}</a>`).join(' · ')} · <a href="${rel}invoice-templates/">all trades</a></p>
      </div>
    </div>

    <div class="feature" style="margin-top:2rem;padding:2rem;text-align:center">
      <h2>Want to see a use case added?</h2>
      <p class="lead" style="margin:0 auto;max-width:40rem">If you prepare the same kind of document every week and it is not listed here, tell us which one. The most-requested templates and workflows are built first.</p>
      <p style="margin-top:1rem"><a class="btn btn-primary" href="${rel}contact/">Request a template or workflow</a></p>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap" style="max-width:48rem">
    <h2 style="text-align:center">Common questions</h2>
    <div class="faq">
      ${FAQ.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('\n      ')}
    </div>
  </div>
</section>

<style>
.customer-card{display:flex;flex-direction:column;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}
.customer-card:hover{transform:translateY(-3px);border-color:var(--accent);box-shadow:var(--shadow)}
.customer-do li{margin:.15rem 0}
</style>

<section class="cta">
  <div class="wrap">
    <h2>Start with the document you send most.</h2>
    <p class="lead" style="margin:0 auto">Browse ${LIB.length} free Word templates or start an invoice in 60 seconds — no signup, no card.</p>
    <div class="actions"><a class="btn btn-primary btn-lg" href="${rel}app/#/start/invoice">Make my free invoice <span class="arr">→</span></a><a class="btn btn-lg" href="${rel}templates/">Browse all templates</a></div>
    <p class="small muted" style="margin-top:1rem">Source code is public at <a href="${REPO_URL}" rel="noopener">GitHub</a>. Read <a href="${rel}about/">about Clausery</a> or <a href="${rel}pricing/">see pricing</a>.</p>
  </div>
</section>`,
}];
