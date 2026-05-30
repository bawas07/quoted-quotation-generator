# History Panel UI

## Purpose

Provides the visual interface for browsing past quotations stored in the history, allowing users to view, select, and load previous quotations into the editor.

## Requirements

### Requirement: History Panel Component
The system SHALL provide a `HistoryPanel.vue` component that displays the list of past quotations from the history store. The component SHALL read from `useHistory()` and render entries in the order provided.

#### Scenario: History panel renders entries
- **WHEN** history contains 3 quotation entries
- **THEN** the panel displays 3 clickable rows

#### Scenario: History panel empty state
- **WHEN** history is empty
- **THEN** the panel displays "No quotations yet. Create or upload one."

### Requirement: History Entry Display
Each history entry row SHALL display: quotation number (QUO-XXX), client name, issue date, total amount (formatted in the quotation's currency), and a read-only status badge. The status badge SHALL be color-coded: DRAFT (gray), SENT (blue), ACCEPTED (green), REJECTED (red).

#### Scenario: History entry shows all fields
- **WHEN** a history entry for "QUO-001 · Acme Corp · 2026-05-19 · Rp 3.885.000 · SENT" exists
- **THEN** the row displays the quotation number, client name, date, formatted total, and a blue "SENT" badge

#### Scenario: History entry with missing client name
- **WHEN** a history entry has an empty `to.name` field
- **THEN** the row displays "No client" in place of the client name

### Requirement: Logo Indicator in History
Each history entry row SHALL display a 📎 icon if `_hadLogo` is `true`, indicating the original quotation included a logo that was stripped from the stored history entry.

#### Scenario: Logo indicator shown
- **WHEN** a history entry has `_hadLogo: true`
- **THEN** a 📎 icon appears in the entry row

#### Scenario: No logo indicator
- **WHEN** a history entry has `_hadLogo: false` or the field is absent
- **THEN** no 📎 icon appears

### Requirement: Click to Load from History
Clicking a history entry SHALL load that quotation into the editor form and switch the active sidebar tab to Editor. The quotation's template SHALL be restored. The logo SHALL NOT be restored (it was stripped from history).

#### Scenario: Click loads quotation
- **WHEN** user clicks a history entry for QUO-002
- **THEN** the editor form is populated with QUO-002's data
- **AND** the sidebar switches to the Editor tab
- **AND** the preview shows QUO-002 in its original template

### Requirement: History Panel Visual Style
The history panel SHALL match the visual design from `docs/design.md` §5.6 and `docs/example-v2.html`. Entries SHALL have a left-border accent that appears on hover, monospace typography for metadata, and the status badge styled as a bordered pill.

#### Scenario: Visual style matches reference
- **WHEN** the history panel renders
- **THEN** entry rows use the dark sidebar background
- **AND** monospace font is used for dates, totals, and status badges
- **AND** hover state shows a left blue border accent
