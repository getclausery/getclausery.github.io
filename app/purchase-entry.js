/* A self-contained, versioned bundle keeps post-payment activation independent of an older app's offline cache. */
import { Store } from './lib/store.js';
import { LICENSE_SERVICE } from './config.js';
import { consumePurchaseReturn, activatePurchase } from './lib/purchase.js';

const purchase = consumePurchaseReturn();
const store = new Store();
const status = document.getElementById('purchase-status');
const retry = document.getElementById('purchase-retry');
let running = false;

async function finish() {
  if (running) return;
  running = true;
  retry.hidden = true;
  status.setAttribute('role', 'status');
  status.textContent = 'Checking your payment and opening Clausery…';
  try {
    if (purchase.error) throw new Error(purchase.error);
    const activate = async () => { await store.open(); return activatePurchase(purchase.key, LICENSE_SERVICE, store); };
    const result = navigator.locks ? await navigator.locks.request('clausery-purchase', activate) : await activate();
    if (!result.ok) throw new Error(result.error);
    purchase.key = '';
    status.textContent = 'Your paid plan is ready. Opening your workspace…';
    location.replace('./#/templates');
  } catch (e) {
    status.setAttribute('role', 'alert');
    status.textContent = e.message;
    retry.hidden = !purchase.key;
  } finally {
    running = false;
  }
}
retry.addEventListener('click', finish);
finish();
