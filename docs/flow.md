# flow.md — User Flows & State Transitions
> Quotation Generator · Vue 3 + TypeScript

---

## 1. App States

```
EMPTY → EDITING → PREVIEWING (always active alongside editing)
                ↓
          STATUS CHANGE
                ↓
         → SENT: Catalog Sync Popup
         → ACCEPTED / REJECTED / DRAFT: silent update
                ↓
          DOWNLOADING (quotation JSON / PDF)
          UPLOADING (re-load from quotation JSON or workspace backup)
```

| State | Description |
|-------|-------------|
| `EMPTY` | First load, no data entered |
| `EDITING` | User filling in form |
| `PREVIEWING` | Always active — live render alongside editing |
| `CATALOG_SYNC` | Popup triggered when status → SENT |
| `DOWNLOADING` | Triggering quotation JSON or PDF download |
| `UPLOADING` | Parsing uploaded quotation JSON or workspace backup |

---

## 2. Primary Flows

---

### Flow A — Create New Quotation (Happy Path)

```
1. User opens app
   └── App loads, reads localStorage
       ├── Restores catalog (invoicy_catalog)
       ├── Restores history (invoicy_quo_history)
       └── Form starts EMPTY with defaults

2. User selects a template
   └── Template switcher highlights selection
   └── Preview re-renders instantly, data unchanged

3. User uploads logo (optional)
   └── Drag or click logo upload zone
   └── Image → base64, stored in memory
   └── Preview updates immediately
   └── Remove button (×) appears

4. User fills FROM fields
   └── Name, address, email, phone, website
   └── Preview updates live (80ms debounce)

5. User fills TO fields
   └── Client name, address, email
   └── Preview updates live

6. User fills Quotation Meta
   └── Quotation number (pre-filled: QUO-001)
   └── Issue date (pre-filled: today)
   └── Valid until (pre-filled: today + 14 days)
   └── Currency (default: IDR)
   └── Status (default: DRAFT)

7. User adds Line Items
   └── Types in description field
       └── Catalog autocomplete appears (if catalog has entries)
       └── User selects item → price auto-fills from catalog default
       └── OR user types freely → no autocomplete match
   └── Fills qty, unit price (or accepts auto-filled price)
   └── Amount auto-calculates (qty × unit price)
   └── Clicks "+ Add Item" for more rows
   └── Clicks × to remove a row (min 1 row enforced)

8. User sets Discount & Tax (optional)
   └── Discount % (default: 0)
   └── Tax label + Tax % (default: PPN 11%)
   └── Totals recalculate live

9. User adds Notes (optional)
   └── Payment terms, validity clause, scope notes

10. User downloads Quotation JSON
    └── Clicks "Download JSON"
    └── File: QUO-001_ClientName_2026-05-19.json
    └── Quotation added/updated in localStorage history (logo stripped)
    └── Toast: "Quotation saved ✓"

11. User changes status to SENT
    └── → triggers Flow C (Catalog Sync Popup)
    └── After popup resolved → status updates in form + preview
    └── isDirty = true (prompt to re-download JSON with updated status)

12. User downloads PDF (optional)
    └── window.print() → preview panel prints as A4
    └── Sidebar + UI chrome hidden via print CSS
```

---

### Flow B — Re-upload & Edit Existing Quotation

```
1. User clicks "Upload JSON" or drags .json onto app
   └── File picker opens

2. App detects file type from JSON "type" field:
   └── "quotation" → load into form (this flow)
   └── "workspace_backup" → trigger Flow F (Workspace Import)

3. App parses quotation JSON
   └── Valid → repopulate all form fields
   └── Logo restored from base64 if present
   └── Template auto-selected from JSON
   └── Status restored from JSON
   └── Invalid/corrupt → toast error: "Couldn't read this file."

4. Quotation added/updated in localStorage history

5. User edits and re-downloads
   └── updated_at timestamp refreshes on download
   └── History entry updates in localStorage
```

---

### Flow C — Catalog Sync Popup (Status → SENT)

