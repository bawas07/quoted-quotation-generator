# JSON Import

## Purpose

Parses uploaded quotation JSON files with schema validation to ensure data integrity and prevent corruption of app state.

## Requirements

### Requirement: JSON file upload and parse
`useJsonIO` MUST export `parseQuotationFile(file: File)` that reads a `.json` file, validates its schema, and returns parsed `QuotationData`.

#### Scenario: Valid file is parsed
- **WHEN** a valid `.json` file with `schema_version: '1.0'` and `type: 'quotation'` is uploaded
- **THEN** the quotation data is parsed and all fields are restored

### Requirement: Schema validation on import
`parseQuotationFile` MUST validate `schema_version` and `type` fields, rejecting incompatible files with a clear error toast.

#### Scenario: Invalid schema_version is rejected
- **WHEN** a file with `schema_version: '2.0'` is uploaded
- **THEN** an error toast is shown and state is not modified

#### Scenario: Missing type is rejected
- **WHEN** a file without `type: 'quotation'` is uploaded
- **THEN** an error toast is shown and state is not modified

### Requirement: Deep clone imported data
Imported data MUST be deep-cloned to break reference ties before assigning to reactive state.

#### Scenario: Imported data is independent
- **WHEN** a file is imported and then the original file object is modified
- **THEN** the quotation state is unaffected
