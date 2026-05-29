## Why

The quotation form is fully functional (M0–M3), but users can only see raw form data — there is no live visual preview of what the quotation looks like. Without previews, users have to download JSON and open it elsewhere to verify formatting. M4 delivers the marquee feature: **live preview with 5 professionally designed templates**, each displaying the status badge, logo, line items, and totals. This transforms the app from a data-entry tool into a complete quotation studio.

## What Changes

- **Implement 5 quotation templates** (Classic, Minimal, Bold, Sidebar, Friendly) that render live from form data
- **Add status badge to every template** — positioned per template design, reflecting DRAFT/SENT/ACCEPTED/REJECTED
- **Enable template switching** with 150ms cross-fade animation between templates
- **Upgrade StatusBar** to include the status badge dropdown (currently shows only quotation number + client name)
- **Upgrade TemplateSwitcher** labels from raw IDs to display names
- **Implement `useTemplate` composable** for cross-fade state management
- **Add print styles** so templates print cleanly on A4
- **Wire dynamic template rendering** in App.vue's invoice-paper container

## Capabilities

### New Capabilities
- `preview-templates`: 5 template components (Classic, Minimal, Bold, Sidebar, Friendly) that each accept a `QuotationData` prop and render logo, parties, meta, line items, totals, notes, and status badge with scoped print styles
- `preview-panel`: Preview container with cross-fade animation on template switch, scrollable A4-proportioned paper view

### Modified Capabilities
- `template-switcher`: Update button labels from raw template IDs to capitalized display names (classic → Classic); no functional change to the interface
- `live-status-bar`: Add status badge with dropdown selector on the right side (currently only shows quotation number + client name on the left)
- `quotation-state`: Add `useTemplate` composable providing `isSwitching` state and `triggerSwitch()` for cross-fade animation; enhance existing template management with animation coordination

## Impact

- **5 new Vue components** created under `src/components/preview/templates/`
- **2 existing components modified**: `TemplateSwitcher.vue`, `StatusBar.vue`
- **1 composable implemented**: `useTemplate.ts` (currently a stub)
- **App.vue** wired to dynamically render the active template inside the `invoice-paper` div
- **`styles/print.css`** updated with full `@media print` rules for A4 output
- **No new dependencies** — all template styling is scoped CSS, no external template engine
- **No breaking changes** — templates are additive; all existing functionality continues working