```
1. User changes status dropdown to SENT
   └── App scans all current line items
   └── Each item normalized (lowercase, trimmed)
   └── Fuzzy matched against catalog (threshold: 0.85)

2. Popup opens with categorized list:

   For each line item:
   ├── NEW (no catalog match)
   │   └── Checkbox: checked by default
   │   └── Shows: item name + price
   │
   ├── UPDATE (catalog match found, price differs)
   │   └── Checkbox: checked by default
   │   └── Shows: item name + new price + "was Rp X (date, client)"
   │
   └── SAME (catalog match found, price identical)
       └── Checkbox: unchecked by default (no point re-saving)
       └── Shows: item name + price + "no change"

3. User reviews and toggles checkboxes

4. User clicks action:
   ├── [Save Selected] → only checked items written to catalog
   ├── [Save All]      → all items regardless of checkbox state
   └── [Skip]          → catalog unchanged, status still updates to SENT

5. On save:
   └── NEW items → created in catalog
   └── UPDATE items → price_history appended, default_price updated
   └── Catalog written to localStorage
   └── Toast: "X items saved to catalog ✓"

6. Status updates to SENT in form state
   └── Preview badge updates
   └── isDirty = true

7. Re-trigger behavior:
   └── If user re-uploads a quotation JSON and sets status → SENT again
   └── Popup fires again — user can Skip if nothing changed
   └── Popup always fires on SENT, never silently skipped
```

---

### Flow D — Browse & Load History

```
1. User clicks "History" tab in sidebar
   └── List loaded from localStorage (invoicy_quo_history)
   └── Sorted by updated_at descending
   └── Each entry: QUO number · client · date · total · status badge

2. User clicks an entry
   └── Form repopulates with that quotation's data
   └── Logo: if was present → placeholder shown
       └── Note: "This quotation had a logo. Re-upload the JSON to restore it."
   └── Template switches to match
   └── Preview updates

3. User edits and re-downloads as normal
```

---

### Flow E — Catalog CRUD

```
BROWSE:
1. User clicks "Catalog" tab
   └── Search bar + item list
   └── Each item: name · default price · times quoted · last quoted date
   └── Empty state: "No items yet. They'll appear here after your first quotation."

CREATE (manual):
1. User clicks "+ Add Item"
   └── Inline form or slide-in drawer:
       name, description, default price, currency, unit, tags
2. User saves → item added to catalog in localStorage
   └── Toast: "Item added to catalog ✓"

UPDATE:
1. User clicks item in list → edit drawer opens
   └── All fields editable
   └── Price history shown (read-only log)
2. User saves → catalog updated in localStorage

DELETE:
1. User clicks delete icon on item
   └── Confirmation: "Remove 'Logo Design' from catalog? This won't affect existing quotations."
   └── Confirmed → item removed from localStorage
   └── Toast: "Item removed ✓"
```

---

### Flow F — Workspace Backup Export & Import

```
EXPORT:
1. User clicks "Export Workspace" in Catalog tab
   └── App reads invoicy_catalog + invoicy_quo_history from localStorage
   └── Combines into workspace_backup object (logos already stripped from history)
   └── Downloads: workspace_backup_2026-05-19.json
   └── Toast: "Workspace exported ✓"

IMPORT:
1. User clicks "Import Workspace" or uploads a .json file
   └── App reads "type" field → "workspace_backup"
   └── Conflict resolution for catalog:
       ├── Item exists by name → compare updated_at → latest wins
       └── Item not found → add as new
   └── History: merged, duplicates by quotation_number → latest updated_at wins
   └── localStorage updated
   └── History panel + catalog refresh
   └── Toast: "Workspace restored — X catalog items, Y quotations ✓"
```

---

### Flow G — New Quotation While One Is Open

```
1. User clicks "+ New Quote"
   └── isDirty check:
       ├── Changes present →
       │   Modal: "You have unsaved changes."
       │   [Download & Continue] [Discard & Continue] [Cancel]
       └── No changes → reset immediately

2. Form resets:
   └── Quotation number increments (QUO-001 → QUO-002)
   └── Dates reset (today / today + 14)
   └── Status resets to DRAFT
   └── Logo cleared
   └── Line items reset to 2 empty rows
   └── History retains all previous entries
```

---

### Flow H — Autocomplete Interaction

```
1. User focuses description field in a line item row
   └── If catalog is empty → no autocomplete, free typing only

2. User types ≥ 2 characters
   └── Fuzzy search fires against catalog item names
   └── Dropdown appears below field (max 5 results)
   └── Each result shows:
       ├── Item name (matched chars highlighted)
       ├── Default price (formatted in current currency)
       └── "quoted X×" in muted mono text

3. User navigates:
   └── Mouse hover OR keyboard ↑↓ to highlight
   └── Enter or click to select

4. On selection:
   └── Description field fills with catalog item name
   └── Unit price field auto-fills with catalog default_price
   └── User can still override price manually
   └── Autocomplete closes

5. User presses Escape or clicks away
   └── Autocomplete closes, free text kept
```

