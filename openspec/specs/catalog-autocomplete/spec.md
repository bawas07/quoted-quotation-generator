# Catalog Autocomplete

## Purpose

Provides per-row autocomplete state management for line item description inputs, enabling fuzzy search against the catalog, keyboard navigation, item selection, and inline item creation.

## ADDED Requirements

### Requirement: Autocomplete reacts to description input
`useAutocomplete` MUST export `search(itemId: string, query: string): void` that fuzzy-searches the catalog using `utils/fuzzyMatch.ts`'s `fuzzySearch` and updates per-row results. Search fires on every keystroke when `query.length >= 1`. Empty query shows recent catalog items (top 6).

#### Scenario: Search returns catalog matches
- **WHEN** `search("row1", "logo")` is called
- **THEN** `results["row1"]` contains catalog entries matching "logo", sorted by score

#### Scenario: Empty query shows recent items
- **WHEN** `search("row1", "")` is called
- **THEN** `results["row1"]` contains the first 6 catalog entries

### Requirement: Per-row dropdown open/close state
`useAutocomplete` MUST export `isOpen: Record<string, boolean>` tracking which rows have their dropdown visible. `close(itemId)` hides the dropdown for a given row.

#### Scenario: Search opens dropdown
- **WHEN** `search("row1", "log")` is called
- **THEN** `isOpen["row1"]` is `true`

#### Scenario: Close hides dropdown
- **WHEN** `close("row1")` is called
- **THEN** `isOpen["row1"]` is `false`

### Requirement: Keyboard navigation in dropdown
`useAutocomplete` MUST export `handleKeydown(event: KeyboardEvent, itemId: string): void` supporting:
- `ArrowDown` — increment `highlightedIndex` (wrap to 0 at max)
- `ArrowUp` — decrement `highlightedIndex` (wrap to max at 0)
- `Enter` — select currently highlighted item
- `Escape` — close dropdown
- All actions call `event.preventDefault()`

#### Scenario: ArrowDown moves highlight forward
- **WHEN** ArrowDown is pressed with `highlightedIndex["row1"]` at 0 and 3 results
- **THEN** `highlightedIndex["row1"]` becomes 1

#### Scenario: Enter selects highlighted item
- **WHEN** Enter is pressed with `highlightedIndex["row1"]` at 0
- **THEN** the first result's `{ description, unit_price }` is returned via `onSelect` callback

#### Scenario: Escape closes dropdown
- **WHEN** Escape is pressed
- **THEN** `isOpen["row1"]` becomes `false`

### Requirement: Select item fills description and price
`useAutocomplete` MUST export `select(itemId: string, index: number): { description: string, unit_price: number } | null` that returns the selected catalog entry's name and price, and closes the dropdown.

#### Scenario: Select returns entry data
- **WHEN** `select("row1", 0)` is called with a "Logo Design" entry at price 3500000
- **THEN** it returns `{ description: "Logo Design", unit_price: 3500000 }`

### Requirement: Create item inline from typed text
`useAutocomplete` MUST export `createAndSelect(itemId: string, name: string): { description: string, unit_price: number }` that adds a new catalog entry with the given name, price 0, current currency, and returns `{ description: name, unit_price: 0 }` so the user can set the price afterward.

#### Scenario: Create adds to catalog and returns name
- **WHEN** `createAndSelect("row1", "Rush Fee")` is called
- **THEN** a new catalog entry with name "Rush Fee" is added to the catalog
- **THEN** it returns `{ description: "Rush Fee", unit_price: 0 }`

### Requirement: Blur handling with delayed close
`useAutocomplete` MUST support a blur handler that closes the dropdown with a 150ms delay (to allow mousedown on dropdown items to fire before close). `close(itemId)` skips the delay and closes immediately.

#### Scenario: Blur closes after delay
- **WHEN** the description input loses focus
- **THEN** the dropdown closes after 150ms

### Requirement: Cleanup on row removal
`useAutocomplete` MUST export `cleanup(itemId: string)` that removes all state for a given row from the internal maps, preventing memory leaks when line items are deleted.

#### Scenario: Cleanup removes state
- **WHEN** `cleanup("row1")` is called
- **THEN** all entries for "row1" in `results`, `isOpen`, `highlightedIndex`, and internal query cache are removed
