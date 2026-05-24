## Context

Greenfield Vue 3 + TypeScript browser app for freelancers. No backend, no database, no auth. All data in localStorage or exported JSON. M0 establishes the skeleton before any feature work.

**Current state:** Zero code. Only `docs/` directory with PRD, design spec, milestones, and an example.html prototype.

## Goals / Non-Goals

**Goals:**
- Scaffold Vite + Vue 3 + TypeScript project
- Define all TypeScript types matching the PRD data model
- Implement CSS design tokens as `:root` custom properties
- Create typed localStorage wrapper used by the entire app
- Render two-column layout (420px sidebar + flex preview)
- Zero TypeScript errors, `npm run dev` boots, `npm test` passes

**Non-Goals:**
- Form fields, line items, quotation logic (M1)
- Catalog CRUD or search (M2)
- Live preview or templates (M4)
- Print/PDF or deploy (M6)
- Vue component testing (deferred to M1)
- CSS framework — raw CSS with custom properties

## Decisions

### Scaffold into existing directory
**Choice:** `npm create vite@latest . -- --template vue-ts` in the existing repo.
**Why:** Preserves git history, keeps `docs/` adjacent to code. Vite adds files without touching existing directories. If prompted "directory not empty", answer Yes.
**Alternative:** Temp directory then move — unnecessary steps.

### Architecture freeze — stub all files in M0
**Choice:** Create 26 component + 11 composable stubs as empty shells.
**Why:** Living architecture map. M1 implementers find files by name without consulting docs. Cost is negligible.
**Alternative:** Create only M0 files, defer stubs — each milestone must re-read docs to determine file placement.

### CSS tokens over Tailwind
**Choice:** CSS custom properties on `:root`.
**Why:** Design.md already defines exact token names. No build dependency. Works naturally with Vue scoped styles. Matches sibling invoice app.
**Alternative:** Tailwind — conflicts with existing token nomenclature, adds complexity.

### localStorage prefix: `quotify_`
**Choice:** `quotify_` prefix (not the PRD's `invoicy_quo_`).
**Why:** Simpler, self-documenting. Separate app, no namespace collision risk.
**Alternative:** Match PRD exactly — more verbose, harder to read in DevTools.

### Test: vitest + jsdom only
**Choice:** No `@vue/test-utils` in M0.
**Why:** Only untestable code is the `storage` utility (pure TS, no Vue). `@vue/test-utils` deferred to M1.
**Alternative:** Pre-install now — scope creep, zero M0 usage.

### Two-column layout with fixed sidebar
**Choice:** Sidebar 420px fixed, preview `flex: 1`.
**Why:** Matches design.md spec. Form fields stable regardless of preview changes. Both columns independently scrollable.
**Alternative:** Percentage-based — breaks at narrow viewports.

## Risks / Trade-offs

**Risk:** `npm create vite` prompts interactively in non-empty directory
**Mitigation:** Document expected prompt. Pre-step: commit all docs to git.

**Risk:** TypeScript errors from stub files with empty function bodies
**Mitigation:** Each stub exports at least one named function. Satisfies TS export requirements.

**Risk:** localStorage quota exceeded (unlikely in M0, possible later)
**Mitigation:** `checkAvailable()` returns metrics. Quota errors caught and logged. `clearAll()` available for reset.

**Trade-off:** 26 stub files vs deferred creation
**For:** Single source of truth. No doc consultation during M1–M7.
**Against:** Near-zero content in many files.
**Decision:** Accept clutter. Developer can fuzzy-find any file immediately.
