# Type System

## Purpose

Define the core TypeScript types, interfaces, union types, and constants that underpin quotation data, catalog entries, and storage keys throughout the application.

## Requirements

### Requirement: QuotationData type defined
The `QuotationData` interface MUST include schema_version, type, template, status, meta, from, to, logo, line_items, totals, notes, created_at, and updated_at fields matching the PRD.

#### Scenario: QuotationData is complete
- **WHEN** the type is used in a TypeScript module
- **THEN** all required fields produce type errors if omitted

### Requirement: CatalogEntry type defined
The `CatalogEntry` interface MUST include id, name, description, default_price, currency, unit, price_history, times_quoted, created_at, updated_at, and tags.

#### Scenario: CatalogEntry is complete
- **WHEN** the type is imported
- **THEN** nested types (PriceHistoryEntry) are also accessible

### Requirement: Union types defined
The types file MUST export QuotationStatus, TemplateId, CurrencyCode, ChangeType, and LogoPosition as string unions.

#### Scenario: Union types restrict values
- **WHEN** a variable is typed as `QuotationStatus`
- **THEN** only 'DRAFT', 'SENT', 'ACCEPTED', or 'REJECTED' are assignable

### Requirement: STORAGE_KEYS constant defined
A constant SHALL be exported with bare keys: HISTORY, CATALOG, CATALOG_META.

#### Scenario: STORAGE_KEYS values are bare
- **WHEN** imported
- **THEN** `STORAGE_KEYS.HISTORY` equals `'history'` (no prefix)
