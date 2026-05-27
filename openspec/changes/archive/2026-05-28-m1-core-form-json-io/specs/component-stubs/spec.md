## MODIFIED Requirements

### Requirement: Vue SFC stubs created
7 sidebar component stubs and 2 shared component stubs MUST be upgraded from empty shells to fully implemented Vue SFCs with reactive binding to `useQuotation` state.

#### Scenario: LogoUpload accepts files
- **WHEN** user interacts with LogoUpload
- **THEN** it uses `useLogoUpload` composable for file selection, drag-drop, preview, and removal

#### Scenario: PartyFields binds to from/to
- **WHEN** user types in PartyFields
- **THEN** the input updates `quotation.value.from` or `quotation.value.to` via `updateFrom`/`updateTo`

#### Scenario: MetaFields binds to meta
- **WHEN** user types in MetaFields
- **THEN** the input updates `quotation.value.meta` via `updateMeta`

#### Scenario: LineItemsTable renders items
- **WHEN** quotation has line items
- **THEN** LineItemsTable renders each item with editable qty, unit_price, and description fields
- **THEN** computed amount (qty × unit_price) is shown

#### Scenario: TotalsFields displays computed totals
- **WHEN** line items exist
- **THEN** TotalsFields displays subtotal, discount_amount, tax_amount, and total from computed values

#### Scenario: NotesField binds to notes
- **WHEN** user types in NotesField
- **THEN** the textarea updates `quotation.value.notes`

#### Scenario: StatusSelector cycles status
- **WHEN** user clicks StatusSelector
- **THEN** the status cycles DRAFT → SENT → ACCEPTED → REJECTED

### Requirement: Composable stubs created
3 composable stubs MUST be upgraded (`useQuotation`, `useJsonIO`, `useLogoUpload`); 1 new composable created (`useToast`); 6 out-of-scope stubs deleted.

#### Scenario: Deleted stubs removed
- **WHEN** the file system is inspected
- **THEN** `useShortcuts.ts`, `useAutoSave.ts`, `useExport.ts`, `useCurrency.ts`, `useValidation.ts`, and `usePreview.ts` no longer exist in `src/composables/`

#### Scenario: useToast is importable
- **WHEN** `useToast` is imported
- **THEN** it exports `toasts` and `showToast`
