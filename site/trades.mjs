// Invoice templates by trade: one page per trade that a preset exists for (app/lib/presets.js). Each page exists because
// it does something the generic invoice page does not: the app opens the invoice with that trade's usual lines already
// in (#/start/invoice/<trade>), and the page explains what that trade in particular should put on an invoice, which
// contract to sign before the work, and how that trade usually gets paid. Example prices are labelled as examples.
import { esc, faqLd, LASTMOD, LASTMOD_LONG } from '../tools/partials.mjs';
import { PRESETS } from '../app/lib/presets.js';
import { LIB } from './library.mjs';
import { GUIDES } from './audience.mjs';
import { TOOLS } from './free-tools.mjs';
import { COUNTRIES } from './countries.mjs';

const T = (slug, o) => ({ slug, preset: PRESETS.invoice[slug], ...o });
export const TRADES = [
  T('construction-contractor', {
    name: 'Contractor', title: 'Contractor invoice template (free, Word)',
    description: 'Free contractor invoice template for Word: labour, materials, permits and change orders on separate lines, with tax and totals calculated. Fill it in online, no sign-up.',
    intro: 'A construction invoice has to show the client what they are paying for: hours on site, materials, permits and any change agreed after the contract was signed. This template starts with those lines and works out the totals.',
    who: 'General contractors, builders, renovators and subcontractors billing a homeowner, a property manager or a main contractor.',
    rates: [65, 3240, 450, 380, 1200],
    include: ['Labour and materials on separate lines. Clients and lenders often want to see them apart, and it makes markups on materials easy to explain.', 'The job site address and a short description of the work, next to the client\'s billing address, so the invoice matches the right project.', 'Each approved change order as its own line, with the change order number, so nothing looks like a surprise charge.', 'Your contractor licence number with your business details, if your licence has to appear on paperwork where you work.', 'Any amount held back as retainage until the job is signed off, and when it becomes due.'],
    paid: ['Bill in stages (deposit, rough-in, completion) rather than one invoice at the end; each stage invoice is smaller and easier to approve.', 'In the US, clients and lenders often ask for a lien waiver with each payment; say on the invoice which waiver you will provide once paid.', 'Put the payment due date on every invoice, and a late fee if your contract allows one.'],
    faq: [['Should materials be marked up on a contractor invoice?', 'Many contractors add a markup to materials to cover buying, collecting and storing them. Whatever you do, follow your contract: if it says materials are billed at cost, attach the receipts.'], ['How do I bill a change order?', 'Get the change signed first, with its price. Then add it to the next invoice as its own line, quoting the change order number. Clausery has a free change order form that works out the new contract total.'], ['Can I invoice before the job is finished?', 'Yes, if your contract has a payment schedule. Progress invoices for each stage are normal in construction and keep your cash flow steady on longer jobs.']],
    contract: 'subcontractor-agreement', also: ['change-order-form', 'quote'], guide: 'what-is-a-change-order',
  }),
  T('handyman', {
    name: 'Handyman', title: 'Handyman invoice template (free, Word)',
    description: 'Free handyman invoice template for Word: labour hours, parts, call-out charge and disposal, totals calculated for you. Fill it in online and download it, no sign-up.',
    intro: 'Handyman jobs are small and quick, so the invoice should be too: hours, parts, a call-out charge if you have one, and the total. This template starts with exactly those lines.',
    who: 'Handymen and odd-job businesses billing homeowners, landlords and small offices.',
    rates: [60, 85, 45, 30],
    include: ['The date and address of the visit, and a one-line description of each job done.', 'Hours worked at your hourly rate, or a fixed price per job if you quoted one.', 'Parts and materials you bought for the job, as a separate line.', 'Your call-out or minimum charge, if you have one, so it is clear why a 20-minute job costs what it does.'],
    paid: ['Ask for payment on completion for small jobs; card or instant transfer on the spot saves chasing.', 'For landlords and property managers, agree monthly invoicing and quote the property address on every line.', 'Keep receipts for parts in case the client asks to see them.'],
    faq: [['Should I charge by the hour or by the job?', 'Hourly is simpler for unpredictable repairs; a fixed price is easier for the client on jobs you can size up. Either way, write on the invoice which one you used.'], ['Can I charge a trip or call-out fee?', 'Yes, as long as you told the client before the visit. Put it on its own line.'], ['Do I need a contract for small jobs?', 'For one-off repairs an agreed quote is usually enough. For regular work, a simple service agreement sets your rates and payment terms once.']],
    contract: 'service-agreement', also: ['quote', 'payment-receipt'], guide: 'quote-vs-estimate-vs-invoice',
  }),
  T('cleaning', {
    name: 'Cleaning', title: 'Cleaning invoice template (free, Word)',
    description: 'Free cleaning invoice template for Word: regular visits, deep cleans, add-ons and supplies, with totals worked out. Fill it in online, no sign-up, nothing uploaded.',
    intro: 'Cleaning businesses usually bill a number of visits over a period, plus the extras. This template starts with regular visits, a deep clean, add-ons and supplies, and adds them up for you.',
    who: 'House cleaners, office cleaning companies, end-of-tenancy and Airbnb turnover cleaners.',
    rates: [120, 260, 40, 25],
    include: ['The period covered (for example the four weekly visits in March) and the dates of each visit.', 'The property address, especially if one client has several properties.', 'Add-ons such as inside the oven, windows or laundry as separate lines, so the regular price stays clear.', 'Supplies, if you charge for them; say if they are included in the visit price instead.'],
    paid: ['Recurring clients are easiest on a monthly invoice with a fixed due date.', 'Put your cancellation charge for missed or locked-out visits in your agreement, then bill it as its own line.', 'For end-of-tenancy cleans, ask for payment on completion before handing back keys.'],
    faq: [['How often should I invoice regular cleaning clients?', 'Monthly or every two weeks is common. Pick one, put it in your agreement and invoice on the same day each time.'], ['Should cleaning supplies be on the invoice?', 'Only if you charge for them separately. If your price includes supplies, a short note saying so prevents questions.'], ['What if a client cancels on the day?', 'If your agreement has a late cancellation fee, add it as a line on the next invoice with the date of the missed visit.']],
    contract: 'cleaning-services-contract', also: ['quote', 'service-agreement'],
  }),
  T('landscaping', {
    name: 'Landscaping', title: 'Landscaping and lawn care invoice template (Word)',
    description: 'Free landscaping and lawn care invoice template for Word: mowing visits, trimming, materials and green waste, totals calculated. Fill it in online, no sign-up.',
    intro: 'Lawn care is billed by the visit and landscaping by the job plus materials. This template starts with mowing visits, trimming, supplied materials and green waste removal, and works out the total.',
    who: 'Lawn care and garden maintenance businesses, landscapers and tree and hedge services.',
    rates: [45, 120, 180, 60],
    include: ['The visits covered, with their dates, for regular mowing and maintenance.', 'Materials you supplied (mulch, soil, plants, gravel) as separate lines, with quantities.', 'Waste removal and tipping charges on their own line.', 'The property address, if it differs from the billing address.'],
    paid: ['Seasonal contracts are often billed monthly at a flat rate; one-off landscaping jobs with a deposit up front and the balance on completion.', 'Ask for a deposit before buying plants or hard materials for a bigger job.', 'Note the next scheduled visit on the invoice; it doubles as a reminder.'],
    faq: [['Should I invoice per visit or monthly?', 'Monthly invoices listing each visit are easier for regular clients. One invoice per visit suits occasional work.'], ['How do I bill materials for a landscaping job?', 'List each material with its quantity. If you mark materials up, make sure your quote or agreement said so.'], ['Can I take a deposit?', 'Yes. For larger jobs a deposit before you order materials is common. Show it on the final invoice as an amount already paid.']],
    contract: 'service-agreement', also: ['quote', 'equipment-rental-agreement'],
  }),
  T('photography', {
    name: 'Photography', title: 'Photography invoice template (free, Word)',
    description: 'Free photography invoice template for Word: session fee, edited images, usage licence, prints and travel, totals calculated. Fill it in online and download it, no sign-up.',
    intro: 'A photography invoice sells more than time: it covers the session, the edited images, the rights to use them and any prints or travel. This template starts with those lines and does the maths.',
    who: 'Wedding, portrait, product, event and commercial photographers.',
    rates: [150, 12, 400, 220, 90],
    include: ['The shoot date, location and type of session.', 'How many edited images you are delivering, and how (gallery link, download).', 'The usage licence: personal, editorial or commercial, and for how long. It is often the largest line for commercial work.', 'Any retainer or deposit already paid, shown as an amount paid so the balance due is right.'],
    paid: ['Take a non-refundable retainer to book the date, and invoice the balance before or on delivery of the gallery.', 'Deliver full-resolution images once the invoice is paid; send proofs or watermarked previews before that.', 'Whether sales tax applies to photography depends on where you work; check your local rules.'],
    faq: [['Should usage rights be on a photography invoice?', 'Yes, for commercial work. Naming the licence on the invoice (who may use the images, where and for how long) avoids disputes later.'], ['How do I show a retainer that was already paid?', 'Turn on "The client has already paid part of it" in Clausery and enter the retainer. The invoice shows it and works out the balance due.'], ['Do I need a model release as well?', 'If people in the photos are identifiable and the images will be used commercially, usually yes. Clausery has a free photo and model release.']],
    contract: 'photography-contract', also: ['photo-release-form', 'quote'], guide: 'do-i-need-a-model-release',
  }),
  T('videography', {
    name: 'Video production', title: 'Video production invoice template (free, Word)',
    description: 'Free video production invoice template for Word: shoot days, editing hours, revisions, music licences and crew, totals calculated. Fill it in online, no sign-up.',
    intro: 'Video jobs are billed in days and hours with licences on top. This template starts with a shoot day, editing time, extra revisions, music and crew, and adds them up.',
    who: 'Videographers, wedding filmmakers and small production companies.',
    rates: [1200, 75, 150, 60, 450],
    include: ['Shoot days and editing hours on separate lines.', 'Revisions beyond the rounds included in your quote, so extra work is visible and expected.', 'Licences you paid for (music, stock footage), which the client may need for their records.', 'Delivery details: formats, resolution and the delivery date.'],
    paid: ['Bill a deposit to book the shoot, then the balance on delivery of the final cut.', 'Hold back final masters until the invoice is paid; send watermarked review copies before that.', 'Write the number of included revision rounds in your contract and point to it when billing extras.'],
    faq: [['How do I bill extra revisions?', 'Your contract should say how many rounds are included. Bill each extra round, or the hours it took, as its own line.'], ['Should music licences be passed on to the client?', 'If you licensed the music for their project, list it so they can see what it covers. Some producers include it in the package price instead.'], ['Can I invoice for travel days?', 'Yes, if your quote or contract says so. A reduced day rate for travel is common.']],
    contract: 'video-production-contract', also: ['quote', 'photo-release-form'],
  }),
  T('graphic-design', {
    name: 'Graphic design', title: 'Graphic design invoice template (free, Word)',
    description: 'Free graphic design invoice template for Word: project fee, extra revisions, source files and stock licences, totals calculated. Fill it in online and download it, no sign-up.',
    intro: 'Design work is usually priced per project, with extra revision rounds and files on top. This template starts with a project fee, an extra round, source files and stock licences.',
    who: 'Freelance graphic designers, illustrators and small studios.',
    rates: [1800, 150, 250, 45],
    include: ['The project name and the deliverables, matching your quote.', 'Extra revision rounds beyond those agreed, each on its own line.', 'Source files, if you charge separately for them or for transferring copyright.', 'Stock images or fonts you licensed for the client.'],
    paid: ['A 50% deposit before you start and the balance before final files is a common split for design projects.', 'Transfer copyright or release source files when the final invoice is paid, and say so in your contract.', 'If a client cancels mid-project, a kill fee in your contract covers the work already done.'],
    faq: [['When should a designer send the final invoice?', 'When the final designs are approved, and before you send the final files. Payment first, files second keeps things simple.'], ['Should I charge for source files?', 'Many designers do, or include them only in a higher package. Whatever you choose, write it in the contract and show it on the invoice.'], ['What is a kill fee?', 'A fee paid if the client cancels the project partway through, so you are paid for the work done. Clausery has a guide to kill fees.']],
    contract: 'graphic-design-contract', also: ['quote', 'statement-of-work'], guide: 'what-is-a-kill-fee', tool: 'freelance-rate',
  }),
  T('web-design', {
    name: 'Web design', title: 'Web design invoice template (free, Word)',
    description: 'Free web design and development invoice template for Word: milestones, development hours, content and hosting, totals calculated. Fill it in online, no sign-up.',
    intro: 'Website projects are billed by milestone, with hours, content work and ongoing hosting on top. This template starts with a design milestone, development hours, content upload and a hosting plan.',
    who: 'Freelance web designers and developers and small web agencies.',
    rates: [1500, 85, 40, 35],
    include: ['The milestone you are billing (design approved, site launched) and what it covered.', 'Development or support hours at your hourly rate, with the period they cover.', 'Recurring hosting or maintenance, with the months it covers.', 'Third-party costs you paid on the client\'s behalf (themes, plugins, domains), as separate lines.'],
    paid: ['Split the project into milestones with a payment at each; it keeps the project moving and limits your risk.', 'Hand over admin access and the domain when the final invoice is paid, as your contract says.', 'Bill hosting and maintenance in advance, monthly or yearly.'],
    faq: [['How should I structure invoices for a website project?', 'A deposit to start, then one invoice per milestone (design approved, development done, launch). Each invoice names its milestone.'], ['Should hosting be on the same invoice as the build?', 'It can be, but separate recurring invoices for hosting and maintenance are easier to track and renew.'], ['How do I invoice hourly support work?', 'List the hours and the period, for example "Support, 1 to 31 March: 6 hours", at your hourly rate.']],
    contract: 'web-design-contract', also: ['statement-of-work', 'quote'], guide: 'what-to-include-in-a-statement-of-work', tool: 'freelance-rate',
  }),
  T('consulting', {
    name: 'Consulting', title: 'Consulting invoice template (free, Word)',
    description: 'Free consulting invoice template for Word: hours or day rate, workshops, retainer and expenses at cost, totals calculated. Fill it in online and download it, no sign-up.',
    intro: 'Consultants bill time, retainers and expenses, and clients want to match each to the engagement. This template starts with consulting hours, a workshop day, a monthly retainer and expenses at cost.',
    who: 'Independent consultants, advisers and small consultancies.',
    rates: [150, 1800, 2500, 340],
    include: ['The engagement or project name and the client\'s purchase order number, if they gave you one.', 'Hours or days worked in the period, at the rate in your agreement.', 'The retainer for the month, if you work on one, separately from any extra hours.', 'Expenses at cost with receipts attached, if your agreement allows them.'],
    paid: ['Monthly invoices in arrears for hourly work, or in advance for retainers, are the norm.', 'Larger clients pay faster when the invoice quotes their purchase order number and goes to accounts payable, not your contact.', 'Payment terms of 14 to 30 days are typical; write yours on every invoice.'],
    faq: [['Should a consulting invoice list every hour?', 'A summary by week or by task is usually enough, with a detailed timesheet attached if the client asks for one.'], ['How do I bill expenses?', 'At cost, with receipts, unless your agreement allows a markup. List them as their own lines.'], ['What is the difference between a retainer and hourly billing?', 'A retainer is a fixed monthly fee for agreed availability or work; hours beyond it are billed separately. Clausery has a free retainer agreement.']],
    contract: 'consulting-agreement', also: ['retainer-agreement', 'statement-of-work'], tool: 'freelance-rate',
  }),
  T('freelance-writing', {
    name: 'Freelance writing', title: 'Freelance writing invoice template (free, Word)',
    description: 'Free freelance writer invoice template for Word: articles, rush fees, research time and kill fees, totals calculated. Fill it in online, no sign-up, nothing uploaded.',
    intro: 'Writers bill per piece or per word, with research, rush delivery and the occasional kill fee on top. This template starts with those lines and adds them up.',
    who: 'Freelance writers, copywriters, journalists and editors.',
    rates: [450, 100, 60, 150],
    include: ['The title or working title of each piece, with its word count and the publication or client.', 'Rush fees and extra research or interview time as separate lines.', 'A kill fee, if a commissioned piece was cancelled, with the original commission date.', 'The editor\'s name or purchase order number, so accounts can match it.'],
    paid: ['Invoice on acceptance of the piece, not on publication, unless your contract says otherwise.', 'Publications often pay on fixed schedules; ask when their payment run is and invoice before it.', 'Keep a list of what each client owes; small invoices are easy to forget on both sides.'],
    faq: [['Should I invoice on acceptance or publication?', 'Acceptance is better for you, since publication dates slip. Agree it in your contract and put the acceptance date on the invoice.'], ['How do I invoice a kill fee?', 'As its own line naming the cancelled piece, at the percentage your contract sets. Clausery has a guide to kill fees.'], ['Do I charge per word or per piece?', 'Either works; per piece is easier to invoice. If you charge per word, show the final word count.']],
    contract: 'freelance-writing-contract', also: ['independent-contractor-agreement', 'quote'], guide: 'what-is-a-kill-fee', tool: 'freelance-rate',
  }),
  T('tutoring', {
    name: 'Tutoring', title: 'Tutoring invoice template (free, Word)',
    description: 'Free tutoring invoice template for Word: sessions, exam prep packs and late cancellations, totals worked out. Fill it in online and download it, no sign-up.',
    intro: 'Tutoring is billed by the session or as a package paid in advance. This template starts with sessions, an exam preparation pack and a late cancellation line.',
    who: 'Private tutors and small tutoring businesses billing parents or adult students.',
    rates: [50, 80, 25],
    include: ['The student\'s name and subject, especially when one parent pays for several children.', 'The dates of the sessions covered.', 'Packages paid in advance, and how many sessions are left.', 'Late cancellations or no-shows, if your agreement charges for them.'],
    paid: ['Monthly invoices or session packages paid up front reduce chasing.', 'State your cancellation notice period in your tutoring agreement and on the invoice.', 'Send a payment receipt when parents need one for their records.'],
    faq: [['Should I invoice parents monthly or per session?', 'Monthly, listing each session, is easiest for regular students. Packages paid in advance work well before exams.'], ['Can I charge for late cancellations?', 'If your agreement says so. Add the missed session as its own line with its date.'], ['Do parents need a receipt?', 'Some do, for their records or employer schemes. Clausery has a free payment receipt that writes the amount in words.']],
    contract: 'tutoring-agreement', also: ['payment-receipt'],
  }),
  T('personal-training', {
    name: 'Personal training', title: 'Personal training invoice template (free, Word)',
    description: 'Free personal trainer invoice template for Word: sessions, training plans and missed sessions, totals calculated. Fill it in online, no sign-up.',
    intro: 'Personal trainers sell sessions, packages and plans. This template starts with training sessions, a training and nutrition plan and a missed-session line.',
    who: 'Personal trainers, coaches and small studios billing clients directly.',
    rates: [60, 120, 30],
    include: ['The sessions covered with their dates, or the package and how many sessions remain.', 'Plans or programmes you wrote as separate lines.', 'Missed sessions charged under your cancellation policy.', 'The client\'s name as it should appear for any reimbursement claim.'],
    paid: ['Packages paid in advance are the norm and avoid chasing single sessions.', 'Write your cancellation notice period in your training agreement and apply it consistently.', 'Some clients claim training costs through work or insurance schemes; a clear invoice and receipt helps them.'],
    faq: [['Should I sell packages or single sessions?', 'Packages paid up front are easier to manage and commit the client. Invoice the package, then track sessions used.'], ['Can I charge for a missed session?', 'If your agreement has a cancellation policy, yes. Bill it with the date of the missed session.'], ['Do I need a waiver?', 'Many trainers have new clients sign a liability waiver and health questionnaire. Clausery has a free liability waiver template.']],
    contract: 'personal-training-agreement', also: ['liability-waiver', 'payment-receipt'], guide: 'are-liability-waivers-enforceable',
  }),
];
for (const t of TRADES) {
  if (!t.preset) throw new Error('trades: no preset for ' + t.slug);
  if (t.rates.length !== t.preset.lines.length) throw new Error('trades: one example rate per line for ' + t.slug);
  for (const s of [t.contract, ...t.also]) if (!LIB.some((x) => x.slug === s)) throw new Error(`trades: ${t.slug} links to unknown template ${s}`);
  if (t.guide && !GUIDES.some((g) => g.slug === t.guide)) throw new Error(`trades: ${t.slug} links to unknown guide ${t.guide}`);
  if (t.tool && !TOOLS.some((x) => x.slug === t.tool)) throw new Error(`trades: ${t.slug} links to unknown tool ${t.tool}`);
}

