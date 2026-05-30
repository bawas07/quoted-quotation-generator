## MODIFIED Requirements

### Requirement: QuotationData type defined
The `QuotationData` interface MUST include schema_version, type, template, status, meta, from, to, logo, line_items, totals, tax_label, discount_label, notes, created_at, and updated_at fields matching the PRD.

#### Scenario: QuotationData is complete
- **WHEN** the type is used in a TypeScript module
- **THEN** all required fields (including `discount_label: string`) produce type errors if omitted
