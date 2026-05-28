## Context

M1 delivered the quotation form, JSON export/import, and sidebar/preview infrastructure. The catalog tab currently shows a placeholder stub: `"Catalog stub — CRUD interface coming in M2"`. The `utils/fuzzyMatch.ts` module is already fully implemented with 0–1 scoring, `fuzzySearch`, and `fuzzyFind` functions. All TypeScript types for `CatalogEntry`, `PriceHistoryEntry`, and `CatalogSyncItem` are already defined in `types/quotation.ts`.

The existing codebase uses a composable-centric architecture: state lives in composables (e.g., `useQuotation`, `useJsonIO`), components consume composables via `setup()`, and shared utilities live in `utils/`. The sidebar components (`LineItemsTable`, `PartyFields`, etc.) communicate with App.vue via props+events.

## Goals / Non-Goals

**Goals:**
- Implement `useCatalog` composable with full CRUD and localStorage persistence
- Implement `useAutocomplete` composable with per-row reactive state for line item autocomplete
- Build catalog UI: `CatalogPanel`, `CatalogItem`, `CatalogEditDrawer`, `CatalogSearch` components
- Integrate autocomplete dropdown into each row of `LineItemsTable.vue`
- Wire catalog tab in `App.vue` to functional `CatalogPanel` with slide-in drawer
- All catalog components styled to match `docs/example-v2.html` and `docs/design.md`
- Tests for both new composables

**Non-Goals:**
- Catalog Sync Popup (status → SENT trigger) — M3
- Workspace export/import (buttons exist, handlers show "Coming in M5") — M5
- Catalog item tags/filtering — M7 (stretch)
- Price history chart/sparkline — M7 (stretch)
- Template rendering — M4
- History persistence — M5

## Decisions

### Decision 1: `useCatalog` as singleton composable (not Pinia)

**Choice:** A standalone composable that internally holds a `Ref<CatalogEntry[]>` loaded from localStorage on first call. All mutation methods write through to localStorage immediately.

**Why:** Follows the same pattern as the existing codebase (no Pinia). The catalog is the only consumer — no cross-component race conditions. localStorage is synchronous, so write-through is trivial. Testability is preserved by stubbing `utils/localStorage.ts`.

**Alternatives considered:**
- *Pinia store*: Overkill for a single-data-source feature. Would add a dependency inconsistent with M0's architecture decision.
- *Provide/inject*: Adds unnecessary indirection. The composable's singleton behavior (module-level state) already provides the same sharing.

### Decision 2: `useAutocomplete` with reactive `Map<string, RowState>` keyed by line item ID

**Choice:** A single composable instance managing a reactive map of autocomplete states. Each state entry contains `{ query, isOpen, results, highlightedIndex }`. Methods accept `itemId` to operate on specific rows.

**Why:** `useAutocomplete` is used once in `LineItemsTable.vue`. Multiple instances would create lifecycle complexity (cleanup on row removal). A core Map with per-row states is clean, debuggable, and avoids recreating state objects when rows re-render.

**Trade-off:** Slightly more complex internals vs. per-row instances. Mitigated by clear method signatures (`search(itemId, q)`, `select(itemId, index)`, `cleanup(itemId)`).

### Decision 3: CatalogEditDrawer as fixed-position overlay sliding from left

**Choice:** The drawer uses `position: fixed; left: 0; width: 420px; transform: translateX(-100%)` with a backdrop overlay (`z-index: 300` on overlay, `301` on drawer). This matches `docs/example-v2.html` exactly.

**Why:** The drawer needs to overlay the sidebar content, not push it. Fixed positioning ensures it covers the entire sidebar regardless of scroll position. The sidebar width (420px) matches the design token `--sidebar-w` from `docs/design.md`.

### Decision 4: Autocomplete fires instantly on input (no debounce), CatalogSearch debounces at 300ms

**Choice:** Line item autocomplete searches on every keystroke (matching example-v2.html behavior). Catalog search debounces at 300ms.

**Why:** Autocomplete in line items needs to feel immediate — users type and expect instant suggestions. Catalog search has a broader dataset (user's full catalog) and benefits from debouncing to avoid unnecessary re-renders during rapid typing.

### Decision 5: Catalog retains `useFuzzyMatch.ts` composable removal, not deletion

**Choice:** The `useFuzzyMatch.ts` composable stub is removed (it simply wraps `utils/fuzzyMatch.ts` with no added value). If a reactive wrapper is ever needed, it can be reintroduced.

**Why:** YAGNI. The raw functions from `utils/fuzzyMatch.ts` (`fuzzyMatch`, `fuzzySearch`, `fuzzyFind`) are already complete and directly usable. The composable stub adds a layer of indirection with zero benefit.

## Risks / Trade-offs

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Autocomplete keyboard nav (↑↓) conflicts with Tab order in line item grid | Medium | Medium | Arrow keys handled only on the description input with `.prevent`; Tab/Shift+Tab pass through normally |
| Catalog drawer overlay (z-index 301) conflicts with toast container (z-index 9999) | Low | Low | Toast already at z-index 9999; drawer at 301 — no conflict. Modal system (M3) will use 400+ |
| `useCatalog` singleton retains stale catalog if another tab modifies localStorage | Low | Medium | The composable reads localStorage on init only. Multiple tabs scenario is out of scope for v1 (localStorage doesn't emit cross-tab events by default) |
| Large catalogs (>500 items) cause autocomplete lag on every keystroke | Low | Medium | fuzzyMatch uses Jaccard similarity, not Levenshtein — O(n·m) per item where n,m are word counts, not character length. Benchmarked reference: 500 items filter in <5ms |
| LineItemsTable re-render causes autocomplete dropdown flicker | Low | Low | Each dropdown uses `v-show` keyed by `item.id`, keeping DOM stable. Dropdown open/close is toggle-only, not created/destroyed |
