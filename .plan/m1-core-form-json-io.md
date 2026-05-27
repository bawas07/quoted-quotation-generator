# M1: Core Form + JSON I/O Implementation Plan

## Current State
- **Change:** m1-core-form-json-io
- **Schema:** spec-driven
- **Progress:** 0/195 tasks complete
- **Specs:** marked "ready" (pending finalization)

## What M1 Delivers

The first feature milestone — makes the quotation form fully functional, implements JSON download/upload with 100% field restoration, and wires all UI components to real data.

## Implementation Strategy

### Phase 1 — Foundation (Tasks 1–8)
1. Delete 6 empty composable stubs (useShortcuts, useAutoSave, useExport, useCurrency, useValidation, usePreview)
2. Implement `createEmptyQuotation()` in `defaults.ts` (referenced by tasks but function doesn't exist yet)
3. Verify build still passes

### Phase 2 — Core Composables (Tasks 9–50)
4. **useQuotation.ts** — Central reactive state with:
   - `quotation` ref initialized with `createEmptyQuotation()`
   - Computed: `subtotal`, `discount_amount`, `tax_amount`, `total`
   - `isDirty` tracking via deep watch
   - CRUD methods: `loadQuotation`, `resetQuotation`, `updateMeta`, `updateFrom`/`updateTo`, `setLogo`, `addLineItem`/`updateLineItem`/`removeLineItem`, `updateTotals`, `setStatus`, `setTemplate`, `setNotes`
5. **useJsonIO.ts** — Export/import with schema validation
6. **useToast.ts** (new) — Toast notification system
7. **useLogoUpload.ts** — File handling, drag-drop, base64

### Phase 3 — Sidebar Components (Tasks 51–88)
8. Rewrite 7 sidebar component stubs to fully wired form components:
   - LogoUpload.vue, PartyFields.vue, MetaFields.vue
   - StatusSelector.vue, LineItemsTable.vue
   - TotalsFields.vue, NotesField.vue

### Phase 4 — Shared Components (Tasks 89–99)
9. **AppButton.vue** — Variant-based button component
10. **AppToast.vue** — Toast notification container

### Phase 5 — Preview Components (Tasks 100–106)
11. **StatusBar.vue** — Live quotation number + client name
12. **TemplateSwitcher.vue** — 5 template pills

### Phase 6 — App.vue Refactor (Tasks 107–118)
13. Compose all components, wire all composables
14. Tab switching, action bar buttons, unsaved changes guard
15. 80ms debounce on preview updates

### Phase 7 — Tests (Tasks 119–176)
16. Write 5 test files:
    - useQuotation.test.ts (26 scenarios)
    - useJsonIO.test.ts (14 scenarios)
    - useLogoUpload.test.ts (6 scenarios)
    - AppButton.test.ts (7 scenarios)
    - AppToast.test.ts (5 scenarios)

### Phase 8 — Polish & Integration (Tasks 177–195)
17. Currency formatting in readonly displays
18. min="0" on all number inputs
19. Unsaved changes confirmation
20. Build & test verification
21. Manual QA checklist

## Files to Create/Modify

### Delete (6)
- `src/composables/useShortcuts.ts`
- `src/composables/useAutoSave.ts`
- `src/composables/useExport.ts`
- `src/composables/useCurrency.ts`
- `src/composables/useValidation.ts`
- `src/composables/usePreview.ts`

### Modify (4)
- `src/utils/defaults.ts` — add `createEmptyQuotation()`
- `src/composables/useQuotation.ts` — full implementation
- `src/composables/useJsonIO.ts` — full implementation
- `src/composables/useLogoUpload.ts` — full implementation

### Create (8)
- `src/composables/useToast.ts` — new composable
- `src/components/sidebar/LogoUpload.vue` — rewrite
- `src/components/sidebar/PartyFields.vue` — rewrite
- `src/components/sidebar/MetaFields.vue` — rewrite
- `src/components/sidebar/StatusSelector.vue` — rewrite
- `src/components/sidebar/LineItemsTable.vue` — rewrite
- `src/components/sidebar/TotalsFields.vue` — rewrite
- `src/components/sidebar/NotesField.vue` — rewrite

### Rewrite (5)
- `src/components/shared/AppButton.vue`
- `src/components/shared/AppToast.vue`
- `src/components/preview/StatusBar.vue`
- `src/components/preview/TemplateSwitcher.vue`
- `src/App.vue`

### New Tests (5)
- `src/composables/__tests__/useQuotation.test.ts`
- `src/composables/__tests__/useJsonIO.test.ts`
- `src/composables/__tests__/useLogoUpload.test.ts`
- `src/components/shared/__tests__/AppButton.test.ts`
- `src/components/shared/__tests__/AppToast.test.ts`

## Key Design Decisions
- Central state in `useQuotation` composable (no Pinia — overkill for local-first)
- Computed totals, not stored totals (prevents data desync)
- Deep watch on `quotation` for `isDirty` (automatic, covers all mutations)
- Toast system as standalone composable (decoupled, testable)
- Inline unsaved changes confirmation (no AppModal needed until M3)
- 80ms debounce on preview updates (prevents jank on fast typing)
