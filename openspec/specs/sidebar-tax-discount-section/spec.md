# Sidebar Tax & Discount Section

## Purpose

Provides the visual layout and interaction for the Tax & Discount and Total sections in the sidebar, with editable inputs for discount/tax configuration and read-only computed totals display.

## Requirements

### Requirement: Sidebar has separate Tax & Discount and Total sections
The `TotalsFields` component MUST render two distinct labeled sections: "Tax & Discount" containing all editable inputs, and "Total" containing only computed display values.

#### Scenario: Two sections are rendered
- **WHEN** `TotalsFields` is rendered
- **THEN** a "Tax & Discount" section heading is visible
- **THEN** a "Total" section heading is visible

### Requirement: Tax & Discount section contains all inputs
The "Tax & Discount" section MUST contain editable inputs for: Discount Label (text), Discount % (number), Tax Label (text), and Tax % (number), in that order.

#### Scenario: All four inputs present
- **WHEN** the "Tax & Discount" section is rendered
- **THEN** a Discount Label text input is visible with default value "Discount"
- **THEN** a Discount % number input is visible
- **THEN** a Tax Label text input is visible with default value "PPN"
- **THEN** a Tax % number input is visible

### Requirement: Discount Label input updates quotation data
Changing the Discount Label input MUST emit an update setting `discount_label` on the quotation data.

#### Scenario: Discount label changed
- **WHEN** user types "Promo" into the Discount Label input
- **THEN** `quotation.discount_label` is set to `"Promo"`

### Requirement: Total section shows computed values only
The "Total" section MUST display read-only computed values: Subtotal, Discount (using discount_label + amount), Tax (using tax_label + amount), and Grand Total, in that order. No inputs SHALL appear in this section.

#### Scenario: Total section displays with custom labels
- **WHEN** discount_label is "Promo", tax_label is "VAT", subtotal=1000, discount_amount=100, tax_amount=72
- **THEN** the Total section shows "Subtotal" with formatted `1000`
- **THEN** the Total section shows "Promo" with formatted `(100)`
- **THEN** the Total section shows "VAT" with formatted `72`
- **THEN** the Total section shows "Total" with formatted `972`
- **THEN** no `<input>` elements exist in the Total section

### Requirement: Discount label defaults to "Discount"
When a new quotation is created, `discount_label` MUST default to `"Discount"`.

#### Scenario: New quotation has default discount label
- **WHEN** `createEmptyQuotation()` is called
- **THEN** `quotation.discount_label` equals `"Discount"`
