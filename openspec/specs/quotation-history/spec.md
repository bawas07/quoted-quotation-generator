# Quotation History

## Purpose

Provides persistent storage of quotation history in localStorage with deduplication, automatic saving on export/import, and a capped entry limit.

## Requirements

### Requirement: History Persistence in localStorage
The system SHALL persist quotation history in localStorage under the key `quoted_history`. Each entry SHALL be a `QuotationData` object with `logo` stripped (set to `null`) and a `_hadLogo` boolean field indicating whether the original quotation included a logo. History SHALL be loaded from localStorage on first access and written through on every mutation.

#### Scenario: History loads from localStorage on app start
- **WHEN** the app initializes and `useHistory` is first accessed
- **THEN** history entries are loaded from the `quoted_history` localStorage key
- **AND** if no entries exist, history is an empty array

#### Scenario: History persists across page refreshes
- **WHEN** a quotation is saved to history
- **AND** the page is refreshed
- **THEN** the saved quotation still appears in the history list

### Requirement: Automatic Save to History on Export
The system SHALL automatically save a quotation to history when the user exports it as JSON. The saved entry SHALL have the logo stripped (set to `null`) and `_hadLogo` set to `true` if the original had a logo. The `updated_at` timestamp SHALL be refreshed to the current time.

#### Scenario: Export triggers history save
- **WHEN** user clicks "Download JSON"
- **THEN** the current quotation is saved to history with logo stripped
- **AND** the history entry has `_hadLogo: true` if the quotation had a logo

#### Scenario: Export without logo
- **WHEN** user exports a quotation that has no logo
- **THEN** the history entry has `_hadLogo: false` (or absent)

### Requirement: Automatic Save to History on Import
The system SHALL automatically save an imported quotation to history. The same logo-stripping logic SHALL apply.

#### Scenario: Import triggers history save
- **WHEN** user uploads and successfully parses a quotation JSON file
- **THEN** the imported quotation is saved to history with logo stripped

### Requirement: History Deduplication
The system SHALL deduplicate history entries by `meta.quotation_number`. When a quotation is saved with the same number as an existing entry, the existing entry SHALL be replaced (removed and re-inserted at the top) rather than creating a duplicate.

#### Scenario: Re-saving with same quotation number
- **WHEN** user exports QUO-001, then edits and re-exports QUO-001
- **THEN** only one QUO-001 entry exists in history
- **AND** the entry is at the top of the list with the latest data

#### Scenario: Importing a quotation with existing number
- **WHEN** user imports a quotation JSON with `quotation_number: "QUO-001"`
- **AND** QUO-001 already exists in history
- **THEN** the existing QUO-001 entry is replaced with the imported data

### Requirement: History Cap of 50 Entries
The system SHALL cap the history at 50 entries. When history exceeds 50 entries, the oldest entries SHALL be dropped.

#### Scenario: 51st entry drops oldest
- **WHEN** history already contains 50 entries
- **AND** a new quotation is saved to history
- **THEN** history contains exactly 50 entries
- **AND** the previously oldest entry (51st) is removed

### Requirement: History Sorted by updated_at Descending
The system SHALL maintain history in descending `updated_at` order (newest first).

#### Scenario: History order after multiple saves
- **WHEN** user exports QUO-002, then QUO-001, then QUO-003
- **THEN** the history list shows QUO-003 first, then QUO-002, then QUO-001

### Requirement: Load Quotation from History
The system SHALL provide a function to load a quotation from history by its index. The loaded quotation SHALL repopulate the editor form with all fields including template, status, and line items. The logo SHALL NOT be restored (it was stripped).

#### Scenario: Load history entry into editor
- **WHEN** user selects a history entry
- **THEN** the editor form is populated with that quotation's data
- **AND** the preview updates to show that quotation
- **AND** the active sidebar tab switches to Editor

#### Scenario: Load history entry that originally had a logo
- **WHEN** user loads a history entry where `_hadLogo` is `true`
- **THEN** the logo upload zone is empty
- **AND** the HistoryPanel shows a logo indicator for that entry

### Requirement: Clear All History
The system SHALL provide a function to clear all history entries from localStorage.

#### Scenario: Clear all history
- **WHEN** `clearHistory()` is called
- **THEN** history becomes an empty array
- **AND** the `quoted_history` localStorage key is removed

### Requirement: Storage Full Detection
The system SHALL check available localStorage space before writing to history. If less than 1MB remains, a warning toast SHALL be displayed to the user.

#### Scenario: Low storage warning
- **WHEN** localStorage has less than 1MB remaining
- **AND** a quotation is saved to history
- **THEN** a warning toast is shown: "Storage almost full. Export your workspace to free up space."
- **AND** the history save still proceeds
