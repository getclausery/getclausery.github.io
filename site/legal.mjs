import { REPO_URL, CONTACT_EMAIL, CONTACT_URL, ANALYTICS_ON, ANALYTICS_SINCE, ONLINE_KEYS, CHECKOUT_SINCE, USAGE_ON, USAGE_SINCE, longDate } from '../tools/partials.mjs';
// The policy's effective date is the last change to what it describes: the visit counter, then the online checkout.
const EFFECTIVE = [ANALYTICS_ON && ANALYTICS_SINCE, ONLINE_KEYS && CHECKOUT_SINCE, USAGE_ON && USAGE_SINCE].filter(Boolean).sort().pop();
/* What the app itself counts once USAGE_COUNTER is set in app/config.js (app/lib/usage.js). */
const APP_COUNTS = `\n<h2>App usage counts</h2>\n<p>To learn which templates people use, the app tells <a href="https://www.goatcounter.com/" rel="noopener">GoatCounter</a> when it is opened, when a draft is started and when a document is downloaded, printed, shared or made from a spreadsheet. Each count is the event and, for a template from our library, which one (for example "document-download/invoice"); a template of your own is counted only as "own". Your answers, file names, template contents and documents are never part of it. GoatCounter uses no cookies or local storage and does not store IP addresses, under <a href="https://www.goatcounter.com/help/privacy" rel="noopener">its privacy policy</a>. Copies of Clausery hosted anywhere else, including your own, never send these counts.</p>`;
const page = (path, title, description, body) => ({ path, title, description, body: (rel) => `<section class="section"><div class="wrap prose">${body(rel)}</div></section>` });
export const pages = [
page('legal/privacy.html', 'Privacy policy', 'How Clausery keeps document contents on your device and handles license checks, purchases, support and cookieless analytics.', (rel) => `
<h1>Privacy policy</h1>
<p class="muted">Effective ${EFFECTIVE ? longDate(EFFECTIVE) : '2 October 2026'}</p>
<h2>Summary</h2>
<p>Clausery is designed so that we cannot see your data. The application runs entirely in your web browser, stores its data only on your device, and only ever requests its own files from the site that serves it${ONLINE_KEYS ? ', plus a license check if you activate a key bought online' : ''}${USAGE_ON ? ', plus the anonymous usage counts described below' : ''}; it never sends your templates, answers or documents anywhere. We do not operate accounts${USAGE_ON ? '' : ANALYTICS_ON ? ', and the app has no analytics' : ', analytics,'} or servers that receive your templates, answers or documents.${USAGE_ON ? ' The app counts a few anonymous events (described below) that contain nothing you type.' : ''}</p>
<h2>What the app processes</h2>
<p>Templates (.docx files), the answers you enter, generated documents, settings and license keys are processed in your browser and stored in its local database. This data is under your control and is never transmitted to us or to any third party by the app${ONLINE_KEYS ? ', with one exception: if you activate a license key bought online, the app sends that key and an activation ID for this browser to Lemon Squeezy, our payment provider, when you activate it and about once a week, so the license follows your subscription. Nothing else is included in that request' : ''}.</p>
<h2>What the website host receives</h2>
<p>The public instance is served as static files by GitHub Pages. Like any web server, GitHub may log the IP address, browser type and requested URLs of visitors for security and operational purposes, under <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener">GitHub's privacy statement</a>. ${ANALYTICS_ON ? 'We receive no visitor data from GitHub.</p>\n<h2>Website visit counts</h2>\n<p>To count visits to the website, the pages outside the app load <a href="https://www.cloudflare.com/web-analytics/" rel="noopener">Cloudflare Web Analytics</a>. It records the page visited, the referring site, and the browser, device type and country, without cookies or local storage and without fingerprinting or tracking individual visitors, under <a href="https://www.cloudflare.com/privacypolicy/" rel="noopener">Cloudflare\'s privacy policy</a>. The app, the embedded calculators and anything you type are never counted. Blocking the script has no effect on how the site works.</p>' + (USAGE_ON ? APP_COUNTS : '') : 'We do not add cookies, analytics or tracking of any kind, and we receive no visitor data from GitHub.</p>' + (USAGE_ON ? APP_COUNTS : '')}
<h2>Purchases and support</h2>
${ONLINE_KEYS ? '<p>After payment, the Open Clausery button in the confirmation and receipt activates your plan automatically. That private access link carries a license credential in its URL fragment, which is not sent to the website host. The app clears it from the address before routing or counting usage, verifies it with Lemon Squeezy and stores the browser activation locally. Keep the access link private and share it only with users covered by your plan.</p>' : ''}
<p>If you buy a license or contact us, we receive the information you provide (typically your name, email address and organisation) and payment details are handled by the payment provider shown at checkout${ONLINE_KEYS ? ' (Lemon Squeezy, which acts as the merchant of record and issues the license key)' : ''}, under their privacy policy. Contact, support and offline-key requests go by email to <a href="${CONTACT_URL}">${CONTACT_EMAIL}</a>; the email providers process those messages under their own privacy policies. Public bug reports on our <a href="${REPO_URL}" rel="noopener">GitHub repository</a> are visible to everyone, so do not include private details there. We use purchase and support records to issue license keys, provide support and send invoices, and keep them for as long as required by tax and accounting law. We do not sell or share them for marketing.</p>
<h2>Your rights</h2>
<p>Because the app holds no data about you, the data-subject rights under the GDPR, UK GDPR and CCPA apply to the purchase and support records described above. To access, correct or delete them, open a request through the <a href="${rel}contact/">contact page</a> saying only that you have a privacy request; we will reply with a private way to verify and complete it.</p>
<h2>Children</h2>
<p>Clausery is a business tool and is not directed at children.</p>
<h2>Changes</h2>
<p>We will post changes to this policy on this page with a new effective date.</p>`),

page('legal/terms.html', 'Terms of service', 'Terms under which Clausery is provided: license, acceptable use, warranties and liability.', (rel) => `
<h1>Terms of service</h1>
<p class="muted">Effective 24 September 2026</p>
<h2>1. The service</h2>
<p>Clausery ("the software") is a browser application for assembling documents from templates you supply. It is provided by Clausery ("we"). By using the software you agree to these terms.</p>
<h2>2. License</h2>
<p>We grant you a non-exclusive, non-transferable right to use the software for your internal business purposes. Free-plan features may be used without charge. Paid features are unlocked by a license key issued to a named user or, for Team licenses, to a number of seats; keys may not be shared beyond the licensed users. You may not remove notices, resell the software, or circumvent license verification.</p>
<h2>3. Your content</h2>
<p>You own your templates, answers and generated documents. The software processes them only on your device. You are responsible for the content of your templates and for reviewing every generated document before use.</p>
<h2>4. Not legal, tax or professional advice</h2>
<p>The software fills in templates. It does not provide legal, tax, financial or other professional advice, and the sample templates are illustrations only, not forms suitable for any particular jurisdiction or purpose.</p>
<h2>5. Data on your device</h2>
<p>Your data is stored in your browser. You are responsible for backups. We cannot recover data that is deleted, lost, or encrypted with a forgotten passphrase.</p>
<h2>6. Fees</h2>
<p>Paid plans are billed as shown at purchase. Except where required by law, fees are non-refundable, but we will refund any purchase made in error within 14 days on request.</p>
<h2>7. Warranty and liability</h2>
<p>The software is provided "as is". To the maximum extent permitted by law, we disclaim all warranties, and our total liability arising from the software or these terms is limited to the amount you paid us in the twelve months before the claim. We are not liable for indirect or consequential loss.</p>
<h2>8. Termination</h2>
<p>You may stop using the software at any time. We may terminate a license for breach of these terms. Sections 3–7 survive termination.</p>
<h2>9. Governing law</h2>
<p>These terms are governed by the laws of the jurisdiction in which Clausery is established, and disputes are subject to the courts of that jurisdiction, without prejudice to mandatory consumer protection where it applies.</p>
<h2>10. Contact</h2>
<p>See the <a href="${rel}contact/">contact page</a>.</p>`),

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
];
