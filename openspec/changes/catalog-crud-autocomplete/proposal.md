## Why

M1 delivered the quotation form and JSON I/O. The next critical piece is the **item catalog** — the heart of the app's "price memory" feature. Without it, users have no way to manage their standard rates and the autocomplete in line items has no data source. This milestone gives users a persistent, localStorage-backed catalog with full CRUD and integrates autocomplete into the quotation line items, so they never guess what they charged last time.

## What Changes

- **New `useCatalog` composable** — CRUD operations for catalog entries, localStorage persistence, fuzzy search integration
- **New `useAutocomplete` composable** — Per-row reactive autocomplete state for line item description inputs with keyboard navigation
- **New catalog UI components** — `CatalogPanel`, `CatalogItem`, `CatalogEditDrawer`, `CatalogSearch` for the catalog tab in the sidebar
- **Modified `LineItemsTable.vue`** — Each row gets an autocomplete dropdown that fuzzy-searches the catalog as the user types
- **Modified `App.vue`** — Catalog tab pane wired to `CatalogPanel` component with `CatalogEditDrawer` overlay
- **Removed `useFuzzyMatch.ts` composable** (redundant — `utils/fuzzyMatch.ts` already provides the functionality)

## Capabilities

### New Capabilities
- `catalog-crud`: Persistent item catalog with add/edit/delete/search, localStorage write-through, fuzzy search, empty state handling, and price history tracking
- `catalog-autocomplete`: Per-row autocomplete dropdown in line item description fields with fuzzy matching, keyboard navigation (↑↓→Enter/Esc), catalog item selection (fills description + price), and inline item creation
- `catalog-ui`: Catalog tab panel with search bar, item list with hover-reveal actions, add button, slide-in drawer for item editing with price history readout, and export/import placeholder buttons

### Modified Capabilities
- `line-item-management`: Description input fields gain autocomplete dropdown with catalog search, selection behavior, and keyboard navigation — requirement change from free-text input to catalog-integrated input
- `app-shell`: Catalog tab pane replaces stub content with functional CatalogPanel component; CatalogEditDrawer added as overlay

## Impact

- **4 new component files** under `src/components/catalog/`
- **2 new composable files** under `src/composables/`
- **2 modified files**: `src/components/sidebar/LineItemsTable.vue`, `src/App.vue`
- **1 removed file**: `src/composables/useFuzzyMatch.ts` (redundant)
- **2 new test files** for `useCatalog` and `useAutocomplete`
- No new dependencies; uses existing `utils/fuzzyMatch.ts`, `utils/localStorage.ts`, and `types/quotation.ts`
