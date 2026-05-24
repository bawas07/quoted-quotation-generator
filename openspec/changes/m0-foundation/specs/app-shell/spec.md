## ADDED Requirements

### Requirement: Two-column layout rendered
`App.vue` MUST render a flex container with 420px fixed sidebar and flexible preview filling remaining width.

#### Scenario: Layout visible
- **WHEN** the app loads
- **THEN** a dark sidebar (ink background) occupies 420px on the left
- **THEN** a cream preview panel fills remaining width on the right

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
