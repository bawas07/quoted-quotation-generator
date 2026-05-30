## 1. Data Model

- [x] 1.1 Add `discount_label: string` field to `QuotationData` interface in `src/types/quotation.ts`
- [x] 1.2 Add `DEFAULT_DISCOUNT_LABEL = 'Discount'` constant to `src/utils/defaults.ts`
- [x] 1.3 Set `discount_label: DEFAULT_DISCOUNT_LABEL` in `createEmptyQuotation()` return object

## 2. State Management

- [x] 2.1 Extend `updateTotalsConfig` patch type to accept `discount_label?: string` in `src/composables/useQuotation.ts`
- [x] 2.2 Add `if (patch.discount_label !== undefined)` handler to update `quotation.value.discount_label` in `updateTotalsConfig`

## 3. Wire-up

- [x] 3.1 Add `:discountLabel="quotation.discount_label"` prop to `TotalsFields` in `src/App.vue`
- [x] 3.2 Add `discountLabel` to `TotalsFields` `defineProps` in `src/components/sidebar/TotalsFields.vue`

## 4. UI Restructure

- [x] 4.1 Replace single "Totals" label with two section labels: "Tax & Discount" and "Total" in the template
- [x] 4.2 Move Discount Label input (new), Discount % input, Tax Label input, and Tax % input under "Tax & Discount" section
- [x] 4.3 Remove the old standalone "Tax (X%)" read-only row (replaced by Total section display)
- [x] 4.4 Restructure "Total" section to display: Subtotal, Discount label + value (formatted), Tax label + value (formatted), and Grand Total
- [x] 4.5 Add discount label update handler (emit `{ discount_label: value }`) on Discount Label input

## 5. Verify

- [x] 5.1 Test that a new quotation defaults `discount_label` to "Discount"
- [x] 5.2 Test that editing Discount Label updates the label in both sections (input and Total summary)
- [x] 5.3 Test that all computed values (discount_amount, tax_amount, total) display correctly
- [x] 5.4 Test JSON export/import round-trip preserves `discount_label`
