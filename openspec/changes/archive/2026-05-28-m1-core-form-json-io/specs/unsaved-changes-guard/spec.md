## ADDED Requirements

### Requirement: Unsaved changes confirmation on "+ New"
When user clicks "+ New" and `isDirty` is `true`, a confirmation dialog MUST appear before resetting.

#### Scenario: Confirmation shown when dirty
- **WHEN** user clicks "+ New" while `isDirty` is `true`
- **THEN** a confirmation dialog asks whether to discard changes

#### Scenario: Discard confirmed
- **WHEN** user confirms discard in the dialog
- **THEN** `resetQuotation()` is called and state is cleared

#### Scenario: Discard cancelled
- **WHEN** user cancels in the dialog
- **THEN** current quotation state is preserved

### Requirement: No confirmation when clean
When `isDirty` is `false`, clicking "+ New" MUST reset without confirmation.

#### Scenario: Clean reset skips dialog
- **WHEN** user clicks "+ New" while `isDirty` is `false`
- **THEN** quotation resets immediately without a confirmation dialog
