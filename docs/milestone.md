# milestones.md — Build Phases & Task Breakdown
> Quotation Generator · Vue 3 + TypeScript

---

## Overview

| Milestone | Name | Goal | Est. Effort |
|-----------|------|------|-------------|
| M0 | Foundation | Scaffold, types, composables, localStorage layer | 1–2 days |
| M1 | Core Form + JSON IO | Working form, quotation JSON export/import | 2–3 days |
| M2 | Catalog | CRUD, localStorage persistence, autocomplete | 2–3 days |
| M3 | Catalog Sync Popup | Status trigger, fuzzy match, popup UI | 1–2 days |
| M4 | Preview + Templates | Live preview, all 5 templates, status badge | 3–4 days |
| M5 | History + Workspace IO | localStorage history, workspace backup/restore | 1–2 days |
| M6 | Print + Deploy | PDF export, Cloudflare Pages | 1 day |
| M7 | Stretch Goals | Mobile layout, tags, price chart in catalog | TBD |

Total estimated: **11–17 focused days** for a solo developer

---

## M0 — Foundation

**Goal:** Project boots, types defined, localStorage layer working, composables stubbed.

### Tasks

- [ ] Scaffold with Vite + Vue 3 + TypeScript
  ```bash
  npm create vite@latest quotify -- --template vue-ts
  cd quotify && npm install
  ```
- [ ] Install dependencies
  - `uuid` — item IDs
  - `date-fns` — date formatting and defaults
  - Google Fonts via `<link>` in `index.html`
- [ ] Folder structure:
  ```
  src/
  ├── components/
  │   ├── sidebar/
  │   │   ├── SidebarShell.vue
  │   │   ├── LogoUpload.vue
  │   │   ├── PartyFields.vue
  │   │   ├── MetaFields.vue
  │   │   ├── LineItemsTable.vue
  │   │   ├── TotalsFields.vue
  │   │   ├── NotesField.vue
  │   │   └── StatusSelector.vue
  │   ├── catalog/
  │   │   ├── CatalogPanel.vue
  │   │   ├── CatalogItem.vue
  │   │   ├── CatalogEditDrawer.vue
  │   │   ├── CatalogSearch.vue
  │   │   └── CatalogSyncPopup.vue
  │   ├── preview/
  │   │   ├── PreviewPanel.vue
  │   │   ├── TemplateSwitcher.vue
  │   │   ├── StatusBar.vue
  │   │   └── templates/
  │   │       ├── TemplateClassic.vue
  │   │       ├── TemplateMinimal.vue
  │   │       ├── TemplateBold.vue
  │   │       ├── TemplateSidebar.vue
  │   │       └── TemplateFriendly.vue
  │   ├── shared/
  │   │   ├── AppButton.vue
  │   │   ├── AppToast.vue
  │   │   ├── AppModal.vue
  │   │   └── ActionBar.vue
  │   └── HistoryPanel.vue
  ├── composables/
  │   ├── useQuotation.ts
  │   ├── useHistory.ts
  │   ├── useCatalog.ts
  │   ├── useCatalogSync.ts
  │   ├── useAutocomplete.ts
  │   ├── useFuzzyMatch.ts
  │   ├── useTemplate.ts
  │   ├── useLogoUpload.ts
  │   ├── useJsonIO.ts
  │   ├── useWorkspaceIO.ts
  │   └── usePrint.ts
  ├── types/
  │   └── quotation.ts
  ├── utils/
  │   ├── calculations.ts
  │   ├── defaults.ts
  │   ├── formatCurrency.ts
  │   ├── generateFilename.ts
  │   ├── fuzzyMatch.ts
  │   └── localStorage.ts           ← typed get/set/clear helpers
  ├── styles/
  │   ├── tokens.css
  │   ├── global.css
  │   └── print.css
  └── App.vue
  ```
- [ ] Define all TypeScript types in `types/quotation.ts` (from flow.md)
- [ ] Define CSS tokens in `styles/tokens.css` (from design.md)
- [ ] Implement `utils/localStorage.ts`
  ```typescript
  // typed wrappers — never raw localStorage calls outside this file
  export const storage = {
    get<T>(key: string): T | null
    set<T>(key: string, value: T): void
    remove(key: string): void
  }
  ```
- [ ] Stub all composables (signatures only)
- [ ] `App.vue` renders two-column layout shell

**Done when:** `npm run dev` boots, layout visible, no TS errors, localStorage utils tested.

---

## M1 — Core Form + JSON IO

**Goal:** Full form works. Quotation JSON downloads correctly. Re-upload restores exact state.

### Tasks

#### Utils
- [ ] `defaults.ts` → `createEmptyQuotation()` factory
  - Auto-increments QUO number from localStorage history
  - Defaults: today's date, valid until +14 days, IDR, DRAFT status
- [ ] `calculations.ts` → `calcSubtotal()`, `calcDiscount()`, `calcTax()`, `calcTotal()`
- [ ] `formatCurrency.ts` → locale-aware per currency
- [ ] `generateFilename.ts` → `QUO-001_ClientName_2026-05-19.json`

