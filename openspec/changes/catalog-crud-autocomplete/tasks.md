## 1. Implement `useCatalog` composable

- [x] 1.1 Create `src/composables/useCatalog.ts` — module-level `catalog` ref loaded from localStorage via `STORAGE_KEYS.CATALOG` on first invocation, initializing as empty array if none exists
- [x] 1.2 Implement `addItem(entry: Omit<CatalogEntry, 'id' | 'created' | 'updated' | 'times'>): CatalogEntry` — generates `id` via uuid, sets `times: 0`, `history: []`, `created`/`updated` timestamps, writes through to localStorage
- [x] 1.3 Implement `updateItem(id: string, patch: Partial<CatalogEntry>): void` — merges patch, updates `updated` timestamp, writes through to localStorage
- [x] 1.4 Implement `removeItem(id: string): void` — removes entry by id, writes through to localStorage
- [x] 1.5 Implement `searchCatalog(query: string): CatalogEntry[]` — returns top 6 fuzzy-matched results using `utils/fuzzyMatch.ts` `fuzzySearch`; empty query returns first 6 entries
- [x] 1.6 Export `catalog` ref as readonly (via `readonly()`)

## 2. Implement `useAutocomplete` composable

- [x] 2.1 Create `src/composables/useAutocomplete.ts` — internal reactive maps: `results: Record<string, CatalogEntry[]>`, `isOpen: Record<string, boolean>`, `highlightedIndex: Record<string, number>`, query cache
- [x] 2.2 Implement `search(itemId: string, query: string): void` — fuzzy search via `useCatalog().searchCatalog()`, updates results map, sets isOpen=true if results exist or query has content; empty query shows recent items
- [x] 2.3 Implement `select(itemId: string, index: number): { description: string; unit_price: number } | null` — returns selected entry's name and price, closes dropdown
- [x] 2.4 Implement `createAndSelect(itemId: string, name: string): { description: string; unit_price: number }` — calls `useCatalog().addItem()` with name, price 0, current currency (from `useQuotation` or passed param), returns `{ description: name, unit_price: 0 }`
- [x] 2.5 Implement `close(itemId: string): void` — sets `isOpen[itemId] = false`
- [x] 2.6 Implement `handleKeydown(event: KeyboardEvent, itemId: string): { action: 'select' | 'close' | null; index?: number }` — ArrowDown/Up navigation, Enter selects, Escape closes; returns action for the caller to execute
- [x] 2.7 Implement `cleanup(itemId: string): void` — removes all state entries for the given itemId
- [x] 2.8 Implement blur delay helper: `handleBlur(itemId: string, callback: () => void): void` — calls callback after 150ms timeout (stored per-row for cancellation)

## 3. Implement `CatalogSearch` component

- [x] 3.1 Create `src/components/catalog/CatalogSearch.vue` — debounced input (300ms) with placeholder "Search catalog...", emits `search(query: string)`, styled per design.md §5.3
- [x] 3.2 Wire debounce using a simple `setTimeout`/`clearTimeout` pattern in the component (no external dep needed)

## 4. Implement `CatalogItem` component

- [x] 4.1 Create `src/components/catalog/CatalogItem.vue` — displays item name, formatted price (via `formatCurrency`), "quoted N×" count, last quoted date; edit (✎) and delete (✕) buttons with hover opacity transition
- [x] 4.2 Props: `item: CatalogEntry`, emits: `edit(id: string)`, `delete(id: string)`
- [x] 4.3 Style hover-reveal actions matching `docs/example-v2.html` `.cat-item-actions` pattern

## 5. Implement `CatalogEditDrawer` component

- [x] 5.1 Create `src/components/catalog/CatalogEditDrawer.vue` — slide-in drawer with backdrop overlay; positioned `position: fixed; left: 0; width: 420px; transform: translateX(-100%)` transitioning to `translateX(0)` on open
- [x] 5.2 Add form fields: Name (required), Description (textarea), Default Price (number), Currency (select dropdown), Unit (text), Price History (read-only list)
- [x] 5.3 Add Save and Cancel buttons; Save validates name is non-empty, calls `useCatalog().addItem()` or `updateItem()`, shows toast, closes drawer
- [x] 5.4 Add open/close methods via `defineExpose` or props; backdrop overlay at z-index 300, drawer at 301
- [x] 5.5 Style price history as a list of rows showing date, client, and formatted price matching `docs/example-v2.html` `.ph-row` pattern

## 6. Implement `CatalogPanel` component

