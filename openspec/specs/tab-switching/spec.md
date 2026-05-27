# Tab Switching

## Purpose

Enables reactive switching between Editor, History, and Catalog views in the sidebar without page reload.

## Requirements

### Requirement: Reactive tab switching
`App.vue` MUST support switching between Editor, History, and Catalog tabs in the sidebar without page reload.

#### Scenario: Tabs switch content
- **WHEN** user clicks the "History" tab
- **THEN** the History panel is shown and Editor panel is hidden
- **WHEN** user clicks the "Editor" tab
- **THEN** the Editor panel is shown again

### Requirement: Active tab visual indicator
The active tab MUST be visually distinguished from inactive tabs.

#### Scenario: Active tab highlighted
- **WHEN** the "Editor" tab is active
- **THEN** it has a distinct active styling compared to other tabs
