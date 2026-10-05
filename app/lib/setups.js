/* Ready-made questionnaire setups for library templates. The questionnaire inferred from a template's tags is the base;
   a setup only improves it: plain-English questions, sections in the order people think about the document, and
   calculations (line amounts, subtotal, tax, totals, amounts in words), so nobody does arithmetic by hand. A tag the
   setup does not mention is still asked, in a final "Other details" section, so a setup can never hide a question.
   Applied when a library template is imported into the workspace (and by the site, to list the questions). */
import { makeField, makeSection } from './schema.js';

export const SETUP_VERSION = 1;

const money = (label, extra = {}) => ({ type: 'money', label, ...extra });
const calc = (label, expr, format = 'money', extra = {}) => ({ type: 'computed', label, expr, format, ...extra });
const percent = (label, help) => ({ type: 'number', label, help, placeholder: 'e.g. 13', decimals: null });
const yes = (label, help = '') => ({ label, help });
const TAX_HELP = 'The rate as a percentage, for example 20 for 20% VAT or 13 for 13% HST. The amount is worked out for you.';
const LINE_ITEMS = (amountKey, rateKey, amountLabel = 'Amount') => ({
  min: 1, children: {
    item_name: { label: 'Description', placeholder: 'e.g. Website design, 3 pages' },
    item_quantity: { label: 'Quantity', default: 1, decimals: null },
    [rateKey]: money('Unit price'),
    [amountKey]: calc(amountLabel, `item_quantity * ${rateKey}`),
  },
});
const less = (flag, key) => `if(${flag}, ${key}, 0)`;