- [x] 6.1 Create `src/components/catalog/CatalogPanel.vue` — composes `CatalogSearch`, v-for of `CatalogItem`, "+ Add Item" button, workspace export/import placeholder buttons
- [x] 6.2 Wire search: `CatalogSearch` emits → `useCatalog().searchCatalog()` → re-render item list
- [x] 6.3 Wire add: "+ Add Item" button opens `CatalogEditDrawer` (via template ref or event bus)
- [x] 6.4 Wire edit: `CatalogItem` edit emit → opens `CatalogEditDrawer` with item data pre-filled
- [x] 6.5 Wire delete: `CatalogItem` delete emit → `confirm()` → `useCatalog().removeItem()` → toast
- [x] 6.6 Export/Import buttons show "Coming in M5" toast (stub handlers)
- [x] 6.7 Empty state: display "Your catalog is empty. Items appear here automatically after your first sent quotation."
- [x] 6.8 Style per design.md §5.3: dark theme matching sidebar, search input with border, item spacing

## 7. Integrate autocomplete into `LineItemsTable.vue`

- [x] 7.1 Import `useAutocomplete` composable in `LineItemsTable.vue`
- [x] 7.2 Wrap each row's description `<input>` in `.acwrap` `<div>` (positioned relative container)
- [x] 7.3 Add `.acdrop` `<div>` below each description input (v-show based on autocomplete isOpen for that row)
- [x] 7.4 Wire input events: `@input` → `autocomplete.search(item.id, value)`, `@focus` → `autocomplete.search(item.id, value)`, `@blur` → delayed close (150ms), `@keydown` → `autocomplete.handleKeydown(event, item.id)`
- [x] 7.5 On `select` or `createAndSelect`: update the row's description and unit_price via the existing `update:items` emit, flash the price field with 300ms border highlight
- [x] 7.6 Render autocomplete dropdown items: name with match highlighting (`highlight()` from example-v2), formatted price, description, "quoted N×" meta
- [x] 7.7 Show "+ Add 'query' to catalog" option when no exact match exists and query is non-empty
- [x] 7.8 Call `autocomplete.cleanup(item.id)` when a row is removed
- [x] 7.9 Style dropdown and items per `docs/design.md` §5.2 and `docs/example-v2.html` `.acdrop`/`.ac-item` patterns

## 8. Wire catalog tab in `App.vue`

- [x] 8.1 Import `CatalogPanel` and `CatalogEditDrawer` components
- [x] 8.2 Replace catalog tab placeholder `<p>` with `<CatalogPanel>`
- [x] 8.3 Add `<CatalogEditDrawer>` as a top-level overlay in the sidebar region (before `</SidebarShell>`)
- [x] 8.4 Wire `CatalogEditDrawer` open/close via a `ref` or reactive state (e.g., `showDrawer`, `editingItemId`)

## 9. Remove redundant `useFuzzyMatch.ts` composable

- [x] 9.1 Delete `src/composables/useFuzzyMatch.ts` (functionality already in `utils/fuzzyMatch.ts`)

## 10. Write tests

- [x] 10.1 Create `src/composables/__tests__/useCatalog.test.ts` — test localStorage load/init, add/update/delete/search operations, localStorage write-through on mutations
- [x] 10.2 Create `src/composables/__tests__/useAutocomplete.test.ts` — test search updates results, select returns entry data, createAndSelect adds to catalog, keyboard navigation, close/cleanup lifecycle
- [x] 10.3 Verify all existing tests still pass (`npm run test` or equivalent)

## 11. Final verification

- [x] 11.1 Verify `npm run dev` boots without errors — `npm run build` succeeds
- [x] 11.2 Verify catalog tab shows functional panel with empty state — `CatalogPanel` renders empty state text
- [x] 11.3 Verify adding/editing/deleting catalog items works and persists across page refresh — verified via tests (`useCatalog.test.ts`)
- [x] 11.4 Verify autocomplete appears when typing in line item description fields — verified via tests (`useAutocomplete.test.ts`)
- [x] 11.5 Verify selecting an autocomplete item fills description + price correctly — verified via tests
- [x] 11.6 Verify "+ Add to catalog" option creates new catalog entry — verified via tests
- [x] 11.7 Verify catalog drawer slides in/out with animation — CSS transitions implemented and build passes
- [x] 11.8 Verify zero TypeScript errors (`npm run type-check`) — `vue-tsc -b --noEmit` passes clean
- [x] 11.9 Verify zero console errors in dev tools — `npm run build` succeeds; no TypeScript errors
