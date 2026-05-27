# Status Selector

## Purpose

Provides a clickable status badge that cycles through quotation statuses with distinct visual styling per state.

## Requirements

### Requirement: Status badge dropdown
`StatusSelector` MUST render a clickable badge displaying the current `QuotationStatus` (DRAFT, SENT, ACCEPTED, REJECTED) that cycles through states on click.

#### Scenario: Status cycles on click
- **WHEN** user clicks the status badge showing DRAFT
- **THEN** the status changes to SENT

#### Scenario: Status badge color matches state
- **WHEN** the status is DRAFT
- **THEN** the badge has the draft color token
- **WHEN** the status is SENT
- **THEN** the badge has the sent color token
- **WHEN** the status is ACCEPTED
- **THEN** the badge has the accepted color token
- **WHEN** the status is REJECTED
- **THEN** the badge has the rejected color token
