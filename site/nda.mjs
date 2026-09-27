// The NDA hub: one page that helps people pick the right NDA template, aimed at "free NDA template" searches.
import { esc, faqLd, faqHtml, crumbsLd } from '../tools/partials.mjs';
import { LIB, NDA_SLUGS } from './library.mjs';

const T = Object.fromEntries(LIB.filter((t) => NDA_SLUGS.includes(t.slug)).map((t) => [t.slug, t]));
for (const s of NDA_SLUGS) if (!T[s]) throw new Error('NDA hub: no template ' + s);

const CHOOSE = [
  ['Both sides will share confidential information: partnership talks, a joint project, a vendor evaluation', 'mutual-nda'],
  ['Only you are sharing: pitching an idea, showing a prototype, briefing an agency', 'one-way-nda'],
  ['You are hiring an employee who will see customer lists, pricing, code or plans', 'employee-nda'],
  ['You are hiring a freelancer or contractor, or you are a freelancer asked to sign one', 'contractor-nda'],
  ['You are selling a business and a buyer wants to see the numbers', 'business-sale-nda'],
];

const FAQ = [
  ['Is a free NDA template legally binding?', 'An NDA is a contract, so it binds the people who sign it if it is clear, reasonable and supported by something of value, such as the other side sharing information or the start of a job. Where the wording came from does not matter; whether it fits your situation does. For a large deal or sensitive technology, have a lawyer review it.'],
  ['Does an NDA need to be notarized or witnessed?', 'Usually not. In most places an NDA is valid once both parties sign it, and electronic signatures are accepted in the US and many other countries.'],
  ['Should I use a mutual or a one-way NDA?', 'Use a one-way NDA when only one side shares confidential information, and a mutual NDA when both do. If you are unsure, a mutual NDA does no harm and is often quicker to agree.'],
  ['How long should an NDA last?', 'One to five years is common for ordinary business information, measured from signing or from the end of the project or job. Trade secrets are usually protected for as long as they stay secret.'],
  ['What happens if someone breaks an NDA?', 'You can sue for the loss it caused, and a court can order them to stop using or sharing the information. Loss from a leak is hard to prove, which is why most NDAs say an injunction may be needed.'],
  ['Can an NDA stop someone reporting wrongdoing?', 'No. An NDA cannot stop someone reporting a possible crime or violation to a government agency. In the US, clauses signed before a dispute cannot silence sexual harassment or assault claims, and most employees are free to discuss their pay. The employee and contractor templates say this plainly.'],
  ['Are these templates really free?', 'Yes. Every NDA template downloads as a Word file with no account, trial or card. You can also fill one in online; your answers stay in your browser and are never uploaded.'],
];

