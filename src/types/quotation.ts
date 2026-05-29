// ──────────────────────────────────────────────
// Union types
// ──────────────────────────────────────────────

export type QuotationStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED'

export type TemplateId = 'classic' | 'minimal' | 'bold' | 'sidebar' | 'friendly'

export type CurrencyCode =
  | 'USD' | 'EUR' | 'GBP' | 'IDR'
  | 'SGD' | 'MYR' | 'AUD' | 'JPY'

export type ChangeType = 'NEW' | 'UPDATE' | 'SAME'

// ──────────────────────────────────────────────
// Quotation sub-types
// ──────────────────────────────────────────────

export interface Party {
  name: string
  address: string
  email: string
  phone?: string
  website?: string
}

export interface QuotationLogo {
  data: string // base64 data URL
  name: string
}

export interface LineItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  amount: number
}

export interface QuotationTotals {
  subtotal: number
  discount_percent: number
  discount_amount: number
  tax_percent: number
  tax_amount: number
  total: number
}

export interface QuotationMeta {
  quotation_number: string
  issue_date: string
  valid_until: string
  currency: CurrencyCode
}

// ──────────────────────────────────────────────
// Main QuotationData interface
// ──────────────────────────────────────────────

export interface QuotationData {
  schema_version: string
  type: 'quotation'
  template: TemplateId
  status: QuotationStatus
  meta: QuotationMeta
  from: Party
  to: Party
  logo: QuotationLogo | null
  line_items: LineItem[]
  totals: QuotationTotals
  tax_label: string
  discount_label: string
  notes: string
  created_at: string
  updated_at: string
}

// ──────────────────────────────────────────────
// Catalog types (matches example-v2.html schema)
// ──────────────────────────────────────────────

export interface PriceHistoryEntry {
  price: number
  date: string
  client: string
  num: string
}

export interface CatalogEntry {
  id: string
  name: string
  desc: string
  price: number
  cur: CurrencyCode
  unit: string
  history: PriceHistoryEntry[]
  times: number
  created: string
  updated: string
}

export interface CatalogSyncItem {
  item: Partial<LineItem>
  match: CatalogEntry | null
  change_type: ChangeType
  checked: boolean
}

// ──────────────────────────────────────────────
// Workspace backup
// ──────────────────────────────────────────────

export interface WorkspaceBackup {
  schema_version: string
  type: 'workspace_backup'
  exported_at: string
  catalog: CatalogEntry[]
  history: QuotationData[]
}

// ──────────────────────────────────────────────
// Storage keys (bare — no prefix)
// The prefix (quoted_) is added by the
// localStorage utility at runtime.
// ──────────────────────────────────────────────

export const STORAGE_KEYS = {
  HISTORY: 'history',
  CATALOG: 'catalog',
  CATALOG_META: 'catalog_meta',
} as const
