## 1. Project Scaffold & Configuration

- [x] 1.1 Pre-scaffold safety check: verify all docs committed (`git status`)
- [x] 1.2 Scaffold Vite + Vue 3 + TypeScript (`npm create vite@latest . -- --template vue-ts`)
- [x] 1.3 Install runtime deps: `npm install uuid date-fns`
- [x] 1.4 Install dev deps: `npm install -D @types/uuid vitest jsdom`
- [x] 1.5 Verify `vue-tsc` in devDependencies; install if missing
- [x] 1.6 Add Google Fonts `<link>` tags to `index.html` (DM Serif Display, DM Sans, DM Mono)
- [x] 1.7 Verify `.gitignore` covers `node_modules/`, `dist/`, `*.local`; append if missing
- [x] 1.8 Confirm: `npm run dev` boots Vite welcome page
- [x] 1.9 Confirm: `npm run build` succeeds with zero errors

## 2. Folder Structure & Stub Files

- [x] 2.1 Delete scaffolded `src/components/HelloWorld.vue` and `src/style.css`
- [x] 2.2 Create `src/components/sidebar/` with 8 stub SFCs (SidebarShell, LogoUpload, PartyFields, MetaFields, LineItemsTable, TotalsFields, NotesField, StatusSelector)
- [x] 2.3 Create `src/components/catalog/` with 5 stub SFCs (CatalogPanel, CatalogItem, CatalogEditDrawer, CatalogSearch, CatalogSyncPopup)
- [x] 2.4 Create `src/components/preview/` with 3 stub SFCs + `templates/` with 5 stub SFCs (Classic, Minimal, Bold, Sidebar, Friendly)
- [x] 2.5 Create `src/components/shared/` with 4 stub SFCs (AppButton, AppToast, AppModal, ActionBar)
- [x] 2.6 Create `src/components/HistoryPanel.vue` stub
- [x] 2.7 Create `src/composables/` with 11 stub `.ts` files, each exporting at least one function
- [x] 2.8 Create `src/utils/` with 6 stub `.ts` files (calculations, defaults, formatCurrency, generateFilename, fuzzyMatch, localStorage)
- [x] 2.9 Create `src/styles/` with 3 starter CSS files (tokens.css, global.css, print.css)

## 3. TypeScript Types

- [x] 3.1 Implement `src/types/quotation.ts`: union types (QuotationStatus, TemplateId, CurrencyCode, ChangeType, LogoPosition)
- [x] 3.2 Define Party, QuotationLogo, LineItem, QuotationTotals, QuotationMeta interfaces
- [x] 3.3 Define QuotationData interface matching PRD schema
- [x] 3.4 Define CatalogEntry, PriceHistoryEntry, CatalogSyncItem interfaces
- [x] 3.5 Define WorkspaceBackup interface
- [x] 3.6 Define STORAGE_KEYS constant with bare (unprefixed) values: history, catalog, catalog_meta
- [x] 3.7 Confirm: zero TypeScript errors when types file is compiled

## 4. CSS Design Tokens

- [x] 4.1 Implement `src/styles/tokens.css`: base colors (cream, white, ink)
- [x] 4.2 Add text colors (primary, secondary, muted) and accent rust colors
- [x] 4.3 Add border colors, status colors (draft, sent, accepted, rejected)
- [x] 4.4 Add typography tokens (font-serif, font-sans, font-mono)
- [x] 4.5 Add font-size scale, spacing scale, border-radius, shadow, layout, and transition tokens
- [x] 4.6 Confirm: all color tokens match docs/example-v2.html (navy/sky/blue palette)

## 5. Global Base Styles

- [x] 5.1 Implement `src/styles/global.css`: CSS reset with `@import './tokens.css'`
- [x] 5.2 Set font smoothing and base font-size (16px) on html
- [x] 5.3 Set body styles: font-sans, cream background, min-height 100vh
- [x] 5.4 Set heading (serif), code (mono), link (rust), input/button (inherit) base styles
- [x] 5.5 Confirm: browser renders sky background and correct font stack

## 6. LocalStorage Utility

- [x] 6.1 Implement `src/utils/localStorage.ts`: `quotify_` prefix constant and `prefixed()` helper
- [x] 6.2 Implement `storage.get<T>(key)` — JSON parse, return null on error
- [x] 6.3 Implement `storage.set<T>(key, value)` — serialize, catch QuotaExceededError
- [x] 6.4 Implement `storage.remove(key)` and `storage.clearAll()` (prefix-filtered removal)
- [x] 6.5 Implement `storage.checkAvailable()` — returns availability, usedMB, remainingMB
- [x] 6.6 Confirm: typed wrappers work, no raw localStorage calls outside this file

## 7. Test Infrastructure & localStorage Tests

- [x] 7.1 Create `vitest.config.ts` with jsdom environment
- [x] 7.2 Add `"test": "vitest run"` and `"test:watch": "vitest"` scripts to package.json
- [x] 7.3 Create `src/utils/localStorage.test.ts`: get tests (happy path, missing, corrupt JSON)
- [x] 7.4 Add set tests (round-trip, overwrite, nested objects, arrays)
- [x] 7.5 Add remove, clearAll, prefix verification, and checkAvailable tests
- [x] 7.6 Confirm: `npm test` runs and all tests pass

## 8. Main Entry & App Shell

- [x] 8.1 Update `src/main.ts` to import `./styles/global.css`
- [x] 8.2 Verify `src/vite-env.d.ts` declares `.vue` module for TypeScript
- [x] 8.3 Implement `src/App.vue`: two-column flex layout with scoped styles
- [x] 8.4 Left sidebar: 420px fixed width, var(--color-ink) background, var(--color-cream) text, overflow-y auto
- [x] 8.5 Right preview: flex 1, var(--color-cream) background, centered placeholder, overflow-y auto
- [x] 8.6 Confirm: `npm run dev` shows dark sidebar + sky preview layout in browser
- [x] 8.7 Confirm: `npx vue-tsc --noEmit` reports zero TypeScript errors

## Verification

- [x] `npm run dev` boots and shows two-column layout
- [x] `npm run build` succeeds with zero errors
- [x] `npm test` runs and all localStorage tests pass
- [x] `npx vue-tsc --noEmit` reports zero TypeScript errors
