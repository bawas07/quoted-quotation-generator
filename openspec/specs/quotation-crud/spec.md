# Quotation CRUD

## Purpose

Provides methods to update every field of the QuotationData object, enabling form components to modify state through a clear API.

## Requirements

### Requirement: Quotation CRUD methods provided
`useQuotation` MUST export methods to update every field of QuotationData: `loadQuotation`, `resetQuotation`, `updateMeta`, `updateFrom`, `updateTo`, `setLogo`, and `updateTotals`.

#### Scenario: loadQuotation replaces state
- **WHEN** `loadQuotation(someData)` is called
- **THEN** `quotation.value` is a deep clone of `someData` and `isDirty` is `false`

#### Scenario: resetQuotation restores defaults
- **WHEN** `resetQuotation()` is called
- **THEN** `quotation.value` equals `createEmptyQuotation()` and `isDirty` is `false`

#### Scenario: updateMeta patches meta fields
- **WHEN** `updateMeta({ number: 'QUO-002' })` is called
- **THEN** `quotation.value.meta.number` becomes `'QUO-002'`

#### Scenario: updateFrom patches from party
- **WHEN** `updateFrom({ name: 'Acme' })` is called
- **THEN** `quotation.value.from.name` becomes `'Acme'`

#### Scenario: updateTo patches to party
- **WHEN** `updateTo({ name: 'Client' })` is called
- **THEN** `quotation.value.to.name` becomes `'Client'`
