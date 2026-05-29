# Preview Panel

## Purpose

Provides the preview container with cross-fade animation on template switch and scrollable A4-proportioned paper view.

## Requirements

### Requirement: Dynamic template rendering
The preview area MUST dynamically render the active template component based on `quotation.template`, passing `quotation` as a prop.

#### Scenario: Renders active template
- **WHEN** `quotation.template` is `'classic'`
- **THEN** `TemplateClassic` component is rendered with the current `quotation` data

#### Scenario: Template switches on change
- **WHEN** `quotation.template` changes from `'classic'` to `'bold'`
- **THEN** `TemplateClassic` is replaced by `TemplateBold` in the DOM

### Requirement: 150ms cross-fade on template switch
When the template switches, the preview MUST fade out (opacity 0), swap the component, then fade in (opacity 1), with a 150ms CSS transition.

#### Scenario: Cross-fade animation plays
- **WHEN** template switches from Classic to Bold
- **THEN** the `.invoice-paper` container adds a `.switching` class with `opacity: 0` and `transition: opacity 150ms`
- **THEN** after 150ms, `.switching` class is removed, restoring `opacity: 1`

### Requirement: Scrollable preview panel
The preview area MUST scroll independently from the sidebar when the template content exceeds viewport height.

#### Scenario: Preview scrolls independently
- **WHEN** the template content is taller than the viewport
- **THEN** the `.preview-scroll` container shows a vertical scrollbar
- **THEN** scrolling in the preview does not affect the sidebar position
