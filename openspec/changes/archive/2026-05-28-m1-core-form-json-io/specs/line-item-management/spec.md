## ADDED Requirements

### Requirement: Add and remove line items
`useQuotation` MUST export `addLineItem()` and `removeLineItem(index)` methods.

#### Scenario: addLineItem appends empty item
- **WHEN** `addLineItem()` is called
- **THEN** a new line item is appended with `id` from `crypto.randomUUID()`, empty `description`, `quantity` of 0, `unit_price` of 0, and `amount` of 0

#### Scenario: removeLineItem removes by index
- **WHEN** `removeLineItem(0)` is called on a quotation with 3 line items
- **THEN** the array length becomes 2

### Requirement: Minimum 1 line item guard
`removeLineItem` MUST prevent removing the last remaining line item and show a warning toast.

#### Scenario: Cannot remove last line item
- **WHEN** `removeLineItem(0)` is called with only 1 line item
- **THEN** the line item is not removed and a warning toast is shown
