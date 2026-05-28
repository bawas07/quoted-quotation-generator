## Why

M0 established the project scaffold, type system, design tokens, localStorage layer, and component/composable stubs. The app renders a two-column layout shell but has zero working form fields, no reactive state, and no JSON import/export. M1 is the first feature milestone: it makes the quotation form fully functional, implements JSON download/upload with 100% field restoration, and wires all UI components to real data.

## What Changes

- **BREAKING (cleanup)** Delete 6 empty composable stubs created in M0 that are out of scope: `useShortcuts.ts`, `useAutoSave.ts`, `useExport.ts`, `useCurrency.ts`, `useValidation.ts`, `usePreview.ts`
- Implement `useQuotation.ts` — central reactive quotation state with computed totals, CRUD methods for every field, and `isDirty` tracking
- Implement `useJsonIO.ts` — `exportQuotation()` (file download), `parseQuotationFile()` (upload + schema validation), error handling
- Create `useToast.ts` — reactive toast array, `showToast(msg, type)`, auto-dismiss 3s
- Implement `useLogoUpload.ts` — file selection, drag-drop, base64 encoding, file type/size validation
- Rewrite 7 sidebar component stubs from empty shells to fully wired form components: `LogoUpload.vue`, `PartyFields.vue`, `MetaFields.vue`, `StatusSelector.vue`, `LineItemsTable.vue`, `TotalsFields.vue`, `NotesField.vue`
- Implement 2 shared components: `AppButton.vue` (variant-based), `AppToast.vue` (stacked bottom-right container)
- Refactor `App.vue` — replace inline HTML stubs with real component composition, wire all composables, reactive tab switching, action bar buttons, live status bar, template switcher, unsaved changes confirmation
- Implement 2 preview components: `StatusBar.vue`, `TemplateSwitcher.vue`
- Write 5 test files: `useQuotation.test.ts` (~26 scenarios), `useJsonIO.test.ts` (~14 scenarios), `useLogoUpload.test.ts`, `AppButton.test.ts`, `AppToast.test.ts`
- Polish: currency formatting in readonly fields, 80ms debounce on preview updates, minimum 1 line item guard

## Capabilities

### New Capabilities

- `quotation-state`: Central reactive `quotation` ref with computed `subtotal`, `discount_amount`, `tax_amount`, `total`, and `isDirty` flag
- `quotation-crud`: Methods to update every QuotationData field (meta, from/to parties, line items, totals, notes, status, template)
- `line-item-management`: Add/remove line items with minimum-1 guard, auto-recalculate amounts and totals
- `json-export`: Download current quotation as `.json` with correct filename (`QUO-001_ClientName_YYYY-MM-DD.json`)
- `json-import`: Parse uploaded `.json`, validate schema version and `type: 'quotation'`, restore 100% of fields
- `logo-upload`: Drag-drop or click-to-select image → base64, preview, remove
- `status-selector`: Clickable badge dropdown cycling DRAFT → SENT → ACCEPTED → REJECTED
- `toast-system`: Success/warning/error toasts, auto-dismiss 3s, stacked bottom-right
- `app-button`: Primary/secondary/ghost variants, small size support
- `tab-switching`: Reactive Editor/History/Catalog tabs in sidebar
- `unsaved-changes-guard`: Confirmation modal on "+ New" when `isDirty` is true
- `template-switcher`: 5 template pills (classic/minimal/bold/sidebar/friendly) wired to reactive state
- `live-status-bar`: Displays quotation number and client name from current state

### Modified Capabilities

- `app-shell`: `App.vue` refactored from static HTML stubs to fully composed reactive layout
- `component-stubs`: 7 sidebar stubs and 2 shared stubs upgraded from empty shells to implemented components
- `composable-stubs`: 3 composable stubs upgraded (`useQuotation`, `useJsonIO`, `useLogoUpload`); 1 new composable created (`useToast`); 6 stubs deleted

## Impact

- **~25 files** affected: 6 deletions, 4 composable implementations, 1 new composable, 9 component implementations, 2 new preview components, 1 App.vue refactor, 5 new test files
- **Dependencies**: `@vue/test-utils` (new dev dependency for component tests in M1)
- **No backend, no APIs, no services affected** — local-first browser app
- **No breaking changes to existing M0 code** — all M0 types, utils, styles, and localStorage layer remain untouched
- **Data format**: JSON export uses `schema_version: '1.0'`, `type: 'quotation'` — forward-compatible with M5 workspace backup format
