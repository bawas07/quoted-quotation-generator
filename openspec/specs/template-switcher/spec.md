# Template Switcher

## Purpose

Provides a set of template selection pills wired to reactive state for changing the quotation's visual template.

## Requirements

### Requirement: Template selection pills
`TemplateSwitcher` MUST render 5 pill-style buttons with capitalized display names: Classic, Minimal, Bold, Sidebar, and Friendly.

#### Scenario: All templates shown with display names
- **WHEN** `TemplateSwitcher` renders
- **THEN** 5 template pills are visible with labels: "Classic", "Minimal", "Bold", "Sidebar", "Friendly"

### Requirement: Template wired to reactive state
Selecting a template MUST update `quotation.value.template` and visually indicate the active selection.

#### Scenario: Template selection updates state
- **WHEN** user clicks "Bold" pill
- **THEN** `quotation.value.template` becomes `'bold'`
- **THEN** the Bold pill is highlighted as active
