## 1. Implement `AppModal.vue`

- [x] 1.1 Rewrite `src/components/shared/AppModal.vue` — use Vue `<Teleport to="body">` wrapper, render overlay only when `open` prop is true
- [x] 1.2 Implement backdrop overlay: `position: fixed; inset: 0; z-index: 400; background: rgba(26,44,61,0.65); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center`
- [x] 1.3 Implement modal card: `background: var(--cloud); border-radius: var(--r-lg); max-width: 440px; width: 94%; max-height: 90vh; display: flex; flex-direction: column; box-shadow: var(--shadow-float)` with `animation: mIn .22s ease` (`@keyframes mIn { from { opacity: 0; transform: scale(.95) } to { opacity: 1; transform: scale(1) } }`)
- [x] 1.4 Implement header slot (`.modal-hdr`) with `title` prop rendered in `.modal-title` (font-serif, 21px) and optional `subtitle` prop in `.modal-sub` (font-mono, 10px, muted)
- [x] 1.5 Implement default slot in `.modal-body` (padding: 0 24px, overflow-y: auto, flex: 1)
- [x] 1.6 Implement `footer` named slot in `.modal-ftr` (padding: 16px 24px, border-top, display: flex, gap: 8px)
- [x] 1.7 Implement `closable` prop (default `true`): when true, backdrop click emits `close`; when false, backdrop click ignored
- [x] 1.8 Implement Escape key listener: when modal is open and Escape pressed, emit `close`
- [x] 1.9 Style all modal classes matching `docs/example-v2.html`: `.modal-ov`, `.modal`, `.modal-hdr`, `.modal-title`, `.modal-sub`, `.modal-body`, `.modal-ftr`

## 2. Implement `useCatalogSync` composable

- [x] 2.1 Create `src/composables/useCatalogSync.ts` with:
  - Internal `syncItems: Ref<CatalogSyncItem[]>` initialized to `[]`
  - `checkedCount: ComputedRef<number>` computed from `syncItems.value.filter(i => i.checked).length`
  - Export `syncItems` as `readonly(syncItems)`
  - Export `checkedCount` as `ComputedRef<number>`
- [x] 2.2 Implement `buildSyncList(lineItems: LineItem[], catalog: CatalogEntry[], currency: CurrencyCode, toName: string, issueDate: string, quotationNumber: string): CatalogSyncItem[]`:
  - Filter out items where `description.trim() === ''`
  - For each item: call `fuzzyFind(item.description, catalog)` from `utils/fuzzyMatch.ts`
  - Classify: no match → NEW; match + price diff ≥ 0.01 → UPDATE; match + prices equal → SAME
  - Set checked: NEW + not oneOff → true; NEW + `looksLikeOneOff(item.description, item.unit_price)` → false; UPDATE → true; SAME → false
  - Store result in `syncItems` ref and return it
- [x] 2.3 Implement `applySyncItems(selectedItems: CatalogSyncItem[], currency: CurrencyCode, toName: string, issueDate: string, quotationNumber: string): void`:
  - Import and call `useCatalog()` to get `addItem`, `updateItem`
  - For NEW items: call `addItem({ name, desc: '', price, cur: currency, unit: '' })`
    - Also needs to push to price_history and increment times_quoted — handled via `updateItem` after creation or as part of a dedicated method
  - For UPDATE items with `match`: call `updateItem(match.id, { price: item.unit_price })`, then push new `PriceHistoryEntry` to `match.history`, increment `match.times`, update `match.updated`
  - For SAME items: skip (no action)
  - Show toast via useToast (or return result for caller to handle)
- [x] 2.4 Ensure `applySyncItems` handles the full CatalogEntry update: `price_history` push, `times_quoted` increment, `updated` timestamp — matching `example-v2.html` lines 1189-1200
- [x] 2.5 Write `src/composables/__tests__/useCatalogSync.test.ts` covering:
  - `buildSyncList` with NEW, UPDATE, SAME items
  - One-off detection auto-unchecks
  - Empty descriptions filtered out
  - `applySyncItems` calls `useCatalog().addItem()` for NEW items
  - `applySyncItems` updates price_history for UPDATE items
  - `checkedCount` computed updates correctly
  - Items with empty catalog return all as NEW
  - All prices matching catalog returns all as SAME (unchecked)

## 3. Implement `CatalogSyncPopup.vue`

- [x] 3.1 Rewrite `src/components/catalog/CatalogSyncPopup.vue`:
  - Props: `open: boolean`, `items: CatalogSyncItem[]`, `quotationNumber: string`, `clientName: string`
  - Emits: `close`, `save-selected`, `save-all`
  - Template uses `AppModal` as shell with title "Save to Catalog?" and subtitle `Review items from {quotationNumber} · {clientName}`
- [x] 3.2 Render item list in default slot: v-for over `items`, each as `.sync-item` row with:
  - Checkbox bound to item's checked state via `@change` handler (local copy of items or mutate prop via v-model pattern)
  - `.sync-body` with `.sync-name` (description), change pill (`.cpill` with `.new`/`.update`/`.same` class)
  - For UPDATE: `.sync-hist` showing `was {fmt(prevPrice)} · {date} · {client}` from `match.history` last entry
  - `.sync-price` with formatted current price using `formatCurrency`
