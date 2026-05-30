## MODIFIED Requirements

### Requirement: Computed discount_amount and tax_amount
`useQuotation` MUST export computed `discount_amount` = `subtotal * (discount_percent / 100)` and `tax_amount` = `(subtotal - discount_amount) * (tax_percent / 100)`. The `updateTotalsConfig` method MUST accept `discount_label` in its patch parameter alongside `discount_percent`, `tax_percent`, and `tax_label`.

#### Scenario: Discount and tax calculated correctly
- **WHEN** subtotal is 1000, discount_percent is 10, and tax_percent is 8
- **THEN** discount_amount is 100 and tax_amount is 72

#### Scenario: updateTotalsConfig accepts discount_label
- **WHEN** `updateTotalsConfig({ discount_label: 'Promo' })` is called
- **THEN** `quotation.value.discount_label` equals `'Promo'`
- **THEN** `isDirty.value` becomes `true`
