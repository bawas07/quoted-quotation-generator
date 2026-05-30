## Context

The sidebar's `TotalsFields.vue` currently renders all totals-related UI in a single flat section labeled "Totals": subtotal display, discount % input, tax display, tax label input, tax % input, and grand total. The hardcoded "Discount" label offers no user customization, and inputs are interspersed with read-only computed values, making the section harder to scan.

The proposal calls for splitting into two clear sections:
1. **Tax & Discount** — all editable controls (discount label, discount %, tax label, tax %)
2. **Total** — read-only summary (subtotal, discount label + amount, tax label + amount, grand total)

This requires a new `discount_label` field in the data model and a restructured component template.

## Goals / Non-Goals

**Goals:**
- Separate input controls from computed display values in the sidebar totals area
- Let users customize the discount label (e.g., "Promo", "Loyalty Discount") just as they can customize the tax label
- Keep the data model change minimal — add one string field, no migration needed

**Non-Goals:**
- No backend/persistence changes (data is local-first, JSON export handles new field naturally)
- No changes to preview templates (they already use `tax_label`; discount label display in previews is out of scope)
- No changes to calculation logic (discount_amount and tax_amount formulas stay identical)

## Decisions

### Decision 1: Add `discount_label` to `QuotationData` root level (not inside `QuotationTotals`)
**Rationale**: `tax_label` already lives at the root level of `QuotationData`. Keeping `discount_label` at the same level is consistent and avoids touching `QuotationTotals`, which represents computed numeric values. Labels are metadata, not totals.

**Alternative considered**: Adding to `QuotationTotals`. Rejected because `QuotationTotals` is for numeric computed fields; mixing in a string label would blur the interface's purpose.

### Decision 2: Extend `updateTotalsConfig` to accept `discount_label` alongside `tax_label`
**Rationale**: The method already handles `tax_label` via a union type in the patch. Adding `discount_label` to the same patch parameter is the path of least resistance. The method name "updateTotalsConfig" already implies configuration (which labels are), not just numeric totals.

**Alternative considered**: Creating a separate `updateLabels` method. Rejected as over-engineering — adds a new method and emit channel for a single string field.

### Decision 3: Single `TotalsFields.vue` with two internal sections (not two separate components)
**Rationale**: Both sections operate on the same props. Splitting into separate components would require duplicating prop definitions and formatting logic with minimal benefit at this scale.

**Alternative considered**: `TaxDiscountFields.vue` + `TotalsSummary.vue`. Rejected because they share props and formatting; two components would add indirection without reducing complexity.

### Decision 4: Default discount label = `"Discount"`
**Rationale**: Preserves backward compatibility. Existing users see the same label they saw before. Only new behavior is the ability to change it.

## Risks / Trade-offs

- **Risk**: JSON export files from older versions won't have `discount_label`. → **Mitigation**: `createEmptyQuotation` always sets it. On import, `JSON.parse` leaves it `undefined`, but the code reads `quotation.discount_label ?? 'Discount'` or defaults in the component prop.
- **Trade-off**: Expanding `updateTotalsConfig` patch type further couples labels to totals. → Acceptable; the method already couples tax_label to totals config, and both labels are part of the same sidebar UI concern.
