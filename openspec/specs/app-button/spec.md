# App Button

## Purpose

A reusable button component with variant and size support, used throughout the sidebar and action bar.

## Requirements

### Requirement: Variant-based button component
`AppButton` MUST support `primary`, `secondary`, and `ghost` variants with distinct visual styling.

#### Scenario: Primary variant renders
- **WHEN** an `AppButton` with `variant="primary"` renders
- **THEN** it has the primary button styling

#### Scenario: Secondary variant renders
- **WHEN** an `AppButton` with `variant="secondary"` renders
- **THEN** it has the secondary button styling

#### Scenario: Ghost variant renders
- **WHEN** an `AppButton` with `variant="ghost"` renders
- **THEN** it has the ghost button styling

### Requirement: Small size support
`AppButton` MUST support a `size="small"` prop for compact layouts.

#### Scenario: Small button renders
- **WHEN** an `AppButton` with `size="small"` renders
- **THEN** it has reduced padding and font size
