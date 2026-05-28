## Why

M2 delivered the catalog CRUD, localStorage persistence, and autocomplete in line items. Users can now manage their rate cards and quickly fill prices when typing descriptions. But the catalog remains **manually populated** — items are only added when users explicitly use the "+ Add Item" drawer. The core "price memory" promise of the app is that the catalog auto-learns from every quotation the user sends.

M3 closes this gap. When a user marks a quotation as **SENT**, a popup appears showing all line items that would be saved to the catalog, classified as NEW, UPDATE, or SAME. The user reviews, checks/unchecks, and confirms. This gives them full control while eliminating the friction of manual catalog entry. This is the moment the catalog truly becomes "self-growing."

## What Changes

- **New `useCatalogSync` composable** — Builds a sync list from line items vs catalog using fuzzy matching, classifies each as NEW/UPDATE/SAME, applies selected items to catalog with price history tracking, computes checked count reactively
- **Rewritten `AppModal.vue`** — Stub becomes a proper reusable modal with teleport, backdrop, Escape-close, scale-in animation, title/subtitle slots, matching `docs/example-v2.html` `.modal-ov` / `.modal` pattern
- **Rewritten `CatalogSyncPopup.vue`** — Stub becomes the full sync review modal: item list with checkboxes, change type pills (NEW/UPDATE/SAME), price history context for updates, Save Selected (N) / Save All / Skip buttons, keyboard support (Escape → Skip)
- **Modified `App.vue`** — Status change to SENT interception: calls `useCatalogSync.buildSyncList()`, shows popup if items found, otherwise updates status silently; popup result handlers apply changes then finalize status
- **No changes to** `StatusSelector.vue`, `useCatalog.ts`, `useQuotation.ts`, `fuzzyMatch.ts` — all remain untouched

## Capabilities

### New Capabilities
- `catalog-sync-composable`: Business logic for building a categorized sync list from line items vs catalog entries, and for applying selected items back to the catalog with price history tracking
- `catalog-sync-popup-ui`: Modal review interface showing all line items with checkboxes, change type classification pills (NEW/UPDATE/SAME), price history context for UPDATE items, and Save Selected / Save All / Skip actions
- `app-modal`: Reusable modal shell with backdrop overlay, teleport, Escape-close, scale animation, and flexible header/body/footer slots

### Modified Capabilities
- `app-vue-integration`: Status management now intercepts SENT transitions to trigger catalog sync workflow; integration handles empty-list skip, popup open/close, and post-sync status application

## Impact

- **1 composable rewritten**: `src/composables/useCatalogSync.ts`
- **2 components rewritten**: `src/components/shared/AppModal.vue`, `src/components/catalog/CatalogSyncPopup.vue`
- **1 file modified**: `src/App.vue`
- **No new dependencies** — uses existing `utils/fuzzyMatch.ts`, `utils/localStorage.ts`, `types/quotation.ts`, and `useCatalog`
- **1 new test file** for `useCatalogSync` composable
