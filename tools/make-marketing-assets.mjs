// Render original, precise resource graphics from the public marketing asset descriptions.
// No remote content or AI-generated product screens. Run with npm run marketing:assets.
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { MARKETING_ASSETS } from '../site/data/marketing-assets.mjs';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const icon = readFileSync('assets/icon.svg', 'utf8');
const browser = await chromium.launch();
mkdirSync('assets/marketing', { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1000, height: 1500 }, deviceScaleFactor: 1 });
  for (const a of MARKETING_ASSETS) {
    await page.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;width:1000px;height:1500px;background:#122b39;color:#fff;font-family:Arial,sans-serif;padding:70px;position:relative;overflow:hidden}.brand{display:flex;align-items:center;gap:18px;font-size:38px;font-weight:700}.brand svg{width:58px;height:58px}.eyebrow{color:#8fe3c4;font-size:23px;letter-spacing:3px;font-weight:700;margin-top:56px}h1{font-size:77px;line-height:1.07;letter-spacing:-2px;margin:23px 0 25px}h1 span{display:block}.detail{font-size:31px;line-height:1.45;color:#d4e1e7;margin:0;max-width:820px}.paper{background:#f8f6ef;color:#122b39;border-radius:22px;padding:38px;margin-top:44px;box-shadow:14px 14px 0 #24524f}.paper-head{font-size:24px;letter-spacing:2px;font-weight:700;border-bottom:2px solid #cdd5d5;padding-bottom:22px}.row{display:flex;justify-content:space-between;align-items:center;gap:25px;padding:24px 0;border-bottom:1px solid #d4d8d3;font-size:28px}.row strong{font-size:34px;white-space:nowrap}.row:last-of-type{color:#0c6c55;font-weight:700}.example{font-size:20px;color:#586775;margin-top:22px}.proof{padding:0;list-style:none;font-size:25px;line-height:1.8;margin:42px 0 0}.proof li:before{content:'✓';margin-right:15px;color:#8fe3c4;font-weight:700}.bottom{position:absolute;bottom:65px;left:70px;right:70px;display:flex;align-items:center;justify-content:space-between}.cta{font-size:24px;font-weight:700;border-radius:12px;background:#8fe3c4;color:#122b39;padding:19px 25px}.url{font-size:22px;color:#d4e1e7}
</style></head><body><div class="brand">${icon}<span>Clausery</span></div><div class="eyebrow">${esc(a.eyebrow)}</div><h1>${a.headline.map((s) => `<span>${esc(s)}</span>`).join('')}</h1><p class="detail">${esc(a.detail)}</p><div class="paper"><div class="paper-head">${a.slug === 'business-document-kit' ? 'YOUR BUSINESS DOCUMENT KIT' : 'ILLUSTRATIVE EXAMPLE'}</div>${a.example.map(([k,v]) => `<div class="row"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join('')}<div class="example">${a.slug === 'business-document-kit' ? 'Six editable .docx templates + instructions' : 'Example only. Use your own agreed amounts and dates.'}</div></div><ul class="proof">${a.proof.map((s) => `<li>${esc(s)}</li>`).join('')}</ul><div class="bottom"><div class="cta">${a.slug === 'business-document-kit' ? 'Download the free kit' : 'Get the free template'}</div><div class="url">getclausery.github.io</div></div></body></html>`);
    const fits = await page.evaluate(() => {
      const proof = document.querySelector('.proof').getBoundingClientRect();
      const bottom = document.querySelector('.bottom').getBoundingClientRect();
      return proof.bottom + 20 <= bottom.top && [...document.querySelectorAll('h1 span,.row,.detail')].every((el) => el.getBoundingClientRect().right <= 950 && el.scrollWidth <= el.clientWidth);
    });
    if (!fits) throw new Error(`Marketing graphic overflows: ${a.slug}`);
    writeFileSync(`assets/marketing/${a.slug}.png`, await page.screenshot({ type: 'png' }));
  }
  await page.close();
  const social = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const socialCard = async (title, detail, file) => {
    await social.setContent(`<html lang="en"><body style="margin:0;width:1200px;height:630px;box-sizing:border-box;background:#122b39;color:#fff;padding:65px;font-family:Arial,sans-serif"><div style="display:flex;align-items:center;gap:18px;font-size:33px;font-weight:700">${icon}Clausery</div><h1 style="font-size:65px;line-height:1.1;margin:38px 0 25px;letter-spacing:-1.5px;max-width:1060px">${esc(title)}</h1><p style="font-size:29px;line-height:1.4;color:#d4e1e7;max-width:1030px">${esc(detail)}</p><p style="position:absolute;bottom:35px;left:65px;color:#8fe3c4;font-size:24px;font-weight:700">Free library templates · No sign-up · Editable .docx</p></body></html>`);
    writeFileSync(file, await social.screenshot({ type: 'png' }));
  };
  await socialCard('Invoices, quotes and receipts in Word.', 'Calculated totals. Document contents stay on your device. Made for small businesses and freelancers.', 'assets/og.png');
  await socialCard('Six free Word templates for your next business job.', 'Quote · Statement of work · Invoice · Receipt · Purchase order · Credit note. One download, no email signup.', 'assets/marketing/business-kit-social.png');
  await social.close();
  console.log('wrote 7 Pinterest graphics, the business kit social card and assets/og.png');
} finally {
  await browser.close();
}
