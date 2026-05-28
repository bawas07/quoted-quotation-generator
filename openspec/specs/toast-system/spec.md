# Toast System

## Purpose

Provides a lightweight notification system with auto-dismiss, used across the app for success, warning, and error messages.

## Requirements

### Requirement: Reactive toast array
`useToast` MUST export a reactive `toasts` array and a `showToast(message: string, type: 'success' | 'warning' | 'error')` function.

#### Scenario: Toast is added
- **WHEN** `showToast('Saved', 'success')` is called
- **THEN** `toasts` array contains one entry with the message `'Saved'` and type `'success'`

### Requirement: Auto-dismiss after 3 seconds
Toasts MUST auto-dismiss after 3 seconds and be removed from the array.

#### Scenario: Toast auto-dismisses
- **WHEN** a toast is shown
- **THEN** after 3 seconds it is removed from the `toasts` array

### Requirement: Stacked bottom-right rendering
`AppToast.vue` MUST render toasts stacked in the bottom-right corner of the viewport.

#### Scenario: Toasts stack
- **WHEN** multiple toasts are shown
- **THEN** they appear stacked vertically in the bottom-right corner
