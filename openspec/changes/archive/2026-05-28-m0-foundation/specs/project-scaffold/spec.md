## ADDED Requirements

### Requirement: Project scaffolds with Vite + Vue 3 + TypeScript
The project SHALL initialize using `npm create vite@latest . -- --template vue-ts` producing a working dev server.

#### Scenario: Scaffold succeeds
- **WHEN** the scaffold command runs in the project root
- **THEN** package.json, vite.config.ts, tsconfig files, index.html, and src/ are generated
- **THEN** `npm run dev` boots a local dev server with the default Vue welcome page

### Requirement: Dependencies are installed
The project MUST install `uuid` and `date-fns` as runtime deps, and `@types/uuid`, `vitest`, `jsdom` as dev deps.

#### Scenario: Dependencies available
- **WHEN** `npm install` completes
- **THEN** `uuid` and `date-fns` are importable
- **THEN** `npm test` executes vitest

### Requirement: Google Fonts are linked
The `index.html` SHALL include `<link>` tags for DM Serif Display, DM Sans, and DM Mono from Google Fonts.

#### Scenario: Fonts load
- **WHEN** the browser loads the app
- **THEN** all three font families are available via CSS

### Requirement: .gitignore is verified
The `.gitignore` MUST cover `node_modules/`, `dist/`, and `*.local`. Missing entries SHALL be appended.

#### Scenario: Gitignore complete
- **WHEN** the scaffold finishes
- **THEN** `node_modules/` and `dist/` are listed in .gitignore
