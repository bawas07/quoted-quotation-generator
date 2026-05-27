## ADDED Requirements

### Requirement: JSON file download
`useJsonIO` MUST export `exportQuotation(data: QuotationData)` that serializes the quotation to JSON and triggers a file download.

#### Scenario: Download triggered
- **WHEN** `exportQuotation(quotationData)` is called
- **THEN** a `.json` file is downloaded with the correct filename format `QUO-001_ClientName_YYYY-MM-DD.json`

#### Scenario: Download contains all fields
- **WHEN** the downloaded file is inspected
- **THEN** it contains `schema_version`, `type: 'quotation'`, and all QuotationData fields with correct values
