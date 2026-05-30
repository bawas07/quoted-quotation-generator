## Why

The sidebar Totals section currently mixes editable inputs (discount %, tax label, tax %) with computed display values in a flat layout. Users need a clearer separation: input controls grouped in a dedicated "Tax & Discount" section, and a clean summary-only "Total" section that uses user-defined labels for discount and tax lines.

## What Changes

- Add a new `discount_label` field to `QuotationData` (default: `"Discount"`), parallel to the existing `tax_label`
- Split `TotalsFields.vue` into two labeled sections:
  - **Tax & Discount** — contains all inputs: Discount Label (new), Discount %, Tax Label, Tax %
  - **Total** — displays computed values only: Subtotal, Discount label + amount, Tax label + amount, Grand Total
- Update `useQuotation.updateTotalsConfig()` to accept `discount_label` updates
- Add `DEFAULT_DISCOUNT_LABEL` constant to defaults module

## Capabilities

### New Capabilities

- `sidebar-tax-discount-section`: Reorganize the sidebar totals layout into a two-section structure (Tax & Discount inputs, Total summary) with a user-customizable discount label

### Modified Capabilities

- `type-system`: Add `discount_label: string` field to `QuotationData`
- `quotation-state`: Extend `updateTotalsConfig` to accept `discount_label` in its patch parameter

## Impact

- **`src/types/quotation.ts`** — new `discount_label` field
- **`src/utils/defaults.ts`** — new `DEFAULT_DISCOUNT_LABEL` constant
- **`src/composables/useQuotation.ts`** — `updateTotalsConfig` patch type extended
- **`src/components/sidebar/TotalsFields.vue`** — restructured template (two sections), new prop + emit for discount_label
- **`src/App.vue`** — wire new `discountLabel` prop to `TotalsFields`
