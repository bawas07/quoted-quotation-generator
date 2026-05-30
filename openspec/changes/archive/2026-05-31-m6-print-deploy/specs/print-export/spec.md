## ADDED Requirements

### Requirement: User can trigger print via PDF button
The system SHALL invoke `window.print()` when the user clicks the PDF button in the preview toolbar. The print dialog MUST open with the currently selected template rendered for A4 output.

#### Scenario: PDF button triggers print
- **WHEN** user clicks the "PDF" button in the preview toolbar
- **THEN** `window.print()` is called
- **AND** the browser-native print dialog opens

#### Scenario: Print renders the active template
- **WHEN** the print dialog opens
- **THEN** the preview panel displays the currently selected template (Classic, Minimal, Bold, Sidebar, or Friendly)
- **AND** the template is rendered at A4-proportioned width

### Requirement: UI chrome is hidden during print
The system SHALL hide all editing UI chrome during print via `@media print` CSS rules. The sidebar, template switcher, status bar, and action buttons MUST NOT appear in the printed output.

#### Scenario: Sidebar hidden in print
- **WHEN** print is triggered
- **THEN** the sidebar (`.sidebar`) is not visible in the printed output

#### Scenario: Template switcher hidden in print
- **WHEN** print is triggered
- **THEN** the template switcher bar (`.preview-topbar`) is not visible in the printed output

#### Scenario: Status bar hidden in print
- **WHEN** print is triggered
- **THEN** the status bar (`.status-bar`) is not visible in the printed output

#### Scenario: Action buttons hidden in print
- **WHEN** print is triggered
- **THEN** the sidebar action buttons (`.sidebar-actions`) are not visible in the printed output

### Requirement: All 5 templates print correctly
Every template MUST include a scoped `@media print` block that ensures clean A4 rendering. Templates SHALL remove screen-only styling (shadows, large padding) and preserve colored elements (status badges, header bands, table headers) via `print-color-adjust: exact`.

#### Scenario: Classic template prints correctly
- **WHEN** Classic template is printed
- **THEN** the template is cleanly laid out on A4 with status badge and colored elements visible

#### Scenario: Minimal template prints correctly
- **WHEN** Minimal template is printed
- **THEN** the template is cleanly laid out on A4 with status badge visible

#### Scenario: Bold template prints correctly
- **WHEN** Bold template is printed
- **THEN** the template is cleanly laid out on A4 with rust header band and status badge visible

#### Scenario: Sidebar template prints correctly
- **WHEN** Sidebar template is printed
- **THEN** the template is cleanly laid out on A4 with sidebar column and status badge visible

#### Scenario: Friendly template prints correctly
- **WHEN** Friendly template is printed
- **THEN** the template is cleanly laid out on A4 with status badge and colored elements visible

### Requirement: Long quotations handle page breaks
The system SHALL handle page breaks for quotations with many line items. Table rows MUST avoid breaking mid-row, and table headers SHALL repeat on each printed page.

#### Scenario: Multi-page quotation prints without broken rows
- **WHEN** a quotation has 20+ line items
- **THEN** table rows do not split across page boundaries
- **AND** table header repeats on each page

### Requirement: Print CSS is loaded
The global `print.css` stylesheet SHALL be loaded when the application initializes. Its `@media print` rules MUST fire when the browser enters print mode.

#### Scenario: print.css is loaded on app start
- **WHEN** the application boots
- **THEN** `styles/print.css` is active and its `@media print` rules are registered

### Requirement: usePrint composable provides triggerPrint
The `usePrint` composable SHALL export a `triggerPrint` function that invokes `window.print()`. It MUST follow the established composable pattern (returning a plain object with the method).

#### Scenario: usePrint returns triggerPrint
- **WHEN** `usePrint()` is called
- **THEN** it returns an object with a `triggerPrint` function
- **AND** calling `triggerPrint()` invokes `window.print()`
