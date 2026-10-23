/* Clausery copy-protection watermark (app/lib/copyguard.js).
 *
 * This file is part of Clausery <https://getclausery.github.io>, licensed AGPL-3.0-or-later
 * WITH the Clausery Trademark Exception (see LICENSE and TRADEMARKS.md). This notice must
 * not be removed or altered (17 U.S.C. §1202 copyright management information).
 *
 * WHY THIS EXISTS
 * Clausery is open source so anyone can audit, self-host and contribute — that is the
 * point of publishing the code. But a recurring failure mode for MIT/BSD-licensed SaaS
 * is that a competitor forks the code, strips the attribution, rebrands it and sells it
 * as their own (often without releasing their modifications, which the AGPL requires).
 * This module makes stripped copies self-identify:
 *
 *   1. The official deployment at the hostnames in OFFICIAL_HOSTS shows nothing.
 *   2. A deployment on any other hostname that still uses the Clausery name, logo,
 *      app icon or screenshots displays a persistent, unobtrusive banner explaining
 *      where the code came from and pointing back to the original project. This is
 *      the attribution the trademark policy and Section 5 of the AGPL require.
 *   3. Deployments that have bought a commercial white-label license (see
 *      https://getclausery.github.io/legal/license.html) set WHITE_LABEL_LICENSE to
 *      true in their config and the banner is suppressed — that is what they paid for.
 *
 *   Legitimate self-hosters running an unmodified copy for internal use under the
 *   AGPL (with their modifications published and the Clausery brand replaced) will
 *   not hit the trigger because they have swapped the name and logo per TRADEMARKS.md.
 */
import { SITE_URL, APP_NAME } from '../config.js';

/* Set to true in your copy of app/config.js only if you have purchased a commercial
   white-label license. Falsifying this is a trademark violation and a breach of the
   AGPL's attribution requirement (s5), and exposes the operator to DMCA takedown. */
const WHITE_LABEL_LICENSE = false;

/* Hostnames that are run by the Clausery project. Subdomains of these also match.
   Additions here require a commit from the project maintainer; third parties should
   not patch this list to include their own domain (doing so is fraud, not
   configuration). */
const OFFICIAL_HOSTS = [
  'getclausery.github.io',
  'getclausery.com',
  'www.getclausery.com',
  'clausery.app',
  'www.clausery.app',
];

/* Strings that, if still present in the page title, brand link or app name, indicate
   the deployment is being held out as "Clausery" rather than as a renamed fork. */
const BRAND_SIGNATURES = ['clausery', 'GetClausery', 'clausery.github.io'];

function isOfficialHost(hostname) {
  if (!hostname) return true; // file://, about:blank, sandboxed frames
  const h = hostname.toLowerCase();
  if (h === 'localhost' || h === '127.0.0.1' || h === '0.0.0.0' || h === 'file' || h.endsWith('.local')) return true; // dev + file://
  // e2b preview / arena sandboxes used during development
  if (h.endsWith('.e2b.app') || h.endsWith('.e2b.dev') || h.endsWith('.arena.ai')) return true;
  for (const official of OFFICIAL_HOSTS) {
    if (h === official || h.endsWith('.' + official)) return true;
  }
  return false;
}

function brandStillPresent() {
  try {
    const hay = [
      document.title,
      document.querySelector('.brand')?.textContent,
      document.querySelector('meta[property="og:site_name"]')?.getAttribute('content'),
      APP_NAME,
    ].filter(Boolean).join(' ').toLowerCase();
    return BRAND_SIGNATURES.some((s) => hay.includes(s.toLowerCase()));
  } catch { return true; }
}

/** Returns true when this deployment appears to be an unlicensed rebrand — i.e. it
 *  is not on an official host, has not bought a white-label license, and is still
 *  using the Clausery name. Exposed so tests and diagnostics can check the logic
 *  without rendering the banner. */
export function detectsUnauthorizedCopy(hostname = location.hostname) {
  if (WHITE_LABEL_LICENSE) return false;
  if (isOfficialHost(hostname)) return false;
  return brandStillPresent();
}

/** Render the attribution banner if the current deployment looks like an unlicensed
 *  copy. Called once from app/main.js during boot. Has no effect on the official
 *  deployment, local dev, or on a properly-renamed fork. */
export function installCopyGuard() {
  if (!detectsUnauthorizedCopy()) return;

  // Don't double-install across hot reloads in tests.
  if (document.getElementById('clausery-copyguard')) return;

  const bar = document.createElement('div');
  bar.id = 'clausery-copyguard';
  bar.setAttribute('role', 'note');
  bar.innerHTML =
    'This instance appears to be running the open-source ' +
    '<a href="' + SITE_URL + '" rel="noopener" target="_blank">Clausery</a> code ' +
    'without a commercial white-label license and without renaming the product as ' +
    'required by the trademark policy. Clausery is free and open source (AGPLv3); ' +
    'rebranded or hosted copies that keep the Clausery name are not, and modified ' +
    'network copies must publish their source. <a href="' + SITE_URL + '/legal/license.html" rel="noopener" target="_blank">Learn about the license</a>.';
  // Reserve space so the bar doesn't cover the app header. Do it via a data attr
  // rather than hardcoding body padding so legitimate deployments see zero change.
  document.documentElement.setAttribute('data-copyguard', '1');
  // Inject first so it sits at the very top of the viewport.
  const parent = document.body;
  parent.insertBefore(bar, parent.firstChild);

  // Print a console notice so even a host that tries to hide the bar via CSS still
  // reveals the provenance to anyone opening dev tools.
  try {
    const css = 'color:#0b5;color:#fff;background:#0b5;padding:2px 6px;border-radius:3px';
    console.log('%cClausery', css,
      'open-source AGPLv3 · original at ' + SITE_URL +
      ' · If you are seeing this message the site you are on appears to be an unlicensed copy.');
    console.log('License: ' + SITE_URL + '/legal/license.html  ·  Source: ' +
      'https://github.com/getclausery/getclausery.github.io');
  } catch { /* some envs strip console */ }
}
