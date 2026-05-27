## ADDED Requirements

### Requirement: Status bar displays quotation info
`StatusBar` MUST display the quotation number and client name derived from the current reactive state.

#### Scenario: Status bar shows data
- **WHEN** `quotation.value.meta.number` is `'QUO-001'` and `quotation.value.to.name` is `'Acme Corp'`
- **THEN** the status bar displays `'QUO-001 — Acme Corp'`

### Requirement: Status bar updates reactively
The displayed information MUST update automatically when the quotation state changes.

#### Scenario: Status bar updates
- **WHEN** `updateMeta({ number: 'QUO-002' })` is called
- **THEN** the status bar reflects `'QUO-002'`
