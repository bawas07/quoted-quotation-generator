## ADDED Requirements

### Requirement: Central reactive quotation state
`useQuotation` composable MUST export a reactive `quotation: Ref<QuotationData>` initialized with `createEmptyQuotation()`.

#### Scenario: Quotation initializes with defaults
- **WHEN** `useQuotation()` is called
- **THEN** `quotation.value` matches the structure returned by `createEmptyQuotation()`

### Requirement: Computed subtotal
`useQuotation` MUST export a computed `subtotal` that sums all line item `amount` fields.

#### Scenario: Subtotal sums line item amounts
- **WHEN** line items have amounts of 100, 200, and 300
- **THEN** `subtotal` equals 600

### Requirement: Computed discount_amount and tax_amount
`useQuotation` MUST export computed `discount_amount` = `subtotal * (discount_percent / 100)` and `tax_amount` = `(subtotal - discount_amount) * (tax_percent / 100)`.

#### Scenario: Discount and tax calculated correctly
- **WHEN** subtotal is 1000, discount_percent is 10, and tax_percent is 8
- **THEN** discount_amount is 100 and tax_amount is 72

### Requirement: Computed total
`useQuotation` MUST export a computed `total` = `subtotal - discount_amount + tax_amount`.

#### Scenario: Total calculated correctly
- **WHEN** subtotal is 1000, discount_amount is 100, tax_amount is 72
- **THEN** total equals 972

### Requirement: isDirty tracking
`useQuotation` MUST export `isDirty: Ref<boolean>` initialized `false`, set to `true` on any quotation mutation (excluding initial load), and reset `false` on `loadQuotation` and `resetQuotation`.

#### Scenario: isDirty starts false
- **WHEN** `useQuotation()` is called
- **THEN** `isDirty.value` is `false`

#### Scenario: isDirty becomes true on mutation
- **WHEN** a field on `quotation.value` is modified
- **THEN** `isDirty.value` becomes `true`
