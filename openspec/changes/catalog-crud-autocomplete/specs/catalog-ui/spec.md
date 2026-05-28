# Catalog UI

## Purpose

Provides the catalog tab panel and edit drawer components that let users browse, search, add, edit, and delete catalog items. The UI matches the visual design in `docs/design.md` §5.3 (Catalog Tab Panel) and §5.3.1 (Item Edit Drawer).

## ADDED Requirements

### Requirement: Catalog panel renders in sidebar catalog tab
`CatalogPanel.vue` MUST render a search input, an item list, an "Add Item" button, and workspace export/import placeholder buttons. It reads from `useCatalog()` and passes data to child components.

#### Scenario: Catalog panel shows empty state
- **WHEN** the catalog is empty
- **THEN** the panel shows: "Your catalog is empty. Items appear here automatically after your first sent quotation."

#### Scenario: Catalog panel shows item list
- **WHEN** the catalog has items
- **THEN** each item is rendered as a `CatalogItem` component

### Requirement: Catalog search filters items
`CatalogSearch.vue` MUST render a debounced search input (300ms) that calls `useCatalog().searchCatalog()`. The search input has a placeholder "Search catalog..." matching design.md.

#### Scenario: Search filters results
- **WHEN** user types "logo" in the search input
- **THEN** only items matching "logo" are shown after 300ms debounce

### Requirement: Catalog item displays name, price, metadata
`CatalogItem.vue` MUST display the item name, formatted price, times quoted count, and last quoted date. Edit and delete buttons appear on hover (opacity transition).

#### Scenario: Item shows key information
- **WHEN** a catalog item is rendered
- **THEN** it shows the item name, formatted price (e.g., "Rp 3.500.000"), "quoted N×", and last quoted date

#### Scenario: Actions visible on hover
- **WHEN** the user hovers over a catalog item
- **THEN** edit (✎) and delete (✕) buttons become visible with a smooth opacity transition

### Requirement: Add Item button opens drawer in create mode
Clicking "Add Item" in the catalog panel MUST open `CatalogEditDrawer.vue` in create mode with empty fields and "Add Item" title.

#### Scenario: Add button opens empty drawer
- **WHEN** user clicks "+ Add Item"
- **THEN** the drawer slides in with "Add Item" title, empty fields, and no price history section

### Requirement: Edit button opens drawer with item data
Clicking the edit button on a `CatalogItem` MUST open `CatalogEditDrawer.vue` in edit mode with the item's current data pre-filled and price history displayed.

#### Scenario: Edit drawer shows item data
- **WHEN** user clicks edit on "Logo Design"
- **THEN** the drawer slides in with "Edit Item" title, name "Logo Design" pre-filled, price pre-filled, and price history list shown

### Requirement: Catalog edit drawer has add/edit form
`CatalogEditDrawer.vue` MUST render a slide-in panel with fields: Name (required), Description, Default Price, Currency (dropdown), Unit, Price History (read-only list), Save, and Cancel buttons.

#### Scenario: Save validates required name
- **WHEN** user clicks Save with an empty Name field
- **THEN** a warning toast is shown and the drawer does not close

#### Scenario: Save creates new entry
- **WHEN** user clicks Save in create mode with valid Name
- **THEN** a new catalog entry is created, localStorage is updated, the drawer closes, and a success toast is shown

#### Scenario: Save updates existing entry
- **WHEN** user clicks Save in edit mode with modified fields
- **THEN** the existing entry is updated, localStorage is updated, the drawer closes, and a success toast is shown

#### Scenario: Cancel closes drawer
- **WHEN** user clicks Cancel
- **THEN** the drawer closes without saving

### Requirement: Drawer slides in/out with animation
The drawer MUST animate from `transform: translateX(-100%)` to `translateX(0)` over 250ms with `cubic-bezier(0.4, 0, 0.2, 1)`. A semi-transparent backdrop overlay appears behind it.

#### Scenario: Drawer animates in
- **WHEN** the drawer opens
- **THEN** it slides in from the left edge over 250ms with a backdrop overlay

### Requirement: Delete item with confirmation
Clicking the delete button on a `CatalogItem` MUST show a confirmation prompt before removing the item.

#### Scenario: Delete confirms and removes
- **WHEN** user clicks delete and confirms
- **THEN** the item is removed from catalog, localStorage is updated, and a success toast is shown

### Requirement: Export/Import buttons present
`CatalogPanel.vue` MUST render "Export Workspace" and "Import Workspace" buttons in the footer. Their click handlers show a toast "Coming in M5" — actual functionality is implemented in M5.

#### Scenario: Export button shows placeholder
- **WHEN** user clicks "Export Workspace"
- **THEN** a toast "Coming in M5" is shown