#### Composables
- [ ] `useQuotation.ts`
  - `quotation` reactive state
  - `computed` totals
  - `loadQuotation(data)`, `resetQuotation()`
  - `isDirty` watcher
- [ ] `useJsonIO.ts`
  - `exportQuotationJson(quotation)` → file download
  - `importJson(file)` → detect type field → route to correct handler
  - Schema version validation
  - Error handling

#### Components
- [ ] `SidebarShell.vue` — 3 tabs: Editor / History / Catalog
- [ ] `LogoUpload.vue` — drag/drop, base64, remove
- [ ] `PartyFields.vue` — reusable for From + To
- [ ] `MetaFields.vue` — quotation number, dates, currency, status selector
- [ ] `StatusSelector.vue` — dropdown with colored badges
- [ ] `LineItemsTable.vue` — dynamic rows, keyboard nav (Tab/Enter)
- [ ] `TotalsFields.vue` — discount %, tax label, tax %
- [ ] `NotesField.vue` — textarea
- [ ] `ActionBar.vue` — Upload / Download JSON / PDF / New
- [ ] `AppButton.vue` — primary / secondary / ghost variants
- [ ] `AppToast.vue` — success / warning / error, auto-dismiss 3s
- [ ] `AppModal.vue` — reusable modal shell (used for sync popup + unsaved changes)

**Done when:** Form fills in → JSON downloads → re-upload restores 100% of fields.

---

## M2 — Catalog

**Goal:** Catalog CRUD works. Items persist in localStorage. Autocomplete works in line items.

### Tasks

#### Utils
- [ ] `fuzzyMatch.ts`
  ```typescript
  // Normalize: lowercase, trim, remove punctuation
  // Compare using Levenshtein or simple bigram similarity
  // Return similarity score 0–1
  export function fuzzyMatch(query: string, target: string): number
  export function fuzzySearch(query: string, catalog: CatalogEntry[]): CatalogEntry[]
  ```

#### Composables
- [ ] `useCatalog.ts`
  - `catalog` ref, loaded from localStorage on init
  - `addItem(entry)`, `updateItem(id, patch)`, `deleteItem(id)`
  - `searchCatalog(query)` → fuzzy filtered results
  - All mutations write through to localStorage
- [ ] `useAutocomplete.ts`
  - `query` ref (bound to description input)
  - `results` computed (top 5 fuzzy matches)
  - `isOpen` ref
  - `selectItem(entry)` → fills description + price in row
  - Keyboard: ↑↓ to navigate, Enter to select, Escape to close

#### Components
- [ ] `CatalogPanel.vue` — search bar, item list, add button, export/import buttons
- [ ] `CatalogItem.vue` — name, price, meta, edit/delete actions (visible on hover)
- [ ] `CatalogEditDrawer.vue`
  - Opens inline within sidebar (slides in, pushes content)
  - Fields: name, description, default price, currency, unit, tags
  - Price history section (read-only log)
  - Save / Cancel
- [ ] `CatalogSearch.vue` — debounced search input (300ms)
- [ ] `LineItemsTable.vue` — update to integrate autocomplete dropdown per row

**Done when:** Catalog CRUD works, items persist on refresh, autocomplete fills line item price.

---

## M3 — Catalog Sync Popup

**Goal:** Changing status to SENT triggers popup. User controls which items are saved.

### Tasks

#### Composables
- [ ] `useCatalogSync.ts`
  - `buildSyncList(lineItems, catalog)` → `CatalogSyncItem[]`
    - For each line item: fuzzy match against catalog
    - Classify as NEW / UPDATE / SAME
    - Pre-check: NEW → checked, UPDATE → checked, SAME → unchecked
    - Special case: items that look like one-offs (e.g. "Rush Fee", single word, round number) → unchecked by default
  - `applySyncItems(selectedItems, catalog)` → updated catalog
  - `checkedCount` computed

#### Components
- [ ] `CatalogSyncPopup.vue`
  - Modal overlay
  - Header: "Save to Catalog?" + quotation number + client
  - Item list with checkboxes, change type pills, price history context
  - Save Selected (N) / Save All / Skip buttons
  - Checked count updates live
  - Keyboard: Escape → Skip

#### Integration
- [ ] `StatusSelector.vue` — on change to SENT:
  1. `useCatalogSync.buildSyncList()` runs
  2. If list is empty → skip popup, status updates silently
  3. If list has items → popup opens
  4. After popup resolved → status updates in `useQuotation` state
  5. `isDirty = true` (user should re-download JSON with new status)

**Done when:** Status → SENT triggers popup, save/skip correctly updates catalog, status updates in UI.

---

## M4 — Preview + Templates

**Goal:** Live preview renders for all 5 templates. Status badge shown in all templates.

### Tasks

#### Composables
- [ ] `useTemplate.ts` — activeTemplate ref, setTemplate(), cross-fade trigger

