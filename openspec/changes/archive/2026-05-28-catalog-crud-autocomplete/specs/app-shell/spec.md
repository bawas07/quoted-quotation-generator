# App Shell

## Purpose

Provides the top-level application layout with sidebar and preview panels, enabling independent scrolling, token-based theming, reactive tab switching with functional catalog content, and catalog edit drawer overlay.

## MODIFIED Requirements

### Requirement: Reactive tab switching with functional catalog content
The sidebar SHALL support Editor/History/Catalog tabs wired to reactive state, switching visible panel content. The Catalog tab SHALL render the `CatalogPanel` component with full CRUD functionality and the `CatalogEditDrawer` overlay.

#### Scenario: Catalog tab shows functional panel
- **WHEN** user clicks the Catalog tab
- **THEN** the `CatalogPanel` component is rendered with search input, item list (or empty state), and add/export/import buttons
- **THEN** the `CatalogEditDrawer` component is mounted (hidden) and slides in when triggered

## ADDED Requirements

### Requirement: Catalog edit drawer wired to App.vue
`App.vue` MUST include `CatalogEditDrawer.vue` as an overlay within the sidebar region. The drawer opens when triggered by the Catalog panel's Add/Edit buttons.

#### Scenario: Drawer overlays sidebar
- **WHEN** the drawer opens
- **THEN** it slides in from the left edge, overlaying the sidebar content
- **THEN** a backdrop overlay prevents interaction with sidebar content behind it

### Requirement: Sidebar action bar unchanged
The sidebar action bar (Upload JSON, Download JSON, PDF, New) MUST remain unchanged from M1. The catalog tab has its own action buttons within `CatalogPanel`.

#### Scenario: Action bar unaffected
- **WHEN** user switches to Catalog tab
- **THEN** the sidebar bottom action bar still shows the M1 action buttons (Upload, JSON, PDF, New)
