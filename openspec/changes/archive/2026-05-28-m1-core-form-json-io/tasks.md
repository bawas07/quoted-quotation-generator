## 1. M0 Cleanup — Remove Scope-Creep Stubs

- [x] 1.1 Delete `src/composables/useShortcuts.ts` (empty stub, not in M0/M1 spec)
- [x] 1.2 Delete `src/composables/useAutoSave.ts` (empty stub, not in M0/M1 spec)
- [x] 1.3 Delete `src/composables/useExport.ts` (empty stub, not in M0/M1 spec)
- [x] 1.4 Delete `src/composables/useCurrency.ts` (empty stub, not in M0/M1 spec)
- [x] 1.5 Delete `src/composables/useValidation.ts` (empty stub, not in M0/M1 spec)
- [x] 1.6 Delete `src/composables/usePreview.ts` (empty stub, not in M0/M1 spec)
- [x] 1.7 Confirm: `npm run build` still passes after deletions
- [x] 1.8 Confirm: no imports reference the deleted files (grep `src/` for each name)

## 2. Core Composables

### 2.1 useQuotation.ts

- [x] 2.1.1 Import `QuotationData`, `LineItem`, `QuotationStatus`, `TemplateId`, `CurrencyCode` from `../types/quotation`
- [x] 2.1.2 Import `createEmptyQuotation` from `../utils/defaults` (implement if still stub)
- [x] 2.1.3 Export `quotation: Ref<QuotationData>` initialized with `createEmptyQuotation()`
- [x] 2.1.4 Export computed `subtotal` — sum of all line item `amount` fields
- [x] 2.1.5 Export computed `discount_amount` — `subtotal * (discount_percent / 100)`
- [x] 2.1.6 Export computed `tax_amount` — `(subtotal - discount_amount) * (tax_percent / 100)`
- [x] 2.1.7 Export computed `total` — `subtotal - discount_amount + tax_amount`
- [x] 2.1.8 Export `isDirty: Ref<boolean>` initialized `false`
- [x] 2.1.9 Implement deep watch on `quotation` → set `isDirty = true` on any change (exclude initial load)
- [x] 2.1.10 Export `loadQuotation(data: QuotationData)` — deep clone into `quotation`, reset `isDirty = false`
- [x] 2.1.11 Export `resetQuotation()` — replace with fresh `createEmptyQuotation()`, reset `isDirty = false`
- [x] 2.1.12 Export `updateMeta(patch: Partial<QuotationMeta>)`
- [x] 2.1.13 Export `updateFrom(patch: Partial<Party>)` and `updateTo(patch: Partial<Party>)`
- [x] 2.1.14 Export `setLogo(logo: QuotationLogo | null)`
- [x] 2.1.15 Export `addLineItem()` — append empty line item with `id` from `crypto.randomUUID()`
- [x] 2.1.16 Export `updateLineItem(id, patch: Partial<LineItem>)` — recalculate `amount = quantity * unit_price`
- [x] 2.1.17 Export `removeLineItem(id)` — guard: prevent removal if only 1 item remains; toast warning
- [x] 2.1.18 Export `updateTotals(patch: Partial<QuotationTotals>)` — only `discount_percent`, `tax_percent`, `tax_label` are writable
- [x] 2.1.19 Export `setStatus(status: QuotationStatus)`
- [x] 2.1.20 Export `setTemplate(template: TemplateId)`
- [x] 2.1.21 Export `setNotes(notes: string)`

### 2.2 useJsonIO.ts

- [x] 2.2.1 Import `QuotationData` from `../types/quotation`
- [x] 2.2.2 Import `generateFilename` from `../utils/generateFilename`
- [x] 2.2.3 Export `exportQuotation(quotation: QuotationData)` — serialize to JSON, create Blob, trigger download with `generateFilename`
- [x] 2.2.4 Export `parseQuotationFile(file: File): Promise<QuotationData>` — read File as text, JSON.parse
- [x] 2.2.5 Validate parsed object has `schema_version === '1.0'` and `type === 'quotation'`
- [x] 2.2.6 Validate required top-level keys: `meta`, `from`, `to`, `line_items`, `totals`, `status`, `template`
- [x] 2.2.7 Return parsed data on success; throw descriptive error on validation failure
- [x] 2.2.8 Export `isQuotationJson(data: unknown): data is QuotationData` type guard for runtime validation

### 2.3 useToast.ts (new)

- [x] 2.3.1 Define `Toast` interface: `{ id: string; message: string; type: 'success' | 'warning' | 'error' }`
- [x] 2.3.2 Export `toasts: Ref<Toast[]>` as reactive array
- [x] 2.3.3 Export `showToast(message: string, type: Toast['type'] = 'success')` — push toast with `crypto.randomUUID()` id
- [x] 2.3.4 Auto-dismiss: `setTimeout(() => removeToast(id), 3000)` on each add
- [x] 2.3.5 Export `removeToast(id: string)` — filter array by id
- [x] 2.3.6 Export `clearToasts()` — empty array

