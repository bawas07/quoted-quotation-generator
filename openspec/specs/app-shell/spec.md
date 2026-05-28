# App Shell

## Purpose

Provides the top-level application layout with sidebar and preview panels, enabling independent scrolling and token-based theming.

## Requirements

### Requirement: Two-column layout rendered
`App.vue` MUST render a flex container with 420px fixed sidebar and flexible preview filling remaining width, composed from real components instead of static HTML stubs.

#### Scenario: Layout composed from components
- **WHEN** the app loads
- **THEN** the sidebar contains real component instances (sidebar shell, form fields, action bar)
- **THEN** the preview panel contains status bar and template switcher components

### Requirement: Columns scroll independently
Both sidebar and preview MUST have `overflow-y: auto` so one column's scroll does not affect the other.

#### Scenario: Independent scroll
- **WHEN** sidebar content overflows
- **THEN** preview panel does not scroll

### Requirement: Layout uses design tokens
All dimensions, colors, and spacing MUST reference CSS custom properties — never hardcoded values.

#### Scenario: Token-based layout
- **WHEN** the sidebar width CSS is inspected
- **THEN** it references `var(--sidebar-width)` not `420px`

### Requirement: Action bar buttons wired
The sidebar action bar MUST include real working buttons: "+ New" (with unsaved changes guard), "Download JSON", and "Upload JSON".

#### Scenario: Action buttons functional
- **WHEN** user clicks "Download JSON"
- **THEN** `exportQuotation()` is called
- **WHEN** user clicks "Upload JSON"
- **THEN** a file picker opens for JSON import

### Requirement: Reactive tab switching in sidebar
The sidebar SHALL support Editor/History/Catalog tabs wired to reactive state, switching visible panel content.

#### Scenario: Tabs switch panels
- **WHEN** user clicks the Catalog tab
- **THEN** Catalog panel is shown (even if content is placeholder)
