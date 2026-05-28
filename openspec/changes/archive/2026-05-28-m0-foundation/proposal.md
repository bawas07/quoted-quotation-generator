## Why

The Quotation Generator has comprehensive documentation (PRD, design, milestones, example prototype) but zero code. Before any feature work begins, the project needs a solid foundation: Vue 3 + TypeScript scaffold, type definitions, CSS design tokens, typed localStorage layer, and a visible layout shell. This is the prerequisite for all M1–M7 feature milestones.

## What Changes

- Scaffold Vite + Vue 3 + TypeScript project into the existing repository
- **BREAKING** Define all TypeScript types (QuotationData, CatalogEntry, LineItem, etc.)
- Define CSS design tokens as custom properties (ink/cream/rust palette)
- Implement typed localStorage utility (`get/set/remove/clearAll/checkAvailable`) with `quotify_` prefix
- Create 26 Vue SFC stubs and 11 composable stubs as a living architecture map for M1–M7
- Render two-column layout shell (420px dark sidebar + cream preview panel)
- Set up vitest + jsdom and write localStorage unit tests
- Install `uuid`, `date-fns`, `vitest`, `jsdom`

## Capabilities

### New Capabilities

- `project-scaffold`: Vite + Vue 3 + TypeScript project initialization, Google Fonts, .gitignore verification
- `type-system`: TypeScript type definitions for quotation data model, catalog, sync, and workspace backup
- `design-tokens`: CSS custom properties for colors, typography, spacing, layout, shadows, transitions
- `global-styles`: CSS reset, font smoothing, base element styling
- `local-storage-layer`: Typed storage wrapper with get/set/remove/clearAll/checkAvailable, error handling
- `app-shell`: Two-column flex layout, independently scrollable sidebar and preview
- `component-stubs`: 26 Vue SFC and 11 composable stub files as architecture map
- `test-infrastructure`: Vitest + jsdom configuration, localStorage utility tests

### Modified Capabilities

*(None — greenfield project)*

## Impact

- **~60+ new files** across `src/` (components, composables, types, utils, styles), vitest config
- **Dependencies**: `uuid`, `date-fns`, `@types/uuid`, `vitest`, `jsdom`
- **No backend, no APIs, no services affected** — local-first browser app
- **No breaking changes to existing code** — project has zero code
- **Docs directory preserved** — Vite adds files alongside existing `docs/`
