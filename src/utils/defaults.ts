// Default values and factory for quotation fields
import type {
  CurrencyCode, QuotationStatus, TemplateId,
  QuotationData, QuotationMeta, Party, LineItem, QuotationTotals,
} from '../types/quotation'
import { format } from 'date-fns'

export const DEFAULT_CURRENCY: CurrencyCode = 'IDR'
export const DEFAULT_STATUS: QuotationStatus = 'DRAFT'
export const DEFAULT_TEMPLATE: TemplateId = 'classic'
export const DEFAULT_TAX_RATE = 11
export const DEFAULT_DISCOUNT = 0
export const DEFAULT_TAX_LABEL = 'PPN'
export const DEFAULT_NOTES = ''

function todayStr(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

function futureStr(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return format(d, 'yyyy-MM-dd')
}

function emptyParty(): Party {
  return { name: '', address: '', email: '' }
}

function emptyMeta(): QuotationMeta {
  return {
    quotation_number: 'QUO-001',
    issue_date: todayStr(),
    valid_until: futureStr(14),
    currency: DEFAULT_CURRENCY,
  }
}

function emptyTotals(): QuotationTotals {
  return {
    subtotal: 0,
    discount_percent: DEFAULT_DISCOUNT,
    discount_amount: 0,
    tax_percent: DEFAULT_TAX_RATE,
    tax_amount: 0,
    total: 0,
  }
}

function emptyLineItem(): LineItem {
  return {
    id: crypto.randomUUID(),
    description: '',
    quantity: 1,
    unit_price: 0,
    amount: 0,
  }
}

/**
 * Create a fresh QuotationData with sensible defaults.
 */
export function createEmptyQuotation(): QuotationData {
  const now = new Date()
  const nowStr = now.toISOString()
  return {
    schema_version: '1.0',
    type: 'quotation',
    template: DEFAULT_TEMPLATE,
    status: DEFAULT_STATUS,
    meta: emptyMeta(),
    from: emptyParty(),
    to: emptyParty(),
    logo: null,
    line_items: [emptyLineItem()],
    totals: emptyTotals(),
    tax_label: DEFAULT_TAX_LABEL,
    notes: DEFAULT_NOTES,
    created_at: nowStr,
    updated_at: nowStr,
  }
}