const money = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const libName = (slug) => LIB.find((x) => x.slug === slug).name;
const guideTitle = (slug) => GUIDES.find((g) => g.slug === slug).title;
const toolName = (slug) => TOOLS.find((x) => x.slug === slug).name;
const example = (t) => {
  const rows = t.preset.lines.map(([d, q], i) => [d, q, t.rates[i], q * t.rates[i]]);
  const total = rows.reduce((s, r) => s + r[3], 0);
  return `<div class="table-wrap" tabindex="0"><table class="compare"><caption class="small muted" style="caption-side:bottom;text-align:left;padding-top:.5rem">Example prices for illustration only. In Clausery the lines start with their quantities and you enter your own prices; tax and totals are added for you.</caption><thead><tr><th scope="col">Description</th><th scope="col">Qty</th><th scope="col">Unit price</th><th scope="col">Amount</th></tr></thead><tbody>
    ${rows.map(([d, q, r, a]) => `<tr><td>${esc(d)}</td><td>${q}</td><td>${money(r)}</td><td>${money(a)}</td></tr>`).join('')}
    <tr><th scope="row" colspan="3" style="text-align:right">Subtotal</th><td><strong>${money(total)}</strong></td></tr>
  </tbody></table></div>`;
};

export const pages = [
  {
    path: 'invoice-templates/', title: 'Invoice templates by trade and country (free, Word)',
    description: `Free Word invoice templates for ${TRADES.length} trades and ${COUNTRIES.length} countries' VAT and GST rules. Each starts with the right lines or tax set-up and adds up totals and tax for you.`,
    body: (rel) => `<section class="section"><div class="wrap">
  <h1>Invoice templates by trade and country</h1>
  <p class="lead">Pick your trade and the invoice opens with the lines that trade usually bills, ready for your prices. Pick your country and it opens with the right tax, rate and tax number. Totals and tax are worked out for you, your next invoice remembers your details and number, and you download an editable Word file. Free, no sign-up, nothing uploaded.</p>
  <h2 style="margin-top:2rem">By trade</h2>
  <div class="grid grid-3" style="margin-top:1.5rem">
    ${TRADES.map((t) => `<a class="feature" style="text-decoration:none;color:inherit" href="${rel}invoice-templates/${t.slug}.html"><h3>${esc(t.title.replace(/ \(free, Word\)| template \(Word\)/, '').replace(/ template$/, ''))}</h3><p>${esc(t.preset.lines.slice(0, 3).map(([d]) => d.replace(/ \(.*\)$/, '')).join(', '))}</p></a>`).join('\n    ')}
  </div>
  <h2 style="margin-top:2.5rem">By country: VAT, GST and HST</h2>
  <div class="grid grid-3" style="margin-top:1rem">
    ${COUNTRIES.map((c) => `<a class="feature" style="text-decoration:none;color:inherit" href="${rel}invoice-templates/${c.slug}.html"><h3>${esc(c.h1.replace(/ template( for)?/, ''))}</h3><p>${esc(c.preset.answers.tax_name)} at ${c.preset.answers.tax_rate}%, your ${esc(c.preset.answers.tax_registration_label)}, amounts in ${esc(c.preset.currency)}</p></a>`).join('\n    ')}
  </div>
  <h2 style="margin-top:2.5rem">Not listed?</h2>
  <p>Start from the general <a href="${rel}templates/invoice.html">invoice template</a> and add your own lines. For quotes before the work, use the <a href="${rel}templates/quote.html">price quote template</a>; for payments received, the <a href="${rel}templates/payment-receipt.html">payment receipt</a>.</p>
  <h2 style="margin-top:2.5rem">Tax and payment details</h2>
  <ul>
    <li><a href="${rel}guides/what-to-include-on-a-vat-invoice.html">${esc(guideTitle('what-to-include-on-a-vat-invoice'))}</a></li>
    <li><a href="${rel}guides/gst-hst-invoice-requirements-canada.html">${esc(guideTitle('gst-hst-invoice-requirements-canada'))}</a></li>
    <li><a href="${rel}guides/tax-invoice-requirements-australia.html">${esc(guideTitle('tax-invoice-requirements-australia'))}</a></li>
    <li><a href="${rel}guides/what-bank-details-to-put-on-an-invoice.html">${esc(guideTitle('what-bank-details-to-put-on-an-invoice'))}</a></li>
    <li><a href="${rel}guides/how-to-write-an-invoice.html">${esc(guideTitle('how-to-write-an-invoice'))}</a></li>
  </ul>
</div></section>`,
  },
  ...TRADES.map((t) => ({
    path: `invoice-templates/${t.slug}.html`, title: t.title, description: t.description,
    extraHead: faqLd(t.faq),
    body: (rel) => `<section class="section"><div class="wrap prose">
  <p class="small"><a href="${rel}invoice-templates/">Invoice templates by trade</a></p>
  <h1>${esc(t.title.replace(/ \(free, Word\)| \(Word\)/, ''))}</h1>
  <p class="lead">${esc(t.intro)}</p>
  <div class="actions" style="display:flex;gap:.75rem;flex-wrap:wrap;margin:1.5rem 0">
    <a class="btn btn-primary btn-lg" href="${rel}app/#/start/invoice/${t.slug}">Start this invoice, free</a>
    <a class="btn btn-lg" href="${rel}samples/invoice.docx" download>Download the Word template</a>
  </div>
  <p class="small">Opens with the lines below already in. Add your prices; the subtotal, tax and total are calculated, and your next invoice starts with your business details and the next number.</p>
  <p class="small muted">No sign-up. Your answers stay in your browser. <strong>Who it is for:</strong> ${esc(t.who)} · Updated <time datetime="${LASTMOD}">${LASTMOD_LONG}</time></p>

  <h2 style="margin-top:2.5rem">Example: a ${esc(t.name.toLowerCase())} invoice</h2>
  ${example(t)}

  <h2 style="margin-top:2.5rem">What to put on a ${esc(t.name.toLowerCase())} invoice</h2>
  <p>Every invoice needs your details, the client's, an invoice number, the date, what you charged and when payment is due (see <a href="${rel}guides/how-to-write-an-invoice.html">how to write an invoice</a>). For ${esc(t.name.toLowerCase())} work, also:</p>
  <ul>${t.include.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>

  <h2 style="margin-top:2.5rem">Getting paid</h2>
  <ul>${t.paid.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>

  <h2 style="margin-top:2.5rem">Before the work: the paperwork</h2>
  <p>An invoice is easier to get paid when it points back to something the client signed. Use the free <a href="${rel}templates/${t.contract}.html">${esc(libName(t.contract).toLowerCase())}</a> to agree the price, scope and payment terms first${t.also.length ? `, and ${t.also.map((s) => `the <a href="${rel}templates/${s}.html">${esc(libName(s).toLowerCase())}</a>`).join(' or ')} when you need ${t.also.length > 1 ? 'them' : 'it'}` : ''}.</p>
  ${t.guide ? `<p><strong>Guide:</strong> <a href="${rel}guides/${t.guide}.html">${esc(guideTitle(t.guide))}</a></p>` : ''}${t.tool ? `<p><strong>Free tool:</strong> <a href="${rel}free-tools/${t.tool}.html">${esc(toolName(t.tool))}</a>, to work out what to charge.</p>` : ''}

  <h2 style="margin-top:2.5rem">Questions</h2>
  <div class="faq">${t.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>

  <!--nav--><h2 style="margin-top:2.5rem">Invoice templates for other trades</h2>
  <ul class="link-cols">${TRADES.filter((x) => x.slug !== t.slug).map((x) => `<li><a href="${rel}invoice-templates/${x.slug}.html">${esc(x.title.replace(/ \(free, Word\)| \(Word\)/, ''))}</a></li>`).join('')}</ul><!--/nav-->
  <p class="small muted" style="margin-top:2rem">General information, not legal or tax advice. Rules on what an invoice must show vary by country and trade; check yours.</p>
</div></section>`,
  })),
];
