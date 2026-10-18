// Trade-specific companions replace generic GUIDE_FOR links. These are drafting checklists and illustrative
// examples, not jurisdiction-specific legal advice or a claim that the external sources were checked today.
export const SERVICE_GUIDES = [
  {
    slug: 'how-to-write-a-photography-contract',
    template: 'photography-contract',
    title: 'How to write a photography contract',
    description: 'Write a photography contract covering shoot hours, edited images, payment, cancellation and usage rights, with sample wording and a free Word template.',
    published: '2026-10-18',
    sources: [
      ['US Copyright Act, 17 USC 201: ownership of copyright', 'https://www.law.cornell.edu/uscode/text/17/201'],
      ['US Copyright Act, 17 USC 202: ownership of copyright and the physical object', 'https://www.law.cornell.edu/uscode/text/17/202'],
    ],
    faq: [
      ['Does paying a photographer mean I own the copyright?', 'Not automatically. A fee for a shoot and delivery of image files is different from a copyright assignment. State whether the client receives a personal or commercial licence, or a separately agreed transfer, and check the law and any employment or commissioning rules that apply.'],
      ['Is a photography contract also a model release?', 'Not necessarily. A contract sets the service and payment terms. Permission to use a person’s likeness, especially for advertising or a portfolio, is a separate question. Identify whose permission is needed and do not assume that the person booking can consent for every attendee.'],
      ['Can a booking payment always be kept if the client cancels?', 'No universal rule makes a payment non-refundable just because it is called a retainer. State a fair cancellation and rescheduling policy, explain how the payment is treated, and check consumer law and other mandatory rights before relying on it.'],
    ],
    body: (rel) => `
<p class="lead">A photography contract should turn a booking into a clear plan: who attends, what gets photographed, how long the shoot lasts, what images the client receives and what they may do with them. Agree the plan before reserving the date. A promise to provide “all photographs” or “full rights” is rarely precise enough.</p>
<h2>Separate the service, the image licence and consent</h2>
<p>The service agreement covers the work and price. The image licence explains permitted uses of the finished photographs. A model or property release deals with permission from someone whose likeness or property appears. These documents can relate to the same shoot without doing the same job. Read the <a href="${rel}guides/do-i-need-a-model-release.html">model release guide</a> when publication or advertising is planned.</p>
<h2>Identify the client, booking and coverage</h2>
<p>Record the legal names, contact details, shoot date, location and start and finish times. Identify who may approve changes and additional charges. For an event, say whether travel between venues counts as coverage, whether a second photographer is included and which permissions or access the client must arrange.</p>
<p>List important moments and practical constraints without promising an impossible result. Venue restrictions, weather, delays and a subject declining to participate can affect a shot list. Explain how the parties communicate on the day and who decides whether conditions are safe.</p>
<h2>Describe deliverables someone can check</h2>
<p>Specify the approximate or agreed image count, selection process, editing level, file format, resolution and delivery method. Say whether the fee includes prints, an album, extra retouching or raw files. Name a delivery period and the event that starts it, such as the shoot or receipt of the client's selections.</p>
<div class="table-wrap" tabindex="0"><table><thead><tr><th scope="col">Decision</th><th scope="col">Illustrative portrait booking</th></tr></thead><tbody>
<tr><th scope="row">Coverage</th><td>One two-hour session at one agreed location</td></tr>
<tr><th scope="row">Delivery</th><td>20 selected, colour-edited JPEG images within 14 days</td></tr>
<tr><th scope="row">Not included</th><td>Raw files, prints and extensive compositing</td></tr>
<tr><th scope="row">Additional work</th><td>Quoted and approved before it is carried out</td></tr>
</tbody></table></div>
<p>These are example choices, not recommended quantities or a guaranteed turnaround. Make the schedule achievable for the actual job, and define how a client raises a delivery problem.</p>
<h2>Make the price and booking payment add up</h2>
<p>State the currency, total price, any applicable tax, travel and overtime charges, the booking payment and the balance date. A USD 900 shoot with USD 300 paid on booking leaves USD 600 before any approved extras. Show that calculation consistently in the agreement and invoice; do not request the original total again as the balance.</p>
<p>The <a href="${rel}invoice-templates/deposit-invoice.html">deposit invoice workflow</a> helps present a request for an advance. It does not collect money or prove that payment arrived. Keep the actual payment record separately, and distinguish an advance against the price from a refundable security deposit.</p>
<h2>Define permitted image use in plain language</h2>
<p>For personal work, address sharing, printing and any restrictions on resale or advertising. For commercial work, identify the business, media, territory, duration, exclusivity and whether agencies or other third parties may use the images. Do not call a limited licence “full ownership.” Agree the fee and wording for a copyright transfer separately if one is intended.</p>
<p>The US copyright provisions below illustrate why ownership of a delivered copy and ownership of copyright are distinct. Other jurisdictions and particular commissioning relationships can differ. The <a href="${rel}clauses/intellectual-property-clause.html">intellectual property clause explanation</a> gives the main drafting questions, not a universal transfer formula.</p>
<h2>Ask separately about portfolio and publicity use</h2>
<p>Explain any proposed use on the photographer's website, social accounts or advertising. Do not hide it inside a general payment clause. Identify whether consent is optional, what restrictions apply and how requests are handled. Extra care is needed for children, private events and sensitive settings; the booking client's signature is not automatically every subject's permission.</p>
<h2>Plan cancellation, rescheduling and absence</h2>
<p>Set the notice method, treatment of money already paid and process for choosing a replacement date. Distinguish client cancellation, unsafe weather and the photographer being unable to attend. Explain whether a substitute needs approval and what happens if no suitable replacement is available. Calling a payment “non-refundable” does not override mandatory rights.</p>
<p>If extra coverage is requested, get approval of the price and new finish time. A written change is easier to reconcile than an informal conversation with someone who was not authorised to approve spending.</p>
<h2>Example scope and rights wording</h2>
<pre><code>The Photographer will provide [hours] of coverage at [location] on [date] and
supply [number and type] edited images by [delivery date or period]. Raw files
and [excluded services] are not included. Additional coverage or editing requires
written agreement on the price and timetable. The Client receives a licence for
[defined uses]. Any other use or copyright assignment requires separate agreement.</code></pre>
<p>This is a drafting example, not a complete contract. Fill every bracket and align it with the fee, cancellation and local-law provisions.</p>
<h2>Review the booking before signing</h2>
<ul>
  <li>Check names, venues, times, deliverables and every attachment against the quote.</li>
  <li>Separate the client's image licence from any portfolio permission.</li>
  <li>Decide who keeps the final files, how long a gallery remains available and whether replacement delivery has a charge.</li>
  <li>Keep the signed agreement, changes, payment records and final delivery message together.</li>
</ul>
<p>Use the free <a href="${rel}templates/photography-contract.html">photography contract template</a> as a Word starting point, or fill its questions in locally. Review the generated file before signing; do not treat a template as approval of every legal term.</p>
<p class="small muted">General drafting information, not legal advice. Copyright, privacy, cancellation and consumer rules depend on the jurisdiction and facts.</p>`,
  },
  {
    slug: 'what-to-include-in-an-equipment-rental-agreement',
    template: 'equipment-rental-agreement',
    title: 'What to include in an equipment rental agreement',
    description: 'An equipment rental agreement checklist: serial numbers, rates, deposits, permitted use, damage and return, with a handover example and free Word template.',
    published: '2026-10-18',
    sources: [
      ['Cornell Legal Information Institute: UCC Article 2A, leases', 'https://www.law.cornell.edu/ucc/2A'],
      ['UK Health and Safety Executive: work equipment and machinery', 'https://www.hse.gov.uk/work-equipment-machinery/'],
    ],
    faq: [
      ['Is a security deposit the same as prepaid equipment rent?', 'No. Prepaid rent pays for use of the equipment. A security deposit is held for agreed, lawful deductions and may need to be returned. Identify each amount separately, explain the accounting and do not assume that the deposit limits every possible liability.'],
      ['Who pays for damage to rented equipment?', 'The agreement should distinguish existing damage, ordinary wear, misuse, loss and defects, subject to applicable law. Record condition at handover and return, explain the evidence and repair-cost process, and check insurance rather than assuming every problem belongs to the renter.'],
      ['Does signing a rental agreement prove equipment is safe?', 'No. A signature does not replace maintenance, inspections, suitable instructions, operator competence or legal safety duties. Do not supply or operate equipment known to be unsafe, and obtain specialist advice for regulated or high-risk machinery.'],
    ],
    body: (rel) => `
<p class="lead">An equipment rental agreement records which items leave the owner, who may use them, the price, the return deadline and what happens if something is missing or damaged. The most useful attachment is often a careful handover record. A generic promise to “return everything in good condition” cannot show which cable was supplied or which dent already existed.</p>
<h2>Identify the parties and the type of transaction</h2>
<p>Name the equipment owner and renter, their addresses and an authorised contact. Confirm that the owner may rent the items and that the person collecting them can act for the renter. An equipment hire is not a sale: use a <a href="${rel}templates/bill-of-sale.html">bill of sale</a> if ownership is actually transferring.</p>
<p>Consumer hire, financed leases, vehicles and specialist machinery can be subject to additional rules. The US lease-law and UK safety sources below are starting points for those jurisdictions, not terms that automatically apply to every rental.</p>
<h2>Make an inventory that identifies the actual items</h2>
<p>List make, model, serial or asset number, quantity and included accessories. Identify batteries, cases, chargers, guards, keys, manuals and other parts likely to be disputed. Note any agreed value without pretending that a list price automatically determines every lawful damage claim.</p>
<div class="table-wrap" tabindex="0"><table><thead><tr><th scope="col">Item</th><th scope="col">Identifier</th><th scope="col">Handover record</th></tr></thead><tbody>
<tr><th scope="row">Camera body</th><td>Asset CAM-014</td><td>Working; cosmetic mark on base photographed</td></tr>
<tr><th scope="row">Lens</th><td>Asset LEN-006</td><td>Front and rear caps included</td></tr>
<tr><th scope="row">Accessories</th><td>Two batteries, charger and case</td><td>Counted and acknowledged by both parties</td></tr>
</tbody></table></div>
<p>These are fictional identifiers. Take clear dated photographs where appropriate, let both parties retain the inventory and avoid collecting unnecessary identity or payment information in a document that will circulate.</p>
<h2>State the rental period and the return event</h2>
<p>Give the collection time, return date and time, location and time zone where relevant. Explain whether the rental ends on physical return, collection by the owner or another agreed event. Define how an extension is requested and approved. A request to keep the equipment longer is not the same as an approved extension.</p>
<p>Decide what happens when the return point is closed, delivery is delayed or an item fails during use. Avoid a price model that leaves the renter unable to work out when another day becomes chargeable.</p>
<h2>Separate rent, fees and the security deposit</h2>
<p>State the currency, rate unit, number of units, taxes where applicable and any delivery or collection fee. For example, three days at USD 80 plus USD 40 delivery is USD 280 before tax. A separate USD 200 security deposit makes the initial amount USD 480 before tax; it does not make the rental price USD 480.</p>
<p>Explain when each amount is due, whether an advance is credited against rent and how deposit deductions and repayment will be documented. The <a href="${rel}clauses/payment-terms-clause.html">payment terms explanation</a> helps distinguish price, payment timing and lawful charges. Do not leave a daily rate and a conflicting weekly total in different attachments.</p>
<h2>Specify permitted users, locations and operation</h2>
<p>Describe the authorised purpose, operating area and any restriction on lending, sub-renting, modifications or taking equipment abroad. Identify required training, suitable transport and instructions. Practical limits should match the equipment and risk, not merely shift every responsibility onto an untrained renter.</p>
<p>A contract cannot substitute for maintenance, required inspections or legal safety duties. Agree how a fault is reported, when use must stop and who arranges a repair or replacement. Do not instruct a renter to keep operating defective machinery to avoid a late-return charge.</p>
<h2>Allocate damage and insurance carefully</h2>
<p>Distinguish ordinary wear, pre-existing damage, accidental damage, misuse, theft and equipment defects. Explain notification, evidence, assessment and how a disputed deduction can be raised. A missing low-cost accessory and a total loss should not be treated as identical events.</p>
<p>Check the actual insurance policy, permitted operators, exclusions, excess and insured value. A certificate is not proof that every contractual promise is covered. An <a href="${rel}guides/what-is-a-hold-harmless-agreement.html">indemnity or hold harmless clause</a> is a separate risk-allocation decision, not a replacement for the inventory or insurance review.</p>
<h2>Write the return and inspection process</h2>
<p>Say who counts accessories and tests operation, when the inspection occurs and how findings reach the renter. Describe any agreed cleaning or refuelling standard precisely. Document condition before repairing damage where practicable, and give an itemised explanation rather than retaining an entire deposit without an account.</p>
<h2>Sample handover and return wording</h2>
<pre><code>The equipment and accessories are listed in Schedule A, with their identifiers
and the condition photographs acknowledged at handover. Return is due at
[place] by [date and time]. Extensions require written approval. On return,
the parties will record missing items and changes in condition. Any proposed
deduction from the security deposit will be itemised with supporting evidence
and handled under the agreement and applicable law.</code></pre>
<p>Adapt this example to the inspection process you can actually perform. It does not set a universal deduction right or deposit deadline.</p>
<h2>Before the equipment leaves</h2>
<ul>
  <li>Complete the inventory and record the agreed rental and deposit amounts separately.</li>
  <li>Check authority to collect, permitted use, instructions and insurance arrangements.</li>
  <li>Give both sides the signed terms, inventory and emergency fault contact.</li>
  <li>Set a return appointment and a method for recording an approved extension.</li>
</ul>
<p>Start with the free <a href="${rel}templates/equipment-rental-agreement.html">equipment rental agreement template</a>, then attach a complete inventory and review the wording for the actual equipment and location.</p>
<p class="small muted">General drafting information, not legal or insurance advice. Consumer hire, finance, safety and deposit rules vary.</p>`,
  },
  {
    slug: 'how-to-write-a-cleaning-services-contract',
    template: 'cleaning-services-contract',
    title: 'How to write a cleaning services contract',
    description: 'Write a cleaning services contract with a task schedule, visit price, supplies, access, cancellations and damage reporting. Example and free Word template.',
    published: '2026-10-18',
    sources: [
      ['US OSHA: hazard communication', 'https://www.osha.gov/hazcom'],
      ['IRS: independent contractor or employee?', 'https://www.irs.gov/businesses/small-businesses-self-employed/independent-contractor-self-employed-or-employee'],
    ],
    faq: [
      ['Should a cleaning contract list every task?', 'List the recurring tasks and frequency clearly enough to distinguish a routine visit from extra work. Name important exclusions such as high-level windows or specialist stain treatment. A short task schedule is more useful than a promise to make the entire property spotless.'],
      ['Can I charge a client when the cleaner cannot get in?', 'Agree a clear access and cancellation policy before the visit, including the notice channel and any fair, lawful charge. Record the attempted attendance and circumstances. Do not add an undisclosed lockout fee after the event or assume a clause overrides consumer rights.'],
      ['Does calling a cleaner an independent contractor settle their tax status?', 'No. The practical working relationship and the applicable legal tests matter. A service contract cannot turn an employment arrangement into self-employment by its title alone. Check classification and any obligations for staff, substitutes or subcontractors.'],
    ],
    body: (rel) => `
<p class="lead">A cleaning services contract should explain what happens at each visit: the tasks, frequency, price, supplies, access and how concerns are resolved. The aim is not a long document full of general promises. It is a schedule the cleaner and client can both use to check what was agreed, including what costs extra.</p>
<h2>Identify the property and people responsible</h2>
<p>Use the client's and cleaning business's legal names, the service address and an authorised contact. Distinguish a residential home from an office or other premises with additional security and safety requirements. Name the person who can approve extra work and price changes, not just whoever happens to be present.</p>
<p>Describe who will attend and whether substitutes or subcontractors are allowed. Do not promise a particular individual every week if the service operates through a rotating team. Any staff or contractor arrangements still need to comply with the applicable rules.</p>
<h2>Attach a task schedule with clear exclusions</h2>
<p>Break work down by room or task and state its frequency. Separate a regular maintenance clean, an initial deep clean and an end-of-tenancy service. Mention surfaces that need special care and identify work outside the agreed service, such as pest control, hazardous material or moving heavy furniture.</p>
<div class="table-wrap" tabindex="0"><table><thead><tr><th scope="col">Area</th><th scope="col">Routine visit</th><th scope="col">Separate agreement needed</th></tr></thead><tbody>
<tr><th scope="row">Kitchen</th><td>Accessible counters, sink and floor</td><td>Inside oven and refrigerator</td></tr>
<tr><th scope="row">Bathroom</th><td>Agreed sanitary fixtures and floor</td><td>Specialist mould or restoration work</td></tr>
<tr><th scope="row">Living areas</th><td>Accessible dusting and vacuuming</td><td>High windows and heavy furniture moves</td></tr>
</tbody></table></div>
<p>This fictional schedule needs adapting to the property. Avoid a blanket promise to remove every stain or make premises sterile when the service and equipment cannot achieve that result.</p>
<h2>Define visit times and the pricing method</h2>
<p>State the start date, days, frequency and expected arrival window. If a team attends, explain whether an hourly rate means a worker-hour or a clock hour for the whole team. Two cleaners working two hours create four worker-hours, not two. Set any minimum visit length and approval process for additional time.</p>
<p>For a fixed USD 120 visit every other week, invoice actual agreed visits rather than assuming every calendar month contains two. List taxes and approved extras separately. The <a href="${rel}invoice-templates/cleaning.html">cleaning invoice template</a> provides a relevant billing starting point; check the dates and tasks against the attendance record.</p>
<h2>Agree supplies and safe working conditions</h2>
<p>Say who provides products, consumables and equipment, how replacements are approved and where items are stored. Record surface-care instructions and any relevant restrictions. If the client supplies products, that does not make every combination or use safe: follow labels, safety information and applicable training requirements.</p>
<p>The OSHA source below concerns US hazard communication, not a universal cleaning standard. Specialist or hazardous work needs its own risk assessment and competent service. A contract should allow concerns to be raised, not pressure a worker to perform unsafe tasks to avoid a missed-visit complaint.</p>
<h2>Keep keys, alarm codes and personal information secure</h2>
<p>Explain how access is arranged, who may hold a key, how keys are identified and how access is removed when the service ends. Keep live alarm codes and passwords out of a broadly circulated contract. Use an approved separate channel and limit access to the people who need it.</p>
<p>Address pets, occupants, valuables and restricted rooms. Decide what happens if entry is unavailable or conditions are unsafe. A useful agreement describes the contact and waiting process rather than silently treating every failed visit as a chargeable cancellation.</p>
<h2>Make cancellation and changes workable</h2>
<p>Specify how much notice is requested, where notice must be sent and any fair, lawful fee. Distinguish rescheduling one visit from ending the whole arrangement. Explain holidays, sickness and a cancelled visit by the provider as well as cancellation by the client.</p>
<p>When the scope changes, confirm the new tasks, time and price before work starts. For a larger commercial service, the <a href="${rel}guides/what-to-include-in-a-statement-of-work.html">statement-of-work checklist</a> helps separate the recurring schedule from a one-off project.</p>
<h2>Describe complaints, breakage and insurance</h2>
<p>Give a contact and reasonable reporting process for missed tasks or damage. If offering a re-clean, describe its scope and how it is arranged without removing mandatory consumer remedies. Record incidents, preserve relevant evidence and avoid promises that every loss is automatically covered by insurance.</p>
<p>Check the actual policy and any limits on keys, theft, subcontractors and specialist work. Liability caps and exclusions need local review, especially where personal injury or consumer services are involved. Do not copy an insurance limit into a contract as though the two have the same legal effect.</p>
<h2>Example scope and extra-work wording</h2>
<pre><code>The Provider will carry out the tasks in Schedule A at [property] every [frequency]
for [currency and price] per visit. The Client will arrange access by [method].
Oven cleaning, high-level windows and [other exclusions] are not included.
Additional tasks or time require agreement on the scope and price before work.
Concerns about a visit should be reported to [contact] so the parties can review
and arrange an appropriate response, subject to applicable consumer rights.</code></pre>
<h2>Check status and the end-of-service process</h2>
<p>The label “independent contractor” does not decide employment or tax status. Review the actual arrangement using the applicable rules; the IRS source illustrates one US tax framework. The <a href="${rel}guides/how-to-write-an-independent-contractor-agreement.html">contractor agreement guide</a> explains why the written label is not enough.</p>
<p>Set notice to end the service, final invoicing, return of keys and removal of access. Use the free <a href="${rel}templates/cleaning-services-contract.html">cleaning services contract template</a> to record the agreed choices, then inspect the downloaded Word file before both parties sign.</p>
<p class="small muted">General drafting information, not legal, tax or safety advice. Employment, consumer and workplace rules differ by location.</p>`,
  },
  {
    slug: 'what-to-include-in-a-tutoring-agreement',
    template: 'tutoring-agreement',
    title: 'What to include in a tutoring agreement',
    description: 'A tutoring agreement checklist for fees, session length, cancellations, parent contact, safeguarding and privacy, with an example and free Word template.',
    published: '2026-10-18',
    sources: [
      ['US Federal Trade Commission: children’s privacy', 'https://www.ftc.gov/business-guidance/privacy-security/childrens-privacy'],
      ['GOV.UK: Disclosure and Barring Service checks', 'https://www.gov.uk/disclosure-barring-service-check/overview'],
    ],
    faq: [
      ['Who signs a tutoring agreement for a child?', 'Usually the tutor contracts with a parent or guardian who has authority to arrange the service and agrees the payment terms. Record the learner separately. Capacity, parental authority and safeguarding rules vary, so check the requirements instead of relying only on the label Parent.'],
      ['Should a tutoring contract guarantee an exam result?', 'Do not promise a grade or admission outcome you cannot control. Define the teaching service, preparation, attendance and progress reporting. Discuss achievable learning goals while recognising that results also depend on the learner, assessment and other factors.'],
      ['Can online tutoring sessions be recorded automatically?', 'Do not treat recording as automatic. Determine the lawful basis and any required permissions, explain the purpose, access and retention, and consider whether recording is necessary at all. A parent signing for lessons is not blanket permission for public clips or indefinite storage.'],
    ],
    body: (rel) => `
<p class="lead">A tutoring agreement should make the learning arrangement predictable: the subject, learner, session length, fees, attendance rules and how the tutor communicates with the family. Where children are involved, safeguarding and privacy need attention before the first lesson. A payment clause alone is not a suitable plan for one-to-one teaching.</p>
<h2>Identify the tutor, payer and learner separately</h2>
<p>Record the tutor or tutoring business, the contracting client and the learner. For a child, confirm who has authority to arrange the lessons and who will pay. For an adult learner, adapt the wording rather than leaving references to a parent in every clause. Identify the person authorised to receive progress updates.</p>
<p>Keep necessary contacts securely, and arrange a suitable emergency contact for in-person teaching where appropriate. Do not place a child's full medical or school record into a document merely because a free-text field is available.</p>
<h2>Describe the subject and teaching service</h2>
<p>Name the subject, level, curriculum or exam where relevant and the starting goals. Explain assessment, lesson preparation, homework feedback and what materials are included. Distinguish teaching and practice from doing graded work on the learner's behalf. Clear boundaries help with both expectations and academic integrity.</p>
<p>Use goals such as reviewing fractions or practising an exam technique rather than guaranteeing a particular grade or admission. Explain how goals are reviewed and what happens if the learner needs support outside the tutor's competence.</p>
<h2>Set the timetable, format and session length</h2>
<p>State the days, frequency, start date and duration. For online lessons, name the platform and time zone and agree how joining details are sent. For in-person teaching, identify the location, arrival and collection arrangements and who must be present. Say whether preparation or travel is included in a charged hour.</p>
<div class="table-wrap" tabindex="0"><table><thead><tr><th scope="col">Term</th><th scope="col">Illustrative arrangement</th></tr></thead><tbody>
<tr><th scope="row">Subject</th><td>Secondary-level mathematics; agreed topic plan</td></tr>
<tr><th scope="row">Sessions</th><td>One 60-minute online lesson each week</td></tr>
<tr><th scope="row">Fee</th><td>USD 40 per completed or otherwise chargeable session</td></tr>
<tr><th scope="row">Review</th><td>A short progress discussion after four lessons</td></tr>
</tbody></table></div>
<p>These are fictional terms, not a recommended price or evidence of market rates. Agree the actual schedule around the learner's needs.</p>
<h2>Explain payment, packages and unused sessions</h2>
<p>Give the currency, hourly or session rate, invoice timing and due date. Four sessions at USD 40 total USD 160 before any applicable tax or agreed extras. If charging for a package, explain its contents, booking process, expiry where lawful and what happens to unused sessions when either side ends the arrangement.</p>
<p>Do not confuse money paid in advance with fees already earned. Address refunds and mandatory consumer rights rather than declaring every package non-refundable. Use the <a href="${rel}invoice-templates/hourly-invoice.html">hourly invoice workflow</a> for a session record and check the bill against actual attendance and the agreed cancellation policy.</p>
<h2>Deal with lateness, cancellation and technical failure</h2>
<p>Specify the notice channel, requested notice period and any fair, lawful cancellation fee. Say whether a late start shortens the session or moves its finish. Apply a clear policy when the tutor cancels too, including rescheduling or refunding the appropriate fee.</p>
<p>For online lessons, agree what happens when the connection or platform fails. A brief interruption, a learner failing to join and the tutor being unavailable are not identical events. Keep a simple attendance and cancellation record so a disputed invoice can be checked.</p>
<h2>Write down safeguarding arrangements</h2>
<p>Agree appropriate contact channels, professional boundaries, the adult-presence policy where applicable and how a concern is reported. Do not rely on a contract to replace a safeguarding process. Check the requirements for the learner's age, teaching setting and jurisdiction before the service begins.</p>
<p>If background checks are mentioned, describe only the check actually held, its scope and the relevant context. Do not imply that a certificate is a guarantee of safety or that every role qualifies for the same check. The GOV.UK source concerns DBS checks in its own jurisdiction; it is not a universal requirement for tutors everywhere.</p>
<h2>Limit recordings and protect learner information</h2>
<p>Decide whether recording is necessary. If it is, explain the purpose, lawful basis and required permissions, who can view it, the storage location and retention. Do not reuse a teaching recording for marketing or publish a student's image under a vague lessons clause.</p>
<p>The FTC source covers children's privacy in the US, including obligations that may apply to online services. It does not mean every private tutoring arrangement has the same legal status. Check the rules for the actual service and collect only information you need. The <a href="${rel}docs/security.html">Clausery security documentation</a> also explains the limits of local storage and downloaded files.</p>
<h2>Sample session and progress wording</h2>
<pre><code>The Tutor will provide [subject and level] tuition in sessions of [duration]
at [schedule and location or platform]. The agreed fee is [amount] per session.
The parties will review the learning goals after [number] sessions. Progress
updates will be shared with [authorised person] by [method]. Tuition supports
the learner's own work; it does not include completing graded assignments or
guaranteeing an examination result. Recording requires a separate agreed process.</code></pre>
<p>Complete the brackets and keep the example consistent with the payment, cancellation, safeguarding and privacy provisions. It is not a complete safeguarding policy.</p>
<h2>Review and end the arrangement clearly</h2>
<ul>
  <li>Confirm the client's authority, learner details, session schedule and any agreed materials.</li>
  <li>Set a review date and a practical way to raise concerns about teaching or attendance.</li>
  <li>Agree how lessons end and how prepaid, unused sessions are accounted for.</li>
  <li>Keep the signed version and later changes without retaining unnecessary learner information.</li>
</ul>
<p>Use the free <a href="${rel}templates/tutoring-agreement.html">tutoring agreement template</a>, adapt the Word wording for an adult learner where needed, and check the final document rather than assuming every optional clause fits the teaching arrangement.</p>
<p class="small muted">General drafting information, not legal or safeguarding advice. Education, consumer, privacy and background-check rules vary by location.</p>`,
  },
];
