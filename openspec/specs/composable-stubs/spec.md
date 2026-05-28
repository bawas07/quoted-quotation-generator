# Composable Stubs

## Purpose

Defines the composable implementations for quotation state management, JSON import/export, logo upload, and toast notifications.

## Requirements

### Requirement: Composable stubs created
The change MUST upgrade 3 composable stubs to full implementations, create 1 new composable, and delete 6 out-of-scope stubs.

#### Scenario: useQuotation fully implemented
- **WHEN** `useQuotation()` is called
- **THEN** it returns reactive `quotation`, computed totals (`subtotal`, `discount_amount`, `tax_amount`, `total`), `isDirty`, and all CRUD methods

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
