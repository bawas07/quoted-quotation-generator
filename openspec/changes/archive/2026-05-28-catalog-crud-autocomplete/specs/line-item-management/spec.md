# Line Item Management

## Purpose

Provides add/remove line item operations with automatic recalculation, a minimum-1 guard, and catalog-backed autocomplete in the description field.

## MODIFIED Requirements

### Requirement: Add and remove line items
`useQuotation` MUST export `addLineItem()` and `removeLineItem(index)` methods.

#### Scenario: addLineItem appends empty item
- **WHEN** `addLineItem()` is called
- **THEN** a new line item is appended with `id` from `crypto.randomUUID()`, empty `description`, `quantity` of 0, `unit_price` of 0, and `amount` of 0

#### Scenario: removeLineItem removes by index
- **WHEN** `removeLineItem(0)` is called on a quotation with 3 line items
- **THEN** the array length becomes 2

### Requirement: Minimum 1 line item guard
`removeLineItem` MUST prevent removing the last remaining line item and show a warning toast.

#### Scenario: Cannot remove last line item
- **WHEN** `removeLineItem(0)` is called with only 1 line item
- **THEN** the line item is not removed and a warning toast is shown

## ADDED Requirements

### Requirement: Description input has autocomplete dropdown
Each line item's description `<input>` MUST trigger an autocomplete dropdown that fuzzy-searches the catalog. The input is wrapped in a positioned container (`.acwrap`) with the dropdown (`.acdrop`) appearing below it. The dropdown shows up to 6 catalog matches with name, price, description, and quoted count.

#### Scenario: Typing shows catalog matches
- **WHEN** user types "log" in the description input
- **THEN** a dropdown appears below the input showing catalog items matching "log" with their name, formatted price, description, and quoted count

#### Scenario: Empty input shows recent items
- **WHEN** the description input is focused and empty
- **THEN** the dropdown shows recent catalog items (first 6)

#### Scenario: Selecting item fills fields
- **WHEN** user clicks a dropdown item
- **THEN** description field is filled with the item name
- **THEN** unit price field is filled with the item's default price
- **THEN** the amount is recalculated
- **THEN** the price field briefly flashes (300ms highlight animation)
- **THEN** the dropdown closes

#### Scenario: Typing non-matching text shows create option
- **WHEN** user types text that does not match any catalog item
- **THEN** the dropdown shows a "+ Add "text" to catalog" option

#### Scenario: Create option adds to catalog
- **WHEN** user clicks the "+ Add" option
- **THEN** a new catalog entry is created with the typed name and zero price
- **THEN** description field is filled
- **THEN** the price field receives focus for the user to set a price
- **THEN** a warning toast says "added to catalog — set the price!"

#### Scenario: Keyboard navigation works in dropdown
- **WHEN** user presses ArrowDown while the dropdown is open
- **THEN** the highlight moves to the next item
- **WHEN** user presses Enter while an item is highlighted
- **THEN** that item is selected (same as clicking)
- **WHEN** user presses Escape
- **THEN** the dropdown closes

#### Scenario: Blur closes dropdown with delay
- **WHEN** user tabs out of the description input
- **THEN** the dropdown closes after a 150ms delay (to allow mousedown on dropdown items)

### Requirement: Autocomplete dropdown styled per design
The dropdown, items, and highlighted state MUST match `docs/design.md` §5.2 (Autocomplete Dropdown): dark background (`--color-ink`), 240px max-height with scroll, highlighted items with rust accent, price right-aligned, description and "quoted N×" metadata below the name.

#### Scenario: Dropdown matches design spec
- **WHEN** the autocomplete dropdown is visible
- **THEN** it has the correct dark background, rounded corners, shadow, item padding, and highlight color from design.md §5.2
