# Drafted by Bawas — Quotation Generator

> *"Never forget what you charged last time."*

A browser-based quotation generator for freelancers and small businesses. Fill in a form, see a live preview, and download your quotation as a self-contained JSON file.

**What makes this different?** A persistent **item catalog** that auto-learns from every quotation you send — so you never have to remember what you charged for "Logo Design" last March.

**Local-first.** No database. No account needed. Your data stays on your machine.

---

## Features

- **Quotation Form** — From/To fields, line items with auto-calculated totals, discount & tax, notes
- **Item Catalog** — CRUD management of your services/products with price history tracking
- **Smart Autocomplete** — Type in the description field → fuzzy search finds matching catalog items and auto-fills the price
- **Catalog Sync** — When you mark a quotation as **SENT**, review what gets saved to your catalog with full control
- **5 Templates** — Classic, Minimal, Bold, Sidebar, Friendly — same data, different skin
- **JSON Export/Import** — Download quotations as standalone `.json` files, re-upload to edit
- **Workspace Backup** — Export your entire catalog + quotation history for migration or safekeeping
- **History Panel** — Past quotations persisted in `localStorage`, click to reload
- **PDF Export** — Print as PDF (A4) via `window.print()` with print CSS
- **Status Tracking** — DRAFT → SENT → ACCEPTED → REJECTED with color-coded badges

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Vue 3 + TypeScript |
| Build | Vite 8 |
| Styling | Raw CSS with CSS custom properties (design tokens) |
| State | Vue `ref()`, `reactive()`, composables (singleton pattern) |
| Persistence | `localStorage` (`quotify_` prefix) via typed helpers |
| PDF | `window.print()` + print CSS |
| Test | Vitest + jsdom + `@vue/test-utils` |
| Deploy | Cloudflare Pages |

**Dependencies:** `uuid`, `date-fns`

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type-check
npx vue-tsc --noEmit

# Run tests
npm test

# Production build
npm run build
```

---

## Project Structure

```
src/
├── components/
│   ├── sidebar/          # Form components (editor tab)
│   │   ├── SidebarShell.vue
│   │   ├── LogoUpload.vue
│   │   ├── PartyFields.vue
│   │   ├── MetaFields.vue
│   │   ├── LineItemsTable.vue
│   │   ├── TotalsFields.vue
│   │   ├── NotesField.vue
│   │   └── StatusSelector.vue
│   ├── catalog/          # Catalog tab
│   │   ├── CatalogPanel.vue
│   │   ├── CatalogItem.vue
│   │   ├── CatalogEditDrawer.vue
│   │   ├── CatalogSearch.vue
│   │   └── CatalogSyncPopup.vue
│   ├── preview/          # Preview panel + templates
│   │   ├── PreviewPanel.vue
│   │   ├── PreviewEmpty.vue
│   │   ├── TemplateSwitcher.vue
│   │   ├── StatusBar.vue
│   │   └── templates/
│   │       ├── TemplateClassic.vue
│   │       ├── TemplateMinimal.vue
│   │       ├── TemplateBold.vue
│   │       ├── TemplateSidebar.vue
│   │       └── TemplateFriendly.vue
│   ├── shared/           # Reusable UI
│   │   ├── AppButton.vue
│   │   ├── AppToast.vue
│   │   ├── AppModal.vue
│   │   └── ActionBar.vue
│   └── HistoryPanel.vue
├── composables/          # Vue composables (singleton pattern)
│   ├── useQuotation.ts   # Core quotation state & computed totals
│   ├── useCatalog.ts     # Catalog CRUD + localStorage persistence
│   ├── useAutocomplete.ts # Fuzzy autocomplete for line items
│   ├── useJsonIO.ts      # Export/import quotation JSON
│   ├── useLogoUpload.ts  # Logo drag-and-drop + base64
│   ├── useToast.ts       # Toast notifications
│   ├── useHistory.ts     # History persistence (stub)
│   ├── useCatalogSync.ts # Sync popup logic (stub)
│   ├── useTemplate.ts    # Template switching (stub)
│   ├── usePrint.ts       # PDF print (stub)
│   └── useWorkspaceIO.ts # Workspace backup (stub)
├── types/
│   └── quotation.ts      # All TypeScript type definitions
├── utils/                # Pure utility functions (zero Vue imports)
│   ├── index.ts          # Barrel export
│   ├── calculations.ts   # subtotal, discount, tax, total
│   ├── defaults.ts       # createEmptyQuotation() factory
│   ├── formatCurrency.ts # Locale-aware currency formatting
│   ├── generateFilename.ts # QUO-001_ClientName_date.json
│   ├── fuzzyMatch.ts     # Fuzzy search for autocomplete
│   └── localStorage.ts   # Typed get/set/remove helpers
├── styles/
│   ├── tokens.css        # Design tokens (colors, typography, spacing)
│   ├── global.css        # Reset & base styles
│   ├── layout.css        # App grid, sidebar, preview layout
│   └── print.css         # Print/PDF styles
├── App.vue               # Root — two-column layout
└── main.ts               # Entry point
```

---

## Data Flow

```
User fills form
     ↓
