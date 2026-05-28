# Catalog Sync Composable

## Purpose

Provides the `useCatalogSync` composable — the business logic for the catalog sync flow. Builds a categorized sync list from line items vs catalog entries using fuzzy matching, classifies each item as NEW/UPDATE/SAME, and applies selected items back to the catalog with full price history tracking.

## ADDED Requirements

### Requirement: buildSyncList creates categorized sync items
`useCatalogSync` MUST export `buildSyncList(lineItems: LineItem[], catalog: CatalogEntry[]): CatalogSyncItem[]` that:
1. Filters out line items with empty description (`description.trim() === ''`)
2. For each remaining item, calls `fuzzyFind(item.description, catalog)` from `utils/fuzzyMatch.ts` (threshold 0.85)
3. Classifies each item:
   - No match → `change_type: 'NEW'`
   - Match found and `Math.abs(match.price - item.unit_price) >= 0.01` → `change_type: 'UPDATE'`
   - Match found and prices equal within 0.01 tolerance → `change_type: 'SAME'`
4. Sets `checked` based on classification:
   - NEW and not a one-off → `checked: true`
   - NEW and `looksLikeOneOff(item.description, item.unit_price)` returns true → `checked: false`
   - UPDATE → `checked: true`
   - SAME → `checked: false`
5. Stores the result in an internal reactive `syncItems` ref
6. Returns the `CatalogSyncItem[]` array

#### Scenario: New item is classified and checked
- **GIVEN** catalog has no match for "Logo Design"
- **WHEN** `buildSyncList([{ description: "Logo Design", unit_price: 3500000 }], catalog)` is called
- **THEN** the result contains one item with `change_type: "NEW"`, `checked: true`, `match: null`

#### Scenario: Update item shows price history context
- **GIVEN** catalog has "Logo Design" with `price: 3000000` and history entry
- **WHEN** `buildSyncList([{ description: "Logo Design", unit_price: 3500000 }], catalog)` is called
- **THEN** the result contains one item with `change_type: "UPDATE"`, `checked: true`, `match` pointing to the catalog entry

#### Scenario: Same item is unchecked
- **GIVEN** catalog has "Logo Design" with `price: 3000000`
- **WHEN** `buildSyncList([{ description: "Logo Design", unit_price: 3000000 }], catalog)` is called
- **THEN** the result contains one item with `change_type: "SAME"`, `checked: false`

#### Scenario: One-off item is unchecked by default
- **GIVEN** catalog has no match for "Rush Fee" with price 500000
- **WHEN** `buildSyncList([{ description: "Rush Fee", unit_price: 500000 }], catalog)` is called
- **THEN** the result contains one item with `change_type: "NEW"`, `checked: false`
- **AND** `looksLikeOneOff("Rush Fee", 500000)` was used internally

#### Scenario: Empty description items are excluded
- **GIVEN** a line item with `description: ""` or `description: "   "`
- **WHEN** `buildSyncList` processes the items
- **THEN** that item is excluded from the result

### Requirement: applySyncItems writes selected items to catalog
`useCatalogSync` MUST export `applySyncItems(selectedItems: CatalogSyncItem[]): void` that:
1. For each item with `change_type: "NEW"`:
   - Calls `useCatalog().addItem()` with:
     - `name`: item.description
     - `desc`: empty string
     - `price`: item.unit_price
     - `cur`: from the current quotation's currency (passed via a parameter or retrieved internally)
     - `unit`: empty string (user fills in later from catalog drawer)
2. For each item with `change_type: "UPDATE"` and `match` present:
   - Constructs a `PriceHistoryEntry` with the current price, issue date, client name, and quotation number
   - Calls `useCatalog().updateItem(match.id, { price: item.unit_price, ... })` to update the entry
   - Note: `useCatalog`'s `updateItem` only supports flat property patches. The `price_history` push and `times_quoted` increment are handled explicitly via separate `updateItem` calls or by reading the entry, mutating it, and calling `updateItem` with the full patch.
3. SAME items are skipped (no catalog change needed)
4. After all writes, the catalog persists via `useCatalog`'s built-in localStorage write-through

#### Scenario: New items are added to catalog
- **GIVEN** `syncItems` contains one NEW item with `item.description: "Logo Design"`, `item.unit_price: 3500000`
- **WHEN** `applySyncItems([newItem])` is called
- **THEN** `useCatalog().addItem()` is called with matching name and price
- **AND** the catalog now contains the new entry

#### Scenario: Update items push price history
- **GIVEN** `syncItems` contains one UPDATE item with `match` pointing to catalog entry "Logo Design" previously at 3000000
- **WHEN** `applySyncItems([updateItem])` is called
- **THEN** the catalog entry's price is updated to the new value
- **AND** a new `PriceHistoryEntry` is added to the entry's `history` array
- **AND** `times_quoted` is incremented

#### Scenario: Same items are skipped
- **GIVEN** `syncItems` contains one SAME item
- **WHEN** `applySyncItems([sameItem])` is called
- **THEN** no catalog write operations are performed

### Requirement: checkedCount is a computed ref
`useCatalogSync` MUST export `checkedCount` as a `ComputedRef<number>` that reflects the current count of sync items where `checked === true`.

#### Scenario: checkedCount updates on toggle
- **GIVEN** 3 sync items with 2 checked
- **WHEN** a component reads `checkedCount.value`
- **THEN** it returns `2`
- **WHEN** one item is unchecked (via `syncItems` mutation)
- **THEN** `checkedCount.value` returns `1`

### Requirement: syncItems is exposed as readonly ref
The internal `syncItems` ref MUST be exposed as `readonly(syncItems)` so components can read the list and bind checkboxes, but mutations go through controlled methods.

#### Scenario: syncItems can be read but not mutated directly
- **GIVEN** a component accesses `catalogSync.syncItems`
- **WHEN** the component tries to `catalogSync.syncItems.value.push(...)`
- **THEN** TypeScript error prevents direct mutation
