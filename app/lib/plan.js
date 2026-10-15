/* Plan gating: what the current license (or free Pro trial) allows. */
import { PLANS, planFeatures } from './license.js';

// In the order the upgrade dialog and Settings list them: what a small business notices first comes first.
export const FEATURE_LABELS = {
  unbranded: 'No “Made with Clausery” line on your documents', bulk: 'Unlimited documents from a spreadsheet',
  maxTemplates: 'Unlimited templates of your own', computed: 'Computed fields and calculations', intake: 'Client intake forms',
  vault: 'Workspace encryption', packs: 'Template packs for teams',
};

export class Plan {
  constructor() { this.plan = 'free'; this.payload = null; this.error = null; }
  set(plan, payload = null, error = null) { this.plan = PLANS[plan] ? plan : 'free'; this.payload = payload; this.error = error; }
  get features() { return planFeatures(this.plan); }
  /** Pro features are unlocked, by a license or by the free trial. */
  get isPaid() { return this.plan !== 'free'; }
  /** Unlocked by the free trial rather than a purchase, so checkout stays on offer. */
  get isTrial() { return !!(this.payload && this.payload.trial); }
  can(feature) { const v = this.features[feature]; return v === true || v === Infinity; }
  canAddTemplate(count) { return count < this.features.maxTemplates; }
  get name() { return this.features.name; }
}
