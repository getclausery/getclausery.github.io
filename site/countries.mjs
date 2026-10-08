// Invoice templates by country: one page per tax set-up in app/lib/presets.js (TAX_PRESETS). Each page exists because it
// does something the generic invoice page does not: the app opens the invoice already set up for that country's tax
// (#/start/invoice/<slug>: tax name and standard rate, what the tax number is called, "Tax invoice" where that is the
// norm, the currency), and the page sets out what that country's tax authority says an invoice must show, with the
// numbers that matter (rates, registration threshold, deadlines) and a link to the authority. Checked October 2026.
import { esc, faqLd, LASTMOD, LASTMOD_LONG } from '../tools/partials.mjs';
import { TAX_PRESETS } from '../app/lib/presets.js';
import { GUIDES } from './audience.mjs';

const C = (slug, o) => ({ slug, preset: TAX_PRESETS.invoice[slug], ...o });
export const COUNTRIES = [
  C('uk-vat-invoice', {
    country: 'UK', title: 'VAT invoice template (UK): free, Word, VAT worked out',
    h1: 'VAT invoice template (UK)', locale: 'en-GB', tax: 'VAT', taxNumber: 'VAT registration number',
    description: 'Free UK VAT invoice template for Word: your VAT number, 20% VAT worked out, the details HMRC asks for and a separate date of supply. Fill it in online, no sign-up.',
    intro: 'A VAT invoice is what lets your VAT-registered customers reclaim the VAT you charge, so HMRC sets out what it must show. This template opens set up for UK VAT: your VAT registration number on the invoice, VAT at 20% worked out on the subtotal, and amounts in pounds.',
    lines: [['Bookkeeping (hours)', 12, 45], ['Year-end accounts', 1, 650], ['Software subscription (months)', 3, 25]],
    facts: [['Standard rate', '20% (reduced rate 5%, zero rate 0%)'], ['Registration threshold', 'Taxable turnover over £90,000 in any rolling 12 months'], ['When to issue', 'Within 30 days of the time of supply'], ['Simplified invoice', 'Allowed when the total including VAT is £250 or less']],
    must: ['A unique invoice number that follows on from the last one.', 'The time of supply (tax point), and the date of issue if it is different.', 'Your name, address and VAT registration number.', 'Your customer\'s name and address.', 'A description of the goods or services.', 'For each item: the quantity, the unit price, the VAT rate and the amount excluding VAT.', 'The total excluding VAT, the rate of any cash discount, and the total VAT in sterling.'],
    setup: ['VAT at 20%, worked out on the subtotal after any discount.', 'Your VAT registration number in your business details.', 'An optional date of supply, for when the tax point differs from the invoice date.', 'Amounts in pounds sterling (GBP).'],
    limits: 'The template applies one VAT rate to the whole invoice. If you sell at more than one rate, issue separate invoices or note each line\'s rate in its description.',
    notRegistered: 'If you are not registered for VAT, do not charge VAT or show a VAT number. Untick the tax option and the invoice is a normal invoice.',
    faq: [['Do I need to issue a VAT invoice to every customer?', 'You must issue one to VAT-registered business customers for standard-rated and reduced-rated sales. Consumers cannot reclaim VAT, so they only need one if they ask.'], ['Can I invoice in euros or dollars?', 'Yes, but the total VAT must also be shown in sterling, so your customer can put it on their VAT return.'], ['How do I correct a VAT invoice I have sent?', 'Do not edit it. Issue a credit note that cancels it, or the wrong part, and then a new invoice with a new number.']],
    guide: 'what-to-include-on-a-vat-invoice',
    sources: [['HMRC: Record keeping for VAT (VAT Notice 700/21), VAT invoices', 'https://www.gov.uk/guidance/record-keeping-for-vat-notice-70021'], ['GOV.UK: VAT registration thresholds', 'https://www.gov.uk/vat-registration/when-to-register']],
  }),
  C('ireland-vat-invoice', {
    country: 'Ireland', title: 'VAT invoice template for Ireland (free, Word)',
    h1: 'VAT invoice template for Ireland', locale: 'en-IE', tax: 'VAT', taxNumber: 'VAT number',
    description: 'Free Irish VAT invoice template for Word: your VAT number, 23% VAT worked out, the date of supply and the details Revenue lists. Fill it in online, no sign-up, nothing uploaded.',
    intro: 'Revenue lists what a VAT invoice in Ireland has to contain, from the sequential number to the date the goods or services were supplied. This template opens set up for Irish VAT: your VAT number, VAT at the 23% standard rate worked out for you, a date of supply, and amounts in euro.',
    lines: [['Web design (days)', 4, 450], ['Hosting set-up', 1, 150], ['Content upload (pages)', 10, 35]],
    facts: [['Standard rate', '23% (reduced rates 13.5% and 9%, zero rate 0%)'], ['Registration thresholds', '€85,000 a year for goods, €42,500 for services (since 1 January 2025)'], ['Date of supply', 'Must be on the invoice'], ['Foreign currency', 'Show the euro equivalents as well']],
    must: ['The date of issue and a unique sequential number.', 'Your full name, address and VAT number.', 'Your customer\'s full name and address.', 'The quantity and nature of the goods, or the extent and nature of the services.', 'The unit price excluding VAT, and any discounts.', 'A breakdown by VAT rate and the total VAT payable.', 'The date the goods or services were supplied.', 'For reverse-charge supplies to a business in another EU country: the customer\'s VAT number and a note that the reverse charge applies.'],
    setup: ['VAT at 23%, worked out on the subtotal after any discount.', 'Your VAT number in your business details.', 'A date of supply, which Irish VAT invoices must show.', 'Amounts in euro (EUR).'],
    limits: 'The template applies one VAT rate to the whole invoice. If an invoice mixes rates, such as 23% and 13.5%, issue separate invoices or note each line\'s rate in its description.',
    notRegistered: 'If you are below the thresholds and not registered, do not charge VAT or show a VAT number. Untick the tax option for a normal invoice.',
    faq: [['Do I charge Irish VAT to a business customer in another EU country?', 'Usually not for services: the customer accounts for the VAT under the reverse charge. Untick the tax option, show their VAT number and add a note that the reverse charge applies. Check Revenue\'s guidance for goods and special cases.'], ['Which VAT rate applies to my work?', 'Most goods and services are at 23%. Some are at 13.5%, 9% or 0%; Revenue\'s VAT rates database lists them.'], ['What if I invoice in pounds or dollars?', 'You can, but the invoice must also show the VAT amounts in euro.']],
    sources: [['Revenue: Information required on a VAT invoice', 'https://www.revenue.ie/en/vat/vat-records-invoices-credit-notes/invoices/information-required-vat-invoice.aspx'], ['Revenue: VAT registration thresholds', 'https://www.revenue.ie/en/vat/vat-registration/who-should-register-for-vat/index.aspx']],
  }),
  C('australia-tax-invoice', {
    country: 'Australia', title: 'Tax invoice template Australia: free, Word, GST added',
    h1: 'Tax invoice template for Australia', locale: 'en-AU', tax: 'GST', taxNumber: 'ABN',
    description: 'Free Australian tax invoice template for Word: the words "Tax invoice", your ABN, 10% GST worked out and the buyer\'s details for sales of $1,000 or more. Fill it in online, no sign-up.',
    intro: 'If you are registered for GST, your business customers need a tax invoice from you to claim the GST back. This template opens set up for Australia: titled "Tax invoice", your ABN on it, GST at 10% worked out, and amounts in Australian dollars.',
    lines: [['Electrical labour (hours)', 6, 95], ['Materials, as itemised', 1, 340], ['Call-out fee', 1, 80]],
    facts: [['GST rate', '10%'], ['Registration threshold', '$75,000 GST turnover ($150,000 for non-profits)'], ['When to issue', 'Within 28 days if the customer asks, unless the sale was $82.50 or less including GST'], ['Sales of $1,000 or more', 'Must also show the buyer\'s identity or ABN']],
    must: ['That it is intended to be a tax invoice, usually the words "Tax invoice".', 'Your identity, such as your business name.', 'Your ABN.', 'The date it was issued.', 'A brief description of what you sold, with the quantity if relevant and the price.', 'The GST amount, or a statement that the total includes GST when it is exactly one eleventh.', 'How far each sale is taxable, when the invoice mixes taxable and GST-free items.'],
    setup: ['The title "Tax invoice".', 'Your ABN in your business details.', 'GST at 10%, worked out on the subtotal after any discount.', 'Amounts in Australian dollars (AUD).'],
    limits: 'GST is applied to the whole invoice. For a mix of taxable and GST-free items, issue separate invoices or mark the GST-free lines in their description.',
    notRegistered: 'If you are not registered for GST, do not call the document a tax invoice and do not add GST. Untick both options and show your ABN if you have one.',
    faq: [['Do I have to write "Tax invoice" on it?', 'The ATO needs it to be clear that the document is intended to be a tax invoice; the words "Tax invoice" at the top are the usual way.'], ['What changes for sales of $1,000 or more?', 'The invoice must also show the buyer\'s identity or ABN. Including the buyer every time keeps every invoice valid.'], ['My prices include GST. Can I still use this?', 'This template adds GST to the prices you enter. If your prices include GST, enter them without it, or state on the invoice that the total includes GST.']],
    guide: 'tax-invoice-requirements-australia',
    sources: [['Australian Taxation Office: Tax invoices', 'https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/tax-invoices'], ['Australian Taxation Office: Registering for GST', 'https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/registering-for-gst']],
  }),
  C('new-zealand-gst-invoice', {
    country: 'New Zealand', title: 'GST invoice template NZ (free, Word)',
    h1: 'GST invoice template for New Zealand', locale: 'en-NZ', tax: 'GST', taxNumber: 'GST number',
    description: 'Free New Zealand GST invoice template for Word: your GST number, 15% GST worked out, and the taxable supply information Inland Revenue asks for at each amount. No sign-up.',
    intro: 'Since April 2023 New Zealand has used "taxable supply information" instead of the old tax invoice rules: what you must show depends on the amount. This template opens set up for New Zealand: your GST number, GST at 15% shown separately, and amounts in New Zealand dollars.',
    lines: [['Lawn mowing (visits)', 4, 55], ['Hedge trimming', 1, 180], ['Green waste removal', 1, 60]],
    facts: [['GST rate', '15%'], ['Registration threshold', 'Turnover over $60,000 in 12 months'], ['"Tax invoice" title', 'No longer required since 1 April 2023'], ['Buyer\'s details', 'Needed for supplies over $1,000 to a GST-registered buyer']],
    must: ['$200 or less: your name or trade name, the date, a description and the amount.', 'Over $200: also your GST number, and either the amount excluding GST, the GST and the total, or the total with a statement that it includes GST.', 'Over $1,000 to a GST-registered buyer: also the buyer\'s name and one more identifier, such as their address, phone number, email, NZBN or website.'],
    setup: ['Your GST number in your business details.', 'GST at 15%, shown as its own line with the totals before and after.', 'Amounts in New Zealand dollars (NZD).'],
    limits: 'GST is applied to the whole invoice. If some items are zero-rated or exempt, invoice them separately.',
    notRegistered: 'If you are not registered for GST, do not charge it or show a GST number. Untick the tax option for a normal invoice.',
    faq: [['Do invoices still have to say "Tax invoice"?', 'No. Since 1 April 2023 the rules are about the information shown, not the title. You can still call it a tax invoice if your customers expect it.'], ['When do I need my customer\'s details on the invoice?', 'For supplies over $1,000 to a GST-registered buyer: their name and at least one other identifier. Including them on every invoice is simplest.'], ['What if I am not registered for GST?', 'Do not charge GST. You must register once your turnover goes over $60,000 in a 12-month period.']],
    sources: [['Inland Revenue: How taxable supply information works', 'https://www.ird.govt.nz/gst/tax-invoices-for-gst/how-tax-invoices-for-gst-work'], ['Inland Revenue: Registering for GST', 'https://www.ird.govt.nz/gst/registering-for-gst']],
  }),
  C('canada-gst-hst-invoice', {
    country: 'Canada', title: 'GST/HST invoice template for Canada (free, Word)',
    h1: 'GST/HST invoice template for Canada', locale: 'en-CA', tax: 'GST/HST', taxNumber: 'GST/HST number',
    description: 'Free Canadian GST/HST invoice template for Word: your GST/HST number, the tax worked out at your province\'s rate, and the details the CRA asks for at $100 and $500. No sign-up.',
    intro: 'Your business customers can only claim back the GST or HST you charge if your invoice shows what the Canada Revenue Agency asks for, and that depends on the amount. This template opens set up for Canada: your GST/HST number, tax at Ontario\'s 13% HST (change it for your province), and amounts in Canadian dollars.',
    lines: [['Consulting (hours)', 15, 120], ['Workshop day', 1, 1500], ['Travel, at cost', 1, 210]],
    facts: [['Rates (since 1 April 2025)', 'GST 5% (AB, BC, MB, QC, SK, territories); HST 13% ON; 14% NS; 15% NB, NL, PE'], ['Small supplier', 'No need to register until taxable sales pass $30,000 over four consecutive calendar quarters'], ['$100 or more', 'Show your GST/HST number and the tax charged'], ['$500 or more', 'Also show the customer\'s name, a description and the payment terms']],
    must: ['Under $100: your business or trading name, the date and the total.', '$100 to $499.99: also your GST/HST registration number, the GST or HST charged (or that the price includes it, with the rate), and which items are taxable if some are not.', '$500 or more: also your customer\'s name, a brief description of what you supplied, and the terms of payment.'],
    setup: ['Your GST/HST number in your business details.', 'HST at 13%, for Ontario. Change the tax name and rate to match where you supply: GST 5%, or HST 14% or 15%.', 'Amounts in Canadian dollars (CAD).'],
    limits: 'The template has one tax line. Where you charge GST plus a provincial tax shown separately (QST in Quebec, PST in British Columbia, Manitoba and Saskatchewan), it fits GST-only invoices; show the provincial tax on a separate invoice line or use your accounting software.',
    notRegistered: 'If you are a small supplier and not registered, do not charge GST or HST and do not show a registration number. Untick the tax option.',
    faq: [['Which rate do I charge?', 'The rate of the province or territory where the supply is made, usually where your customer is. A consultant in Alberta billing a client in Ontario usually charges 13% HST.'], ['What does a GST/HST number look like?', 'Your nine-digit business number followed by RT and four digits, for example 123456789 RT0001.'], ['Do I need to register?', 'Not until your taxable sales pass $30,000 over four consecutive calendar quarters, but you can register earlier to claim input tax credits.']],
    guide: 'gst-hst-invoice-requirements-canada',
    sources: [['Canada Revenue Agency: Input tax credits, information you need', 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/calculate-prepare-report/input-tax-credit.html'], ['Canada Revenue Agency: GST/HST rates by province', 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate/calculator.html']],
  }),
  C('south-africa-tax-invoice', {
    country: 'South Africa', title: 'Tax invoice template South Africa (free, Word, VAT)',
    h1: 'Tax invoice template for South Africa', locale: 'en-ZA', tax: 'VAT', taxNumber: 'VAT registration number',
    description: 'Free South African tax invoice template for Word: the words "Tax invoice", your VAT number, 15% VAT worked out and the details SARS lists for a full tax invoice. No sign-up.',
    intro: 'A VAT vendor in South Africa has to issue a tax invoice within 21 days, and SARS lists what it must show. This template opens set up for South Africa: titled "Tax invoice", your VAT registration number, VAT at 15% worked out, and amounts in rand.',
    lines: [['Plumbing labour (hours)', 5, 450], ['Geyser element and thermostat', 1, 1250], ['Call-out fee', 1, 350]],
    facts: [['VAT rate', '15% (the planned increases were reversed)'], ['Compulsory registration', 'Taxable supplies over R2.3 million in 12 months (from 1 April 2026; was R1 million)'], ['When to issue', 'Within 21 days of the supply'], ['Full or abridged', 'A full tax invoice above R5,000; an abridged one is allowed for R5,000 or less']],
    must: ['The words "Tax invoice", "VAT invoice" or "Invoice".', 'Your name, address and VAT registration number.', 'The recipient\'s name and address, and their VAT registration number if they are a vendor.', 'A serial number and the date of issue.', 'A description of the goods or services, noting second-hand goods.', 'The quantity or volume supplied.', 'The value of the supply, the VAT charged and the total.'],
    setup: ['The title "Tax invoice".', 'Your VAT registration number in your business details.', 'VAT at 15%, worked out on the subtotal after any discount.', 'Amounts in rand (ZAR).'],
    limits: 'VAT is applied to the whole invoice. If some items are zero-rated or exempt, invoice them separately or mark them in their description.',
    notRegistered: 'If you are not a VAT vendor, do not charge VAT, show a VAT number or call the document a tax invoice. Untick both options. You can register voluntarily once your supplies pass R120,000 in 12 months.',
    faq: [['Do I need a full tax invoice every time?', 'Only above R5,000. For R5,000 or less you may issue an abridged tax invoice, and for R50 or less a till slip showing the VAT is enough. A full invoice is valid at any amount.'], ['How long do I have to issue it?', '21 days from the date of the supply.'], ['Do I have to register for VAT?', 'You must register once your taxable supplies pass R2.3 million in 12 months (from 1 April 2026). You can register voluntarily from R120,000.']],
    sources: [['SARS: Tax invoices', 'https://www.sars.gov.za/businesses-and-employers/government/tax-invoices/'], ['SARS: Value-Added Tax', 'https://www.sars.gov.za/types-of-tax/value-added-tax/']],
  }),
];
for (const c of COUNTRIES) {
  if (!c.preset) throw new Error('countries: no tax preset for ' + c.slug);
  if (c.guide && !GUIDES.some((g) => g.slug === c.guide)) throw new Error(`countries: ${c.slug} links to unknown guide ${c.guide}`);
}

