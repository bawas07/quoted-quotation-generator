# Design Tokens

## Purpose

Establish a centralized set of CSS custom properties for colors, typography, spacing, and layout to ensure consistent theming across the application.

## Requirements

### Requirement: Color tokens defined
The `:root` selector SHALL define custom properties for base, text, accent, border, and status colors matching design.md §2.

#### Scenario: Color tokens resolve
- **WHEN** a CSS rule uses `var(--color-rust)`
- **THEN** the color `#C4622D` is applied

### Requirement: Typography tokens defined
The `:root` selector SHALL define `--font-serif`, `--font-sans`, `--font-mono` with DM font families and fallback stacks.

#### Scenario: Typography tokens resolve
- **WHEN** `font-family: var(--font-serif)` is used
- **THEN** text renders in DM Serif Display or the fallback

### Requirement: Spacing, radius, shadow, layout, transition tokens defined
The `:root` selector SHALL include font-size scale, spacing scale, border radii, shadows, layout dimensions, and transition durations.

#### Scenario: Layout token used
- **WHEN** sidebar width is `var(--sidebar-width)`
- **THEN** the sidebar measures 420px
