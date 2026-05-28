# Live Status Bar

## Purpose

Displays the current quotation number, client name, and status badge derived from reactive state, updating automatically as the form changes.

## MODIFIED Requirements

### Requirement: Status bar displays quotation info
`StatusBar` MUST display the quotation number and client name on the left side, and a status badge with dropdown on the right side, derived from the current reactive state.

**Previous behavior:** Status bar showed only quotation number and client name.
**New behavior:** Status bar shows quotation number and client name on the left, and a clickable status badge with inline dropdown on the right.

#### Scenario: Status bar shows data with status badge
- **WHEN** `quotation.value.meta.number` is `'QUO-001'`, `quotation.value.to.name` is `'Acme Corp'`, and `quotation.value.status` is `'DRAFT'`
- **THEN** the left side displays `'QUO-001 — Acme Corp'`
- **THEN** the right side shows a status badge with `'DRAFT'` text in muted colors

### Requirement: Status bar updates reactively
The displayed information MUST update automatically when the quotation state changes.

#### Scenario: Status bar updates on state change
- **WHEN** `updateMeta({ number: 'QUO-002' })` is called
- **THEN** the status bar reflects `'QUO-002'`

#### Scenario: Status badge updates
- **WHEN** `setStatus('SENT')` is called
- **THEN** the status badge reflects `'SENT'` in blue colors

### Requirement: Status badge dropdown interaction
Clicking the status badge MUST open an inline dropdown with the 4 status options (DRAFT, SENT, ACCEPTED, REJECTED), each with a colored dot indicator.

#### Scenario: Dropdown opens and selects
- **WHEN** user clicks the status badge
- **THEN** a dropdown appears below the badge with 4 options
- **WHEN** user clicks "SENT" in the dropdown
- **THEN** `handleStatusChange('SENT')` is emitted
- **THEN** the dropdown closes