const guideTitle = (slug) => GUIDES.find((g) => g.slug === slug).title;
const example = (c) => {
  const fmt = (n) => new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.preset.currency }).format(n);
  const rows = c.lines.map(([d, q, r]) => [d, q, r, q * r]);
  const sub = rows.reduce((s, r) => s + r[3], 0);
  const rate = c.preset.answers.tax_rate, tax = Math.round(sub * rate) / 100;
  return `<div class="table-wrap" tabindex="0"><table class="compare"><caption class="small muted" style="caption-side:bottom;text-align:left;padding-top:.5rem">Example prices for illustration only. You enter your own lines and prices; the ${esc(c.preset.answers.tax_name)} and totals are worked out.</caption><thead><tr><th scope="col">Description</th><th scope="col">Qty</th><th scope="col">Unit price</th><th scope="col">Amount</th></tr></thead><tbody>
    ${rows.map(([d, q, r, a]) => `<tr><td>${esc(d)}</td><td>${q}</td><td>${fmt(r)}</td><td>${fmt(a)}</td></tr>`).join('')}
    <tr><th scope="row" colspan="3" style="text-align:right">Subtotal</th><td>${fmt(sub)}</td></tr>
    <tr><th scope="row" colspan="3" style="text-align:right">${esc(c.preset.answers.tax_name)} at ${rate}%</th><td>${fmt(tax)}</td></tr>
    <tr><th scope="row" colspan="3" style="text-align:right">Total</th><td><strong>${fmt(sub + tax)}</strong></td></tr>
  </tbody></table></div>`;
};

