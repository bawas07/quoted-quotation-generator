## ADDED Requirements

### Requirement: Export Workspace Backup
The system SHALL provide a function to export the entire workspace as a JSON backup file. The backup SHALL combine all catalog entries and all history entries (logos already stripped) into a `WorkspaceBackup` object with `schema_version: "1.0"` and `type: "workspace_backup"`. The file SHALL be downloaded with the filename `workspace_backup_YYYY-MM-DD.json`.

#### Scenario: Export workspace with data
- **WHEN** user clicks "Export Workspace" in the Catalog tab
- **AND** catalog has 5 items and history has 3 entries
- **THEN** a JSON file downloads containing both catalog and history arrays
- **AND** the filename is `workspace_backup_YYYY-MM-DD.json` with the current date

#### Scenario: Export workspace empty
- **WHEN** user clicks "Export Workspace"
- **AND** both catalog and history are empty
- **THEN** a JSON file downloads with empty arrays

### Requirement: Import Workspace Backup
The system SHALL provide a function to import a workspace backup JSON file. The import SHALL validate `schema_version: "1.0"` and `type: "workspace_backup"`. On success, it SHALL merge the backup's catalog and history into the app's current catalog and history stores, then persist to localStorage.

#### Scenario: Import valid workspace backup
- **WHEN** user uploads a valid workspace backup JSON file
- **THEN** the backup's catalog items are merged into the current catalog
- **AND** the backup's history entries are merged into the current history
- **AND** both are persisted to localStorage
- **AND** a success toast shows the count of imported items and quotations

#### Scenario: Import invalid file
- **WHEN** user uploads a file that is not a valid workspace backup (wrong type, missing schema_version, or corrupt JSON)
- **THEN** an error toast is shown: "Couldn't read this file."
- **AND** no data is modified

### Requirement: Catalog Merge on Import
When importing a workspace backup, catalog items SHALL be merged by normalized name. If an item with the same normalized name exists in both the current catalog and the backup, the one with the later `updated` timestamp SHALL be kept. Items not found in the current catalog SHALL be added as new.

#### Scenario: New catalog item from backup
- **WHEN** importing a backup with a catalog item "Logo Design" not in the current catalog
- **THEN** "Logo Design" is added to the catalog

#### Scenario: Conflicting catalog item — backup wins
- **WHEN** importing a backup with "Logo Design" that has a later `updated` timestamp than the current catalog's "Logo Design"
- **THEN** the backup's version replaces the current version

#### Scenario: Conflicting catalog item — current wins
- **WHEN** importing a backup with "Logo Design" that has an earlier `updated` timestamp than the current catalog's "Logo Design"
- **THEN** the current catalog's version is kept unchanged

### Requirement: History Merge on Import
When importing a workspace backup, history entries SHALL be merged by `meta.quotation_number`. If an entry with the same quotation number exists in both the current history and the backup, the one with the later `updated_at` timestamp SHALL be kept. Entries not found in the current history SHALL be added.

#### Scenario: New history entry from backup
- **WHEN** importing a backup with QUO-005 not in the current history
- **THEN** QUO-005 is added to history

#### Scenario: Conflicting history entry — backup wins
- **WHEN** importing a backup with QUO-001 that has a later `updated_at` than the current history's QUO-001
- **THEN** the backup's QUO-001 replaces the current one

#### Scenario: Conflicting history entry — current wins
- **WHEN** importing a backup with QUO-001 that has an earlier `updated_at` than the current history's QUO-001
- **THEN** the current history's QUO-001 is kept unchanged

### Requirement: Workspace Export/Import UI Buttons
The Catalog panel SHALL display "Export Workspace" and "Import Workspace" buttons in its footer. The Export button SHALL trigger the export function. The Import button SHALL open a file picker for `.json` files and trigger the import function.

#### Scenario: Export button triggers download
- **WHEN** user clicks "Export Workspace" in the Catalog tab
- **THEN** a workspace backup JSON file is downloaded

#### Scenario: Import button opens file picker
- **WHEN** user clicks "Import Workspace" in the Catalog tab
- **THEN** a file picker opens accepting `.json` files

### Requirement: Workspace Import via Upload Button
The system SHALL detect the file `type` field during JSON upload. If `type` is `"workspace_backup"`, the system SHALL route to the workspace import flow instead of the quotation import flow.

#### Scenario: Upload workspace backup via main upload button
- **WHEN** user uploads a file with `type: "workspace_backup"` via the sidebar Upload button
- **THEN** the workspace import flow is triggered (merge catalog + history)
- **AND** the editor form is not modified
