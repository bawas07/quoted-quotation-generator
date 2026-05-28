# App.vue Integration

## Purpose

Wires the catalog sync flow into `App.vue`, the composition root. Intercepts status changes to SENT, triggers `useCatalogSync.buildSyncList()`, conditionally shows `CatalogSyncPopup`, and applies selected items before finalizing the status update.

## Requirements

### Requirement: Status change to SENT triggers sync flow
The current `@update:modelValue` handler on `StatusSelector` MUST be replaced with a handler that:
1. Accepts the new status value
2. If status is NOT `'SENT'`: calls `setStatus(val)` immediately (no sync needed)
3. If status IS `'SENT'`:
   a. Calls `useCatalogSync().buildSyncList(quotation.value.line_items, catalog.value)`
   b. If the result has items:
      - Stores the sync items in local state
      - Sets `showSyncPopup = true`
      - Does NOT update the quotation status yet
   c. If the result has no items:
      - Calls `setStatus('SENT')` directly
      - Shows a success toast: "Status updated to SENT"

#### Scenario: Non-SENT status update passes through
- **GIVEN** current status is DRAFT
- **WHEN** user changes status to ACCEPTED
- **THEN** `setStatus('ACCEPTED')` is called immediately
- **AND** no sync popup is shown

#### Scenario: SENT with sync items opens popup
- **GIVEN** current catalog has entries and line items exist
- **WHEN** user changes status to SENT
- **THEN** `buildSyncList()` is called with current line items and catalog
- **AND** if items are found, `showSyncPopup` is set to true
- **AND** quotation status remains unchanged until popup resolves

#### Scenario: SENT with no sync items updates silently
- **GIVEN** all line items are empty or already match catalog
- **WHEN** user changes status to SENT
- **THEN** `buildSyncList()` returns empty array
- **AND** `setStatus('SENT')` is called immediately
- **AND** a success toast is shown

### Requirement: Sync popup state management
`App.vue` MUST add reactive state:
- `showSyncPopup: Ref<boolean>` — controls CatalogSyncPopup visibility
- `pendingSyncItems: Ref<CatalogSyncItem[]>` — holds the sync items while popup is open
- Import `useCatalogSync` and `CatalogSyncPopup`

#### Scenario: State tracks popup lifecycle
- **WHEN** status changes to SENT with items
- **THEN** `pendingSyncItems` is set to the build result
- **AND** `showSyncPopup` is set to true
- **WHEN** popup emits close
- **THEN** `showSyncPopup` is set to false
- **AND** `pendingSyncItems` is cleared

### Requirement: Sync popup event handlers
`App.vue` MUST implement handlers for CatalogSyncPopup events:

1. **save-selected**: Receives the checked items, calls `catalogSync.applySyncItems(checkedItems)`, calls `setStatus('SENT')`, shows toast with count, closes popup
2. **save-all**: Calls `catalogSync.applySyncItems(allItems)`, calls `setStatus('SENT')`, shows toast, closes popup
3. **skip/close**: Calls `setStatus('SENT')`, shows toast "Status updated to SENT, catalog unchanged", closes popup

All three handlers MUST:
- Call `setStatus('SENT')` to finalize the status
- Close the popup (`showSyncPopup = false`)

#### Scenario: Save Selected updates status and catalog
- **GIVEN** popup is open with 2 checked items
- **WHEN** user clicks "Save Selected (2)"
- **THEN** `applySyncItems` is called with those 2 items
- **AND** `setStatus('SENT')` is called
- **AND** toast shows "2 items saved to catalog ✓"
- **AND** popup closes

#### Scenario: Skip updates status without catalog changes
- **GIVEN** popup is open
- **WHEN** user clicks Skip
- **THEN** `setStatus('SENT')` is called
- **AND** no catalog changes are made
- **AND** toast shows "Status updated to SENT, catalog unchanged"
- **AND** popup closes

### Requirement: CatalogSyncPopup renders conditionally
`App.vue` MUST render `CatalogSyncPopup` bound to the state, passing the required props and event handlers.

#### Scenario: Popup renders with correct props
- **GIVEN** `showSyncPopup = true` and `pendingSyncItems` has data
- **WHEN** App.vue renders
- **THEN** `CatalogSyncPopup` is rendered with the sync items, quotation number, and client name

#### Scenario: Popup hidden when not shown
- **GIVEN** `showSyncPopup = false`
- **WHEN** App.vue renders
- **THEN** `CatalogSyncPopup` is not rendered
