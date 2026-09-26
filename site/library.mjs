// Free template library: one page per shipped sample, generated from the real .docx so the question list always matches
// what the app asks. Each page offers the Word template download and a one-click "fill it in your browser" deep link.
import { readFileSync } from 'node:fs';
import { inspectDocx } from '../app/lib/render.js';
import { inferQuestionnaire, FIELD_TYPES } from '../app/lib/schema.js';
import { esc, SITE } from '../tools/partials.mjs';
import { CLAUSES } from './data/clauses.mjs';
import { GUIDES } from './audience.mjs';
// The how-to guide that goes with each template, where there is one.
const GUIDE_FOR = { 'offer-letter': 'how-to-write-an-offer-letter', 'internship-offer-letter': 'how-to-write-an-offer-letter', 'payment-demand-letter': 'how-to-write-a-payment-demand-letter', 'statement-of-work': 'what-to-include-in-a-statement-of-work', 'consulting-agreement': 'what-to-include-in-a-statement-of-work', 'service-agreement': 'what-to-include-in-a-statement-of-work', 'mutual-nda': 'what-to-include-in-an-nda', 'one-way-nda': 'what-to-include-in-an-nda', 'engagement-letter': 'automate-word-templates', 'web-design-contract': 'how-to-write-a-freelance-contract', 'graphic-design-contract': 'what-is-a-kill-fee', 'photography-contract': 'how-to-write-a-freelance-contract', 'social-media-management-contract': 'how-to-write-a-freelance-contract', 'freelance-writing-contract': 'what-is-a-kill-fee', 'video-production-contract': 'how-to-write-a-freelance-contract', 'virtual-assistant-agreement': 'how-to-write-a-freelance-contract', 'event-planning-contract': 'how-to-write-a-freelance-contract' };
const GUIDE = Object.fromEntries(GUIDES.map((g) => [g.slug, g]));