- [x] 3.3 Implement checkbox toggle: local reactive copy of items (or use v-model pattern), update checked state on toggle
- [x] 3.4 Implement computed `checkedCount` based on local items state
- [x] 3.5 Render action buttons in `footer` slot:
  - "Save Selected (N)" — `.btn.btn-primary`, disabled when N=0, emits `save-selected` with checked items
  - "Save All" — `.btn.btn-secondary`, emits `save-all` with all items
  - "Skip" — `.btn.btn-ghost`, emits `close`
- [x] 3.6 Implement empty state: if items is empty array, render "No new or updated items found." instead of item list
- [x] 3.7 Import `formatCurrency` from `src/utils/formatCurrency.ts` for price formatting
- [x] 3.8 Style all component classes matching `docs/example-v2.html` sync modal CSS:
  - `.sync-item`, `.sync-cb`, `.sync-body`, `.sync-name`, `.sync-hist`, `.sync-price`
  - `.cpill`, `.cpill.new`, `.cpill.update`, `.cpill.same`
  - Background colors: `.cpill.new` → rgba(46,125,90,0.1), `.cpill.update` → rgba(176,125,42,0.1), `.cpill.same` → rgba(138,159,176,0.1)
- [x] 3.9 Wire keyboard handling: AppModal handles Escape → close; no additional keyboard logic needed in popup

## 4. Integrate in `App.vue`

- [x] 4.1 Import `useCatalogSync` and `CatalogSyncPopup` in `App.vue`
- [x] 4.2 Import `useCatalog` and get `catalog` ref for passing to `buildSyncList`
- [x] 4.3 Add reactive state: `showSyncPopup = ref(false)`, `pendingSyncItems = ref<CatalogSyncItem[]>([])`
- [x] 4.4 Replace direct `@update:modelValue="(val) => setStatus(val)"` on `StatusSelector` with a named handler `handleStatusChange(val: QuotationStatus)`:
  - If val !== 'SENT': call `setStatus(val)` immediately
  - If val === 'SENT':
    - Get `catalog` via `useCatalog().catalog`
    - Call `catalogSync.buildSyncList(quotation.value.line_items, catalog.value)`
    - If items.length > 0: set `pendingSyncItems` to items, set `showSyncPopup = true`
    - If items.length === 0: call `setStatus('SENT')`, show toast "Status updated to SENT"
- [x] 4.5 Implement `handleSyncSaveSelected(checkedItems: CatalogSyncItem[])`:
  - Call `catalogSync.applySyncItems(checkedItems, ...)`
  - Call `setStatus('SENT')`
  - Show toast `{checkedItems.length} items saved to catalog ✓`
  - Set `showSyncPopup = false`, clear `pendingSyncItems`
- [x] 4.6 Implement `handleSyncSaveAll(items: CatalogSyncItem[])`:
  - Call `catalogSync.applySyncItems(items, ...)`
  - Call `setStatus('SENT')`
  - Show toast `{items.length} items saved to catalog ✓`
  - Set `showSyncPopup = false`, clear `pendingSyncItems`
- [x] 4.7 Implement `handleSyncClose()` (skip):
  - Call `setStatus('SENT')`
  - Show toast "Status updated to SENT, catalog unchanged"
  - Set `showSyncPopup = false`, clear `pendingSyncItems`
- [x] 4.8 Render `CatalogSyncPopup` in template (after the preview panel, alongside AppToast):
  ```vue
  <CatalogSyncPopup
    :open="showSyncPopup"
    :items="pendingSyncItems"
    :quotationNumber="quotation.meta.quotation_number"
    :clientName="quotation.to.name"
    @close="handleSyncClose"
    @save-selected="handleSyncSaveSelected"
    @save-all="handleSyncSaveAll"
  />
  ```

## 5. Final verification

- [x] 5.1 Verify `npm run dev` boots without errors
- [x] 5.2 Verify `npm run build` passes with zero TypeScript errors
- [x] 5.3 Verify `npm run test` passes — all existing tests + new `useCatalogSync` tests pass
- [x] 5.4 Manual test: Status → SENT with line items → sync popup appears with correct classifications
- [x] 5.5 Manual test: Save Selected → only checked items added to catalog, status updates to SENT
- [x] 5.6 Manual test: Save All → all items added to catalog, status updates to SENT
- [x] 5.7 Manual test: Skip → catalog unchanged, status updates to SENT, toast shown
- [x] 5.8 Manual test: Empty line items → no popup, status updates silently
- [x] 5.9 Manual test: All items match catalog → all shown as SAME, pre-unchecked
- [x] 5.10 Manual test: One-off item (e.g., "Rush Fee" 500000) → pre-unchecked by default
- [x] 5.11 Manual test: Escape key closes popup (behaves as Skip)
- [x] 5.12 Manual test: Re-opening popup (change status away from SENT and back) → popup re-fires with fresh buildSyncList
- [x] 5.13 Verify AppModal is reusable: rendered with correct classes, teleported to body, backdrop click behavior correct
- [x] 5.14 Verify zero console errors in dev tools