---

## 3. Edge Cases & Error States

| Scenario | Behaviour |
|----------|-----------|
| Upload non-JSON file | Toast: "Please upload a .json file" |
| Upload JSON with unknown type field | Toast: "Unknown file type. Expected quotation or workspace_backup." |
| Upload corrupt JSON | Toast: "Couldn't read this file." |
| Upload workspace backup with 0 catalog items | Toast: "Workspace imported — no catalog items found." |
| Catalog sync popup with 0 new/updated items (all SAME) | Popup still shows with note: "All prices match your catalog. Nothing to update." [Close] |
| Line item qty = 0 | Allowed, shows Rp 0 — user's responsibility |
| No line items | Block: must have at least 1 row — remove button disabled on last row |
| Logo > 2MB | Warning toast, proceed allowed |
| localStorage full | Toast: "Storage almost full. Export your workspace to free up space." |
| Quotation number left blank | Auto-fills QUO-001 on download |
| No client name | Filename: QUO-001_Quotation_2026-05-19.json |
| Autocomplete open + user tabs away | Autocomplete closes, current text kept |
| Status changed SENT → ACCEPTED → SENT | Popup fires again on each SENT transition |

---

## 4. State Shape (TypeScript Reference)

```typescript
// ── App State ──
interface AppState {
  template: TemplateId
  quotation: QuotationData
  history: QuotationData[]          // loaded from localStorage, logos stripped
  catalog: CatalogEntry[]           // loaded from localStorage
  isDirty: boolean
  activeTab: 'editor' | 'history' | 'catalog'
  catalogSyncPopup: {
    open: boolean
    items: CatalogSyncItem[]
  }
  autocomplete: {
    activeRowId: string | null
    query: string
    results: CatalogEntry[]
    open: boolean
  }
}

// ── Quotation ──
interface QuotationData {
  schema_version: '1.0'
  type: 'quotation'
  template: TemplateId
  status: QuotationStatus
  meta: QuotationMeta
  from: Party
  to: Party
  logo: Logo | null
  line_items: LineItem[]
  totals: Totals
  tax_label: string
  notes: string
  created_at: string
  updated_at: string
}

type QuotationStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED'
type TemplateId = 'classic' | 'minimal' | 'bold' | 'sidebar' | 'friendly'

interface QuotationMeta {
  quotation_number: string
  issue_date: string                // YYYY-MM-DD
  valid_until: string               // YYYY-MM-DD
  currency: CurrencyCode
}

// ── Catalog ──
interface CatalogEntry {
  id: string                        // uuid
  name: string
  description?: string
  default_price: number
  currency: CurrencyCode
  unit?: string
  tags?: string[]
  price_history: PriceHistoryEntry[]
  times_quoted: number
  created_at: string
  updated_at: string
}

interface PriceHistoryEntry {
  price: number
  quoted_at: string                 // YYYY-MM-DD
  client: string
  quotation_number: string
}

// ── Catalog Sync ──
interface CatalogSyncItem {
  lineItem: LineItem
  changeType: 'NEW' | 'UPDATE' | 'SAME'
  catalogMatch?: CatalogEntry       // present for UPDATE and SAME
  checked: boolean
}

// ── Workspace Backup ──
interface WorkspaceBackup {
  schema_version: '1.0'
  type: 'workspace_backup'
  exported_at: string
  catalog: CatalogEntry[]
  history: QuotationData[]          // logos stripped (logo: null)
}

type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'IDR' | 'SGD' | 'MYR' | 'AUD' | 'JPY'
```

---

## 5. Composables Map

| Composable | Responsibility |
|------------|---------------|
| `useQuotation()` | Core quotation state, form bindings, computed totals |
| `useHistory()` | localStorage read/write for quotation history |
| `useCatalog()` | localStorage read/write for catalog, CRUD operations |
| `useCatalogSync()` | Scan line items, fuzzy match, build sync popup item list |
| `useAutocomplete()` | Query catalog on keypress, manage dropdown state |
| `useFuzzyMatch()` | Normalize + compare strings, return similarity score |
| `useTemplate()` | Active template, switch handler |
| `useLogoUpload()` | File → base64, size warning |
| `useJsonIO()` | Export quotation JSON, import + detect file type |
| `useWorkspaceIO()` | Export workspace backup, import + merge logic |
| `usePrint()` | window.print() + print CSS class |

---

*Next: `design.md` → catalog UI, autocomplete component, status badge, sync popup*