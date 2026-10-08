/* Starting points for library templates by trade: the lines a business in that trade usually bills, so a first invoice
   starts with the right shape instead of a blank row. Only descriptions and quantities: prices are the business's own
   and are never guessed. Opened with #/start/<template>/<preset>; the public site has a page for each (site/trades.mjs). */

export const PRESETS = {
  invoice: {
    'construction-contractor': { name: 'Construction', lines: [['Labour (hours)', 40], ['Materials, as itemised on the attached list', 1], ['Equipment rental', 1], ['Permit and inspection fees', 1], ['Approved change order', 1]] },
    handyman: { name: 'Handyman', lines: [['Labour (hours)', 3], ['Materials and parts', 1], ['Call-out or trip charge', 1], ['Disposal of old fixtures and debris', 1]] },
    cleaning: { name: 'Cleaning', lines: [['Regular cleaning visit', 4], ['Deep clean (kitchen and bathrooms)', 1], ['Inside oven or fridge add-on', 1], ['Cleaning supplies', 1]] },
    landscaping: { name: 'Landscaping and lawn care', lines: [['Lawn mowing and edging (visits)', 4], ['Hedge and shrub trimming', 1], ['Mulch, soil or plants (supplied)', 1], ['Green waste removal', 1]] },
    photography: { name: 'Photography', lines: [['Photo session (hours)', 2], ['Edited images delivered', 40], ['Commercial usage licence', 1], ['Prints and albums', 1], ['Travel', 1]] },
    videography: { name: 'Video production', lines: [['Shoot day', 1], ['Editing (hours)', 12], ['Revisions beyond the included rounds', 1], ['Music licence', 1], ['Equipment and crew', 1]] },
    'graphic-design': { name: 'Graphic design', lines: [['Logo and brand identity (project fee)', 1], ['Additional revision round', 1], ['Print-ready files and source files', 1], ['Stock image licences', 1]] },
    'web-design': { name: 'Web design and development', lines: [['Milestone: design approved', 1], ['Development (hours)', 30], ['Content upload (pages)', 8], ['Hosting and maintenance (months)', 12]] },
    consulting: { name: 'Consulting', lines: [['Consulting (hours)', 20], ['Workshop day', 1], ['Monthly retainer', 1], ['Expenses at cost, receipts attached', 1]] },
    'freelance-writing': { name: 'Freelance writing', lines: [['Article (about 1,500 words)', 2], ['Rush delivery fee', 1], ['Research and interviews (hours)', 3], ['Kill fee for a cancelled piece', 1]] },
    tutoring: { name: 'Tutoring', lines: [['Tutoring session (1 hour)', 8], ['Exam preparation pack', 1], ['Late cancellation fee', 1]] },
    'personal-training': { name: 'Personal training', lines: [['Personal training session', 8], ['Training and nutrition plan', 1], ['Missed session (under 24 hours notice)', 1]] },
  },
};

/* Tax set-ups by country: the tax, its standard rate, what the tax number is called and the details that country asks
   for, so an invoice starts right for where the business is registered. `answers` are invoice answers; `currency` is
   the workspace currency the invoice should be in, and `locale` (where set) how dates and numbers are written there,
   such as 8 October 2026 in the UK. Rates are each country's standard rate as of October 2026 (the
   public pages in site/countries.mjs say so and link the tax authority). Canada starts on Ontario's 13% HST, the
   largest province, and says how to change it. */
export const TAX_PRESETS = {
  invoice: {
    'uk-vat-invoice': { name: 'UK VAT', currency: 'GBP', locale: 'en-GB', answers: { has_tax: true, tax_name: 'VAT', tax_rate: 20, has_tax_registration: true, tax_registration_label: 'VAT registration number' } },
    'ireland-vat-invoice': { name: 'Irish VAT', currency: 'EUR', locale: 'en-IE', answers: { has_tax: true, tax_name: 'VAT', tax_rate: 23, has_tax_registration: true, tax_registration_label: 'VAT number', has_supply_date: true } },
    'australia-tax-invoice': { name: 'Australian GST', currency: 'AUD', locale: 'en-AU', answers: { has_tax: true, tax_name: 'GST', tax_rate: 10, has_tax_registration: true, tax_registration_label: 'ABN', is_tax_invoice: true } },
    'new-zealand-gst-invoice': { name: 'New Zealand GST', currency: 'NZD', locale: 'en-NZ', answers: { has_tax: true, tax_name: 'GST', tax_rate: 15, has_tax_registration: true, tax_registration_label: 'GST number' } },
    'canada-gst-hst-invoice': { name: 'Canadian GST/HST', currency: 'CAD', locale: 'en-CA', answers: { has_tax: true, tax_name: 'HST', tax_rate: 13, has_tax_registration: true, tax_registration_label: 'GST/HST number' } },
    'south-africa-tax-invoice': { name: 'South African VAT', currency: 'ZAR', answers: { has_tax: true, tax_name: 'VAT', tax_rate: 15, has_tax_registration: true, tax_registration_label: 'VAT registration number', is_tax_invoice: true } },
  },
};

/** The preset (trade or country) for a template slug and preset slug, or null. */
export const presetFor = (sample, slug) => (PRESETS[sample] && PRESETS[sample][slug]) || (TAX_PRESETS[sample] && TAX_PRESETS[sample][slug]) || null;

/**
 * Apply a preset to a new draft's answers. A trade preset's `lines` replace the template's repeating list of items (the
 * first one, for the invoice `line_items`), each with its quantity and an empty price. A country preset's `answers`
 * are set where the template has that question (anything else is ignored). Returns new answers.
 */
export function applyPreset(template, answers, preset) {
  if (!preset) return answers;
  const fields = template.fields || [];
  let out = answers;
  if (preset.answers) {
    const keys = new Set(fields.filter((f) => f.type !== 'computed').map((f) => f.key));
    out = { ...out, ...Object.fromEntries(Object.entries(preset.answers).filter(([k]) => keys.has(k))) };
  }
  const list = preset.lines && fields.find((f) => f.type === 'repeat');
  if (!list) return out;
  const kids = (list.children || []).filter((c) => c.type !== 'computed').map((c) => c.key);
  const [descKey, qtyKey] = [kids.find((k) => /name|description/.test(k)), kids.find((k) => /quantity|qty/.test(k))];
  if (!descKey) return out;
  const blank = Object.fromEntries((list.children || []).filter((c) => c.type !== 'computed').map((c) => [c.key, c.default ?? (c.type === 'checkbox' ? false : '')]));
  return { ...out, [list.key]: preset.lines.map(([desc, qty]) => ({ ...blank, [descKey]: desc, ...(qtyKey ? { [qtyKey]: qty } : {}) })) };
}

/** The sentence shown when a draft starts from a preset. */
export function presetNote(preset) {
  if (!preset) return '';
  if (preset.lines) return `Started with the lines a ${preset.name.toLowerCase()} business usually bills. Add your prices and remove what you don't need.`;
  const a = preset.answers || {};
  return `Set up for ${preset.name}: ${a.tax_name} at ${a.tax_rate}%, with your ${a.tax_registration_label}${a.is_tax_invoice ? ' and the title "Tax invoice"' : ''}. Change the rate if you charge a different one.`;
}