export const SETUPS = {
  invoice: {
    sections: [
      ['Your business', 'Printed at the top of the invoice.', ['business_name', 'business_address', 'business_email', 'has_business_phone', 'business_phone', 'has_tax_registration', 'tax_registration_label', 'tax_registration_number']],
      ['Invoice details', '', ['invoice_number', 'invoice_date', 'has_supply_date', 'supply_date', 'due_date', 'has_purchase_order', 'purchase_order_number', 'is_tax_invoice']],
      ['Bill to', 'Who pays this invoice.', ['client_name', 'client_address']],
      ['Items and totals', 'Add a line for each product or service. Amounts and totals are calculated for you.', ['line_items', 'subtotal_amount', 'has_discount', 'discount_amount', 'has_tax', 'tax_name', 'tax_rate', 'tax_amount', 'invoice_total', 'has_amount_paid', 'amount_paid', 'balance_due']],
      ['Payment', 'How and when to pay you.', ['how_to_pay', 'has_bank_details', 'bank_details', 'warn_about_bank_changes', 'has_late_fee', 'late_fee_amount', 'late_fee_grace_days', 'has_notes', 'invoice_notes']],
    ],
    fields: {
      business_name: { label: 'Business or trading name' },
      business_email: { label: 'Email' },
      has_business_phone: yes('Show a phone number'),
      business_phone: { label: 'Phone number' },
      has_tax_registration: yes('Show a tax registration number', 'A VAT, GST/HST or other tax number, if you are registered.'),
      tax_registration_label: { label: 'What your tax number is called', placeholder: 'e.g. VAT number, GST/HST number, ABN', default: 'Tax registration number' },
      tax_registration_number: { label: 'Tax registration number', placeholder: 'e.g. GB123456789 or 123456789 RT0001' },
      invoice_number: { label: 'Invoice number', placeholder: 'e.g. INV-0042', help: 'Use a new number for every invoice, in sequence.' },
      has_supply_date: yes('Show a separate date of supply', 'UK VAT invoices must show the time of supply (tax point) when it differs from the invoice date.'),
      supply_date: { label: 'Date of supply' },
      due_date: { label: 'Payment due date' },
      is_tax_invoice: yes('Title it "Tax invoice"', 'In Australia, a tax invoice from a GST-registered seller must say it is a tax invoice.'),
      has_purchase_order: yes('The client gave a purchase order number'),
      purchase_order_number: { label: 'Purchase order number' },
      client_name: { label: 'Client name' },
      line_items: { ...LINE_ITEMS('item_amount', 'item_rate'), itemLabel: 'Line item' },
      subtotal_amount: calc('Subtotal', 'sum(line_items, "item_amount")'),
      has_discount: yes('Give a discount'),
      discount_amount: money('Discount amount'),
      has_tax: yes('Charge sales tax or VAT'),
      tax_name: { label: 'Name of the tax', placeholder: 'e.g. VAT, GST, HST, Sales tax' },
      tax_rate: percent('Tax rate (%)', TAX_HELP),
      tax_amount: calc('Tax', `round((subtotal_amount - ${less('has_discount', 'discount_amount')}) * tax_rate / 100, 2)`),
      invoice_total: calc('Total', `subtotal_amount - ${less('has_discount', 'discount_amount')} + ${less('has_tax', 'tax_amount')}`),
      has_amount_paid: yes('The client has already paid part of it'),
      amount_paid: money('Amount already paid'),
      balance_due: calc('Balance due', 'invoice_total - amount_paid'),
      how_to_pay: { label: 'How to pay', placeholder: 'e.g. bank transfer, card or cheque' },
      has_bank_details: yes('Add bank details'),
      bank_details: { label: 'Bank details', placeholder: 'Account name, bank, account number and sort code, IBAN or routing number' },
      warn_about_bank_changes: { ...yes('Warn that your bank details never change by email', 'Protects your client from fake "our bank details have changed" emails, a common fraud.'), default: true },
      has_late_fee: yes('Charge a late fee'),
      late_fee_amount: money('Late fee'),
      late_fee_grace_days: { label: 'Days after the due date before the fee applies', default: 7 },
      has_notes: yes('Add a note'),
      invoice_notes: { label: 'Note', placeholder: 'e.g. Thank you for choosing us again this year.' },
    },
  },

  quote: {
    sections: [
      ['Your business', 'Printed at the top of the quote.', ['business_name', 'business_address', 'business_email']],
      ['Quote details', '', ['quote_number', 'quote_date', 'valid_until_date']],
      ['Customer', '', ['customer_name', 'customer_address', 'project_description']],
      ['Items and totals', 'Add a line for each product or service. Amounts and totals are calculated for you.', ['quote_items', 'subtotal_amount', 'has_discount', 'discount_amount', 'has_tax', 'tax_name', 'tax_rate', 'tax_amount', 'quote_total']],
      ['Terms', '', ['has_exclusions', 'excluded_work_description', 'has_timeline', 'start_date', 'completion_date', 'has_deposit', 'deposit_amount', 'balance_terms']],
    ],
    fields: {
      business_name: { label: 'Business or trading name' },
      business_email: { label: 'Email' },
      quote_number: { label: 'Quote number', placeholder: 'e.g. Q-0107' },
      valid_until_date: { label: 'Valid until' },
      project_description: { label: 'The work being quoted', placeholder: 'A sentence or two on what you will do or supply.' },
      quote_items: { ...LINE_ITEMS('item_amount', 'item_rate'), itemLabel: 'Line item' },
      subtotal_amount: calc('Subtotal', 'sum(quote_items, "item_amount")'),
      has_discount: yes('Give a discount'),
      discount_amount: money('Discount amount'),
      has_tax: yes('Add sales tax or VAT'),
      tax_name: { label: 'Name of the tax', placeholder: 'e.g. VAT, GST, HST, Sales tax' },
      tax_rate: percent('Tax rate (%)', TAX_HELP),
      tax_amount: calc('Tax', `round((subtotal_amount - ${less('has_discount', 'discount_amount')}) * tax_rate / 100, 2)`),
      quote_total: calc('Total', `subtotal_amount - ${less('has_discount', 'discount_amount')} + ${less('has_tax', 'tax_amount')}`),
      has_exclusions: yes('List work that is not included'),
      excluded_work_description: { label: 'Not included' },
      has_timeline: yes('Give start and completion dates'),
      has_deposit: yes('Ask for a deposit'),
      deposit_amount: money('Deposit'),
      balance_terms: { label: 'When the balance is due', placeholder: 'e.g. within 14 days of completion' },
    },
  },

  'purchase-order': {
    sections: [
      ['Your company', '', ['buyer_company', 'buyer_address', 'purchase_order_number', 'order_date']],
      ['Vendor and delivery', '', ['vendor_name', 'vendor_address', 'has_ship_to_address', 'ship_to_address', 'delivery_date', 'has_shipping_method', 'shipping_method']],
      ['Items and totals', 'Add a line for each item. Line totals and the order total are calculated for you.', ['order_items', 'subtotal_amount', 'has_tax', 'tax_name', 'tax_rate', 'tax_amount', 'has_shipping_cost', 'shipping_cost', 'order_total']],
      ['Terms and approval', '', ['payment_terms', 'has_special_instructions', 'special_instructions', 'confirm_days', 'authorized_by_name', 'authorized_by_title']],
    ],
    fields: {
      buyer_company: { label: 'Your company name' },
      buyer_address: { label: 'Your company address' },
      purchase_order_number: { label: 'PO number', placeholder: 'e.g. PO-2026-031' },
      has_ship_to_address: yes('Ship to a different address'),
      has_shipping_method: yes('Name a shipping method'),
      order_items: { ...LINE_ITEMS('item_total', 'item_unit_price', 'Line total'), itemLabel: 'Item' },
      subtotal_amount: calc('Subtotal', 'sum(order_items, "item_total")'),
      has_tax: yes('Add sales tax or VAT'),
      tax_name: { label: 'Name of the tax', placeholder: 'e.g. Sales tax, VAT' },
      tax_rate: percent('Tax rate (%)', TAX_HELP),
      tax_amount: calc('Tax', 'round(subtotal_amount * tax_rate / 100, 2)'),
      has_shipping_cost: yes('Add a shipping charge'),
      shipping_cost: money('Shipping charge'),
      order_total: calc('Order total', `subtotal_amount + ${less('has_tax', 'tax_amount')} + ${less('has_shipping_cost', 'shipping_cost')}`),
      payment_terms: { label: 'Payment terms', placeholder: 'e.g. Net 30 from receipt of a correct invoice' },
      has_special_instructions: yes('Add special instructions'),
      confirm_days: { label: 'Days the vendor has to confirm the order', default: 3 },
      authorized_by_name: { label: 'Authorized by (name)' },
      authorized_by_title: { label: 'Their job title' },
    },
  },

  'credit-note': {
    sections: [
      ['Your business', '', ['business_name', 'business_address', 'contact_email']],
      ['Credit note details', '', ['credit_note_number', 'credit_note_date', 'original_invoice_number', 'original_invoice_date']],
      ['Customer', '', ['customer_name', 'customer_address', 'credit_reason']],
      ['Credited items and totals', 'The subtotal, tax and total credit are calculated for you.', ['credited_items', 'subtotal_amount', 'includes_tax', 'tax_name', 'tax_rate', 'tax_amount', 'total_credit_amount']],
      ['Refund or credit', '', ['is_refund', 'refund_method', 'refund_days', 'credit_application', 'has_notes', 'notes']],
    ],
    fields: {
      credit_note_number: { label: 'Credit note number', placeholder: 'e.g. CN-0007' },
      original_invoice_number: { label: 'Invoice being credited' },
      credit_reason: { label: 'Reason for the credit', placeholder: 'e.g. Two items returned unused' },
      credited_items: { itemLabel: 'Credited item', min: 1, children: { credited_item_description: { label: 'Description' }, credited_item_amount: money('Amount') } },
      subtotal_amount: calc('Subtotal', 'sum(credited_items, "credited_item_amount")'),
      includes_tax: yes('The invoice charged tax, so credit it too'),
      tax_name: { label: 'Name of the tax', placeholder: 'e.g. VAT, GST, HST, Sales tax' },
      tax_rate: percent('Tax rate (%)', TAX_HELP),
      tax_amount: calc('Tax', 'round(subtotal_amount * tax_rate / 100, 2)'),
      total_credit_amount: calc('Total credit', `subtotal_amount + ${less('includes_tax', 'tax_amount')}`),
      is_refund: yes('Refund the money (rather than credit a future invoice)'),
      credit_application: { label: 'Apply the credit to', placeholder: 'e.g. invoice INV-0051, or your next invoice' },
      has_notes: yes('Add a note'),
    },
  },

  'expense-reimbursement-form': {
    sections: [
      ['Claim details', '', ['claimant_name', 'company_name', 'department', 'period_start_date', 'period_end_date']],
      ['Expenses', 'Add a line for each receipt. Totals are calculated for you.', ['expenses', 'expenses_subtotal', 'has_mileage', 'miles_driven', 'mileage_rate', 'mileage_amount', 'mileage_purpose', 'total_amount', 'has_advance', 'advance_amount', 'balance_due']],
      ['Receipts and payment', '', ['receipts_attached', 'missing_receipt_reason', 'payment_details', 'approver_name']],
    ],
    fields: {
      claimant_name: { label: 'Your name' },
      company_name: { label: 'Company' },
      department: { label: 'Department or project' },
      expenses: { itemLabel: 'Expense', min: 1, children: { expense_date: { label: 'Date' }, expense_description: { type: 'text', label: 'Description', placeholder: 'e.g. Train to client meeting' }, expense_category: { type: 'select', label: 'Category', options: ['Travel', 'Meals', 'Accommodation', 'Supplies', 'Software', 'Phone and internet', 'Training', 'Other'].map((v) => ({ value: v, label: v })) }, expense_amount: money('Amount') } },
      expenses_subtotal: calc('Expenses total', 'sum(expenses, "expense_amount")'),
      has_mileage: yes('Claim mileage'),
      miles_driven: { type: 'number', label: 'Miles driven', decimals: null },
      mileage_rate: money('Rate per mile', { help: 'Check your company policy. In the US the IRS sets a standard rate each year.' }),
      mileage_amount: calc('Mileage', 'round(miles_driven * mileage_rate, 2)'),
      mileage_purpose: { label: 'What the trips were for' },
      total_amount: calc('Total to reimburse', `expenses_subtotal + ${less('has_mileage', 'mileage_amount')}`),
      has_advance: yes('You received an advance'),
      advance_amount: money('Advance received'),
      balance_due: calc('Balance due to you', 'total_amount - advance_amount'),
      receipts_attached: yes('Receipts are attached for every expense'),
      payment_details: { label: 'Pay to', placeholder: 'e.g. payroll, or your bank details' },
      approver_name: { label: 'Approver\'s name' },
    },
  },

  'payment-receipt': {
    sections: [
      ['Your business', '', ['business_name', 'business_address', 'received_by_name']],
      ['The payment', '', ['receipt_number', 'payment_date', 'payer_name', 'amount_received', 'show_sum_in_words', 'sum_in_words', 'payment_purpose', 'has_invoice_number', 'invoice_number', 'how_paid', 'has_transaction_reference', 'transaction_reference']],
      ['Balance and notes', '', ['is_partial_payment', 'balance_due', 'balance_due_date', 'has_notes', 'receipt_notes']],
    ],
    fields: {
      receipt_number: { label: 'Receipt number', placeholder: 'e.g. R-0193' },
      payment_date: { label: 'Date received' },
      payer_name: { label: 'Received from' },
      show_sum_in_words: yes('Also write the amount in words', 'Written out for you, as on a cheque.'),
      sum_in_words: calc('Amount in words', 'concat(words(floor(amount_received)), " and ", if(round((amount_received - floor(amount_received)) * 100) < 10, "0", ""), round((amount_received - floor(amount_received)) * 100), "/100")', 'text'),
      payment_purpose: { label: 'What the payment was for', placeholder: 'e.g. Deposit for kitchen renovation' },
      has_invoice_number: yes('It pays an invoice'),
      how_paid: { label: 'Paid by', placeholder: 'e.g. bank transfer, card, cash' },
      has_transaction_reference: yes('Show a transaction reference'),
      is_partial_payment: yes('This is a partial payment'),
      balance_due: money('Balance still due'),
      has_notes: yes('Add a note'),
      received_by_name: { label: 'Received by (your name)' },
    },
  },

  'rent-receipt': {
    sections: [
      ['Receipt', '', ['receipt_number', 'receipt_date', 'tenant_name', 'property_address']],
      ['Payment', '', ['amount_received', 'period_start_date', 'period_end_date', 'how_paid', 'includes_late_fee', 'late_fee_amount', 'has_other_charges', 'other_charges_description', 'is_partial_payment', 'balance_due', 'balance_due_date', 'has_notes', 'receipt_notes']],
      ['Landlord', '', ['landlord_name', 'has_manager', 'owner_name', 'has_landlord_contact', 'landlord_phone', 'landlord_email']],
    ],
    fields: {
      receipt_number: { label: 'Receipt number', placeholder: 'e.g. 2026-10' },
      tenant_name: { label: 'Tenant\'s name' },
      property_address: { label: 'Rental property address' },
      period_start_date: { label: 'Rent period from' },
      period_end_date: { label: 'Rent period to' },
      how_paid: { label: 'Paid by', placeholder: 'e.g. e-transfer, cheque, cash' },
      includes_late_fee: yes('The payment includes a late fee'),
      has_other_charges: yes('The payment includes other charges', 'For example parking, utilities or a pet fee.'),
      other_charges_description: { label: 'Other charges', placeholder: 'e.g. $40 for parking' },
      is_partial_payment: yes('This is a partial payment'),
      balance_due: money('Balance still due'),
      has_notes: yes('Add a note'),
      landlord_name: { label: 'Landlord or manager\'s name' },
      has_manager: yes('You are a manager signing for the owner'),
      owner_name: { label: 'Owner\'s name' },
      has_landlord_contact: yes('Show your phone and email'),
    },
  },

  'change-order-form': {
    sections: [
      ['The contract', '', ['change_order_number', 'change_order_date', 'project_name', 'original_contract_name', 'original_contract_date', 'provider_name', 'client_name']],
      ['The change', 'List what is added, removed or changed. The price change is the total of these amounts.', ['change_description', 'change_items', 'is_price_increase', 'price_change_amount', 'original_contract_price', 'new_contract_total', 'has_payment_change', 'payment_terms_for_change']],
      ['Schedule', '', ['changes_schedule', 'original_completion_date', 'new_completion_date']],
    ],
    fields: {
      change_items: { itemLabel: 'Change', min: 1, children: { change_item: { label: 'What changes' }, change_item_amount: money('Price of this change') } },
      is_price_increase: yes('The price goes up (untick if it goes down)'),
      price_change_amount: calc('Price change', 'sum(change_items, "change_item_amount")'),
      original_contract_price: money('Contract price before this change', { help: 'Include any earlier change orders.' }),
      new_contract_total: calc('New contract price', 'if(is_price_increase, original_contract_price + price_change_amount, original_contract_price - price_change_amount)'),
      has_payment_change: yes('The change is paid differently from the contract'),
      changes_schedule: yes('The completion date changes'),
    },
  },
};

