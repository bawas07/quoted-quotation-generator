# Quotation State

## Purpose

Provides the central reactive quotation state with computed totals, dirty tracking, and template switching animation state, serving as the single source of truth for all form and preview components.

## Requirements

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
`useQuotation` MUST export computed `discount_amount` = `subtotal * (discount_percent / 100)` and `tax_amount` = `(subtotal - discount_amount) * (tax_percent / 100)`. The `updateTotalsConfig` method MUST accept `discount_label` in its patch parameter alongside `discount_percent`, `tax_percent`, and `tax_label`.

#### Scenario: Discount and tax calculated correctly
- **WHEN** subtotal is 1000, discount_percent is 10, and tax_percent is 8
- **THEN** discount_amount is 100 and tax_amount is 72

#### Scenario: updateTotalsConfig accepts discount_label
- **WHEN** `updateTotalsConfig({ discount_label: 'Promo' })` is called
- **THEN** `quotation.value.discount_label` equals `'Promo'`
- **THEN** `isDirty.value` becomes `true`

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

### Requirement: useTemplate composable for cross-fade animation
A `useTemplate` composable MUST export `isSwitching: Ref<boolean>` initialized `false`, and `triggerSwitch()` that sets `isSwitching` to `true`, then after 150ms sets it back to `false`.

#### Scenario: isSwitching initializes false
- **WHEN** `useTemplate()` is called
- **THEN** `isSwitching.value` is `false`

#### Scenario: triggerSwitch toggles state
- **WHEN** `triggerSwitch()` is called
- **THEN** `isSwitching.value` becomes `true`
- **THEN** after 150ms, `isSwitching.value` becomes `false`

### Requirement: Template switch triggers cross-fade in App.vue
When the user selects a new template via `TemplateSwitcher`, App.vue MUST call `useTemplate.triggerSwitch()` and update `quotation.template` after the fade-out begins.

#### Scenario: Template selection triggers animation
- **WHEN** user clicks "Minimal" pill in TemplateSwitcher
- **THEN** `triggerSwitch()` is called, setting `isSwitching` to `true`
- **THEN** `quotation.template` is updated to `'minimal'`
- **THEN** the preview fades out, swaps component, and fades in
