## 1. Template Composable Foundation

- [x] 1.1 Implement `useTemplate` composable with `isSwitching` ref and `triggerSwitch()` that toggles state on a 150ms delay
- [x] 1.2 Add `.invoice-paper.switching` CSS rule in `layout.css`: `opacity: 0; transition: opacity 150ms`

## 2. Preview Template Components

- [x] 2.1 Implement `TemplateClassic.vue` — accepts `quotation: QuotationData` prop, renders gradient top bar, logo/title side by side, two-column parties, ruled line item table, footer with notes + totals, and status badge (top-right)
- [x] 2.2 Implement `TemplateMinimal.vue` — large italic "Quotation" title, compact meta row with status badge, border-separated parties, minimal inline item rows, right-aligned totals, validity date at bottom
- [x] 2.3 Implement `TemplateBold.vue` — navy header band with logo + number, blue band with issue date/valid until/status, white body with parties + table, totals in footer
- [x] 2.4 Implement `TemplateSidebar.vue` — two-column grid: left sidebar (sender info, currency, status badge) + right main column (title, recipient, quantity-breakdown table, totals)
- [x] 2.5 Implement `TemplateFriendly.vue` — rounded badge header, card-style from/to sections, striped info bar (date/currency/status), card-style table with blue header, totals

## 3. Existing Component Upgrades

- [x] 3.1 Update `TemplateSwitcher.vue` — change button labels from raw template IDs to capitalized display names (classic → Classic, minimal → Minimal, etc.)
- [x] 3.2 Update `StatusBar.vue` — add status badge with dropdown selector on the right side; badge shows current status with colored dot; dropdown opens 4 status options (DRAFT, SENT, ACCEPTED, REJECTED) with colored dots; clicking an option emits `update:modelValue`

## 4. App.vue Wiring

- [x] 4.1 Import all 5 template components in App.vue
- [x] 4.2 Wire dynamic component rendering inside `invoice-paper` using `<component :is>` bound to `quotation.template`, passing `quotation` as prop
- [x] 4.3 Wire cross-fade animation: on template switch, call `useTemplate.triggerSwitch()`, bind `isSwitching` to `.switching` class on `invoice-paper`
- [x] 4.4 Wire the StatusBar's status badge dropdown output to `handleStatusChange` (same handler used by the current StatusSelector)

## 5. Print Styles

- [x] 5.1 Update `styles/print.css` with full `@media print` rules: hide `.sidebar`, `.preview-topbar`, `.status-bar`, `.action-bar`; set A4 page size; remove box-shadows from `.invoice-paper`; ensure templates print cleanly

## 6. Tests

- [x] 6.1 Write unit test for `useTemplate`: verify `isSwitching` initial state, `triggerSwitch()` toggles correctly with timers
- [x] 6.2 Write component test for `TemplateClassic`: verify it renders with sample `QuotationData`, shows status badge, renders line items
- [x] 6.3 Write component test for `TemplateMinimal`: verify correct layout rendering with status badge
- [x] 6.4 Write component test for `TemplateBold`: verify header bands and status badge render correctly
- [x] 6.5 Write component test for `TemplateSidebar`: verify two-column layout and status badge
- [x] 6.6 Write component test for `TemplateFriendly`: verify card sections and status badge
- [x] 6.7 Write component test for updated `StatusBar.vue`: verify status badge and dropdown appear
- [x] 6.8 Write component test for updated `TemplateSwitcher.vue`: verify display name labels render
