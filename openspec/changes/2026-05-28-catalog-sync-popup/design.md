## Context

M2 implemented the full catalog CRUD (`useCatalog`, catalog UI components) and autocomplete integration. `utils/fuzzyMatch.ts` is fully implemented with `fuzzyMatch`, `fuzzySearch`, `fuzzyFind`, and `looksLikeOneOff`. `useCatalog` is a singleton composable with `addItem`, `updateItem`, `removeItem`, `searchCatalog`. The sync popup stub exists at `src/components/catalog/CatalogSyncPopup.vue` and `src/composables/useCatalogSync.ts` — both are empty shells.

The `docs/example-v2.html` reference contains a complete working implementation of the sync flow (lines 1095–1220) that we port to Vue 3 + TypeScript.

## Goals / Non-Goals

**Goals:**
- Implement `useCatalogSync` composable: `buildSyncList()`, `applySyncItems()`, `checkedCount`
- Implement `AppModal.vue` as reusable modal with teleport, backdrop, Escape-close, animation
- Rewrite `CatalogSyncPopup.vue` as full sync review modal using AppModal
- Wire sync flow into `App.vue`: intercept status → SENT, trigger popup, handle save/skip
- All styles match `docs/example-v2.html` CSS classes: `.modal-ov`, `.modal`, `.sync-item`, `.cpill`, `.sync-cb`, `.sync-body`, `.sync-name`, `.sync-price`, `.sync-hist`
- Tests for `useCatalogSync` composable covering build, classify, apply, edge cases

**Non-Goals:**
- Unsaved-changes confirmation modal refactor (still inline in App.vue) — can use AppModal later
- Catalog item tags/filtering — M7 (stretch)
- Price history chart/sparkline — M7 (stretch)
- Workspace export/import catalog integration — M5
- Status selector component changes — no modifications needed

## Decisions

### Decision 1: `useCatalogSync` as singleton composable with internal `syncItems` ref

**Choice:** A composable that manages its own `Ref<CatalogSyncItem[]>` state and provides `buildSyncList()` to populate it and `applySyncItems()` to persist selected items.

**Why:** `CatalogSyncPopup` needs to read the sync list reactively (for checkbox toggling and checkedCount). The composable owns this state. `buildSyncList()` is called from `App.vue` when status changes to SENT. `applySyncItems()` delegates to `useCatalog` internally for writes — keeping concerns separated.

**Alternatives considered:**
- *Pure functions in utils/*: Would lose reactivity for checkedCount and item toggle state. The popup would need to manage its own copy, duplicating logic.
- *State inside CatalogSyncPopup only*: Popup would need to receive pre-built sync items and emit apply events for the parent to handle catalog writes. More complex wiring for no gain.

### Decision 2: `AppModal` uses Teleport + `<slot>` pattern

**Choice:** `AppModal` teleports its content to `<body>` and uses named slots: `default` (body content) and `footer` (action buttons). Props: `open`, `title`, `subtitle`. Emits: `close`. Close-on-Escape is built in. Close-on-backdrop-click is controlled by optional `closable` prop (default: true — but sync popup will set it false to avoid accidental close).

**Why:** Teleport avoids z-index stacking issues with sidebar and drawer. Named slots give consuming components full control over layout while reusing the modal shell. This matches `docs/example-v2.html`'s `.modal-ov > .modal` structure, keeping CSS portable.

### Decision 3: Sync classification follows example-v2.html exactly — plus one-off detection

**Choice:** Each line item is classified using `fuzzyFind()` (threshold 0.85) from `utils/fuzzyMatch.ts`:
- No match → **NEW** (pre-checked, unless `looksLikeOneOff()` returns true)
- Match found + price differs by ≥ 0.01 → **UPDATE** (pre-checked, shows price history context)
- Match found + prices equal → **SAME** (pre-unchecked, shows "✓ SAME" pill)

Pre-check defaults: NEW checked, UPDATE checked, SAME unchecked, one-offs unchecked.

**Why:** This exactly mirrors `example-v2.html`'s `buildSyncItems()` (line 1095) with the addition of `looksLikeOneOff()` which fills a gap in the reference implementation. The example always pre-checks NEW items; our version uses the heuristic to auto-uncheck items like "Rush Fee" or "Expedite" that are likely one-off charges.

### Decision 4: Sync popup intercept at `App.vue` level, not in `StatusSelector.vue`

**Choice:** `StatusSelector.vue` remains a pure presentational component. The status change interception happens in `App.vue`'s `@update:modelValue` handler.

**Why:** The sync flow involves multiple composables (`useQuotation.setStatus`, `useCatalogSync.buildSyncList`, `useCatalog`) and component state (show/hide popup). This is orchestration logic that belongs in the composition root (`App.vue`), not in a presentational dropdown. `StatusSelector` only learns about status changes it should emit — it never decides what happens next.

### Decision 5: `applySyncItems` delegates writes to `useCatalog` singleton

**Choice:** `applySyncItems()` internally calls `useCatalog().addItem()` for NEW entries and `useCatalog().updateItem()` for UPDATE entries. It constructs proper `CatalogEntry` objects with price history records including quotation context (client name, date, number).

**Why:** `useCatalog` already handles localStorage persistence, ID generation, timestamp management. Duplicating this logic in `useCatalogSync` would violate DRY and create two paths for catalog mutations. `useCatalogSync` is a coordinator, not a data layer.

## Risks / Trade-offs

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| User clicks status → SENT multiple times rapidly | Low | Low | Each click triggers a new `buildSyncList` call — no state corruption because `syncItems` is replaced entirely |
| One-off detection (looksLikeOneOff) false positives | Medium | Low | Users can manually re-check items. The heuristic is conservative — only auto-unchecks clear one-offs (single word, round price, known generic terms) |
| Modal z-index (400) conflicts with drawer (301) or toast (500) | Low | Low | z-index spacing: drawer at 301, modal at 400 (matches example-v2.html), toast at 500. No overlap |
| `useCatalog` singleton not initialized when `applySyncItems` fires | Low | Low | `useCatalog()` already calls `ensureLoaded()` on every invocation — safe from any call site |