/** The setup for a library template slug, or null. */
export const setupFor = (slug) => SETUPS[slug] || null;

function override(f, o) {
  if (!o) return f;
  const { children, ...rest } = o;
  let out = f;
  if (rest.type && rest.type !== f.type) {
    // a new type starts from that type's defaults; the key, section, show-when rule and label carry over
    out = makeField(f.key, rest.type, { label: f.label, sectionId: f.sectionId, showIf: f.showIf });
  }
  out = { ...out, ...rest };
  if (out.type === 'computed') { out.required = false; out.role = 'value'; }
  if (out.type === 'repeat' && children) out.children = (out.children || []).map((c) => override(c, children[c.key]));
  return out;
}

/**
 * Apply a setup to an inferred questionnaire ({ sections, fields }). Returns a new { sections, fields }: sections in the
 * setup's order (plus "Other details" for anything it does not place), fields in section order, overrides merged in.
 */
export function applySetup(q, setup) {
  if (!setup) return q;
  const byKey = new Map(q.fields.map((f) => [f.key, f]));
  const sections = [], placed = new Map();
  for (const [title, description, keys] of setup.sections || []) {
    const s = makeSection(title, { description });
    sections.push(s);
    keys.forEach((k, i) => { if (byKey.has(k) && !placed.has(k)) placed.set(k, { sectionId: s.id, rank: sections.length * 1000 + i }); });
  }
  let other = null;
  const fields = q.fields.map((f, i) => {
    let sectionId, rank;
    if (placed.has(f.key)) ({ sectionId, rank } = placed.get(f.key));
    else { if (!other) { other = makeSection('Other details'); } sectionId = other.id; rank = 1e6 + i; }
    return { field: override({ ...f, sectionId }, (setup.fields || {})[f.key]), rank };
  }).sort((a, b) => a.rank - b.rank).map((x) => x.field);
  if (other) sections.push(other);
  return { ...q, sections, fields };
}
