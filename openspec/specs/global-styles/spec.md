# Global Styles

## Purpose

Define base-level CSS reset, element defaults, and font smoothing to ensure consistent rendering across browsers.

## Requirements

### Requirement: CSS reset applied
`global.css` MUST set `box-sizing: border-box`, zero margin/padding, and `font-size: 16px` on html.

#### Scenario: Reset active
- **WHEN** the app loads
- **THEN** no browser default margins affect layout

### Requirement: Base element styles set
`global.css` SHALL set body to `--font-sans` with cream background, headings to `--font-serif`, and code to `--font-mono`.

#### Scenario: Base styles render
- **WHEN** the page renders
- **THEN** body background is cream (#F5F0E8), headers use serif font

### Requirement: Font smoothing enabled
The html element MUST set `-webkit-font-smoothing: antialiased` and `-moz-osx-font-smoothing: grayscale`.

#### Scenario: Smooth fonts
- **WHEN** text renders in a WebKit browser
- **THEN** subpixel antialiasing is disabled