export const pages = COUNTRIES.map((c) => ({
  path: `invoice-templates/${c.slug}.html`, title: c.title, description: c.description,
  extraHead: faqLd(c.faq),
  body: (rel) => `<section class="section"><div class="wrap prose">
  <p class="small"><a href="${rel}invoice-templates/">Invoice templates</a></p>
  <h1>${esc(c.h1)}</h1>
  <p class="lead">${esc(c.intro)}</p>
  <div class="actions" style="display:flex;gap:.75rem;flex-wrap:wrap;margin:1.5rem 0">
    <a class="btn btn-primary btn-lg" href="${rel}app/#/start/invoice/${c.slug}">Start this invoice, free</a>
    <a class="btn btn-lg" href="${rel}samples/invoice.docx" download>Download the Word template</a>
  </div>
  <p class="small">Fill it in online and download an editable Word file. Your next invoice starts with your business details, the next number and today's date.</p>
  <p class="small muted">No sign-up. Your answers stay in your browser. Updated <time datetime="${LASTMOD}">${LASTMOD_LONG}</time></p>

  <h2 style="margin-top:2.5rem">${esc(c.country)} at a glance</h2>
  <div class="table-wrap" tabindex="0"><table class="compare"><tbody>
    ${c.facts.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('\n    ')}
  </tbody></table></div>

  <h2 style="margin-top:2.5rem">What the invoice must show</h2>
  <ul>${c.must.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
  ${c.guide ? `<p>More detail: <a href="${rel}guides/${c.guide}.html">${esc(guideTitle(c.guide))}</a>.</p>` : ''}

  <h2 style="margin-top:2.5rem">How this template is set up</h2>
  <ul>${c.setup.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
  <p>${esc(c.limits)}</p>
  <p><strong>Not registered?</strong> ${esc(c.notRegistered)}</p>

  <h2 style="margin-top:2.5rem">Example</h2>
  ${example(c)}

  <h2 style="margin-top:2.5rem">Questions</h2>
  <div class="faq">${c.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>

  <h2 style="margin-top:2.5rem">Related</h2>
  <ul>
    <li><a href="${rel}templates/credit-note.html">Credit note template</a>, to correct or cancel an invoice you have sent.</li>
    <li><a href="${rel}templates/quote.html">Price quote template</a>, for agreeing the price before the work.</li>
    <li><a href="${rel}invoice-templates/">Invoice templates by trade</a>, which start with the lines your trade usually bills.</li>
  </ul>

  <!--nav--><h2 style="margin-top:2.5rem">Invoice templates for other countries</h2>
  <ul class="link-cols">${COUNTRIES.filter((x) => x.slug !== c.slug).map((x) => `<li><a href="${rel}invoice-templates/${x.slug}.html">${esc(x.h1)}</a></li>`).join('')}</ul><!--/nav-->
  <p class="small muted" style="margin-top:2rem">Sources, checked October 2026: ${c.sources.map(([t, u]) => `<a href="${u}" rel="noopener">${esc(t)}</a>`).join('; ')}. General information, not tax advice; rates and thresholds change, so check the tax authority or an accountant for your situation.</p>
</div></section>`,
}));
