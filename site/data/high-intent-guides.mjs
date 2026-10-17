// Companion guides for four frequently used templates. Kept as data so the audience module supplies the same
// Article/FAQ metadata, topic navigation, publication dates and feed entries as the rest of the guide library.
export const HIGH_INTENT_GUIDES = [
  {
    slug: 'how-to-write-an-independent-contractor-agreement',
    title: 'How to write an independent contractor agreement',
    description: 'What an independent contractor agreement should include: scope, fees, ownership, status and termination, with sample wording and a free Word template.',
    published: '2026-10-17',
    sources: [
      ['IRS: independent contractor or employee?', 'https://www.irs.gov/businesses/small-businesses-self-employed/independent-contractor-self-employed-or-employee'],
      ['US Department of Labor: employee misclassification', 'https://www.dol.gov/agencies/whd/flsa/misclassification'],
    ],
    faq: [
      ['Does signing a contractor agreement make someone self-employed?', 'No. Classification depends on the actual relationship and the legal test that applies, not just the contract label. Tax, employment and local rules can use different tests. Get advice if the person will work like an employee.'],
      ['Can an independent contractor agreement cover several projects?', 'Yes. Use a master agreement for recurring terms and a signed statement of work for each project, with its own deliverables, dates and fees. Say which document controls if they conflict.'],
      ['Who owns work made by an independent contractor?', 'Do not assume that paying the invoice transfers copyright. State what is assigned or licensed, when that happens, and what tools, pre-existing material and third-party rights are excluded. Local law may require particular wording.'],
    ],
    body: (rel) => `
<p class="lead">An independent contractor agreement records the deal between a client and a self-employed service provider: the work, the price, the timetable, ownership and how the relationship ends. Write those decisions down before work starts. A clear agreement reduces disputes, but it cannot turn an employee into a contractor simply by calling them one.</p>
<h2>1. Identify the parties and check the relationship</h2>
<p>Use each party's legal name, business address and contact details. If the contractor operates through a company, name that company rather than only the individual doing the work. Record who may approve deliverables, changes and invoices for the client.</p>
<p>Then check whether contracting is appropriate. Control over how work is performed, independence and the practical working arrangement can matter. The US tax and wage-law sources below explain different tests; other countries have their own. Do not copy a status declaration into an arrangement that actually functions as employment.</p>
<h2>2. Define the work and the acceptance process</h2>
<p>Describe deliverables rather than saying only “consulting services.” List the format, quantity, milestones, assumptions and exclusions. Identify any client inputs, such as access, product information or approvals, and what happens if they arrive late. For a detailed project, attach a <a href="${rel}templates/statement-of-work.html">statement of work</a> and give it a version and date.</p>
<pre><code>The Contractor will deliver a five-page website design in the agreed design-file format,
including two consolidated revision rounds. Copywriting, hosting and ongoing maintenance
are excluded. The Client will provide final copy and brand assets by [date]. Additional
work requires written agreement on the scope, fee and revised delivery date.</code></pre>
<p>Set a reasonable review period and a way to report defects against the agreed specification. Distinguish correcting an error from requesting a new feature. The <a href="${rel}guides/what-to-include-in-a-statement-of-work.html">statement-of-work checklist</a> helps make acceptance measurable.</p>
<h2>3. Make fees and payment dates unambiguous</h2>
<p>Choose a fixed fee, hourly rate or retainer. State the currency, deposit, invoice schedule and due date, and whether taxes and expenses are included. If expenses need approval, set the approval method and any cap. Never leave “payment on completion” undefined when completion depends on somebody answering an email.</p>
<p>For example, a USD 2,400 project might require USD 800 before the start and USD 1,600 after the agreed final milestone, payable within 14 days of the invoice. That is an illustration, not a recommended rate. Use the <a href="${rel}clauses/payment-terms-clause.html">payment terms clause</a> to consider disputes, overdue sums and lawful late charges.</p>
<h2>4. Describe independence without making false promises</h2>
<p>A contractor may control their methods and supply their own equipment, subject to agreed results, lawful site rules and necessary security requirements. Say whether subcontracting needs consent and whether the contractor can bind the client to purchases or other commitments. Do not promise benefits or impose employee-style supervision by accident.</p>
<p>The <a href="${rel}clauses/independent-contractor-clause.html">independent contractor clause</a> explains the limits of status wording. A clause allocating tax responsibilities does not remove withholding, reporting or other duties that the law puts on the client. Review the written terms alongside what both sides will actually do.</p>
<h2>5. Decide ownership and confidentiality separately</h2>
<p>Specify which deliverables the client receives and whether ownership transfers or a licence is granted. State when the transfer takes effect, such as after full payment where lawful. Reserve the contractor's pre-existing tools, methods and reusable material, while giving the client the rights needed to use the finished work.</p>
<p>Third-party fonts, stock photographs and software may have separate licence terms. Identify those limits rather than promising ownership of everything. The <a href="${rel}clauses/intellectual-property-clause.html">intellectual property clause</a> covers the main choices. Confidentiality should define protected information, permitted use, reasonable safeguards and exceptions, including disclosures required by law; it should not become an unlimited ban on the contractor's future work.</p>
<h2>6. Agree how the project can end</h2>
<p>State the start date, any end date, notice method and termination rights. Separate ending for convenience from ending for a serious breach, and decide whether a breach can be corrected first. Explain what is payable for completed work and approved commitments, and what happens to an unused advance.</p>
<pre><code>Either party may end the engagement on [number] days' written notice. On termination,
the Client will pay for work properly performed up to the end date and approved,
non-cancellable expenses. The Contractor will provide the agreed paid-for work in progress
and return or delete confidential information, subject to lawful record-retention duties.</code></pre>
<p>This is sample wording to adapt, not a complete termination regime. Address access removal, handover and clauses that continue after termination. Read the <a href="${rel}guides/how-to-terminate-a-contract.html">contract termination guide</a> before sending a notice under an existing agreement.</p>
<h2>7. Review risk, signing and the final document</h2>
<p>Check warranties, insurance, liability limits, indemnities, governing law and dispute resolution against the actual risk and local law. A small design job should not quietly carry an unlimited guarantee for the client's entire business. Obtain appropriate professional advice for regulated services, sensitive data or substantial potential losses.</p>
<ul>
  <li>Make sure every attachment is named, dated and consistent with the main agreement.</li>
  <li>Remove contradictory terms copied from an employment contract or another project.</li>
  <li>Confirm that the signers have authority and that any required formalities are met.</li>
  <li>Keep the signed version, approved changes, invoices and acceptance messages together.</li>
</ul>
<p>Start with the free <a href="${rel}templates/independent-contractor-agreement.html">independent contractor agreement template</a>, download it for Word or answer its questions in your browser. Check the result before signing. The <a href="${rel}guides/how-to-write-a-freelance-contract.html">freelance contract guide</a> adds practical points about revisions and cancellation for creative projects.</p>
<p class="small muted">General information and sample wording, not legal or tax advice. Classification and contract rules vary by jurisdiction.</p>`,
  },
  {
    slug: 'how-to-write-a-promissory-note',
    title: 'How to write a promissory note',
    description: 'How to write a promissory note: borrower, lender, principal, interest, repayment dates and signatures, with an example and a free editable Word template.',
    published: '2026-10-17',
    sources: [
      ['IRS: applicable federal rates', 'https://www.irs.gov/applicable-federal-rates'],
      ['Cornell Legal Information Institute: UCC 3-104, negotiable instruments', 'https://www.law.cornell.edu/ucc/3/3-104'],
    ],
    faq: [
      ['Is a handwritten promissory note valid?', 'It may be, if it contains the required terms, is properly signed and meets local formalities. Typing it makes names, amounts and dates easier to read, but printing a template does not by itself make the note enforceable.'],
      ['Does a promissory note need a witness or notary?', 'Requirements depend on the jurisdiction, the transaction and whether security is involved. A notary is not a substitute for lawful terms. Check the applicable requirements before the borrower signs or money changes hands.'],
      ['Can a promissory note be interest-free?', 'Sometimes, but an interest-free loan can still have tax consequences, particularly between family members. Check tax rules and any applicable minimum-interest rules separately from the maximum rate that lending law permits.'],
    ],
    body: (rel) => `
<p class="lead">A promissory note is a written promise to repay a debt. It should identify the borrower and lender, the amount advanced, any interest, the repayment schedule and the borrower's signature. Start with the actual arrangement, not a complicated form: a stranger should be able to read the note and work out what is owed and when.</p>
<h2>Choose the right document first</h2>
<p>A note suits a straightforward promise to pay. A <a href="${rel}templates/loan-agreement.html">loan agreement</a> can cover a wider set of mutual obligations, conditions, guarantees and security arrangements. The title is not decisive, and a short note is not automatically suitable for a regulated loan or a transaction involving a home.</p>
<p>If the money is genuinely a gift, do not disguise it as a loan. If it is a loan to someone close to you, discuss affordability and missed payments openly before drafting. The <a href="${rel}guides/how-to-lend-money-to-family.html">guide to lending money to family</a> deals with those relationship and tax questions.</p>
<h2>Record names, principal and the advance</h2>
<p>Give the full legal names and addresses of the borrower and lender. Where a business borrows, identify the legal entity and the signer's capacity. Do not make an individual a guarantor merely by putting their name beside the company without understanding the effect.</p>
<p>State the principal in a named currency, the date of the advance and how the money is provided. A note signed before funding should not falsely acknowledge receipt of money that has not arrived. Keep the bank-transfer record or other evidence of the actual advance with the signed document. Avoid unnecessary account numbers in copies that will circulate.</p>
<h2>Write a schedule that adds up</h2>
<p>Choose one repayment method: a single payment on a date, specified instalments, or another clearly defined arrangement. Say when the first payment is due, how frequently payments follow and when the balance must be cleared. “Pay me when you can” is not a useful schedule.</p>
<p>For an interest-free USD 3,000 loan repaid in six equal monthly instalments, each instalment is USD 500. The example below starts on 1 November 2026 and ends on 1 April 2027. The dates are illustrations, not a reason to backdate a real note.</p>
<div class="table-wrap" tabindex="0"><table class="compare"><thead><tr><th scope="col">Item</th><th scope="col">Example term</th></tr></thead><tbody>
<tr><th scope="row">Principal</th><td>USD 3,000</td></tr>
<tr><th scope="row">Interest</th><td>0% contractual interest, subject to tax review</td></tr>
<tr><th scope="row">Instalments</th><td>Six payments of USD 500</td></tr>
<tr><th scope="row">Due dates</th><td>First day of each month, November 2026 to April 2027</td></tr>
<tr><th scope="row">Early repayment</th><td>Allowed without a contractual penalty</td></tr>
</tbody></table></div>
<p>For an interest-bearing loan, use the <a href="${rel}free-tools/loan-repayment.html">loan repayment calculator</a> to check the instalments, total interest and final balance. The arithmetic is not a check of legal lending limits.</p>
<h2>Explain interest and charges precisely</h2>
<p>If interest is charged, state the annual rate, whether it is simple or compounded, the calculation basis and when it begins. Do not write “5% interest” without saying whether that is annual or a flat charge for the whole term. Describe how a payment is allocated between interest, principal and any lawful charges.</p>
<p>Maximum rates, fees and consumer-credit disclosures differ by location. An agreed rate can still be unlawful. Separately, a below-market family loan may have tax consequences: the IRS publishes applicable federal rates for US tax purposes. Those rates are not a universal permission to lend, and tax advice may be needed even for a zero-interest note.</p>
<h2>Decide what happens after a missed payment</h2>
<p>Set out the due date, any grace period and the notice process. If the lender may demand the entire unpaid balance after default, say when that right arises and whether the borrower gets time to put matters right. Do not assume that missing one payment automatically makes every future payment due.</p>
<p>Keep penalties proportionate and lawful. Collection costs, default interest and acceleration can be restricted by local law. For a first missed payment, a <a href="${rel}templates/payment-reminder-letter.html">payment reminder letter</a> can record the amount and invite contact without inventing charges. Agree any changed payment schedule in writing and keep it with the original note.</p>
<h2>Sample repayment wording</h2>
<pre><code>For value received, [Borrower] promises to pay [Lender] the principal sum of
USD 3,000. No contractual interest is charged. The Borrower will pay six monthly
instalments of USD 500, due on the first day of each month from 1 November 2026
through 1 April 2027. Payments will be made by [agreed method]. The Borrower may
repay all or part of the outstanding principal early without a contractual penalty.</code></pre>
<p>This paragraph is only an example of the payment promise. Add the correct parties, advance details, notice terms, governing law and signing requirements. Do not use the illustrative zero rate without considering tax rules and the actual bargain.</p>
<h2>Do not treat security as a checkbox</h2>
<p>A secured note needs more than a sentence saying “secured by my car.” Identify the asset, ownership and any existing security, and obtain advice about the separate documents, registration or other steps needed to create and protect the security interest. Property lending, guarantees and consumer lending deserve specialist review.</p>
<p>Likewise, do not assume every promissory note is a negotiable instrument that can be transferred in the same way. The UCC source below describes one US framework; the wording and applicable law matter. Check transfer restrictions and who may enforce the debt before using an unfamiliar form.</p>
<h2>Sign, fund and keep a payment record</h2>
<p>Use the real signing date and meet any required witness or notarisation rules. Give both sides a complete copy. Keep a ledger of the advance, payments, interest and remaining principal, supported by receipts or transfer records. Mark the debt paid when it is discharged and retain evidence of any release of security.</p>
<p>The free <a href="${rel}templates/promissory-note.html">promissory note template</a> provides a Word starting point you can download or fill in locally. Review every answer and have important loans checked before signing.</p>
<p class="small muted">General drafting information, not legal, lending or tax advice. Requirements vary by jurisdiction and transaction.</p>`,
  },
  {
    slug: 'how-to-write-a-sublease-agreement',
    title: 'How to write a sublease agreement',
    description: 'Write a sublease agreement covering consent, the original lease, rent, deposit, shared space and move-out, with sample wording and a free Word template.',
    published: '2026-10-17',
    sources: [
      ['GOV.UK: private renting tenancy agreements', 'https://www.gov.uk/private-renting-tenancy-agreements'],
      ['US EPA: lead-based paint real estate disclosure', 'https://www.epa.gov/lead/protect-your-family-lead-your-home-real-estate-disclosure'],
    ],
    faq: [
      ['Does a sublease release the original tenant from the lease?', 'Usually not by itself. The original tenant can remain responsible to the landlord for rent and damage. A release or replacement arrangement needs the appropriate agreement and must comply with local law.'],
      ['Can I sublet without the landlord’s permission?', 'Check the original lease and local law before offering the space. Consent may be required, and some arrangements may be prohibited or regulated. A sublease signed by two occupants does not override those rules.'],
      ['Is a sublease the same as a roommate agreement?', 'No. A sublease grants occupancy through an existing tenant. A roommate agreement mainly divides household responsibilities between occupants; it does not by itself give permission to sublet or change the landlord’s rights.'],
    ],
    body: (rel) => `
<p class="lead">A sublease agreement lets an existing tenant rent all or part of a home to another person while the original lease remains in place. It should explain permission, the space, dates, rent, deposit and household responsibilities. Before discussing wording, check whether the lease and local law allow the arrangement at all.</p>
<h2>Understand who is making which agreement</h2>
<p>The original tenant is often called the sublessor; the incoming occupant is the subtenant or sublessee. The landlord is a separate party to the original lease. Use each person's full legal name and identify the original lease by its parties, property and date so the documents cannot be confused.</p>
<p>A sublease is different from an assignment, where a tenant transfers their lease position, and from a <a href="${rel}templates/roommate-agreement.html">roommate agreement</a> between household members. Labels do not settle the legal classification. A person who stays in the home and lets a room may face different rules from someone who sublets the whole property.</p>
<h2>Get consent and check the original lease</h2>
<p>Read the lease, amendments and building rules before advertising. Check consent requirements, occupancy limits, permitted use, guest rules, insurance and any restriction on short stays. Local tenancy, licensing, rent-control or housing rules may add requirements or prohibit the proposed arrangement.</p>
<p>Where permission is needed, obtain it in the required form before giving possession. Keep the written consent with the sublease and provide the subtenant with the relevant lease terms. Do not claim that the landlord approved the arrangement unless approval has actually been obtained.</p>
<pre><code>This sublease concerns the premises at [address] under the original lease dated [date]
between [landlord] and [tenant]. It is subject to any consent required by that lease
and applicable law. The attached written consent is dated [date]. The parties will
not begin occupancy before the required permission has been obtained.</code></pre>
<p>This is illustrative wording, not a substitute for checking the lease or satisfying a legal consent procedure.</p>
<h2>Describe the space and limit the dates</h2>
<p>For a room, identify the bedroom and the shared kitchen, bathroom, living area, storage and parking. List furnishings and any areas excluded from use. For the whole home, give the unit number and address rather than relying on “my apartment.” Agree who else may occupy the property.</p>
<p>Record the start date, end date, key handover and move-out time. Do not promise occupation beyond the original tenant's right to provide it. Explain what happens if the original lease lawfully ends early, without pretending that a clause can remove a subtenant's mandatory notice or other statutory rights.</p>
<h2>Make rent and utilities easy to check</h2>
<p>State the currency, rent, due day, recipient and payment method. Specify who pays the landlord: the original tenant may remain responsible even when the subtenant is late. A payment by the subtenant directly to the landlord does not necessarily create a new tenancy or release the original tenant.</p>
<p>For shared bills, name the utilities, the allocation rule and when evidence of the bill will be provided. “A fair share” is a recipe for disagreement. Use a percentage, a fixed amount where lawful, or another objective method, and address seasonal or unusually high bills.</p>
<p>If the first month is partial, agree the calculation method. The <a href="${rel}free-tools/prorated-rent.html">prorated rent calculator</a> can compare methods, but the lease and local rules determine which one applies. Keep a <a href="${rel}templates/rent-receipt.html">rent receipt</a> or transfer record for every payment.</p>
<h2>Handle the deposit as a separate obligation</h2>
<p>Record who holds the subtenant's deposit, the amount, what it may cover, and the lawful return process. Do not assume that collecting a second deposit escapes deposit caps, protection schemes or accounting rules. Rules may apply to a tenant acting as a sublandlord as well as to the property owner.</p>
<p>Distinguish the deposit paid under the original lease from money paid under the sublease. A private promise to reimburse the original tenant does not automatically transfer the landlord-held deposit. Use the <a href="${rel}guides/how-to-return-a-security-deposit.html">deposit return guide</a> as a checklist of questions, then check the rules for the property.</p>
<h2>Divide everyday duties without waiving rights</h2>
<p>Say how repairs are reported, who contacts the landlord and what to do in an emergency. Allocate cleaning, rubbish, shared supplies and reasonable care of furnishings. Set lawful expectations for guests, pets, smoking, noise and keys, consistent with the original lease.</p>
<p>Do not make the subtenant waive habitability, privacy, fair-housing or other rights that local law protects. Entry, notices, fees and removal of an occupant require particular care. A contract is not permission to change locks, remove possessions or shut off utilities when a dispute occurs.</p>
<h2>Sample rent and handover wording</h2>
<pre><code>The Subtenant will pay [currency and amount] per month to [recipient] by [method]
on the [day] of each month. Utilities will be shared as follows: [specific allocation].
The parties will complete and sign a condition inventory at handover and keep copies
of dated photographs. At the lawful end of occupancy, the Subtenant will return the
keys and leave the agreed space and furnishings in the condition required by law
and this agreement, allowing for ordinary wear.</code></pre>
<p>Complete every blank and adapt the paragraph to the actual property and applicable law. Keep any deposit, notice and repair provisions consistent rather than scattering different rules through attachments.</p>
<h2>Complete the move-in and move-out record</h2>
<ul>
  <li>Inspect together and use a <a href="${rel}templates/move-in-checklist.html">move-in checklist</a> for damage, furnishings, meter readings and keys.</li>
  <li>Attach the relevant original lease terms, required disclosures and written consent.</li>
  <li>Agree a contact address for notices and emergencies; do not rely only on a social-media account.</li>
  <li>Sign the complete agreement, keep copies and arrange a documented final inspection.</li>
</ul>
<p>The official sources below illustrate why location matters: UK tenancy guidance and US lead-disclosure requirements are not a universal subletting checklist. Check current local rules, particularly for regulated housing or short-term accommodation.</p>
<p>Use the free <a href="${rel}templates/sublease-agreement.html">sublease agreement template</a> for a Word starting point, and read <a href="${rel}guides/what-to-include-in-a-lease-agreement.html">what the original residential lease should cover</a> alongside it. Your answers stay in your browser when you fill it in online.</p>
<p class="small muted">General information and sample wording, not legal advice. Obtain local advice about consent, deposits and tenancy rights before giving possession.</p>`,
  },
  {
    slug: 'how-to-write-a-purchase-order',
    title: 'How to write a purchase order (with an example)',
    description: 'How to write a purchase order with clear items, prices, delivery and payment terms. Includes a worked PO example, approval checklist and free Word template.',
    published: '2026-10-17',
    sources: [
      ['Cornell Legal Information Institute: UCC 2-206, offer and acceptance', 'https://www.law.cornell.edu/ucc/2/2-206'],
      ['Cornell Legal Information Institute: UCC 2-207, additional terms', 'https://www.law.cornell.edu/ucc/2/2-207'],
    ],
    faq: [
      ['Is a purchase order the same as an invoice?', 'No. The buyer issues a purchase order to order goods or services; the supplier issues an invoice to request payment. Quote the PO number on the invoice so the order, delivery and bill can be matched.'],
      ['Is a purchase order legally binding?', 'It can form or evidence a contract, depending on its terms, acceptance, any existing agreement and applicable law. A supplier acknowledgement with different terms needs review; do not assume your wording automatically overrides theirs.'],
      ['Can I change a purchase order after sending it?', 'Send a clearly numbered revision or agreed change order and obtain the supplier’s agreement where required. Keep the earlier version and record what changed. Quietly replacing the original file makes later delivery and invoice disputes harder to resolve.'],
    ],
    body: (rel) => `
<p class="lead">A purchase order, or PO, is the buyer's written instruction to a supplier: what to provide, in what quantity, at what price and by when. A useful PO gives the supplier enough detail to fulfil the order and finance enough detail to approve the invoice. It is not proof that the goods arrived or that payment was made.</p>
<h2>Know where the PO fits</h2>
<p>A quote offers a price; the buyer's purchase order places the order; the supplier's invoice requests payment; a receipt records payment. The <a href="${rel}guides/quote-vs-estimate-vs-invoice.html">quote, estimate and invoice guide</a> explains the wider sequence. Do not send a PO as though it were a customer invoice.</p>
<p>A PO can form part of a contract, but its effect depends on acceptance, existing agreements and applicable law. Check conflicting supplier terms before delivery. The US UCC sources below illustrate offer, acceptance and additional terms for goods; they are not universal rules for every purchase or jurisdiction.</p>
<h2>Add the parties and an unambiguous reference</h2>
<p>Use the buyer's and supplier's legal names, addresses and contacts. Separate the billing address from the delivery address. Add a unique PO number, issue date, currency and the approved quote or contract reference. If a project or department pays the bill, include its reference too.</p>
<p>Choose a numbering system that does not reuse numbers, such as PO-2026-0042. A revision should retain that reference and identify its revision number and date. Tell the supplier where to send acknowledgements and invoices, and ask them to include the PO number on both.</p>
<h2>Describe line items so substitutions are visible</h2>
<p>Give each item a clear description, product code where useful, unit, quantity and unit price. Include sizes, specifications or an attached specification version when a name alone is ambiguous. For services, state the deliverable or service period rather than only “professional services.”</p>
<p>Show discounts, shipping and taxes separately, and say whether prices include tax. Do not mix currencies in one total. If tax is uncertain, resolve it with the supplier rather than inserting a guessed rate into the final order. Arithmetic and tax compliance are different checks.</p>
<h2>A worked purchase order example</h2>
<p>Suppose a studio orders display materials from a print supplier. This example uses USD, no discount, USD 20 shipping and an illustrative 10% tax applied only to the goods. Real tax rates and whether shipping is taxable depend on the transaction; these assumptions are only for checking the sums.</p>
<div class="table-wrap" tabindex="0"><table class="compare"><thead><tr><th scope="col">Item</th><th scope="col">Quantity</th><th scope="col">Unit price</th><th scope="col">Line total</th></tr></thead><tbody>
<tr><th scope="row">Display stands, specification A</th><td>12</td><td>USD 25</td><td>USD 300</td></tr>
<tr><th scope="row">Printed signs, approved artwork v3</th><td>4</td><td>USD 40</td><td>USD 160</td></tr>
<tr><th scope="row" colspan="3">Goods subtotal</th><td>USD 460</td></tr>
<tr><th scope="row" colspan="3">Shipping</th><td>USD 20</td></tr>
<tr><th scope="row" colspan="3">Illustrative tax: 10% of USD 460</th><td>USD 46</td></tr>
<tr><th scope="row" colspan="3">Order total</th><td>USD 526</td></tr>
</tbody></table></div>
<p>The buyer should also state the delivery address, required date and approved artwork attachment. Check that 12 × 25 plus 4 × 40 equals 460, then add the agreed shipping and tax. The supplier's acknowledgement should confirm the same specification and total, not only the PO number.</p>
<h2>Specify delivery, inspection and changes</h2>
<p>Set the requested delivery date or schedule, delivery location and contact. Say whether partial deliveries or substitutions are acceptable and how shipping charges are agreed. For international or higher-risk purchases, obtain advice about delivery terms, customs responsibilities, insurance and when risk passes.</p>
<p>Explain the inspection or acceptance process and how shortages, damage or non-conforming work should be reported. A delivery signature may acknowledge receipt without confirming that every item passed inspection; make the intended process clear. Do not promise a rejection window that conflicts with mandatory rights or an existing contract.</p>
<pre><code>Please acknowledge PO-2026-0042 and confirm the quantities, specification, total price
and delivery date before dispatch. No substitution or additional charge is authorised
without the Buyer's written agreement. Quote this PO number on delivery documents
and invoices. Send any proposed change to [named contact and address].</code></pre>
<p>This is sample operational wording, not a complete set of purchase terms. Add the actual contact and agree the legal terms separately where needed.</p>
<h2>Agree payment terms and approval authority</h2>
<p>Record when payment becomes due and what starts the clock: for example, receipt of a correct invoice, subject to the agreed contract and lawful acceptance process. “Net 30” is incomplete if the parties disagree about the starting date. The <a href="${rel}free-tools/invoice-due-date.html">invoice due date calculator</a> helps turn agreed terms into a date.</p>
<p>Identify the person authorised to approve the order and any spending limit. A draft PO should not look like a released order. Keep internal approval evidence, then send the approved version to the supplier and retain their acknowledgement. Check payment-detail changes through a known contact rather than trusting a new bank account printed on an email.</p>
<h2>Match the order, delivery and invoice</h2>
<p>Before paying, compare three records: the approved PO, the receiving or acceptance record, and the supplier's invoice. Check quantities actually received, unit prices, approved extras, taxes, currency and prior payments. For a partial shipment, pay according to the agreement and keep the remaining quantity open rather than treating the order as fully delivered.</p>
<p>Resolve mismatches before silently editing the order to fit the invoice. If the scope changed, retain the agreed revision or <a href="${rel}templates/change-order-form.html">change order</a>. If the supplier corrects a billed amount, keep the replacement invoice or credit note with the transaction. This trail helps prevent duplicate payments as well as disputes.</p>
<h2>Make the next order easier</h2>
<ul>
  <li>Reuse supplier and buyer details, but recheck delivery addresses and contacts.</li>
  <li>Give each new order its own number; do not copy the previous order's quantities blindly.</li>
  <li>Keep approved specifications, revisions, delivery evidence and invoices together.</li>
  <li>Close the order only after the agreed deliveries and financial adjustments are complete.</li>
</ul>
<p>The free <a href="${rel}templates/purchase-order.html">purchase order template</a> calculates line totals and tax when filled in online and downloads as editable Word. Review its assumptions and the final file before sending. Suppliers preparing the related bill can use the <a href="${rel}guides/how-to-write-an-invoice.html">invoice writing guide</a>.</p>
<p class="small muted">General purchasing and drafting information, not legal, accounting or tax advice. Adapt the terms to the transaction and local rules.</p>`,
  },
];
