# App Modal

## Purpose

Provides a reusable modal dialog shell used by CatalogSyncPopup and (future) unsaved-changes confirmation. Handles backdrop overlay, teleport to body, Escape key close, and scale-in animation — matching `docs/example-v2.html` `.modal-ov` / `.modal` pattern.

## ADDED Requirements

### Requirement: Modal renders as teleported overlay
`AppModal` MUST render its content inside a `<div>` teleported to `<body>` using Vue's `<Teleport>`. The modal MUST consist of:
- A backdrop overlay (`position: fixed; inset: 0; z-index: 400`) with semi-transparent background and `backdrop-filter: blur(6px)`
- A centered card inside the overlay with max-width 440px, rounded corners, box-shadow, and scale-in animation

#### Scenario: Modal renders when open
- **GIVEN** `AppModal` with `open={true}`
- **WHEN** the component renders
- **THEN** the backdrop overlay is visible with centered card content
- **AND** the overlay is teleported to `<body>` (not nested in parent's DOM)

#### Scenario: Modal is hidden when closed
- **GIVEN** `AppModal` with `open={false}`
- **WHEN** the component renders
- **THEN** no overlay or backdrop is rendered

### Requirement: Modal emits close on Escape
When the modal is open and the user presses the Escape key, the modal MUST emit a `close` event.

#### Scenario: Escape key closes modal
- **GIVEN** the modal is open
- **WHEN** the user presses Escape
- **THEN** the modal emits a `close` event

### Requirement: Modal supports closable prop for backdrop click
`AppModal` MUST accept an optional `closable` prop (boolean, default `true`). When `true`, clicking the backdrop overlay emits `close`. When `false`, backdrop clicks are ignored.

#### Scenario: Backdrop click closes when closable
- **GIVEN** the modal is open with `closable={true}`
- **WHEN** the user clicks the backdrop overlay (not the card)
- **THEN** the modal emits a `close` event

#### Scenario: Backdrop click ignored when not closable
- **GIVEN** the modal is open with `closable={false}`
- **WHEN** the user clicks the backdrop overlay
- **THEN** no event is emitted

### Requirement: Modal renders header with title and subtitle
`AppModal` MUST accept `title` (string) and `subtitle` (string, optional) props. When provided, they render in a `.modal-hdr` div at the top of the card:
- Title: `font-family: var(--font-serif); font-size: 21px`
- Subtitle: `font-family: var(--font-mono); font-size: 10px; color: var(--text-muted)`

#### Scenario: Header renders with title and subtitle
- **GIVEN** `AppModal` with `title="Save to Catalog?"` and `subtitle="Review items from QUO-001"`
- **WHEN** the modal renders
- **THEN** the header shows both title and subtitle text with correct styling

### Requirement: Modal renders default slot as body
The modal's body section MUST render the `default` slot content inside a `.modal-body` div with padding and scroll overflow.

#### Scenario: Default slot renders in body
- **GIVEN** `AppModal` with slot content `<div class="test">Content</div>`
- **WHEN** the modal renders
- **THEN** the content appears inside `.modal-body`

### Requirement: Modal renders footer slot
`AppModal` MUST render a `footer` named slot inside a `.modal-ftr` div with flex layout, border-top separator, and padding.

#### Scenario: Footer slot renders actions
- **GIVEN** `AppModal` with footer slot containing buttons
- **WHEN** the modal renders
- **THEN** the buttons appear in `.modal-ftr`

### Requirement: Modal animates in with scale transform
When the modal opens, the card MUST animate in using a CSS `@keyframes mIn` animation: `opacity: 0; transform: scale(0.95)` → `opacity: 1; transform: scale(1)` over 220ms with ease easing.

#### Scenario: Card scales in on open
- **GIVEN** the modal transitions from closed to open
- **WHEN** the card appears
- **THEN** it animates from 0.95 scale to 1.0 scale over 220ms

### Requirement: Modal styles match example-v2.html
The modal MUST use CSS classes matching `docs/example-v2.html`:
- `.modal-ov` — overlay (display:flex, align-items:center, justify-content:center when open)
- `.modal` — card (max-width:440px, width:94%, border-radius:var(--r-lg))
- `.modal-hdr` — header section
- `.modal-title` — title text
- `.modal-sub` — subtitle text
- `.modal-body` — scrollable body content
- `.modal-ftr` — footer with actions

#### Scenario: CSS classes match reference
- **WHEN** inspecting the rendered modal
- **THEN** all class names match `docs/example-v2.html` exactly

### Requirement: Modal card has max-height with scroll
The modal card MUST have `max-height: 90vh` and `display: flex; flex-direction: column` to prevent overflow on long content. `.modal-body` MUST have `overflow-y: auto` and `flex: 1`.

#### Scenario: Long content scrolls
- **GIVEN** body content taller than 90vh
- **WHEN** the modal renders
- **THEN** the body section shows a scrollbar while header and footer remain fixed
