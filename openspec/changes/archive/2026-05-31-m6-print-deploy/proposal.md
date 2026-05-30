## Why

The quotation generator has a fully functional form, catalog, templates, and history — but users can't print quotations to PDF and the app isn't deployed anywhere. These are the final two blockers preventing real-world use. M6 closes the loop: users get a printable PDF quotation and a live URL to access the tool.

## What Changes

- Implement `usePrint` composable with `triggerPrint()` to invoke `window.print()` with A4-optimized print CSS
- Wire the existing "PDF" button in the preview toolbar to call `triggerPrint()` instead of showing a "coming soon" placeholder
- Load `print.css` (already written but not imported) so `@media print` rules fire in the browser
- Add `@media print` blocks to TemplateBold and TemplateSidebar (the only two templates missing them) for consistent print rendering across all 5 templates
- Create `public/_redirects` with SPA fallback rule (`/* /index.html 200`) for Cloudflare Pages
- Verify print output across Chrome and Firefox on all 5 templates, including long-quotation page-break behavior
- Deploy to Cloudflare Pages and verify localStorage persistence on the production domain

## Capabilities

### New Capabilities

- `print-export`: Trigger browser print with A4-optimized CSS. Hides UI chrome (sidebar, template switcher, status bar, action buttons) and renders the selected template cleanly on A4 paper. All 5 templates must print correctly with status badge, logo, line items, and totals intact.
- `cloudflare-deploy`: Production deployment to Cloudflare Pages. Includes SPA redirect configuration (`_redirects`), build verification, and post-deploy testing of localStorage persistence.

### Modified Capabilities

_None._ Existing spec requirements are unchanged. The `preview-templates` spec already requires print support — the missing `@media print` blocks in Bold and Sidebar are an implementation gap, not a spec change.

## Impact

- **Files modified**: `src/composables/usePrint.ts` (stub → implementation), `src/App.vue` (wire PDF button), `src/main.ts` (import print.css), `src/components/preview/templates/TemplateBold.vue` (add @media print block), `src/components/preview/templates/TemplateSidebar.vue` (add @media print block)
- **Files created**: `public/_redirects`
- **Existing file (no changes needed)**: `src/styles/print.css` — already contains correct `@media print` rules, just needs to be loaded
- **Dependencies**: None. Zero new npm packages.
- **Deployment**: GitHub push → Cloudflare Pages connect → production URL
