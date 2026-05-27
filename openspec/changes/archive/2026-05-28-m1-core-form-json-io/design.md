## Context

M0 is complete. The project has a working Vite + Vue 3 + TypeScript scaffold, all TypeScript types, CSS design tokens, typed localStorage utility, and a two-column layout shell. There are 26 component stubs and 11 composable stubs (6 of which are scope creep). M1 is the first feature milestone: make the form work, implement JSON IO, and wire the UI.

**Current state:** Layout renders. All form fields are inline HTML stubs or placeholder text. No reactive state. No JSON download/upload. Buttons are inert.

## Goals / Non-Goals

**Goals:**
- Implement central quotation state (`useQuotation`) with reactive computed totals
- Implement JSON export and import with schema validation (`useJsonIO`)
- Implement logo upload with drag-drop and base64 encoding (`useLogoUpload`)
- Create toast notification system (`useToast`)
- Rewrite all sidebar form components from stubs to working Vue SFCs
- Implement shared `AppButton` and `AppToast` components
- Refactor `App.vue` to compose real components and wire all composables
- Implement `StatusBar.vue` and `TemplateSwitcher.vue` in preview panel
- Write unit tests for all new composables and shared components
- Zero TypeScript errors, `npm run build` passes, all tests green

**Non-Goals:**
- Catalog CRUD or autocomplete (M2)
- Catalog sync popup on SENT status (M3)
- Live preview templates (Classic, Minimal, Bold, Sidebar, Friendly) — M4
- History persistence in localStorage (M5)
- Print/PDF export (M6)
- Workspace backup import/export (M5)
- AppModal component (deferred to M3 when first needed for catalog sync)

## Decisions

### Delete 6 M0 composable stubs
**Choice:** Remove `useShortcuts.ts`, `useAutoSave.ts`, `useExport.ts`, `useCurrency.ts`, `useValidation.ts`, `usePreview.ts`.
**Why:** These were created as architecture map stubs but are not in the M0 milestone spec or M1 scope. They are empty 4-line shells, never imported. Keeping them creates confusion about what is actually implemented.
**Alternative:** Leave them — unnecessary clutter, misleading to future implementers.

### Central state in `useQuotation` composable
**Choice:** Single `quotation` ref exported from `useQuotation`, with computed totals derived from `line_items`, `discount_percent`, and `tax_percent`.
**Why:** All sidebar components read/write the same reactive object. No prop drilling. Computed totals update automatically when line items change. Matches Vue 3 Composition API best practices.
**Alternative:** Pinia or global store — overkill for a local-first app with no backend. Composable pattern is idiomatic and sufficient.

### JSON schema validation in `useJsonIO`
**Choice:** Validate `schema_version`, `type: 'quotation'`, and required top-level keys on import. Reject unknown `schema_version` with clear error toast.
**Why:** Prevents corrupted or incompatible files from destroying app state. Forward-compatible: M5 workspace backup has `type: 'workspace_backup'` and will be rejected here, routed correctly later.
**Alternative:** No validation — dangerous, user could upload any JSON and crash the app.

### Toast system as standalone composable
**Choice:** `useToast()` returns reactive `toasts` array and `showToast(message, type)` function. `AppToast.vue` renders the container. Any component can import and call `showToast`.
**Why:** Decoupled from any specific feature. Used by JSON IO (success/error), logo upload (validation errors), and unsaved changes guard. Easy to test in isolation.
**Alternative:** Inline toast logic in `App.vue` — creates god component, harder to test and reuse.

### Computed totals, not stored totals
**Choice:** `subtotal`, `discount_amount`, `tax_amount`, `total` are computed properties in `useQuotation`. Only `discount_percent`, `tax_percent`, and `tax_label` are stored in `QuotationData.totals`.
**Why:** Prevents data desync. If line items change, totals recalculate automatically. The exported JSON still includes full `totals` object for portability.
**Alternative:** Store all totals — requires manual recalculation on every mutation, error-prone.

### Minimum 1 line item guard
**Choice:** `removeLineItem()` prevents removing the last item. Toast warns user.
**Why:** A quotation with zero line items is invalid. Matches business logic and prevents empty export.
**Alternative:** Allow zero items — creates edge cases in totals calculation and preview rendering.

### 80ms debounce on preview updates
**Choice:** Debounce form input → preview update at 80ms using `setTimeout` or `watch` with `flush: 'post'`.
**Why:** Design.md specifies 80ms debounce. Prevents excessive re-renders while typing. Preview panel is lightweight in M1 (status bar + template switcher only; templates come in M4).
**Alternative:** Immediate updates — causes jank on fast typing.

### Currency formatting via existing `formatCurrency` util
**Choice:** Use `src/utils/formatCurrency.ts` (already implemented in M0) for all readonly currency displays.
**Why:** M0 already implemented this utility with locale-aware formatting and zero-decimal currency support (IDR, JPY). No duplication needed.
**Alternative:** Inline formatting in components — violates DRY.

### `@vue/test-utils` for component tests
**Choice:** Install `@vue/test-utils` as dev dependency for M1 component tests (`AppButton`, `AppToast`).
**Why:** M0 explicitly deferred Vue component testing. M1 is the first milestone with real implemented components that need rendering tests. Composable tests use vitest + jsdom directly.
**Alternative:** No component tests — unacceptable for shared components used across the app.

## Risks / Trade-offs

**Risk:** Refactoring `App.vue` from static HTML to composed components may break layout CSS
**Mitigation:** Preserve existing CSS class names and DOM structure in `App.vue`. Components slot into existing `.sidebar-body`, `.sidebar-actions`, `.preview-topbar`, `.preview-scroll` containers. Verify `npm run dev` layout visually after refactor.

**Risk:** `useQuotation` computed totals may have floating-point rounding errors
**Mitigation:** Use standard JavaScript arithmetic (same as example-v2.html). For display, `formatCurrency` rounds to 2 decimals (or 0 for IDR/JPY). Tests verify exact expected values for common scenarios.

**Risk:** JSON import of a malformed file could corrupt reactive state
**Mitigation:** `parseQuotationFile` validates schema before assigning to `quotation`. Errors show toast and leave state untouched. Deep clone imported data to break reference ties.

**Risk:** Base64 logo images may exceed localStorage quota
**Mitigation:** Logo is stored in reactive state only (not localStorage in M1). M5 will handle workspace persistence. `useLogoUpload` validates file size (max 2MB) before encoding.

**Trade-off:** Inline unsaved changes confirmation vs reusable `AppModal`
**For:** Inline simple confirmation in `App.vue` — faster to implement, no modal component needed yet.
**Against:** Reusable modal would be cleaner. `AppModal` stub exists but is not needed until M3 catalog sync popup.
**Decision:** Use inline confirmation in M1. Implement `AppModal` in M3 when first actually needed.

**Trade-off:** `isDirty` tracking via deep watch vs manual flag
**For:** Deep watch on `quotation` ref — automatic, covers all mutations.
**Against:** Performance cost of deep watching large object with base64 logo. Logo changes are rare; form field changes are frequent.
**Decision:** Use deep watch with `flush: 'post'`. If performance issues arise, switch to manual flag in M4.
