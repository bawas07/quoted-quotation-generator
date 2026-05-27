# Component Stubs

## Purpose

Defines the Vue SFC components and composables that make up the application, with sidebar form components upgraded from stubs to fully implemented reactive components.

## Requirements

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
3 composable stubs MUST be upgraded to full implementations (`useQuotation`, `useJsonIO`, `useLogoUpload`); 1 new composable created (`useToast`); 6 out-of-scope stubs deleted.

#### Scenario: useQuotation fully implemented
- **WHEN** `useQuotation()` is called
- **THEN** it returns reactive `quotation`, computed totals, `isDirty`, and all CRUD methods

#### Scenario: useJsonIO fully implemented
- **WHEN** `useJsonIO()` is called
- **THEN** it returns `exportQuotation(data)` and `parseQuotationFile(file)`

#### Scenario: useLogoUpload fully implemented
- **WHEN** `useLogoUpload()` is called
- **THEN** it returns logo state, file selection, drag-drop handlers, validation, preview, and remove methods

#### Scenario: useToast available
- **WHEN** `useToast()` is called
- **THEN** it returns `toasts` reactive array and `showToast(msg, type)` function

#### Scenario: Out-of-scope stubs deleted
- **WHEN** `src/composables/` is listed
- **THEN** `useShortcuts`, `useAutoSave`, `useExport`, `useCurrency`, `useValidation`, `usePreview` are absent
