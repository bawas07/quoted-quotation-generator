# Cloudflare Deploy

## Purpose

Provides Cloudflare Pages deployment configuration with SPA redirects, production build verification, and localStorage functionality on the production domain.

## Requirements

### Requirement: SPA redirects are configured
The project MUST include a `public/_redirects` file with the rule `/* /index.html 200` so that Cloudflare Pages correctly routes all paths to the SPA entry point.

#### Scenario: _redirects file exists with SPA rule
- **WHEN** the project is built
- **THEN** `dist/_redirects` contains the line `/* /index.html 200`

#### Scenario: Direct URL access works on production
- **WHEN** a user navigates directly to a non-root path on the production domain
- **THEN** the app loads correctly instead of returning a 404

### Requirement: Production build succeeds
The Vite build (`npm run build`) MUST produce a valid `dist/` directory with no TypeScript errors and no console errors in the production bundle.

#### Scenario: Build completes without errors
- **WHEN** `npm run build` is executed
- **THEN** the build completes with exit code 0
- **AND** zero TypeScript errors are reported

#### Scenario: Production bundle runs without console errors
- **WHEN** the production build is loaded in a browser
- **THEN** no console errors are present

### Requirement: App is deployed to Cloudflare Pages
The application SHALL be deployed to Cloudflare Pages and accessible via a public URL. The deployment MUST serve the production build from the `dist/` directory.

#### Scenario: App loads on production URL
- **WHEN** a user visits the production URL
- **THEN** the quotation generator app loads and displays the two-column layout
- **AND** the app is interactive (form fields respond to input)

### Requirement: localStorage works on production domain
The application's localStorage-based features (catalog persistence, history persistence) SHALL function correctly on the Cloudflare Pages production domain.

#### Scenario: Catalog persists across page refresh on production
- **WHEN** a user adds items to the catalog on the production domain and refreshes the page
- **THEN** the catalog items are still present after refresh

#### Scenario: History persists across page refresh on production
- **WHEN** a user downloads a quotation on the production domain and refreshes the page
- **THEN** the quotation appears in the history tab after refresh