#### Components
- [ ] `PreviewPanel.vue` — template switcher + status bar + dynamic template component
- [ ] `TemplateSwitcher.vue` — 5 pill buttons
- [ ] `StatusBar.vue` — quotation number · client · status badge (live from form)
- [ ] `TemplateClassic.vue`
- [ ] `TemplateMinimal.vue`
- [ ] `TemplateBold.vue`
- [ ] `TemplateSidebar.vue`
- [ ] `TemplateFriendly.vue`

#### Each template must:
- [ ] Accept `quotation: QuotationData` as prop
- [ ] Show "Quotation" not "Invoice"
- [ ] Show "Valid Until" not "Due Date"
- [ ] Display status badge in correct position (see design.md §6)
- [ ] Display logo if present
- [ ] Render all line items + totals
- [ ] Hide empty optional fields gracefully
- [ ] Be A4-proportioned (794px wide)
- [ ] Have scoped print styles

#### Preview behavior
- [ ] 80ms debounce on form → preview update
- [ ] 150ms cross-fade on template switch
- [ ] Preview scrolls independently from sidebar

**Done when:** All 5 templates render correctly with live data including status badge.

---

## M5 — History + Workspace IO

**Goal:** History persists in localStorage. Workspace backup export/import works.

### Tasks

#### Composables
- [ ] `useHistory.ts`
  - `history` ref, loaded from localStorage on init
  - `addToHistory(quotation)` → strips logo.data → saves
  - `loadFromHistory(index)` → loads into form
  - `clearHistory()`
  - Deduplication: same quotation_number → latest wins
- [ ] `useWorkspaceIO.ts`
  - `exportWorkspace()` → combines catalog + history → downloads JSON
  - `importWorkspace(file)` → parses, merges catalog, merges history
  - Conflict resolution: latest `updated_at` wins

#### Components
- [ ] `HistoryPanel.vue`
  - Reads from `useHistory()`
  - Shows: QUO number · client · date · total · status badge
  - Logo indicator: shows 📎 icon if original had logo (logo stripped in storage)
  - Click → loads, switches to Editor tab
  - Empty state

#### Polish
- [ ] "New Quotation" `isDirty` check + confirmation modal
- [ ] Quotation number auto-increment from history count
- [ ] All edge cases from flow.md §3 handled
- [ ] localStorage full detection → warning toast
- [ ] History sorted by updated_at descending

**Done when:** History loads on refresh, workspace backup round-trips cleanly.

---

## M6 — Print + Deploy

**Goal:** PDF prints cleanly on A4. App live on Cloudflare Pages.

### Tasks

#### Print
- [ ] `usePrint.ts` → `triggerPrint()`
- [ ] `styles/print.css` — hide sidebar, status bar, template switcher, action bar
- [ ] A4 page sizing + margin reset
- [ ] Test all 5 templates in Chrome, Firefox, Safari
- [ ] Long quotation page-break behavior

#### Deploy
- [ ] `vite.config.ts` build config
- [ ] `public/_redirects` → `/* /index.html 200`
- [ ] Push to GitHub
- [ ] Connect to Cloudflare Pages
  - Build command: `npm run build`
  - Output: `dist`
  - Node: 20
- [ ] Verify production build end-to-end
- [ ] Test localStorage persistence on production domain

**Done when:** Live on Cloudflare Pages. PDF works across browsers.

---

## M7 — Stretch Goals

| Feature | Notes |
|---------|-------|
| Item tags + filter | Tag catalog items (design, dev, copy) → filter in panel |
| Price history chart | Sparkline showing price trend over time per item |
| Mobile layout | Tab-based: Form ↔ Preview on < 768px |
| Duplicate quotation | Clone button in History |
| "Looks like a one-off" detection | Heuristic to auto-uncheck rush fees etc in sync popup |
| Catalog item usage count badge | Shows "quoted 5×" badge on catalog items |
| Convert to Invoice | Generate invoice JSON from accepted quotation (prep for V2 connection) |
| i18n | EN + ID (Bahasa Indonesia) |
| PWA | Service worker via vite-plugin-pwa |

---

## Definition of Done (V1)

- [ ] User creates a quotation from scratch in < 2 minutes
- [ ] All 5 templates render correctly with quotation data + status badge
- [ ] Autocomplete fills price from catalog correctly
- [ ] Status → SENT triggers catalog sync popup
- [ ] Save Selected / Save All / Skip all work correctly
- [ ] Catalog persists in localStorage across page refreshes
- [ ] History persists in localStorage (logos stripped)
- [ ] Quotation JSON download is valid, re-upload restores 100% of fields
- [ ] Workspace backup exports catalog + history, imports and merges cleanly
- [ ] PDF prints on A4 in Chrome, Firefox, Safari
- [ ] Zero TypeScript errors (`npm run type-check` passes)
- [ ] Zero console errors in production build
- [ ] Live on Cloudflare Pages

---

*Next: `example.html` → working HTML/CSS/JS prototype*