### 2.4 useLogoUpload.ts

- [x] 2.4.1 Export `logo: Ref<QuotationLogo | null>`
- [x] 2.4.2 Export `handleFileSelect(file: File)` — validate type (image/*), validate size (≤2MB)
- [x] 2.4.3 Convert valid file to base64 data URL via `FileReader.readAsDataURL`
- [x] 2.4.4 Set `logo.value = { data: base64, name: file.name }` on success
- [x] 2.4.5 Throw descriptive error on invalid type or oversized file
- [x] 2.4.6 Export `clearLogo()` — set `logo.value = null`
- [x] 2.4.7 Export `isDragging: Ref<boolean>` for drag-drop visual state

## 3. Sidebar Components

### 3.1 LogoUpload.vue

- [x] 3.1.1 Accept `modelValue: QuotationLogo | null` prop, emit `update:modelValue`
- [x] 3.1.2 Render drop zone with drag-over visual feedback (`isDragging`)
- [x] 3.1.3 Handle `drop` event → call `handleFileSelect` from `useLogoUpload`
- [x] 3.1.4 Handle `click` → hidden `<input type="file" accept="image/*">`
- [x] 3.1.5 Show image preview when `modelValue` is present
- [x] 3.1.6 Show "Remove" button when logo exists; emit `null` on click
- [x] 3.1.7 Show validation errors via toast (use `useToast`)

### 3.2 PartyFields.vue

- [x] 3.2.1 Accept `modelValue: Party` prop, emit `update:modelValue`
- [x] 3.2.2 Render inputs: name (text), address (textarea), email (email), phone (tel, optional), website (url, optional)
- [x] 3.2.3 Label prop: `"From"` or `"To"` — displayed as section header
- [x] 3.2.4 Two-way bind each field to `modelValue` via computed setters
- [x] 3.2.5 Optional fields show only when non-empty or focused (graceful empty-state)

### 3.3 MetaFields.vue

- [x] 3.3.1 Accept `meta: QuotationMeta` prop, emit `update:meta`
- [x] 3.3.2 Render: quotation number (text), issue date (date), valid until (date)
- [x] 3.3.3 Render currency dropdown (`<select>`) with all 8 `CurrencyCode` options
- [x] 3.3.4 Two-way bind all fields via computed setters
- [x] 3.3.5 Default valid until = issue date + 14 days (set by `createEmptyQuotation`)

### 3.4 StatusSelector.vue

- [x] 3.4.1 Accept `modelValue: QuotationStatus` prop, emit `update:modelValue`
- [x] 3.4.2 Render clickable badge showing current status with colored dot
- [x] 3.4.3 On click: open dropdown with 4 options (DRAFT, SENT, ACCEPTED, REJECTED)
- [x] 3.4.4 Each option shows status name + colored dot
- [x] 3.4.5 Close dropdown on selection or outside click
- [x] 3.4.6 Emit new status value on selection

### 3.5 LineItemsTable.vue

- [x] 3.5.1 Accept `items: LineItem[]` prop, emit `update:items`
- [x] 3.5.2 Render table with columns: description, qty, unit price, amount (readonly)
- [x] 3.5.3 Each row: description `<input>`, qty `<input type="number" min="0">`, unit price `<input type="number" min="0">`
- [x] 3.5.4 Amount column: computed `quantity * unit_price`, formatted with `formatCurrency`
- [x] 3.5.5 Remove button per row; guard prevents removing last item (toast warning)
- [x] 3.5.6 "Add item" button appends new empty row
- [x] 3.5.7 Emit updated array on every mutation

### 3.6 TotalsFields.vue

- [x] 3.6.1 Accept `totals: QuotationTotals` and `currency: CurrencyCode` props
- [x] 3.6.2 Emit `update:totals` for writable fields only (`discount_percent`, `tax_percent`, `tax_label`)
- [x] 3.6.3 Render discount % input (0–100), tax label input, tax % input
- [x] 3.6.4 Render readonly subtotal, discount amount, tax amount, total — formatted with `formatCurrency`
- [x] 3.6.5 Computed values update live when props change

### 3.7 NotesField.vue

- [x] 3.7.1 Accept `modelValue: string` prop, emit `update:modelValue`
- [x] 3.7.2 Render `<textarea>` with placeholder "Additional notes..."
- [x] 3.7.3 Two-way bind to `modelValue`

## 4. Shared Components

### 4.1 AppButton.vue

- [x] 4.1.1 Props: `variant: 'primary' | 'secondary' | 'ghost'` (default `'primary'`), `size: 'sm' | 'md'` (default `'md'`)
- [x] 4.1.2 Render `<button>` with dynamic CSS classes based on variant + size
- [x] 4.1.3 Forward all native button attributes (type, disabled, etc.) via `$attrs`
- [x] 4.1.4 Slot for button label/content
- [x] 4.1.5 Scoped styles matching design tokens (rust primary, ink secondary, transparent ghost)

### 4.2 AppToast.vue

- [x] 4.2.1 Use `useToast()` to access `toasts` array
- [x] 4.2.2 Render fixed-position container bottom-right of viewport
- [x] 4.2.3 Render each toast as stacked card with color border-left per type
- [x] 4.2.4 Success = green, warning = amber, error = red (use design token colors)
- [x] 4.2.5 Auto-dismiss after 3s (handled by composable)
- [x] 4.2.6 Manual close button (×) calls `removeToast(id)`

## 5. Preview Components

### 5.1 StatusBar.vue

- [x] 5.1.1 Accept `quotationNumber: string` and `clientName: string` props
- [x] 5.1.2 Render: quotation number · client name (or "—" if empty)
- [x] 5.1.3 Styled to match existing `.status-bar` CSS in `App.vue`

### 5.2 TemplateSwitcher.vue

- [x] 5.2.1 Accept `modelValue: TemplateId` prop, emit `update:modelValue`
- [x] 5.2.2 Render 5 pill buttons: classic, minimal, bold, sidebar, friendly
- [x] 5.2.3 Active pill has `.active` class
- [x] 5.2.4 Emit new template on click

## 6. App.vue Refactor

- [x] 6.1 Import and compose: `SidebarShell`, `LogoUpload`, `PartyFields`, `MetaFields`, `StatusSelector`, `LineItemsTable`, `TotalsFields`, `NotesField`, `AppButton`, `AppToast`, `PreviewPanel`, `StatusBar`, `TemplateSwitcher`
- [x] 6.2 Import composables: `useQuotation`, `useJsonIO`, `useLogoUpload`, `useToast`
- [x] 6.3 Wire `useQuotation` state to all sidebar form components via `v-model`
- [x] 6.4 Wire `useLogoUpload.logo` ↔ `LogoUpload` via `v-model`
- [x] 6.5 Implement reactive tab switching: `activeTab: Ref<'editor' | 'history' | 'catalog'>`
- [x] 6.6 Action bar buttons:
  - [x] 6.6.1 "Upload JSON" → hidden file input → `parseQuotationFile` → `loadQuotation` → toast success/error
  - [x] 6.6.2 "Download JSON" → `exportQuotation(quotation.value)` → toast success
  - [x] 6.6.3 "PDF" → noop (M6), toast "PDF export coming soon"
  - [x] 6.6.4 "+ New" → if `isDirty`, show inline confirmation; else `resetQuotation()`
- [x] 6.7 Live status bar: pass `quotation.meta.quotation_number` and `quotation.to.name` to `StatusBar`
- [x] 6.8 Template switcher: pass `quotation.template` to `TemplateSwitcher`, update via `setTemplate`
- [x] 6.9 Unsaved changes confirmation: inline overlay in sidebar, "Discard changes? / Cancel" buttons
- [x] 6.10 Render `<AppToast />` once at root level
- [x] 6.11 Preserve existing CSS class names and layout structure
- [x] 6.12 Add 80ms debounce wrapper for preview-related reactive updates (status bar, template switcher)

## 7. Tests

### 7.1 useQuotation.test.ts

- [x] 7.1.1 Initial state: quotation has default values from `createEmptyQuotation`
- [x] 7.1.2 `isDirty` starts `false`
- [x] 7.1.3 Updating meta sets `isDirty = true`
- [x] 7.1.4 Updating from/to sets `isDirty = true`
- [x] 7.1.5 Adding line item sets `isDirty = true`
- [x] 7.1.6 Updating line item sets `isDirty = true`
- [x] 7.1.7 Removing line item sets `isDirty = true`
- [x] 7.1.8 Updating totals sets `isDirty = true`
- [x] 7.1.9 Setting status sets `isDirty = true`
- [x] 7.1.10 Setting template sets `isDirty = true`
- [x] 7.1.11 Setting notes sets `isDirty = true`
- [x] 7.1.12 `loadQuotation` replaces state and resets `isDirty = false`
- [x] 7.1.13 `resetQuotation` creates fresh state and resets `isDirty = false`
- [x] 7.1.14 Computed `subtotal` sums line items correctly
- [x] 7.1.15 Computed `discount_amount` applies percent to subtotal
- [x] 7.1.16 Computed `tax_amount` applies percent to discounted base
- [x] 7.1.17 Computed `total` = subtotal - discount + tax
- [x] 7.1.18 `addLineItem` appends item with unique id
- [x] 7.1.19 `updateLineItem` recalculates amount = qty * unit_price
- [x] 7.1.20 `removeLineItem` removes by id
- [x] 7.1.21 `removeLineItem` on last item throws / shows warning (guard)
- [x] 7.1.22 Deep clone on `loadQuotation` — mutating loaded object does not affect original
- [x] 7.1.23 Currency formatting not tested here (tested in `formatCurrency.test.ts` if exists)
- [x] 7.1.24 Logo update sets `isDirty = true`
- [x] 7.1.25 Setting same status again still sets `isDirty = true` (any mutation)
- [x] 7.1.26 Computed totals update reactively when line items change

### 7.2 useJsonIO.test.ts

- [x] 7.2.1 `exportQuotation` returns a Blob with correct MIME type
- [x] 7.2.2 `exportQuotation` filename matches `generateFilename` format
- [x] 7.2.3 `exportQuotation` JSON contains all QuotationData fields
- [x] 7.2.4 `parseQuotationFile` parses valid quotation JSON
- [x] 7.2.5 `parseQuotationFile` validates `schema_version === '1.0'`
- [x] 7.2.6 `parseQuotationFile` validates `type === 'quotation'`
- [x] 7.2.7 `parseQuotationFile` rejects missing required keys
- [x] 7.2.8 `parseQuotationFile` rejects unknown `schema_version`
- [x] 7.2.9 `parseQuotationFile` rejects workspace backup (`type: 'workspace_backup'`)
- [x] 7.2.10 `parseQuotationFile` rejects invalid JSON syntax
- [x] 7.2.11 `parseQuotationFile` rejects non-JSON file content
- [x] 7.2.12 `isQuotationJson` returns `true` for valid object
- [x] 7.2.13 `isQuotationJson` returns `false` for null, array, primitive
- [x] 7.2.14 `isQuotationJson` returns `false` for object missing required keys

### 7.3 useLogoUpload.test.ts

- [x] 7.3.1 `logo` starts `null`
- [x] 7.3.2 `handleFileSelect` with valid image sets `logo` with base64 data and name
- [x] 7.3.3 `handleFileSelect` rejects non-image file type
- [x] 7.3.4 `handleFileSelect` rejects file > 2MB
- [x] 7.3.5 `clearLogo` sets `logo` to `null`
- [x] 7.3.6 `isDragging` toggles on dragenter/dragleave

### 7.4 AppButton.test.ts

- [x] 7.4.1 Renders slot content
- [x] 7.4.2 Applies `primary` variant class by default
- [x] 7.4.3 Applies `secondary` variant class when prop set
- [x] 7.4.4 Applies `ghost` variant class when prop set
- [x] 7.4.5 Applies `sm` size class when prop set
- [x] 7.4.6 Forwards click events
- [x] 7.4.7 Respects `disabled` attribute

### 7.5 AppToast.test.ts

- [x] 7.5.1 Renders nothing when `toasts` array is empty
- [x] 7.5.2 Renders toast message and type icon/color
- [x] 7.5.3 Renders multiple toasts stacked
- [x] 7.5.4 Close button removes toast immediately
- [x] 7.5.5 Auto-dismiss after 3s (use vitest fake timers)

## 8. Polish & Integration

- [x] 8.1 Currency formatting in `LineItemsTable` amount column uses `formatCurrency`
- [x] 8.2 Currency formatting in `TotalsFields` readonly values uses `formatCurrency`
- [x] 8.3 80ms debounce on preview panel reactive updates (status bar text, template switcher)
- [x] 8.4 Unsaved changes confirmation on "+ New" click: inline overlay, not `AppModal`
- [x] 8.5 Minimum 1 line item: `removeLineItem` guard + toast warning
- [x] 8.6 All number inputs have `min="0"` to prevent negative values
- [x] 8.7 `App.vue` scoped styles preserved; no visual regression in layout
- [x] 8.8 No `console.log` or `console.error` in production code (except error handling)

## Verification

- [x] `npm run build` passes (`vue-tsc --noEmit` + `vite build`, zero TS errors)
- [x] `npm run test` passes (all 6 test files green, 79 tests)
- [x] Form fills all fields → JSON downloads with all data present
- [x] JSON re-upload → 100% field restoration (verify every key)
- [x] Line item add/remove works; removing last item shows toast and is blocked
- [x] Computed totals update live when qty, unit_price, discount%, or tax% change
- [x] Logo upload (click and drag-drop), preview, and remove all work
- [x] Status badge dropdown cycles through all 4 states
- [x] Tab switching (Editor/History/Catalog) works without page reload
- [x] "+ New" with unsaved changes shows confirmation; without changes resets immediately
- [x] No console errors in browser dev tools during normal usage
