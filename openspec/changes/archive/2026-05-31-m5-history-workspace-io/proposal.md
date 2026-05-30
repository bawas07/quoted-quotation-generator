## Why

Users can create and export quotations today, but there's no record of past quotations within the app. They can't browse what they quoted last month, reload a previous quote to re-use it, or back up their entire workspace (catalog + history) for migration to a new browser. This is the last major persistence feature before the app ships.

## What Changes

- **Quotation history** persists in localStorage across sessions. Every exported or imported quotation is saved automatically.
- **History panel** in the sidebar tab shows all past quotations: QUO number, client, date, total, status badge, and a logo indicator.
- **Click-to-load** from history restores a past quotation into the editor form for re-use or editing.
- **Auto-increment quotation number** reads from history to suggest the next number (QUO-001 → QUO-002 → …).
- **Workspace backup** exports the entire catalog + history (logos stripped) as a single JSON file.
- **Workspace restore** imports a backup file and merges catalog (by name) and history (by quotation number), with conflict resolution (latest `updated_at` wins).
- **History deduplication**: saving a quotation with the same number updates the existing entry rather than creating a duplicate.
- **History cap**: maximum 50 entries, oldest dropped when exceeded.
- **LocalStorage full detection** warns the user with a toast when storage is nearly exhausted.

## Capabilities

### New Capabilities

- `quotation-history`: localStorage-persisted history of past quotations, with auto-save on export/import, deduplication by quotation number, and a 50-entry cap.
- `history-panel-ui`: Sidebar tab component displaying a sortable list of past quotations with click-to-load, logo indicator (📎), status badges, and empty state.
- `workspace-backup-io`: Export and import of a combined catalog + history backup file with conflict resolution on merge.
- `quotation-number-generation`: Auto-increment quotation number derived from existing history entries.

### Modified Capabilities

<!-- No existing capability specs change at the requirement level. The wiring changes
     (adding addToHistory calls to export/import flow, wiring HistoryPanel into the tab,
     swapping CatalogPanel stub buttons for real workspace buttons) are implementation
     integrations that don't alter the specification of existing capabilities. -->

## Impact

- **Affected code**: `src/composables/useHistory.ts` (full rewrite from stub), `src/composables/useWorkspaceIO.ts` (full rewrite from stub), `src/components/HistoryPanel.vue` (full rewrite from stub), `src/App.vue` (wire history tab + auto-increment + `addToHistory` calls), `src/components/catalog/CatalogPanel.vue` (replace stub workspace buttons), `src/utils/defaults.ts` (add optional `nextNumber` parameter)
- **New files**: None (all changes are to existing stubs or wiring)
- **No breaking changes**: All existing composable APIs, component props, and templates are unaffected
- **Dependencies**: Uses existing `src/utils/localStorage.ts`, `src/utils/fuzzyMatch.ts`, `src/types/quotation.ts` (types already defined), `src/composables/useCatalog.ts` (for workspace IO)
