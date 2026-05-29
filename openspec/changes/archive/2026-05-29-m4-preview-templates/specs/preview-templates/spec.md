# Preview Templates

## Purpose

Provides 5 quotation template components (Classic, Minimal, Bold, Sidebar, Friendly) that render live from `QuotationData`, each with scoped styling, status badge, and print support.

## ADDED Requirements

### Requirement: Each template accepts QuotationData as a prop
Every template component MUST accept a typed `quotation: QuotationData` prop.

#### Scenario: Template receives quotation data
- **WHEN** `TemplateClassic` receives a `quotation` prop with valid `QuotationData`
- **THEN** the template renders the quotation's line items, totals, parties, and meta

### Requirement: Template renders "Quotation" as document title
Each template MUST display "Quotation" (not "Invoice") as the document type label.

#### Scenario: Document title is "Quotation"
- **WHEN** any template renders
- **THEN** the document title shown is "Quotation"

### Requirement: Template shows "Valid Until" not "Due Date"
Each template MUST label the validity date as "Valid Until".

#### Scenario: Validity label is "Valid Until"
- **WHEN** any template renders the meta dates
- **THEN** the second date field is labeled "Valid Until"

### Requirement: Template displays status badge
Every template MUST include a status badge reflecting the current `quotation.status`, styled per the template's design (see design.md §6 for positions).

#### Scenario: Status badge shows DRAFT
- **WHEN** `quotation.status` is `'DRAFT'`
- **THEN** the template shows a badge with `'DRAFT'` text in the muted status color

#### Scenario: Status badge shows SENT
- **WHEN** `quotation.status` is `'SENT'`
- **THEN** the template shows a badge with `'SENT'` text in the blue status color

#### Scenario: Status badge shows ACCEPTED
- **WHEN** `quotation.status` is `'ACCEPTED'`
- **THEN** the template shows a badge with `'ACCEPTED'` text in the green status color

#### Scenario: Status badge shows REJECTED
- **WHEN** `quotation.status` is `'REJECTED'`
- **THEN** the template shows a badge with `'REJECTED'` text in the red status color

### Requirement: Template renders logo if present
Each template MUST display the logo image when `quotation.logo` is non-null.

#### Scenario: Logo rendered
- **WHEN** `quotation.logo` contains a base64 data URL
- **THEN** the template renders an `<img>` with that data URL

#### Scenario: Logo hidden when null
- **WHEN** `quotation.logo` is `null`
- **THEN** no logo image is rendered (no broken image or empty space)

### Requirement: Template renders all line items
Each template MUST render all entries from `quotation.line_items`, showing description, quantity, unit price, and amount.

#### Scenario: All line items displayed
- **WHEN** `quotation.line_items` contains 3 items
- **THEN** all 3 items' descriptions, quantities, unit prices, and amounts are visible

### Requirement: Template renders totals breakdown
Each template MUST render subtotal, discount (if >0%), tax (if >0%), and total.

#### Scenario: Totals rendered with discount and tax
- **WHEN** totals have subtotal 1000, discount 10%, tax 11%
- **THEN** subtotal, discount line, tax line, and total are all displayed

#### Scenario: Discount hidden when 0%
- **WHEN** `totals.discount_percent` is 0
- **THEN** no discount line is rendered

#### Scenario: Tax hidden when 0%
- **WHEN** `totals.tax_percent` is 0
- **THEN** no tax line is rendered

### Requirement: Template hides empty optional fields
Each template MUST gracefully omit logo, notes, phone, website fields when they are empty or null.

#### Scenario: Empty notes hidden
- **WHEN** `quotation.notes` is empty string
- **THEN** no notes section is rendered

#### Scenario: Empty phone hidden
- **WHEN** `quotation.from.phone` is empty string
- **THEN** no phone line is rendered

### Requirement: Template has A4-proportioned container
Each template MUST render within a 794px-wide container (supplied by the parent `.invoice-paper` class).

#### Scenario: Template contained in 794px
- **WHEN** any template renders
- **THEN** it is inside a container styled at 794px width

### Requirement: Template has scoped print styles
Each template MUST include `@media print` rules for clean A4 output, hiding interactive elements if present.

#### Scenario: Print styles applied
- **WHEN** `window.print()` is triggered
- **THEN** the template renders cleanly without broken layouts in Chrome, Firefox, Safari

### Requirement: TemplateClassic specific layout
`TemplateClassic` MUST render a top section with logo + title block, a two-column parties section, a ruled table for line items, and a footer with notes + totals.

#### Scenario: Classic layout rendered
- **WHEN** `TemplateClassic` renders
- **THEN** the layout includes: gradient top bar, logo/title side by side, issuer and recipient columns, ruled table, and totals + notes footer

### Requirement: TemplateMinimal specific layout
`TemplateMinimal` MUST render an italic serif title, a compact meta row, spaced parties, minimal item rows, and a clean totals column.

#### Scenario: Minimal layout rendered
- **WHEN** `TemplateMinimal` renders
- **THEN** the layout includes: large italic "Quotation" title, meta row with number/date/status, border-separated parties, minimal inline item rows, and right-aligned totals

### Requirement: TemplateBold specific layout
`TemplateBold` MUST render a dark navy header band with title and number, a blue info band with dates and status, a body with parties and table, and totals.

#### Scenario: Bold layout rendered
- **WHEN** `TemplateBold` renders
- **THEN** the layout includes: navy header with logo/number, blue band with issue date/valid until/status, white body with parties and table, totals in footer

### Requirement: TemplateSidebar specific layout
`TemplateSidebar` MUST render a two-column grid: left sidebar (198px) with sender info and currency, and main column with title block, recipient info, quantity-breakdown table, and totals.

#### Scenario: Sidebar layout rendered
- **WHEN** `TemplateSidebar` renders
- **THEN** the layout includes: left navy sidebar with sender details, right column with quotation title, recipient block, table showing description + per-item breakdown, and totals

### Requirement: TemplateFriendly specific layout
`TemplateFriendly` MUST render rounded card-style party sections, a striped info bar, a card-style table with colored header, and totals.

#### Scenario: Friendly layout rendered
- **WHEN** `TemplateFriendly` renders
- **THEN** the layout includes: rounded badge header with "Quotation" + number, card-style from/to sections, striped info bar with date/currency/status, card-style table with blue header, and totals
