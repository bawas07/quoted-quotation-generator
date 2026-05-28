# Catalog CRUD

## Purpose

Provides a persistent item catalog stored in localStorage with full CRUD operations, fuzzy search, and price history tracking. This is the data backbone for autocomplete and catalog sync features.

## ADDED Requirements

### Requirement: Catalog loads from localStorage on initialization
`useCatalog` MUST load catalog entries from localStorage keyed by `STORAGE_KEYS.CATALOG` on its first invocation. If no catalog exists, it initializes as an empty array.

#### Scenario: Catalog loads from localStorage
- **WHEN** `useCatalog()` is called and localStorage has catalog data
- **THEN** `catalog` ref is populated with the stored entries

#### Scenario: Catalog initializes empty
- **WHEN** `useCatalog()` is called and localStorage has no catalog
- **THEN** `catalog` ref is an empty array

### Requirement: Catalog persists to localStorage on every mutation
Every add, update, or delete operation MUST write the full catalog array to localStorage immediately.

#### Scenario: Add writes to localStorage
- **WHEN** a new catalog entry is added
- **THEN** localStorage is updated with the new catalog array

### Requirement: Add catalog entry
`useCatalog` MUST export `addItem(entry: Omit<CatalogEntry, 'id' | 'created' | 'updated' | 'times'>): CatalogEntry` that creates a new entry with generated `id`, `created`/`updated` timestamps, `times: 0`, and an empty `history` array.

#### Scenario: Add creates entry with defaults
- **WHEN** `addItem({ name, desc, price, cur, unit })` is called
- **THEN** a new entry is appended to catalog with auto-generated `id`, `times: 0`, `history: []`, and current `created`/`updated` timestamps

### Requirement: Update catalog entry
`useCatalog` MUST export `updateItem(id: string, patch: Partial<CatalogEntry>): void` that merges the patch and updates the `updated` timestamp.

#### Scenario: Update modifies existing entry
- **WHEN** `updateItem(id, { price: 5000000 })` is called
- **THEN** the entry's price is updated and `updated` timestamp is refreshed

### Requirement: Delete catalog entry
`useCatalog` MUST export `removeItem(id: string): void` that removes the entry by id.

#### Scenario: Delete removes entry
- **WHEN** `removeItem(id)` is called
- **THEN** the entry is removed from the catalog array

### Requirement: Fuzzy search catalog
`useCatalog` MUST export `searchCatalog(query: string): CatalogEntry[]` that returns entries fuzzy-matched by name using `utils/fuzzyMatch.ts`'s `fuzzySearch`, sorted by match score descending, limited to top 6 results.

#### Scenario: Search returns ranked results
- **WHEN** `searchCatalog("logo")` is called with a catalog containing "Logo Design", "Brand Guidelines", "Social Media Kit"
- **THEN** the result array has "Logo Design" first with the highest score

#### Scenario: Empty query returns recent items
- **WHEN** `searchCatalog("")` is called
- **THEN** the first 6 catalog entries are returned (unordered, for "recent items" display)

### Requirement: Catalog exposed as readonly computed
`useCatalog` MUST export `catalog` as a `Ref<CatalogEntry[]>` that components can read but should not mutate directly — all mutations go through the exported methods.

#### Scenario: Catalog ref is reactive
- **WHEN** a component reads `catalog.value`
- **THEN** it reflects the current state including any mutations from other consumers