Live preview updates (80ms debounce)
     ↓
User changes status → SENT
     ↓
Catalog Sync Popup appears (review items)
     ↓
User confirms → items saved to catalog (localStorage)
     ↓
User downloads quotation JSON (self-contained, includes logo)
     ↓
Quotation added to history (localStorage, logo stripped)
```

### Two export types:

| Export | File | Contains | Use case |
|--------|------|----------|----------|
| **Quotation JSON** | `QUO-001_ClientName_2026-05-19.json` | Single quotation + logo (base64) | Archive, share, re-edit |
| **Workspace Backup** | `workspace_backup_2026-05-19.json` | Catalog + all history (no logos) | Migrate browser, backup everything |

---

## Build Phases (Milestones)

| # | Name | Status | Tests |
|---|------|--------|-------|
| M0 | Foundation — scaffold, types, design tokens, localStorage lib, layout shell | ✅ Complete | 10 |
| M1 | Core Form + JSON IO — working form, export/import | ✅ Complete | 78 |
| M2 | Catalog — CRUD, persistence, autocomplete | ✅ Complete | 28 |
| M3 | Catalog Sync Popup — status trigger, fuzzy match (stubbed) | 🚧 In Progress | — |
| M4 | Preview + Templates — live preview, 5 templates, status badge (stubbed) | 🚧 In Progress | — |
| M5 | History + Workspace IO — localStorage history, backup/restore (stubbed) | 🚧 In Progress | — |
| M6 | Print + Deploy — PDF, Cloudflare Pages | 📋 Planned | — |
| M7 | Stretch Goals — mobile layout, tags, PWA, i18n | 🔮 Future | — |

**Total: 121 tests · 9 test files · all passing**

---

## Roadmap

**V1 is free and local-first.** No database, no auth, no infra cost.

The current focus is completing M3–M5 (catalog sync, preview templates, history) to reach a shippable V1. See [`docs/milestone.md`](docs/milestone.md) for the full task breakdown.

A natural upgrade path is cloud sync for users who hit localStorage limits or switch devices. See [`docs/PRD.md`](docs/PRD.md) for the broader vision.

---

## Design Language

Ink, cream, rust palette. DM type family (DM Serif Display + DM Sans + DM Mono). See [`docs/design.md`](docs/design.md) for the full design system.

---

## Documentation

- [`docs/PRD.md`](docs/PRD.md) — Full product requirements
- [`docs/design.md`](docs/design.md) — Visual design & components
- [`docs/milestone.md`](docs/milestone.md) — Build phases & tasks
- [`docs/example-v2.html`](docs/example-v2.html) — Working vanilla JS prototype

---

## License

MIT