export const pages = [{
  path: 'nda-templates/', title: 'Free NDA templates (Word): mutual, one-way, employee',
  description: 'Free NDA templates for Word: mutual, one-way, employee, contractor and business sale. Download or fill one in online, with no sign-up and nothing uploaded.',
  extraHead: faqLd(FAQ) + crumbsLd([['Home', ''], ['Templates', 'templates/'], ['NDA templates', 'nda-templates/']]),
  body: (rel) => `
<section class="section"><div class="wrap" style="max-width:56rem">
  <nav class="small muted" aria-label="Breadcrumb"><a href="${rel}">Home</a> › <a href="${rel}templates/">Templates</a> › NDA templates</nav>
  <h1 style="margin-top:1rem">Free NDA templates for Word</h1>
  <p class="lead">Five free non-disclosure agreement templates, also called confidentiality agreements, one for each common situation. Pick the one that matches who is sharing information, then download the Word file or fill it in online in a few minutes. There is no account, no trial and no card, and nothing you type is uploaded.</p>

  <h2 style="margin-top:2.5rem">Which NDA do you need?</h2>
  <div class="table-wrap" tabindex="0"><table class="compare"><thead><tr><th scope="col">Your situation</th><th scope="col">Template</th><th scope="col">Get it</th></tr></thead><tbody>
    ${CHOOSE.map(([when, s]) => `<tr><td>${esc(when)}</td><td><a href="${rel}templates/${s}.html">${esc(T[s].name)}</a></td><td class="small"><a href="${rel}app/#/start/${s}">Fill it in</a> · <a href="${rel}samples/${T[s].file}" download>Word file</a></td></tr>`).join('')}
  </tbody></table></div>

  <div class="grid grid-3" style="margin-top:2rem">
    ${NDA_SLUGS.map((s) => `<a class="feature" style="text-decoration:none;color:inherit" href="${rel}templates/${s}.html"><span class="badge">NDA</span><h3 style="font-size:1.15rem;margin-top:.75rem">${esc(T[s].name)}</h3><p>${esc(T[s].intro)}</p></a>`).join('')}
  </div>

  <h2 style="margin-top:2.5rem">What every NDA should include</h2>
  <ul>
    <li><strong>The right parties</strong>, with full legal names, so the company that shares the information is the one protected.</li>
    <li><strong>A narrow purpose</strong>, such as "evaluating a possible partnership", which limits what the information can be used for.</li>
    <li><strong>A clear definition of confidential information</strong>, with the standard exclusions for public information and information already known. See the <a href="${rel}clauses/confidentiality-clause.html">confidentiality clause</a>.</li>
    <li><strong>How long it lasts</strong>, and how long the duty of confidence <a href="${rel}clauses/survival-clause.html">survives</a> after it ends.</li>
    <li><strong>Return or deletion</strong> of the information when talks end.</li>
    <li><strong>Governing law</strong>, so everyone knows which courts and rules apply. See the <a href="${rel}clauses/governing-law-clause.html">governing law clause</a>.</li>
  </ul>
  <p>The full checklist is in <a href="${rel}guides/what-to-include-in-an-nda.html">what to include in an NDA</a>. For choosing between the two main types, read <a href="${rel}guides/mutual-vs-one-way-nda.html">mutual vs one-way NDA</a>, and for picking a term, <a href="${rel}guides/how-long-should-an-nda-last.html">how long an NDA should last</a>.</p>

  <h2 style="margin-top:2.5rem">What these templates do differently</h2>
  <ul>
    <li><strong>They ask, you answer.</strong> Clausery turns each template into a short questionnaire, so names, dates and terms land in the right places and optional clauses appear only when you want them.</li>
    <li><strong>The employee and contractor versions carry the notices US law expects</strong>, including the Defend Trade Secrets Act whistleblower notice and a plain statement that the NDA does not stop anyone reporting wrongdoing.</li>
    <li><strong>No hidden non-compete.</strong> None of the NDAs stop anyone working elsewhere. They only protect confidential information.</li>
    <li><strong>Private by design.</strong> Everything runs in your browser. Deal names, salaries and client details never reach a server.</li>
  </ul>
  <p>If you only need one standard mutual NDA for a software deal, Common Paper's free mutual NDA is also widely used and worth a look. Clausery covers more situations and fills in the details for you.</p>

  <h2 style="margin-top:2.5rem">Questions</h2>
  ${faqHtml(FAQ)}

  <h2 style="margin-top:2.5rem">Related</h2>
  <ul>
    <li><a href="${rel}templates/non-solicitation-agreement.html">Non-solicitation agreement</a>, to protect customer and staff relationships as well as information</li>
    <li><a href="${rel}guides/nda-vs-confidentiality-agreement.html">NDA vs confidentiality agreement</a>, and how both differ from non-solicitation and non-compete agreements</li>
    <li><a href="${rel}clauses/non-solicitation-clause.html">Non-solicitation clause</a>, used in the business sale NDA</li>
    <li><a href="${rel}templates/letter-of-intent.html">Letter of intent</a>, the usual next step after a business sale NDA</li>
    <li><a href="${rel}templates/independent-contractor-agreement.html">Independent contractor agreement</a>, for the work itself alongside a contractor NDA</li>
    <li><a href="${rel}templates/">All ${LIB.length} free templates</a></li>
  </ul>
  <p class="small muted" style="margin-top:2rem">These templates are general samples, not legal advice. Laws differ between countries and states; have an NDA reviewed for your situation before you rely on it.</p>
</div></section>`,
}];
