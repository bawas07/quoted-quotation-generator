## 1. Print composable

- [x] 1.1 Replace `usePrint.ts` stub with working `triggerPrint()` function that calls `window.print()`. Follow the existing composable pattern: return `{ triggerPrint }` from a plain function (no `ref`/`reactive` needed — composable is stateless). Remove the `// stub` comment.

## 2. Wire PDF button

- [x] 2.1 Import `usePrint` in `src/App.vue`
- [x] 2.2 Create a `const { triggerPrint } = usePrint()` instance
- [x] 2.3 Replace `handlePdf()` body: `showToast('PDF export coming soon', 'warning')` → call `triggerPrint()`

## 3. Load print.css

- [x] 3.1 Add `import './styles/print.css'` to `src/main.ts` alongside the existing `import './styles/global.css'`

## 4. Template print blocks (Bold and Sidebar)

- [x] 4.1 Add scoped `@media print` block to `TemplateBold.vue`:
  - Reduce padding to `52px 56px` (matches Classic)
  - Preserve the rust header band and status badge with `print-color-adjust: exact; -webkit-print-color-adjust: exact`
  - Preserve table header with `print-color-adjust: exact`
  - Remove any box shadows from the template root
- [x] 4.2 Add scoped `@media print` block to `TemplateSidebar.vue`:
  - Reduce padding to `52px 56px`
  - Preserve the sidebar column background and status badge with `print-color-adjust: exact`
  - Preserve table header with `print-color-adjust: exact`
  - Remove any box shadows from the template root

## 5. Cloudflare Pages deployment

- [x] 5.1 Create `public/_redirects` with the content `/* /index.html 200`
- [x] 5.2 Run `npm run build` and verify zero TypeScript errors and successful `dist/` output
- [x] 5.3 Verify `dist/_redirects` exists and contains the SPA redirect rule
- [x] 5.4 Push to GitHub, connect repository to Cloudflare Pages with: build command `npm run build`, output directory `dist`, Node.js version 20
- [x] 5.5 After deploy, open the production URL and verify the app loads correctly

## 6. Verification

- [x] 6.1 Test print in Chrome: open app, select each of the 5 templates, click PDF button, verify print preview shows clean A4 output with status badge visible and no UI chrome
- [x] 6.2 Test print in Firefox: repeat the same check for all 5 templates
- [x] 6.3 Test long quotation page-break: create a quotation with 15+ line items, print, verify rows don't split across pages and table header repeats
- [x] 6.4 Test localStorage on production domain: add catalog items, download a quotation, refresh the page, verify both catalog and history persist
- [x] 6.5 Run `npm run build` one final time — verify zero TypeScript errors and zero console errors in the production bundle