export const LIB = [
  { slug: 'mutual-nda', file: 'mutual-nda.docx', name: 'Mutual NDA', title: 'Free mutual NDA template (Word)', category: 'Legal',
    intro: 'A two-way non-disclosure agreement for when both sides will share confidential information: partnership talks, M&A conversations, joint ventures, vendor evaluations.',
    who: 'Founders, in-house counsel and law firms who send NDAs every week and are tired of editing party names by hand.',
    clauses: ['Parties, entity types and short names', 'Purpose of the disclosure', 'Definition of confidential information, with optional standard carve-outs', 'Use and protection obligations', 'Term and survival period', 'Governing law, with optional exclusive jurisdiction', 'Notices, with optional email copies', 'Signature blocks'],
    faq: [['Is a mutual NDA different from a one-way NDA?', 'Yes. A mutual NDA protects information flowing in both directions. Use a one-way NDA when only one party discloses.'], ['Can I change the clauses?', 'Yes. Download the Word file, edit any wording you like, keep the {tags}, and upload it to Clausery. Your formatting is kept exactly.']] },
  { slug: 'engagement-letter', file: 'engagement-letter.docx', name: 'Engagement letter', title: 'Free law firm engagement letter template (Word)', category: 'Legal',
    intro: 'An engagement letter that sets out scope, the team, fees and billing for a new matter. It supports hourly or flat fees, an optional retainer, and a list of attorneys with their rates.',
    who: 'Solo practitioners and small firms who open new matters every week.',
    clauses: ['Client and matter details', 'Scope of the engagement', 'Team: any number of attorneys with role and hourly rate', 'Hourly or flat fee', 'Optional advance fee deposit held in trust', 'Costs, billing and payment terms', 'Termination', 'Client acceptance block'],
    faq: [['Does this meet my state bar\'s requirements?', 'It is a general sample. Rules on engagement letters, fees and trust accounts vary by jurisdiction; adapt the wording to your rules before use.'], ['Can I list more than one attorney?', 'Yes. The attorney list repeats for as many people as you add, each with a role and rate.']] },
  { slug: 'offer-letter', file: 'offer-letter.docx', name: 'Offer letter', title: 'Free job offer letter template (Word)', category: 'HR',
    intro: 'A job offer letter with remote or office variants, salary, optional bonus and equity, a benefits list and offer conditions.',
    who: 'HR teams, recruiters and founders hiring without an HR system.',
    clauses: ['Role, manager and location (remote or office)', 'Start date', 'Base salary', 'Optional bonus target', 'Optional equity grant with vesting', 'Benefits list and paid time off', 'Conditions such as a background check', 'Acceptance block'],
    faq: [['Is this an employment contract?', 'No. It is an offer letter. Employment terms, at-will language and required notices depend on your country and state.'], ['Can I reuse it for every hire?', 'Yes. Answer the questions for each candidate and download a finished letter in seconds; every draft is kept for later.']] },
  { slug: 'independent-contractor-agreement', file: 'independent-contractor-agreement.docx', name: 'Independent contractor agreement', title: 'Free independent contractor agreement template (Word)', category: 'Business',
    intro: 'A contractor agreement covering services, hourly or fixed fees, invoicing, independent status, ownership of work product, confidentiality and termination.',
    who: 'Businesses hiring freelancers, and freelancers who want their own paper.',
    clauses: ['Parties and services', 'Start date and optional end date', 'Hourly rate with optional monthly cap, or a fixed fee', 'Invoicing and expenses', 'Independent contractor status', 'Who owns the work product', 'Confidentiality', 'Termination and governing law'],
    faq: [['Does this decide whether someone is legally a contractor?', 'No. Classification depends on how the work is actually done under your local law, not on the contract wording alone.'], ['Can the contractor keep ownership of their work?', 'Yes. One question switches between assignment to the client and a licence to the client.']] },
  { slug: 'statement-of-work', file: 'statement-of-work.docx', name: 'Statement of work', title: 'Free statement of work (SOW) template (Word)', category: 'Business',
    intro: 'A statement of work with a list of deliverables and due dates, a timeline, fixed-price or time-and-materials fees, assumptions and acceptance.',
    who: 'Agencies, consultants and IT service providers who write a SOW for every project.',
    clauses: ['Reference to the master agreement', 'Project summary', 'Deliverables: any number, each with a description and due date', 'Timeline', 'Fixed price or time and materials', 'Assumptions', 'Review and acceptance period', 'Sign-off'],
    faq: [['Do I need a master agreement?', 'This SOW refers to one. If you do not have a master services agreement, add the missing terms or use the contractor agreement template.'], ['Can I add a deliverables table?', 'Yes. In Word, put the loop tags in a table row and the row repeats for each deliverable.']] },
  { slug: 'employment-verification-letter', file: 'employment-verification-letter.docx', name: 'Employment verification letter', title: 'Free employment verification letter template (Word)', category: 'HR',
    intro: 'A letter confirming that someone works, or used to work, for your company, with their job title, dates and employment type, and optionally their salary.',
    who: 'HR and office managers answering requests from landlords, lenders and visa applications.',
    clauses: ['Current or former employee wording', 'Job title and dates', 'Full-time, part-time or other employment type', 'Optional salary line', 'Optional purpose of the letter', 'Contact for further verification', 'Signature'],
    faq: [['Should I include salary?', 'Only with the employee\'s consent and where local law allows it. The salary line is optional.'], ['Does it work for former employees?', 'Yes. One question switches the wording to past tense and asks for an end date.']] },
  { slug: 'payment-demand-letter', file: 'payment-demand-letter.docx', name: 'Payment demand letter', title: 'Free payment demand letter template (Word)', category: 'Finance',
    intro: 'A firm but polite letter asking a customer to pay an overdue balance by a deadline, with optional invoice number, interest and next steps.',
    who: 'Small businesses, freelancers and bookkeepers chasing late invoices.',
    clauses: ['Debtor details and amount due', 'What the payment was for and when it was due', 'Pay-by date and payment instructions', 'Optional interest', 'Invitation to dispute or agree a payment plan', 'Optional next steps'],
    faq: [['Is this a formal letter before action?', 'No. Some courts require specific pre-action steps and wording; check your local rules before starting proceedings.'], ['Can I send it by email?', 'Yes. Download the Word file or print it to PDF and attach it.']] },
  { slug: 'one-way-nda', file: 'one-way-nda.docx', name: 'One-way NDA', title: 'Free one-way NDA template (Word)', category: 'Legal',
    intro: 'A unilateral non-disclosure agreement for when only one side shares confidential information: pitching an idea, hiring a contractor, showing a prototype or sharing financials with a potential buyer.',
    who: 'Founders, freelancers and small businesses that need to share something sensitive before a deal is signed.',
    clauses: ['Disclosing and receiving party', 'Purpose of the disclosure', 'What counts as confidential, with standard exclusions', 'Use, disclosure and care obligations', 'Return or destruction, with optional written confirmation', 'Term', 'No licence', 'Governing law and signatures'],
    faq: [['When should I use a one-way NDA instead of a mutual one?', 'Use a one-way NDA when only you are sharing confidential information. If both sides will share, use the mutual NDA template.'], ['How long should confidentiality last?', 'Two to five years is common for business information; trade secrets are often protected for as long as they remain secret. You choose the number of years.']] },
  { slug: 'consulting-agreement', file: 'consulting-agreement.docx', name: 'Consulting agreement', title: 'Free consulting agreement template (Word)', category: 'Business',
    intro: 'A consulting agreement with a monthly retainer or a day rate, a list of deliverables with due dates, confidentiality, ownership of materials and a notice period.',
    who: 'Independent consultants, advisers and fractional executives.',
    clauses: ['Parties and scope of the engagement', 'Deliverables with due dates', 'Monthly retainer or day rate', 'Payment terms', 'Independent contractor status', 'Confidentiality and ownership of materials', 'Term, notice and governing law'],
    faq: [['Retainer or day rate?', 'A retainer suits ongoing advisory work; a day rate suits projects with uneven effort. One question switches between them.'], ['Who owns the reports?', 'Materials made specifically for the client belong to the client once paid for; the consultant keeps their own methods and know-how.']] },
  { slug: 'employment-termination-letter', file: 'employment-termination-letter.docx', name: 'Termination letter', title: 'Free employment termination letter template (Word)', category: 'HR',
    intro: 'A clear, respectful notice of termination covering the end date, notice or pay in lieu, final pay, optional severance, return of company property and who to contact.',
    who: 'HR managers and small-business owners who need to confirm a termination in writing.',
    clauses: ['Employee, role and termination date', 'Optional reason', 'Notice period, garden leave, or pay in lieu of notice', 'Final pay and accrued time off', 'Optional severance', 'Return of company property', 'Benefits information and HR contact'],
    faq: [['Do I have to give a reason?', 'It depends on your country, state and contract. The reason line is optional; take advice before terminating anyone.'], ['Is this enough to terminate someone lawfully?', 'No letter alone makes a termination lawful. Notice rules, consultation, final pay deadlines and protected characteristics all vary by jurisdiction.']] },
  { slug: 'reference-letter', file: 'reference-letter.docx', name: 'Reference letter', title: 'Free employment reference letter template (Word)', category: 'HR',
    intro: 'A reference letter for a former employee or colleague with their role, dates, responsibilities, a list of strengths and an optional recommendation for a specific role.',
    who: 'Managers asked to write references, and HR teams who want them consistent.',
    clauses: ['Candidate, role and dates', 'How you know the candidate', 'Main responsibilities', 'Optional list of strengths', 'Optional recommendation for a target role', 'Your contact details'],
    faq: [['What should a reference include?', 'Facts you can stand behind: dates, role, responsibilities and strengths you observed. Keep opinions fair and accurate.'], ['Can I list several strengths?', 'Yes. Add as many as you like and each becomes a bullet point.']] },
  { slug: 'salary-increase-letter', file: 'salary-increase-letter.docx', name: 'Salary increase letter', title: 'Free salary increase letter template (Word)', category: 'HR',
    intro: 'A short letter confirming a pay rise: the old and new salary, the effective date, the first payslip that shows it, and an optional reason and new job title.',
    who: 'Managers and HR teams running pay reviews.',
    clauses: ['Current and new salary', 'Effective date', 'Optional reason for the increase', 'Optional change of job title', 'First pay date', 'Confirmation that other terms are unchanged'],
    faq: [['Should the letter explain the raise?', 'A short reason, such as a promotion or strong performance, is appreciated. It is optional.'], ['Can I do a whole pay review at once?', 'Yes. Start one draft per employee from the same template; each takes about a minute.']] },
  { slug: 'internship-offer-letter', file: 'internship-offer-letter.docx', name: 'Internship offer letter', title: 'Free internship offer letter template (Word)', category: 'HR',
    intro: 'An internship offer covering dates, paid or unpaid status, an optional stipend, weekly hours, remote or office location, supervisor, learning objectives and academic credit.',
    who: 'Startups and small companies taking on interns.',
    clauses: ['Role, team and dates', 'Pay rate, or unpaid with optional stipend', 'Hours and location', 'Supervisor', 'Learning objectives', 'Optional academic credit', 'Response deadline'],
    faq: [['Can internships be unpaid?', 'In many places unpaid internships are only lawful in narrow circumstances. Check your local rules before offering one.'], ['Does it support remote internships?', 'Yes. One question switches between remote and a named office.']] },
  { slug: 'service-agreement', file: 'service-agreement.docx', name: 'Service agreement', title: 'Free service agreement template (Word)', category: 'Business',
    intro: 'A general service agreement with a priced list of services, payment terms, optional deposit and late fee, a fixed or auto-renewing term, standard of work and a liability cap.',
    who: 'Service businesses such as cleaners, IT support, marketing agencies and trades.',
    clauses: ['Parties and services', 'Priced service items', 'Payment terms, optional deposit and late fee', 'Fixed term or automatic renewal', 'Standard of work', 'Limitation of liability', 'Governing law'],
    faq: [['Can the agreement renew automatically?', 'Yes. Choose auto-renewal, set the renewal period and the notice needed to cancel.'], ['Can I list several services with prices?', 'Yes. Add as many service items as you need; each gets its own line.']] },
  { slug: 'cease-and-desist-letter', file: 'cease-and-desist-letter.docx', name: 'Cease and desist letter', title: 'Free cease and desist letter template (Word)', category: 'Legal',
    intro: 'A cease and desist letter that describes the conduct, states the basis of the complaint, lists exactly what the recipient must do, sets a deadline and reserves your rights.',
    who: 'Businesses and their lawyers dealing with copying, harassment, unpaid use of work or misleading claims.',
    clauses: ['Recipient and sender', 'Description of the conduct', 'Optional intellectual property claim', 'List of required actions', 'Response deadline', 'Optional reservation of remedies'],
    faq: [['Should a lawyer send it?', 'A letter from a lawyer often carries more weight, and some claims have strict rules. Consider advice before sending, especially for defamation or IP.'], ['Can I demand several things?', 'Yes. Add each demand as a separate item; they become a bullet list.']] },
  { slug: 'promissory-note', file: 'promissory-note.docx', name: 'Promissory note', title: 'Free promissory note template (Word)', category: 'Finance',
    intro: 'A promissory note for a personal or business loan with the principal, optional interest, lump-sum or instalment repayment, prepayment, default after a grace period and an optional witness.',
    who: 'Friends, family and small businesses documenting a loan.',
    clauses: ['Borrower, lender and principal', 'Optional interest rate', 'Lump sum by a date, or instalments', 'Prepayment without penalty', 'Default after a grace period', 'Governing law', 'Signature and optional witness'],
    faq: [['Is there a maximum interest rate?', 'Many jurisdictions cap interest rates (usury laws). Check the limit where the borrower lives.'], ['Does it need a witness or notary?', 'Usually not, but some places or lenders require one. The witness line is optional.']] },
  { slug: 'resignation-letter', file: 'resignation-letter.docx', name: 'Resignation letter', title: 'Free resignation letter template (Word)', category: 'HR',
    intro: 'A professional resignation letter with your last working day, notice period, an optional reason, an offer to help with the handover and an optional thank-you.',
    who: 'Anyone leaving a job who wants to resign on good terms.',
    clauses: ['Formal notice of resignation', 'Last working day and notice period', 'Optional reason', 'Optional handover offer', 'Optional thanks', 'Signature'],
    faq: [['Do I have to give a reason?', 'No. The reason is optional and many people leave it out.'], ['How much notice should I give?', 'Check your contract; two to four weeks is common, and longer for senior roles.']] },
  { slug: 'web-design-contract', file: 'web-design-contract.docx', name: 'Web design contract', title: 'Free web design contract template (Word)', category: 'Freelance',
    intro: 'A web design contract that lists every page, sets the launch date and content deadline, limits revision rounds, and covers the deposit, optional monthly maintenance and who owns the finished site.',
    who: 'Freelance web designers, developers and small studios who want clients to sign before work starts.',
    clauses: ['Project description and a list of pages', 'Start date, launch date and client content deadline', 'Revision rounds and hourly rate for extra work', 'Total fee, optional deposit and payment terms', 'Optional monthly maintenance', 'Ownership on full payment, with the designer keeping its own code and tools', 'Optional portfolio rights', 'Third-party fonts, images and plugins', 'Termination and governing law'],
    faq: [['Who owns the website after it is paid for?', 'In this template the client owns the final design and content once the fee is paid in full, while the designer keeps its pre-existing code and tools and licenses them for use in the site. You can change that split in the Word file.'], ['How do I stop endless revisions?', 'Set the number of revision rounds included in the fee and an hourly rate for anything beyond them. The contract also moves the launch date if the client delivers content late.']] },
  { slug: 'graphic-design-contract', file: 'graphic-design-contract.docx', name: 'Graphic design contract', title: 'Free graphic design contract template (Word)', category: 'Freelance',
    intro: 'A graphic design contract for logos, brand identities and print or digital work, with deliverables and file formats, concept and revision limits, a flat or hourly fee, and a choice between transferring copyright or licensing the design.',
    who: 'Freelance graphic designers, illustrators and brand studios.',
    clauses: ['Project description and deliverables with file formats and due dates', 'Number of initial concepts and revision rounds', 'Flat fee, or hourly rate with an estimate', 'Optional deposit and payment terms', 'Copyright transfer on payment, or an exclusive licence', 'Source files included, or available for a fee', 'Optional portfolio rights', 'Cancellation with an optional kill fee'],
    faq: [['Should I transfer copyright or license the design?', 'Clients usually expect to own a logo outright, so transfer on payment is common. For illustrations or artwork you may prefer to keep the copyright and license specific uses. One question switches between the two.'], ['What is a kill fee?', 'A fee the client pays if they cancel the project after work has started, on top of paying for work done, to compensate for time you turned other work away.']] },
  { slug: 'photography-contract', file: 'photography-contract.docx', name: 'Photography contract', title: 'Free photography contract template (Word)', category: 'Freelance',
    intro: 'A photography contract for events, portraits and commercial shoots, covering the date, location and hours, a booking retainer, delivery of edited images, optional prints and travel fees, cancellation, and personal or commercial usage rights.',
    who: 'Wedding, event, portrait and commercial photographers.',
    clauses: ['Shoot description, date, location and hours of coverage', 'Optional second photographer', 'Number of edited images and delivery time', 'Optional prints list', 'Total fee, booking retainer and balance due date', 'Optional travel fee', 'Cancellation, rescheduling and what happens if the photographer cannot attend', 'Copyright stays with the photographer; personal or commercial licence', 'Optional portfolio use'],
    faq: [['Who owns the copyright in the photos?', 'In most countries the photographer owns the copyright unless they sign it away. This template keeps copyright with the photographer and gives the client a personal or commercial licence, which is the usual arrangement.'], ['Is the retainer refundable?', 'In this template the retainer is kept if the client cancels within the cancellation window, because the date was reserved for them. Consumer protection rules in some places limit non-refundable deposits, so check what applies to you.']] },
  { slug: 'social-media-management-contract', file: 'social-media-management-contract.docx', name: 'Social media management contract', title: 'Free social media management contract template (Word)', category: 'Freelance',
    intro: 'A social media management contract listing each platform and posting frequency, with optional community management, paid ads and reporting, an approval process, a monthly fee, a minimum term and clear ownership of accounts and content.',
    who: 'Freelance social media managers, content creators and small agencies.',
    clauses: ['Platforms and posts per week for each', 'Optional community management with response times', 'Optional paid ads with a monthly budget paid by the client', 'Content approval deadline', 'Optional regular reports', 'Monthly fee and payment terms', 'Client owns its accounts; content belongs to the client once paid for', 'No guarantee of followers or sales', 'Minimum term, then month to month with notice'],
    faq: [['Who pays for ads?', 'The client pays the platforms directly for ad spend within the agreed budget; the monthly fee only covers the manager\'s work. That keeps ad spend off your invoices and your cash flow.'], ['Should I guarantee results?', 'No. Reach and engagement depend on platforms and algorithms you do not control. The template says so plainly to avoid disputes.']] },
  { slug: 'freelance-writing-contract', file: 'freelance-writing-contract.docx', name: 'Freelance writing contract', title: 'Free freelance writing contract template (Word)', category: 'Freelance',
    intro: 'A freelance writing contract with a list of assignments, each with its word count, due date and fee, plus revisions, originality and optional AI-use disclosure, payment and kill fee, rights and byline.',
    who: 'Freelance writers, copywriters, journalists and the editors who commission them.',
    clauses: ['Assignments with word count, due date and fee', 'Revision rounds and revision window', 'Originality, with optional disclosure of AI tool use', 'Invoicing on delivery and payment terms', 'Optional kill fee as a percentage', 'All rights assigned, or specific rights licensed', 'Byline or no byline', 'Independent contractor status'],
    faq: [['Should a writing contract mention AI?', 'More clients now ask. The template has an optional promise to tell the client if AI tools were used in drafting, which you can switch on or off.'], ['What rights should I grant?', 'Clients commissioning web content usually want all rights. For articles, writers often license first publication or a time-limited exclusive and keep the rest. One question switches between the two.']] },
  { slug: 'video-production-contract', file: 'video-production-contract.docx', name: 'Video production contract', title: 'Free video production contract template (Word)', category: 'Freelance',
    intro: 'A video production contract listing each video with its length and format, the shoot and delivery dates, edit rounds, deposit and expenses, who owns the final videos and the raw footage, and cancellation terms.',
    who: 'Videographers, video editors and small production companies.',
    clauses: ['Project and a list of videos with length and format', 'Pre-production, filming, first cut and final delivery dates', 'Edit rounds and hourly rate for extra edits', 'Total fee, optional deposit and payment terms', 'Optional expenses at cost with an approval limit', 'Music licences, releases and client permissions', 'Client owns final videos; raw footage delivered or kept', 'Optional portfolio use and cancellation terms'],
    faq: [['Who owns the raw footage?', 'In this template the client owns the final edited videos once paid, and you choose whether raw footage is included or kept by the producer for a set period and available for a fee.'], ['How do I handle expenses?', 'Switch on the expenses clause to charge travel, equipment hire, locations and talent at cost with receipts, with client approval needed above a limit you set.']] },
  { slug: 'virtual-assistant-agreement', file: 'virtual-assistant-agreement.docx', name: 'Virtual assistant agreement', title: 'Free virtual assistant contract template (Word)', category: 'Freelance',
    intro: 'A virtual assistant agreement with a task list, a monthly retainer of hours or an hourly rate, availability and response times, secure handling of logins, optional data handling terms, and notice to end.',
    who: 'Virtual assistants, online business managers and the small businesses that hire them.',
    clauses: ['List of tasks', 'Monthly retainer of hours, or an hourly rate', 'Availability, time zone and response time', 'Logins through a password manager; access removed at the end', 'Optional personal data handling terms', 'Client-paid software and approved expenses', 'Independent contractor status', 'Notice period and governing law'],
    faq: [['Retainer or hourly?', 'A retainer of monthly hours gives both sides predictable income and cost; hourly suits irregular work. One question switches between them.'], ['What about client data?', 'If you handle customers\' personal data, switch on the data handling clause. Some laws, such as the GDPR, require a written agreement covering this.']] },
  { slug: 'event-planning-contract', file: 'event-planning-contract.docx', name: 'Event planning contract', title: 'Free event planning contract template (Word)', category: 'Freelance',
    intro: 'An event planning contract covering the event, a list of services, optional day-of coordination, a flat or percentage fee with a retainer, how vendors are booked and paid, cancellation, postponement and events beyond anyone\'s control.',
    who: 'Wedding planners, event coordinators and party planners.',
    clauses: ['Event type, date, venue and guest count', 'List of planning services', 'Optional day-of coordination hours', 'Flat fee or percentage of the event budget', 'Non-refundable retainer and balance due date', 'Client contracts vendors directly; no spending without approval', 'Optional disclosure of vendor commissions', 'Cancellation, postponement and events beyond control'],
    faq: [['Should I charge a flat fee or a percentage?', 'A percentage of the budget scales with bigger events; a flat fee is easier for clients to understand. The template supports both.'], ['What if the venue closes or the event is postponed?', 'The template credits payments to a new date within a period you set, and neither party is liable for events beyond its reasonable control.']] },
  { slug: 'personal-training-agreement', file: 'personal-training-agreement.docx', name: 'Personal training agreement', title: 'Free personal trainer contract template (Word)', category: 'Freelance',
    intro: 'A personal training agreement for session packages or pay-per-session, with a late cancellation rule, a health declaration, optional medical clearance, a plain statement of exercise risk and refund terms.',
    who: 'Personal trainers, fitness coaches and small studios.',
    clauses: ['Session package with expiry, or price per session', 'Session length and location', 'Late cancellation rule', 'Health declaration and optional doctor\'s clearance', 'Exercise risk, without excluding liability the law does not allow', 'No guaranteed results', 'Refund or transfer of unused sessions'],
    faq: [['Can I make clients waive all liability?', 'No. Most legal systems do not allow you to exclude liability for your own negligence causing injury, and trying to can undermine the whole clause. The template states the risks plainly instead.'], ['Should I ask for medical clearance?', 'For clients with known conditions, injuries or who are returning to exercise, asking for a doctor\'s clearance is sensible. One question adds it.']] },
  { slug: 'tutoring-agreement', file: 'tutoring-agreement.docx', name: 'Tutoring agreement', title: 'Free tutoring agreement template (Word)', category: 'Freelance',
    intro: 'A tutoring agreement between a tutor and a parent covering subjects and goals, online or in-person sessions, hourly fees, cancellation, optional progress reports, safeguarding and academic honesty.',
    who: 'Private tutors, tutoring businesses and parents arranging tutoring.',
    clauses: ['Subjects, level and learning goals', 'Sessions per week and session length', 'Online platform or in-person location', 'Hourly fee and invoicing', 'Cancellation notice', 'Optional progress updates', 'Safeguarding: recording consent or an adult present; optional background check', 'No completing graded work for the student'],
    faq: [['Why is the agreement with the parent?', 'When the student is a child, the parent or guardian is the one agreeing to the service and paying for it. For adult learners, change "Parent" to the student\'s name in the Word file.'], ['Should I mention background checks?', 'Many parents ask. Switch on the clause if you hold a current check, such as a DBS certificate in the UK.']] },
];

