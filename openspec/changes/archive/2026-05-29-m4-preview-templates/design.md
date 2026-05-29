## Context

The app currently has a functional form (sidebar) and an empty preview area. Users fill in quotation data on the left and see nothing on the right. The `invoice-paper` div exists in the layout (`layout.css` has the paper styles) but contains only a comment placeholder. Template components are all stubs that render only `<slot />`. The `TemplateSwitcher` shows raw template IDs as button labels.

The example-v2.html provides complete reference implementations for all 5 templates using scoped CSS — no external template engine, no runtime template compilation. Each template is pure Vue HTML with scoped CSS, receiving `QuotationData` as a prop. The existing design tokens (`tokens.css`) and layout styles (`layout.css`) already match the example-v2.html navy/blue/sky palette.

## Goals / Non-Goals

**Goals:**
- 5 fully implemented template components that render live from reactive `QuotationData`
- Status badge visible in all 5 templates at correct positions
- Template switching with 150ms cross-fade animation
- StatusBar upgraded to show status badge dropdown on the right
- TemplateSwitcher showing display names (Classic, Minimal, Bold, Sidebar, Friendly)
- `useTemplate` composable providing cross-fade state
- Print CSS for all templates so `window.print()` produces clean A4 output
- Dynamic component rendering wired in App.vue's `invoice-paper`

**Non-Goals:**
- PDF generation beyond `window.print()` (M6)
- Template customization or theming by the user
- Mobile-responsive template layouts (M7 stretch goal)
- Template preview thumbnails in the switcher
- Animation beyond the simple CSS opacity cross-fade

## Decisions

### Decision 1: Dynamic component binding in App.vue (not PreviewPanel)

**Choice:** Wire template rendering directly in App.vue using `<component :is="currentTemplate" :quotation="quotation" />` inside the existing `invoice-paper` div.

**Why:** App.vue already owns the reactive state and the layout. PreviewPanel is a passive shell. Moving template rendering into PreviewPanel would require passing `quotation` as a prop through two layers and would duplicate layout structure. The simplest approach that works — KISS.

**Alternatives considered:**
- PreviewPanel owns rendering with `quotation` prop — more encapsulation but unnecessary indirection and prop drilling for no benefit at current scale
- Each template self-registers — over-engineered for 5 templates, adds complexity

### Decision 2: Each template is a standalone component with scoped CSS, no shared template partials

**Choice:** Each template component (TemplateClassic.vue, TemplateMinimal.vue, etc.) is self-contained with its own scoped CSS. Duplication between templates is acceptable — each template has unique layout, colors, and structure.

**Why:** The templates share no visual DNA. Classic is ruled-table corporate, Minimal is whitespace-heavy editorial, Bold is high-contrast bands, Sidebar is two-column, Friendly is rounded cards. Extracting shared partials would create an abstraction that doesn't map to actual reuse patterns. Each template is ~100-200 lines of CSS and ~50-100 lines of template HTML — well within single-file component limits.

**YAGNI check:** If a 6th template is added later, it copies the pattern. No shared abstraction needed until 3+ templates share the same layout element.

### Decision 3: Cross-fade via CSS class toggle, not JS animation library

**Choice:** The `useTemplate` composable exposes an `isSwitching` ref. When triggered, the `invoice-paper` div gets a `.switching` class that sets `opacity: 0`. After 150ms (matching the CSS transition duration), the class is removed. The component switch happens during the fade-out, and the fade-in is just the opacity transition back to 1.

**Why:** Zero dependencies, matches the example-v2.html approach exactly, the cross-fade is purely cosmetic and doesn't need sequencing beyond the CSS transition.

### Decision 4: Each template receives the full QuotationData as a single prop

**Choice:** Single `quotation: QuotationData` prop per template component. No granular props.

**Why:** Templates need access to all fields (parties, meta, line items, totals, notes, logo, status). Passing individual props would create 15+ props per component. A single typed prop is cleaner, and TypeScript catches any property access issues at compile time.

### Decision 5: Status badge rendered by each template, not by a shared sub-component

**Choice:** Each template includes its own status badge HTML inline, styled with scoped CSS classes (`.tpl-status`, `.tpl-status.draft`, etc.).

**Why:** Each template positions the badge differently (top-right, meta row, header band, sidebar, info strip). A shared badge component would need positioning props or slots, adding complexity. Inline HTML is 4 lines per template — cheaper than the abstraction.

## Risks / Trade-offs

- **Risk: Template inconsistency** — 5 templates means 5 independent implementations that could drift in behavior. **Mitigation:** Each template maps to the same `QuotationData` prop shape. TypeScript enforces interface compliance. The shared acceptance criteria in tasks.md ensure uniform coverage.
- **Risk: CSS bloat** — Scoped CSS per template duplicates some base styles (table reset, font sizing). **Mitigation:** Acceptable — duplication is in the tens of lines, not hundreds. Template CSS is scoped so it doesn't leak. CSS will be <20KB total for all 5 templates.
- **Trade-off: No partial extraction** — If a 6th template repeats patterns from an existing one, some CSS will be duplicated. **Mitigation:** Cross that bridge when there are 3+ shared patterns. Premature extraction is worse.
- **Risk: Print styles missed per template** — Some templates may not print correctly. **Mitigation:** A shared `@media print` block in `print.css` hides chrome (sidebar, toolbar). Per-template print refinements go in each component's scoped styles.
