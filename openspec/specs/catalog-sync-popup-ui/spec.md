# Catalog Sync Popup UI

## Purpose

Provides the `CatalogSyncPopup` component — the modal review interface shown when status changes to SENT. Displays each line item with a checkbox, change type classification pill (NEW/UPDATE/SAME), price history context for UPDATEs, and action buttons. Matches `docs/example-v2.html` sync modal HTML structure and CSS classes exactly.

## Requirements

### Requirement: Popup wraps AppModal
`CatalogSyncPopup` MUST use `AppModal` as its shell. The popup controls modal open/close via an `open` prop and `close` emit.

#### Scenario: Popup renders inside AppModal
- **WHEN** `CatalogSyncPopup` renders with `open={true}`
- **THEN** an `AppModal` is rendered containing the sync content

### Requirement: Popup accepts required props
`CatalogSyncPopup` MUST accept:
- `open: boolean` — whether the modal is visible
- `items: CatalogSyncItem[]` — the sync items to display
- `quotationNumber: string` — shown in subtitle
- `clientName: string` — shown in subtitle
- `currency: CurrencyCode` — used for price formatting (default: 'IDR')

#### Scenario: Props drive modal content
- **GIVEN** `open={true}`, `items={[...]}`, `quotationNumber="QUO-001"`, `clientName="Acme Corp"`
- **WHEN** the component renders
- **THEN** modal title shows "Save to Catalog?"
- **AND** modal subtitle shows "Review items from QUO-001 · Acme Corp"

### Requirement: Emits for user actions
`CatalogSyncPopup` MUST emit:
- `close` — when modal should close (Escape, backdrop click, or Skip button)
- `save-selected` — when user clicks "Save Selected" button
- `save-all` — when user clicks "Save All" button

#### Scenario: Skip emits close
- **GIVEN** the popup is open
- **WHEN** user clicks the Skip button
- **THEN** `close` event is emitted

#### Scenario: Save Selected emits with checked items
- **GIVEN** the popup is open with 3 items, 2 checked
- **WHEN** user clicks "Save Selected (2)"
- **THEN** `save-selected` event is emitted

#### Scenario: Save All emits save-all
- **GIVEN** the popup is open
- **WHEN** user clicks "Save All" button
- **THEN** `save-all` event is emitted

### Requirement: Item list with checkboxes
Each sync item MUST render as a `.sync-item` row containing:
- A checkbox (`<input type="checkbox" class="sync-cb">`) — checked state bound to item's `checked` field, toggle emits local update
- A body div (`.sync-body`) with:
  - Item name (`.sync-name`) — the line item description
  - Change type pill (`.cpill`) with appropriate class: `.new`, `.update`, or `.same`
  - For UPDATE items: a history line (`.sync-hist`) showing previous price, date, and client from the matched catalog entry's last price history entry
- A price div (`.sync-price`) showing the current line item's formatted price

#### Scenario: NEW item renders with green pill
- **GIVEN** a sync item with `change_type: "NEW"`
- **WHEN** the item renders
- **THEN** it shows `● NEW` in a `.cpill.new` span with green colors

#### Scenario: UPDATE item renders with amber pill and history
- **GIVEN** a sync item with `change_type: "UPDATE"` and `match` containing `price_history`
- **WHEN** the item renders
- **THEN** it shows `▲ UPDATE` in a `.cpill.update` span with amber colors
- **AND** shows previous price, date, and client in `.sync-hist`

#### Scenario: SAME item renders with muted pill
- **GIVEN** a sync item with `change_type: "SAME"`
- **WHEN** the item renders
- **THEN** it shows `✓ SAME` in a `.cpill.same` span with muted colors

#### Scenario: Checkbox reflects checked state
- **GIVEN** a sync item with `checked: true`
- **WHEN** the item renders
- **THEN** the checkbox is checked
- **WHEN** user unchecks the checkbox
- **THEN** the item's checked state updates locally

### Requirement: Checked count updates on checkbox toggle
When user checks or unchecks an item, the button label MUST update dynamically. The "Save Selected" button MUST display the current count: `Save Selected (N)` where N is the number of checked items.

#### Scenario: Button count matches checked items
- **GIVEN** 3 items, 2 checked initially
- **WHEN** popup renders
- **THEN** button shows "Save Selected (2)"
- **WHEN** user checks the third item
- **THEN** button updates to "Save Selected (3)"

### Requirement: Action buttons in footer
The modal footer MUST contain three buttons in order:
1. **Save Selected (N)** — `.btn.btn-primary`, emits `save-selected` with the list of checked items
2. **Save All** — `.btn.btn-secondary`, emits `save-all` with all items
3. **Skip** — `.btn.btn-ghost`, emits `close`

#### Scenario: Skip emits close
- **WHEN** user clicks Skip
- **THEN** `close` event emitted

### Requirement: Empty state handling
If `items` is an empty array, the popup body MUST show a message: "No new or updated items found." styled as centered muted mono text.

#### Scenario: Empty items shows message
- **GIVEN** `items={[]}`
- **WHEN** popup renders
- **THEN** body shows "No new or updated items found." instead of an item list

### Requirement: Format prices using formatCurrency util
All price displays MUST use the `formatCurrency` utility from `src/utils/formatCurrency.ts` for consistent currency formatting.

#### Scenario: Price formatted with correct currency
- **GIVEN** price `3500000` and currency `IDR`
- **WHEN** the sync price renders
- **THEN** it shows "Rp 3.500.000" using `formatCurrency`

### Requirement: Keyboard: Escape closes
When the modal is open, pressing the Escape key MUST close the popup (handled by AppModal's built-in Escape behavior).

#### Scenario: Escape closes modal
- **GIVEN** the popup is open
- **WHEN** user presses Escape
- **THEN** `close` event is emitted

### Requirement: Styles match example-v2.html
The popup must use CSS classes matching `docs/example-v2.html` sync modal patterns:
- `.sync-item` — flex row with gap 12px, border-bottom separator
- `.sync-cb` — checkbox, accent-color var(--blue), width 14px
- `.sync-body` — flex: 1, min-width: 0
- `.sync-name` — font-size 13px, font-weight 500
- `.sync-hist` — font-mono, font-size 9px, color var(--text-muted)
- `.sync-price` — font-mono, font-size 13px, font-weight 500
- `.cpill` — inline-flex, border-radius 99px, font-size 8px, letter-spacing 1px
- `.cpill.new` — color var(--c-new), background rgba(46,125,90,0.1)
- `.cpill.update` — color var(--c-update), background rgba(176,125,42,0.1)
- `.cpill.same` — color var(--c-same), background rgba(138,159,176,0.1)

#### Scenario: Item row structure matches reference
- **WHEN** inspecting a sync item row in the rendered popup
- **THEN** the HTML structure matches `docs/example-v2.html`
