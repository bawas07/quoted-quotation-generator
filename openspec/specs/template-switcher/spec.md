# Template Switcher

## Purpose

Provides a set of template selection pills wired to reactive state for changing the quotation's visual template.

## Requirements

### Requirement: Template selection pills
`TemplateSwitcher` MUST render 5 pill-style buttons for Classic, Minimal, Bold, Sidebar, and Friendly templates.

#### Scenario: All templates shown
- **WHEN** `TemplateSwitcher` renders
- **THEN** 5 template pills are visible: Classic, Minimal, Bold, Sidebar, and Friendly

### Requirement: Template wired to reactive state
Selecting a template MUST update `quotation.value.template` and visually indicate the active selection.

#### Scenario: Template selection updates state
- **WHEN** user clicks "Bold" pill
- **THEN** `quotation.value.template` becomes `'bold'`
- **THEN** the Bold pill is highlighted as active
