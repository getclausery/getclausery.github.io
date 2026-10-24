import { REPO_URL, CONTACT_EMAIL, CONTACT_URL, ANALYTICS_ON, ANALYTICS_SINCE, ONLINE_KEYS, CHECKOUT_SINCE, USAGE_ON, USAGE_SINCE, longDate, mailto } from '../tools/partials.mjs';
import { TRIAL_DAYS, REFUND_DAYS } from '../app/config.js';
// Later changes to what the policy describes: 2026-10-15 added the free trial, the Free plan's credit line and the
// upgrade and trial counts.
const POLICY_UPDATES = ['2026-10-15'];
// The policy's effective date is the last change to what it describes: the visit counter, the online checkout, the app
// counts and the updates above.
const EFFECTIVE = [ANALYTICS_ON && ANALYTICS_SINCE, ONLINE_KEYS && CHECKOUT_SINCE, USAGE_ON && USAGE_SINCE, ...POLICY_UPDATES].filter(Boolean).sort().pop();
/* What the app itself counts once USAGE_COUNTER is set in app/config.js (app/lib/usage.js). */
const APP_COUNTS = `\n<h2>App usage counts</h2>\n<p>To learn which templates people use, the app tells <a href="https://www.goatcounter.com/" rel="noopener">GoatCounter</a> when it is opened, when a draft is started and when a document is downloaded, printed, shared or made from a spreadsheet, and, to learn whether the paid plans make sense, when the upgrade dialog is shown (with the feature asked for), a checkout button is selected, or the free trial starts or ends. Each count is the event and, for a template from our library, which one (for example "document-download/invoice"); a template of your own is counted only as "own". Your answers, file names, template contents and documents are never part of it. GoatCounter uses no cookies or local storage and does not store IP addresses, under <a href="https://www.goatcounter.com/help/privacy" rel="noopener">its privacy policy</a>. Copies of Clausery hosted anywhere else, including your own, never send these counts.</p>`;
const page = (path, title, description, body) => ({ path, title, description, body: (rel) => `<section class="section"><div class="wrap prose">${body(rel)}</div></section>` });
export const pages = [
page('legal/privacy.html', 'Privacy policy', 'How Clausery keeps document contents on your device and handles license checks, purchases, support and cookieless analytics.', (rel) => `
<h1>Privacy policy</h1>
<p class="muted">Effective ${EFFECTIVE ? longDate(EFFECTIVE) : '2 October 2026'}</p>
<h2>Summary</h2>
<p>Clausery is designed so that we cannot see your data. The application runs entirely in your web browser, stores its data only on your device, and only ever requests its own files from the site that serves it${ONLINE_KEYS ? ', plus a license check if you activate a key bought online' : ''}${USAGE_ON ? ', plus the anonymous usage counts described below' : ''}; it never sends your templates, answers or documents anywhere. We do not operate accounts${USAGE_ON ? '' : ANALYTICS_ON ? ', and the app has no analytics' : ', analytics,'} or servers that receive your templates, answers or documents.${USAGE_ON ? ' The app counts a few anonymous events (described below) that contain nothing you type.' : ''}</p>
<h2>What the app processes</h2>
<p>Templates (.docx files), the answers you enter, generated documents, settings, license keys and the dates of a free Pro trial are processed in your browser and stored in its local database. This data is under your control and is never transmitted to us or to any third party by the app${ONLINE_KEYS ? ', with one exception: if you activate a license key bought online, the app sends that key and an activation ID for this browser to Lemon Squeezy, our payment provider, when you activate it and about once a week, so the license follows your subscription. Nothing else is included in that request' : ''}.</p>
<p>On the Free plan, documents made from library templates end with a small “Made with Clausery” line that links to our website. The link is the same in every document: it identifies no person, business or document.</p>
<h2>What the website host receives</h2>
<p>The public instance is served as static files by GitHub Pages. Like any web server, GitHub may log the IP address, browser type and requested URLs of visitors for security and operational purposes, under <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener">GitHub's privacy statement</a>. ${ANALYTICS_ON ? 'We receive no visitor data from GitHub.</p>\n<h2>Website visit counts</h2>\n<p>To count visits to the website, the pages outside the app load <a href="https://www.cloudflare.com/web-analytics/" rel="noopener">Cloudflare Web Analytics</a>. It records the page visited, the referring site, and the browser, device type and country, without cookies or local storage and without fingerprinting or tracking individual visitors, under <a href="https://www.cloudflare.com/privacypolicy/" rel="noopener">Cloudflare\'s privacy policy</a>. The app, the embedded calculators and anything you type are never counted. Blocking the script has no effect on how the site works.</p>' + (USAGE_ON ? APP_COUNTS : '') : 'We do not add cookies, analytics or tracking of any kind, and we receive no visitor data from GitHub.</p>' + (USAGE_ON ? APP_COUNTS : '')}
<h2>Purchases and support</h2>
${ONLINE_KEYS ? '<p>After payment, the Open Clausery button in the confirmation and receipt activates your plan automatically. That private access link carries a license credential in its URL. The initial URL is sent to our website host, GitHub Pages. The activation page has no visitor analytics and does not send the URL as a referrer. The app clears the credential from the address before activation, verifies it with Lemon Squeezy and stores the browser activation locally. Keep the access link private and share it only with users covered by your plan.</p>' : ''}
<p>If you buy a license or contact us, we receive the information you provide (typically your name, email address and organisation) and payment details are handled by the payment provider shown at checkout${ONLINE_KEYS ? ' (Lemon Squeezy, which acts as the merchant of record and issues the license key)' : ''}, under their privacy policy. Contact, support and offline-key requests go by email to <a href="${CONTACT_URL}">${CONTACT_EMAIL}</a>; the email providers process those messages under their own privacy policies. Public bug reports on our <a href="${REPO_URL}" rel="noopener">GitHub repository</a> are visible to everyone, so do not include private details there. We use purchase and support records to issue license keys, provide support and send invoices, and keep them for as long as required by tax and accounting law. We do not sell or share them for marketing.</p>
<h2>Your rights</h2>
<p>Because the app holds no data about you, the data-subject rights under the GDPR, UK GDPR and CCPA apply to the purchase and support records described above. To access, correct or delete them, open a request through the <a href="${rel}contact/">contact page</a> saying only that you have a privacy request; we will reply with a private way to verify and complete it.</p>
<h2>Children</h2>
<p>Clausery is a business tool and is not directed at children.</p>
<h2>Changes</h2>
<p>We will post changes to this policy on this page with a new effective date.</p>`),

page('legal/terms.html', 'Terms of service', `Terms under which Clausery is provided: license, the free trial, fees and the ${REFUND_DAYS}-day money-back guarantee, warranties and liability.`, (rel) => `
<h1>Terms of service</h1>
<p class="muted">Effective 15 October 2026</p>
<h2>1. The service</h2>
<p>Clausery ("the software") is a browser application for assembling documents from templates you supply. It is provided by Clausery ("we"). By using the software you agree to these terms.</p>
<h2>2. License</h2>
<p>We grant you a non-exclusive, non-transferable right to use the software for your internal business purposes. Free-plan features may be used without charge. Paid features are unlocked by a license key issued to a named user or, for Team licenses, to a number of seats; keys may not be shared beyond the licensed users. A free trial of paid features may be started once per browser: it lasts ${TRIAL_DAYS} days, needs no payment details and ends by itself, after which the Free plan applies. You may not remove notices from the software, resell it, or circumvent license verification. This does not cover your generated documents, which are yours (section 3).</p>
<h2>3. Your content</h2>
<p>You own your templates, answers and generated documents. The software processes them only on your device. You are responsible for the content of your templates and for reviewing every generated document before use.</p>
<h2>4. Not legal, tax or professional advice</h2>
<p>The software fills in templates. It does not provide legal, tax, financial or other professional advice, and the sample templates are illustrations only, not forms suitable for any particular jurisdiction or purpose.</p>
<h2>5. Data on your device</h2>
<p>Your data is stored in your browser. You are responsible for backups. We cannot recover data that is deleted, lost, or encrypted with a forgotten passphrase.</p>
<h2>6. Fees</h2>
<p>Paid plans are billed as shown at purchase. Subscriptions renew automatically for the same period until cancelled. You can cancel at any time from Manage subscription in the app's Settings or from your receipt email; cancelling stops future renewals. A one-time (lifetime) purchase, where offered, covers its plan for one named user for as long as we offer the software and does not renew.</p>
<p><strong>${REFUND_DAYS}-day money-back guarantee.</strong> If you are not satisfied, email us within ${REFUND_DAYS} days of your first payment for a plan and we will refund that payment in full, without asking for a reason. Apart from that guarantee, and except where required by law, fees are non-refundable, but we will refund any purchase or renewal made in error if you ask within 14 days. Refunds go back to the original payment method through our payment provider, and the plan the refunded payment paid for ends.</p>
<h2>7. Warranty and liability</h2>
<p>The software is provided "as is". To the maximum extent permitted by law, we disclaim all warranties, and our total liability arising from the software or these terms is limited to the amount you paid us in the twelve months before the claim. We are not liable for indirect or consequential loss.</p>
<h2>8. Termination</h2>
<p>You may stop using the software at any time. We may terminate a license for breach of these terms. Sections 3–7 survive termination.</p>
<h2>9. Governing law</h2>
<p>These terms are governed by the laws of the jurisdiction in which Clausery is established, and disputes are subject to the courts of that jurisdiction, without prejudice to mandatory consumer protection where it applies.</p>
<h2>10. Contact</h2>
<p>See the <a href="${rel}contact/">contact page</a>.</p>
<h2>11. License to the code; trademark; anti-impersonation</h2>
<p>The source code for Clausery is published under the GNU AGPL-3.0-or-later with a trademark exception (see <a href="${rel}legal/license.html">the open-source license page</a> and <a href="${REPO_URL}/blob/main/TRADEMARKS.md" rel="noopener">TRADEMARKS.md</a>). That license lets you run, modify and redistribute the code under its conditions, including publishing source for modified network copies. It does <strong>not</strong> authorise you to:</p>
<ul>
  <li>Use the "Clausery" name, logo, domain, app icon, product screenshots, marketing copy or other brand assets to present any other service, fork or copy as Clausery, as affiliated with Clausery, or as endorsed by Clausery, except under a written commercial license.</li>
  <li>Remove, obscure or alter the copyright notices, license banners, source-on-GitHub links or attribution watermarks from the HTML, JavaScript, CSS or SVG files we distribute. Doing so is removal of copyright management information under 17 U.S.C. §1202 and a breach of AGPL s5.</li>
  <li>Register "Clausery" or a confusingly similar word mark, domain name, social-media handle, browser-extension ID, app-store listing or search ad keyword in any jurisdiction for a document, invoice or template product.</li>
  <li>Purchase search ads against the "Clausery" brand term to redirect users to a competing document product.</li>
  <li>Offer a publicly-hosted modified copy of Clausery under the Clausery name without a commercial license and without publishing your modifications as required by AGPL s13.</li>
</ul>
<p>We enforce these terms through the DMCA, the UDRP for domains, the hosting provider's trademark and abuse process, and where applicable the Google/GitHub/Cloudflare pages for impersonation. Report impersonation or copy-fraud via the <a href="${rel}legal/dmca.html">DMCA / takedown page</a>.</p>`),

page('legal/dpa.html', 'Data processing statement', 'For procurement and compliance teams: why Clausery involves no processing of personal data by the vendor, and what to record.', (rel) => `
<h1>Data processing statement</h1>
<p class="muted">For procurement, privacy and information-security reviews</p>
<h2>Role of the vendor</h2>
<p>Clausery does not process personal data on behalf of customers. The software executes on the customer's devices; no customer content is transmitted to, stored by, or accessible to the vendor. Consequently the vendor is not a <em>processor</em> under Article 28 GDPR (or a service provider under the CCPA) for content handled in the software, and a data processing agreement covering that content is not required. We are happy to sign a short attestation to this effect for your records.</p>
<h2>Records of processing</h2>
<p>When recording the use of Clausery in a register of processing activities, the accurate description is: <em>"Document assembly software executed locally in employees' browsers; no transfer to the supplier; data stored on managed endpoints under the organisation's device policies."</em></p>
<h2>Sub-processors</h2>
<p>None for customer content. The public web host (GitHub Pages) serves the application files and receives standard web-server logs from visitors' browsers${ONLINE_KEYS ? "; Lemon Squeezy, our payment provider, receives the license key and this browser's activation ID when the app checks a key bought online, and that request carries no customer content" : ''}; customers who prefer no third party in the delivery path can <a href="${rel}docs/self-hosting.html">self-host</a>.</p>
<h2>Security measures</h2>
<p>See the <a href="${rel}docs/security.html">security overview</a>: client-side architecture, strict content security policy, no third-party code at runtime, optional AES-256-GCM encryption at rest, ${ONLINE_KEYS ? 'license checks that carry only the license key and browser activation ID' : 'offline license verification'}.</p>
<h2>International transfers</h2>
<p>None by the vendor.</p>
<h2>Contact</h2>
<p>See the <a href="${rel}contact/">contact page</a>. For a signed attestation, say so in a question and we will arrange a private channel.</p>`),

page('legal/license.html', 'Open-source license (AGPLv3) and commercial licensing', 'Clausery is open source under the GNU AGPLv3, with commercial licenses available for white-label use.', (rel) => `
<h1>Open source, not open season</h1>
<p class="lead">Clausery is free software — free to use, read, modify and self-host — but the Clausery name and logos are trademarks, and anyone offering a modified version over a network has to publish their changes. Here is how that works.</p>

<h2>Code license: GNU AGPLv3</h2>
<p>Everything in this repository — the document engine, UI, templates and public site — is published under the <a href="https://www.gnu.org/licenses/agpl-3.0.en.html" rel="noopener">GNU Affero General Public License, version 3</a>, or (at your option) any later version. That is the same license WordPress, Nextcloud, GitLab Community Edition, Mastodon and many other network software products use. You can read the full legal text in <a href="${rel}LICENSE">LICENSE</a>.</p>
<p>What that means in practice:</p>
<ul>
  <li><strong>Use it:</strong> run Clausery for yourself, your team or your company, for free.</li>
  <li><strong>Study it:</strong> read every line of code, including the parts that assemble the .docx and the parts that verify license keys. There are no obfuscated binaries.</li>
  <li><strong>Modify it:</strong> patch it, add templates, translate it, run it on your own domain for your team.</li>
  <li><strong>Redistribute it:</strong> give copies to other people, publicly or commercially, AS LONG AS you keep the AGPLv3 license on the copy and publish the corresponding source code of your version.</li>
  <li><strong>Run a modified version for others over a network?</strong> Section 13 of the AGPL requires you to offer your users the complete corresponding source code of your modified version at no charge, from the same service. That is the clause that stops a competitor taking the code, rebranding it and selling it as a closed SaaS without giving anything back.</li>
</ul>

<h2>Trademarks: what the AGPL does NOT cover</h2>
<p>The AGPL covers code. It does not grant permission to use the <strong>Clausery</strong> word mark, the logo/app icon, marketing copy, screenshots, social accounts or domain. Those are reserved to the project. They are the part that tells users they are on the real tool, not a clone.</p>
<p>The full policy is in <a href="https://github.com/getclausery/getclausery.github.io/blob/main/TRADEMARKS.md" rel="noopener">TRADEMARKS.md</a>. In short: name your fork something else, swap the logo for your own, and add a one-line credit ("Built on Clausery (AGPL-3.0) · view source") in your footer and in your app's sidebar. Nominative references ("our tool is built on Clausery", "forked from Clausery") are fine.</p>

<h2>What the "Made with Clausery" line is for</h2>
<p>Documents made from free library templates on the Free plan end with one small line, <em>"Made with Clausery · getclausery.github.io"</em>. That line is how people who receive a free invoice find the tool — the equivalent of a WordPress "Powered by" line — and it doubles as the attribution that lets the free tier exist. Pro, Team, Enterprise and commercial-license deployments remove it from documents.</p>

<h2>Commercial licenses</h2>
<p>We sell commercial licenses to teams who want to:</p>
<ul>
  <li>White-label Clausery inside a closed product or intranet without the AGPL source-offer obligation;</li>
  <li>Embed the editor in a paid SaaS under their own brand;</li>
  <li>Deploy a heavily-modified internal version without publishing their customisations;</li>
  <li>Use the logo or product screenshots in marketing.</li>
</ul>
<p>Commercial licenses fund new templates, maintenance and the perpetual free public release of the core product. Email <a href="${mailto('Clausery commercial license')}">${CONTACT_EMAIL}</a> via the <a href="${rel}contact/">contact page</a> with how many users and what you are building — most small teams get a flat quote back quickly.</p>

<h2>Contributing</h2>
<p>Pull requests are welcome. See <a href="https://github.com/getclausery/getclausery.github.io/blob/main/CONTRIBUTING.md" rel="noopener">CONTRIBUTING.md</a> for how to set up. By opening a PR you agree your contribution is licensed under the same AGPL-3.0-or-later; no CLA required.</p>

<h2>Security</h2>
<p>Report security issues privately via GitHub's <a href="https://github.com/getclausery/getclausery.github.io/security/advisories/new" rel="noopener">private advisory reporting</a> or by email, as described in <a href="https://github.com/getclausery/getclausery.github.io/blob/main/SECURITY.md" rel="noopener">SECURITY.md</a> and <a href="${rel}.well-known/security.txt">security.txt</a>. Do not open a public issue for a security vulnerability.</p>

<h2>Why AGPL instead of MIT or BSD?</h2>
<p>Clausery is a client-side product that competes with paid SaaS tools. A permissive license (MIT, BSD, Apache) would allow competitors to take the code, rebrand it, close the improvements and sell it as their own — which has happened to many MIT-licensed developer tools. The AGPL keeps the code free and keeps improvements free while still allowing commercial use through a paid dual-license, which is the model used by other developer-focused open-source companies (Ghost, Grafana Labs' AGPL components, Element/Matrix, Plausible, Mastodon, GitLab CE). It is the OSI-approved license that matches how Clausery is actually used: over the network.</p>

<p class="small muted" style="margin-top:2rem">The software is provided "as is" without warranty, as described in <a href="${rel}legal/terms.html">the terms of service</a>.</p>`),

page('legal/dmca.html', 'DMCA, trademark and impersonation takedown', 'How to report copyright infringement, trademark infringement, impersonation or unlicensed Clausery copies, and what information to send.', (rel) => `
<h1>DMCA, trademark and impersonation takedown</h1>
<p class="muted">How to report infringing copies; how we respond; how to submit a legitimate takedown notice.</p>
<h2>What we take down</h2>
<p>Clausery is open source under the AGPLv3. People who follow the license are welcome — that is the point of publishing the code. We file takedown notices (DMCA on US hosts, UDRP on domains, trademark/abuse reports elsewhere) when a copy falls into one of these categories:</p>
<ul>
  <li><strong>Unlicensed rebrands.</strong> A hosted copy that still uses the Clausery name, logo, app icon, screenshots or marketing copy without a commercial white-label license (see <a href="${rel}legal/license.html">open-source license</a> and <a href="${REPO_URL}/blob/main/TRADEMARKS.md" rel="noopener">TRADEMARKS.md</a>).</li>
  <li><strong>Closed SaaS clones.</strong> A publicly-accessible modified Clausery instance — including re-uploads wrapped in someone else's wrapper — that does not publish corresponding source as required by AGPL s13.</li>
  <li><strong>Stripped attribution.</strong> A copy from which the copyright/AGPL banners, license HTML comments, visible footer or source-on-GitHub link have been removed (removal of CMI under 17 U.S.C. §1202).</li>
  <li><strong>Impersonation.</strong> Social-media accounts, app-store listings, browser extensions, domains or search ads that present themselves as Clausery, as an "official" download, or as affiliated with the project, when they are not.</li>
  <li><strong>Scraped SEO spam.</strong> Sites that republish Clausery page content verbatim to capture search traffic meant for this site.</li>
</ul>
<h2>How to report</h2>
<p>Send a notice to <a href="${mailto('Clausery takedown / DMCA')}">${CONTACT_EMAIL}</a> (subject: "Clausery takedown / DMCA") with:</p>
<ol>
  <li>The URL(s) of the infringing material, and which hosting provider, app store or domain registrar they are on if you can tell.</li>
  <li>Which of the categories above applies — copyright (which AGPL section), trademark, CMI removal, impersonation, or scraped content.</li>
  <li>A screenshot or excerpt of the infringing material.</li>
  <li>Your name, email and, if you are reporting on behalf of a rights-holder, a statement that you are authorised to act.</li>
  <li>The statement required by 17 U.S.C. §512(c)(3): "I have a good-faith belief that the use is not authorised by the copyright owner, its agent, or the law"; "I swear, under penalty of perjury, that the information in this notification is accurate and that I am authorised to act on behalf of the owner of an exclusive right that is allegedly infringed"; and a physical or electronic signature.</li>
</ol>
<p>We respond to complete notices within 14 days. Notices that target legitimate AGPL-compliant forks (renamed, with source published, without the Clausery brand) will be declined — those are allowed by the license and are not infringements.</p>
<h2>What we do on receipt</h2>
<p>We verify the claim against the code history and the license terms. For confirmed infringements we send a properly-targeted notice: DMCA to US-based hosts and GitHub, a UDRP complaint to the registrar for confusingly-similar domains, trademark/impersonation reports to app stores and social platforms, and a scraped-content notice to search engines via their standard spam-report flows. Where the host responds with a counter-notice, we follow 17 U.S.C. §512(g) and, if the material stays up, file in an appropriate court within 14 days.</p>
<h2>Changelogs and proof of ownership</h2>
<p>The canonical source of truth for Clausery is <a href="${REPO_URL}" rel="noopener">the public GitHub repository</a>, where every change is timestamped in git. The <a href="${rel}changelog.html">changelog</a> lists releases with dates back to the first public version, which is earlier than any clone's "about" page will be able to honestly claim.</p>
<h2>False reports</h2>
<p>Takedown notices that misrepresent a legitimate AGPL fork as infringing are themselves a problem: they damage the open-source ecosystem we rely on. If you have received a notice you believe was sent in error, reply to the sending address and we will review and, if we got it wrong, retract.</p>`),
];
