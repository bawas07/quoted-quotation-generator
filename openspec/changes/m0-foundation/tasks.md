## 1. Project Scaffold & Configuration

- [ ] 1.1 Pre-scaffold safety check: verify all docs committed (`git status`)
- [ ] 1.2 Scaffold Vite + Vue 3 + TypeScript (`npm create vite@latest . -- --template vue-ts`)
- [ ] 1.3 Install runtime deps: `npm install uuid date-fns`
- [ ] 1.4 Install dev deps: `npm install -D @types/uuid vitest jsdom`
- [ ] 1.5 Verify `vue-tsc` in devDependencies; install if missing
- [ ] 1.6 Add Google Fonts `<link>` tags to `index.html` (DM Serif Display, DM Sans, DM Mono)
- [ ] 1.7 Verify `.gitignore` covers `node_modules/`, `dist/`, `*.local`; append if missing
- [ ] 1.8 Confirm: `npm run dev` boots Vite welcome page
- [ ] 1.9 Confirm: `npm run build` succeeds with zero errors

## 2. Folder Structure & Stub Files

- [ ] 2.1 Delete scaffolded `src/components/HelloWorld.vue` and `src/style.css`
- [ ] 2.2 Create `src/components/sidebar/` with 8 stub SFCs (SidebarShell, LogoUpload, PartyFields, MetaFields, LineItemsTable, TotalsFields, NotesField, StatusSelector)
- [ ] 2.3 Create `src/components/catalog/` with 5 stub SFCs (CatalogPanel, CatalogItem, CatalogEditDrawer, CatalogSearch, CatalogSyncPopup)
- [ ] 2.4 Create `src/components/preview/` with 3 stub SFCs + `templates/` with 5 stub SFCs (Classic, Minimal, Bold, Sidebar, Friendly)
- [ ] 2.5 Create `src/components/shared/` with 4 stub SFCs (AppButton, AppToast, AppModal, ActionBar)
- [ ] 2.6 Create `src/components/HistoryPanel.vue` stub
- [ ] 2.7 Create `src/composables/` with 11 stub `.ts` files, each exporting at least one function
- [ ] 2.8 Create `src/utils/` with 6 stub `.ts` files (calculations, defaults, formatCurrency, generateFilename, fuzzyMatch, localStorage)
- [ ] 2.9 Create `src/styles/` with 3 starter CSS files (tokens.css, global.css, print.css)

## 3. TypeScript Types

- [ ] 3.1 Implement `src/types/quotation.ts`: union types (QuotationStatus, TemplateId, CurrencyCode, ChangeType, LogoPosition)
- [ ] 3.2 Define Party, QuotationLogo, LineItem, QuotationTotals, QuotationMeta interfaces
- [ ] 3.3 Define QuotationData interface matching PRD schema
- [ ] 3.4 Define CatalogEntry, PriceHistoryEntry, CatalogSyncItem interfaces
- [ ] 3.5 Define WorkspaceBackup interface
- [ ] 3.6 Define STORAGE_KEYS constant with bare (unprefixed) values: history, catalog, catalog_meta
- [ ] 3.7 Confirm: zero TypeScript errors when types file is compiled

## 4. CSS Design Tokens

- [ ] 4.1 Implement `src/styles/tokens.css`: base colors (cream, white, ink)
- [ ] 4.2 Add text colors (primary, secondary, muted) and accent rust colors
- [ ] 4.3 Add border colors, status colors (draft, sent, accepted, rejected)
- [ ] 4.4 Add typography tokens (font-serif, font-sans, font-mono)
- [ ] 4.5 Add font-size scale, spacing scale, border-radius, shadow, layout, and transition tokens
- [ ] 4.6 Confirm: all color tokens match design.md §2–3 exactly

## 5. Global Base Styles

- [ ] 5.1 Implement `src/styles/global.css`: CSS reset with `@import './tokens.css'`
- [ ] 5.2 Set font smoothing and base font-size (16px) on html
- [ ] 5.3 Set body styles: font-sans, cream background, min-height 100vh
- [ ] 5.4 Set heading (serif), code (mono), link (rust), input/button (inherit) base styles
- [ ] 5.5 Confirm: browser renders cream background and correct font stack

## 6. LocalStorage Utility

- [ ] 6.1 Implement `src/utils/localStorage.ts`: `quotify_` prefix constant and `prefixed()` helper
- [ ] 6.2 Implement `storage.get<T>(key)` — JSON parse, return null on error
- [ ] 6.3 Implement `storage.set<T>(key, value)` — serialize, catch QuotaExceededError
- [ ] 6.4 Implement `storage.remove(key)` and `storage.clearAll()` (prefix-filtered removal)
- [ ] 6.5 Implement `storage.checkAvailable()` — returns availability, usedMB, remainingMB
- [ ] 6.6 Confirm: typed wrappers work, no raw localStorage calls outside this file

## 7. Test Infrastructure & localStorage Tests

- [ ] 7.1 Create `vitest.config.ts` with jsdom environment
- [ ] 7.2 Add `"test": "vitest run"` and `"test:watch": "vitest"` scripts to package.json
- [ ] 7.3 Create `src/utils/localStorage.test.ts`: get tests (happy path, missing, corrupt JSON)
- [ ] 7.4 Add set tests (round-trip, overwrite, nested objects, arrays)
- [ ] 7.5 Add remove, clearAll, prefix verification, and checkAvailable tests
- [ ] 7.6 Confirm: `npm test` runs and all tests pass

## 8. Main Entry & App Shell

- [ ] 8.1 Update `src/main.ts` to import `./styles/global.css`
- [ ] 8.2 Verify `src/vite-env.d.ts` declares `.vue` module for TypeScript
- [ ] 8.3 Implement `src/App.vue`: two-column flex layout with scoped styles
- [ ] 8.4 Left sidebar: 420px fixed width, var(--color-ink) background, var(--color-cream) text, overflow-y auto
- [ ] 8.5 Right preview: flex 1, var(--color-cream) background, centered placeholder, overflow-y auto
- [ ] 8.6 Confirm: `npm run dev` shows dark sidebar + cream preview layout in browser
- [ ] 8.7 Confirm: `npx vue-tsc --noEmit` reports zero TypeScript errors

## Verification

- [ ] `npm run dev` boots and shows two-column layout
- [ ] `npm run build` succeeds with zero errors
- [ ] `npm test` runs and all localStorage tests pass
- [ ] `npx vue-tsc --noEmit` reports zero TypeScript errors
