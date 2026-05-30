# Quotation Number Generation

## Purpose

Provides auto-incrementing quotation number generation by scanning history entries to determine the next available number, formatted as QUO-XXX.

## Requirements

### Requirement: Auto-Increment Quotation Number
The system SHALL generate the next quotation number by scanning all existing history entries and finding the highest numeric suffix. The next number SHALL be one greater than the maximum found, formatted as `QUO-XXX` with zero-padding to 3 digits. If no history entries exist, the default SHALL be `QUO-001`.

#### Scenario: First quotation
- **WHEN** history is empty
- **AND** a new quotation is created
- **THEN** the quotation number field is pre-filled with "QUO-001"

#### Scenario: Next number from history
- **WHEN** history contains QUO-001, QUO-002, and QUO-003
- **AND** a new quotation is created
- **THEN** the quotation number field is pre-filled with "QUO-004"

#### Scenario: Non-sequential numbers in history
- **WHEN** history contains QUO-001 and QUO-005
- **AND** a new quotation is created
- **THEN** the quotation number field is pre-filled with "QUO-006"

#### Scenario: Malformed quotation numbers ignored
- **WHEN** history contains QUO-001, QUO-ABC, and QUO-003
- **AND** a new quotation is created
- **THEN** the quotation number field is pre-filled with "QUO-004"
- **AND** malformed entries (QUO-ABC) are silently ignored

### Requirement: Number Generation on App Start
The system SHALL determine the next quotation number when the app initializes (when `useHistory` is first accessed) and store it for use by the quotation factory.

#### Scenario: Number available at app start
- **WHEN** the app loads
- **AND** history contains 3 entries (highest QUO-003)
- **THEN** the next number (4) is computed
- **AND** a new quotation form starts with "QUO-004"

### Requirement: Number Generation on New Quotation
When the user creates a new quotation (via "+ New" button), the quotation number SHALL increment. The system SHALL scan current history at that moment to compute the next number.

#### Scenario: New quotation after saving several
- **WHEN** user saves 3 quotations (QUO-001, QUO-002, QUO-003)
- **AND** user clicks "+ New"
- **THEN** the new form shows "QUO-004"

#### Scenario: New quotation after import
- **WHEN** user imports a quotation with number QUO-010
- **AND** user clicks "+ New"
- **THEN** the new form shows "QUO-011"

### Requirement: Number Does Not Decrement
The system SHALL NOT decrement the quotation number when history entries are removed or when a workspace backup replaces entries with lower numbers.

#### Scenario: Clear history does not reset number
- **WHEN** history is cleared
- **AND** a new quotation is created
- **THEN** the quotation number defaults to "QUO-001" (since history is empty, no higher numbers exist)

### Requirement: Number in createEmptyQuotation Factory
The `createEmptyQuotation()` factory function SHALL accept an optional `nextNumber` parameter. When provided, it SHALL use that number for `meta.quotation_number`. When omitted, it SHALL default to 1 (QUO-001).

#### Scenario: Factory with explicit number
- **WHEN** `createEmptyQuotation(5)` is called
- **THEN** the returned quotation has `meta.quotation_number: "QUO-005"`

#### Scenario: Factory without number
- **WHEN** `createEmptyQuotation()` is called with no argument
- **THEN** the returned quotation has `meta.quotation_number: "QUO-001"`