function questionsFor(file) {
  const q = inferQuestionnaire(inspectDocx(readFileSync(new URL(`../samples/${file}`, import.meta.url))));
  const kind = (f) => (f.role === 'condition' && f.type === 'checkbox' ? 'Yes / no' : FIELD_TYPES[f.type].label);
  return q.fields.map((f) => ({ label: f.label, kind: kind(f), when: f.showIf, children: (f.children || []).map((c) => c.label) }));
}

const faqLd = (faq) => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) })}</script>`;
const crumbsLd = (items) => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + url })) })}</script>`;
const COMMON_FAQ = [
  ['Is it really free?', 'Yes. The template download is free, and the Clausery app is free for up to three templates with unlimited documents. No account or card is needed.'],
  ['Is my information uploaded anywhere?', 'No. Clausery runs entirely in your browser. Your answers and the finished document are created and stored on your own device.'],
  ['Is this legal advice?', 'No. These are general samples. Laws differ between countries and states, so have the wording reviewed for your situation before you rely on it.'],
];

for (const [t, g] of Object.entries(GUIDE_FOR)) if (!GUIDE[g] || !LIB.some((x) => x.slug === t)) throw new Error(`GUIDE_FOR: ${t} -> ${g}`);

export const pages = [
  {
    path: 'templates/', title: 'Free Word document templates',
    description: 'Free Word (.docx) templates for NDAs, engagement letters, offer letters, contractor agreements, statements of work and more. Fill them in your browser; nothing is uploaded.',
    extraHead: crumbsLd([['Home', ''], ['Templates', 'templates/']]),
    body: (rel) => `
<section class="section"><div class="wrap">
  <p class="eyebrow">Free template library</p>
  <h1>Free Word templates you can fill in without uploading anything</h1>
  <p class="lead">Download any template as a normal Word file, or fill it in right here: answer a few questions and get a finished .docx. Everything happens in your browser, so client and employee details never leave your computer.</p>
  <div class="grid grid-3" style="margin-top:2rem">
    ${LIB.map((t) => `<a class="feature" style="text-decoration:none;color:inherit" href="${rel}templates/${t.slug}.html"><span class="badge">${t.category}</span><h2 style="font-size:1.15rem;margin-top:.75rem">${esc(t.name)}</h2><p>${esc(t.intro)}</p></a>`).join('')}
  </div>
  <p class="small muted" style="margin-top:2rem">These are general samples, not legal advice. Have them reviewed for your jurisdiction before use.</p>
</div></section>`,
  },
  ...LIB.map((t) => {
    const qs = questionsFor(t.file);
    const faq = [...t.faq, ...COMMON_FAQ];
    return {
      path: `templates/${t.slug}.html`, title: t.title, ogImage: `assets/og/${t.slug}.png`,
      description: `Free ${/^[A-Z][a-z]/.test(t.name) ? t.name[0].toLowerCase() + t.name.slice(1) : t.name} template for Word. Fill it in online in minutes or download the .docx; nothing is uploaded. ${t.intro}`,
      extraHead: faqLd(faq) + crumbsLd([['Home', ''], ['Templates', 'templates/'], [t.name, `templates/${t.slug}.html`]]),
      body: (rel) => `
<section class="section"><div class="wrap" style="max-width:52rem">
  <nav class="small muted" aria-label="Breadcrumb"><a href="${rel}">Home</a> › <a href="${rel}templates/">Templates</a> › ${esc(t.name)}</nav>
  <h1 style="margin-top:1rem">${esc(t.title)}</h1>
  <p class="lead">${esc(t.intro)}</p>
  <div class="actions" style="display:flex;gap:.75rem;flex-wrap:wrap;margin:1.5rem 0">
    <a class="btn btn-primary btn-lg" href="${rel}app/#/start/${t.slug}">Fill it in now, free</a>
    <a class="btn btn-lg" href="${rel}samples/${t.file}" download>Download the Word template</a>
  </div>
  <p class="small muted">No sign-up. Your answers stay in your browser. <strong>Who it is for:</strong> ${esc(t.who)}</p>

  <h2 style="margin-top:2.5rem">What is in the ${esc(t.name.toLowerCase())}</h2>
  <ul>${t.clauses.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>

  <h2 style="margin-top:2.5rem">The questions you answer</h2>
  <p>Clausery turns the template into a short questionnaire. Optional parts only appear when they apply.</p>
  <div class="table-wrap" tabindex="0"><table class="compare"><thead><tr><th scope="col">Question</th><th scope="col">Type</th><th scope="col">Asked when</th></tr></thead><tbody>
    ${qs.map((q) => `<tr><td>${esc(q.label)}${q.children.length ? `<div class="small muted">For each item: ${esc(q.children.join(', '))}</div>` : ''}</td><td>${esc(q.kind)}</td><td class="small">${q.when ? `<code>${esc(q.when)}</code>` : 'Always'}</td></tr>`).join('')}
  </tbody></table></div>

  <h2 style="margin-top:2.5rem">How to use it</h2>
  <ol class="steps" style="grid-template-columns:1fr">
    <li><h3>Open it</h3><p>Click <em>Fill it in now</em>. The template opens in Clausery with its questionnaire ready.</p></li>
    <li><h3>Answer the questions</h3><p>Work through the sections. Drafts save as you type, on your device.</p></li>
    <li><h3>Download the document</h3><p>Get a finished Word file with your formatting intact, or print it to PDF.</p></li>
  </ol>
  <p>Prefer to start from your own wording? Download the Word file, edit it, keep the <code>{tags}</code>, and upload it to Clausery. See the <a href="${rel}docs/templates.html">template syntax</a>.</p>

  <h2 style="margin-top:2.5rem">Questions</h2>
  <div class="faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>

${CLAUSES.some((c) => c.templates.includes(t.slug)) ? `  <h2 style="margin-top:2.5rem">Clauses in this template, explained</h2>
  <ul>${CLAUSES.filter((c) => c.templates.includes(t.slug)).map((c) => `<li><a href="${rel}clauses/${c.slug}.html">${esc(c.name)}</a></li>`).join('')}</ul>
` : ''}${GUIDE_FOR[t.slug] ? `  <p style="margin-top:2rem"><strong>Guide:</strong> <a href="${rel}guides/${GUIDE_FOR[t.slug]}.html">${esc(GUIDE[GUIDE_FOR[t.slug]].title)}</a></p>
` : ''}  <h2 style="margin-top:2.5rem">More free templates</h2>
  <ul>${LIB.filter((x) => x.slug !== t.slug).map((x) => `<li><a href="${rel}templates/${x.slug}.html">${esc(x.name)}</a></li>`).join('')}</ul>
  <p class="small muted" style="margin-top:2rem">This template is a general sample and not legal advice. Laws vary by jurisdiction; have it reviewed before use.</p>
</div></section>`,
    };
  }),
];
