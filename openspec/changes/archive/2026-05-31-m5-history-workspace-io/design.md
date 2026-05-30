## Context

The app currently has in-memory-only quotation state and a localStorage-backed catalog. Users can create, preview, export, and import individual quotations — but there's no record of past quotations within the app. The History tab in the sidebar shows a hardcoded "No quotations yet" message. The Workspace Export/Import buttons in the Catalog footer are wired to "Coming in M5" stubs.

The app uses a module-level singleton pattern for shared state (e.g., `useCatalog.ts`). The reference implementation in `docs/example-v2.html` demonstrates the exact behavior for history persistence (lines 861–887), workspace backup (lines 931–953), and the history panel UI (lines 814–825).

All required TypeScript types (`QuotationData`, `CatalogEntry`, `WorkspaceBackup`, `STORAGE_KEYS`) are already defined in `src/types/quotation.ts`. The `localStorage` utility (`src/utils/localStorage.ts`) provides typed get/set/remove with `quoted_` prefix and quota detection.

## Goals / Non-Goals

**Goals:**
- Implement `useHistory` composable as a module-level singleton with localStorage read/write, deduplication, and history cap
- Implement `useWorkspaceIO` composable for export/import of combined catalog + history backup
- Build `HistoryPanel.vue` component matching the design in `docs/design.md` §5.6 and `docs/example-v2.html`
- Wire history auto-save into the existing JSON export and import flows in `App.vue`
- Wire the History tab and workspace buttons into `App.vue`
- Auto-increment quotation numbers from history count

**Non-Goals:**
- Cloud sync or multi-device history
- History search or filtering (beyond what the simple list provides)
- Undo/delete individual history entries (only clear-all via workspace management)
- History export as standalone file (workspace backup covers this)
- Converting quotations to invoices (that's V2)

## Decisions

### 1. Module-level singleton for `useHistory`

**Choice:** `useHistory` follows the same module-level singleton pattern as `useCatalog`. The state (`history: Ref<QuotationData[]>`) is declared at module scope, loaded from localStorage on first access, and all mutations write through immediately.

**Why:** Multiple consumers need the same history store — App.vue (for wiring auto-save and history tab), useWorkspaceIO (for export/import), and the HistoryPanel component. A provide/inject pattern would add unnecessary complexity for a client-only app with exactly one history store.

**Alternative considered:** Per-component composable with provide/inject. Rejected because App.vue handlers (handleDownload, handleImportFile) and CatalogPanel workspace buttons all need to call the same history operations.

### 2. History entry shape: `QuotationData` with a `_hadLogo` flag

**Choice:** Each history entry is a `QuotationData` object with `logo: null` (base64 stripped) and an additional `_hadLogo?: boolean` field set to `true` when the original quotation had a logo. This field is non-standard metadata only present in history storage — it's silently dropped on export/import.

**Why:** The milestone spec requires showing a 📎 icon if the original quotation had a logo. Since logos are stripped from history entries, we need a lightweight way to signal "this entry originally had a logo." Adding `_hadLogo` is simpler than storing a sentinel logo object or checking for the absence of other fields.

**Alternative considered:** Store `logo: { data: "", name: "logo.png" }`. Rejected because it's semantically misleading and would confuse code that checks `quotation.logo?.data` for truthiness.

### 3. Auto-increment via optional parameter on `createEmptyQuotation`

**Choice:** `createEmptyQuotation()` gains an optional `nextNumber?: number` parameter. When provided, it uses that number for the quotation number; when omitted, it defaults to 1 (QUO-001). The caller (`App.vue` or initialization logic) computes the next number from history.

**Why:** Keeps `defaults.ts` pure — it's a factory function that shouldn't have knowledge of localStorage or history state. The caller is responsible for determining context (which history to scan).

**Alternative considered:** Having `createEmptyQuotation()` import `useHistory` directly. Rejected because `defaults.ts` is a utility, not a composable, and shouldn't have Vue/lifecycle dependencies. It would also create a circular dependency risk.

### 4. Workspace import conflict resolution: latest `updated_at` wins

**Choice:** For catalog items, match by normalized name (using the existing `normalize()` from `fuzzyMatch.ts`). For history entries, match by `meta.quotation_number`. In both cases, if the imported entry has a later `updated_at`, it replaces the existing one.

**Why:** Matches the reference implementation (`example-v2.html` lines 942–953) and the PRD §6.6. The user exporting from their main browser and importing into a new one expects the newer data to survive.

**Alternative considered:** Prompting the user for each conflict. Rejected because workspace backups typically have dozens of entries — a per-item confirmation dialog would be terrible UX. The "latest wins" approach is the documented behavior in the PRD and the user can always re-export from the source browser if needed.

### 5. History cap: 50 entries, oldest dropped

**Choice:** When `addToHistory` is called and history exceeds 50 entries, the oldest entries are dropped from the tail (history is stored newest-first via `unshift`).

**Why:** Matches the reference implementation (`example-v2.html` line 865). localStorage has a 5–10MB quota across browsers, and base64-stripped quotation JSON objects are roughly 1–5KB each. 50 entries is well within safe bounds while providing enough history for practical use.

### 6. Storage full detection: reuse existing `storage.checkAvailable()`

**Choice:** Before writing to history, check `storage.checkAvailable().remainingMB`. If less than 1MB remains, show a warning toast: "Storage almost full. Export your workspace to free up space."

**Why:** The `localStorage.ts` utility already has `checkAvailable()` and `estimateRemaining()` functions. The `set()` method already catches `QuotaExceededError` and logs it. Adding a pre-emptive toast warning improves UX by alerting the user before writes start failing.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| History entries stored as full `QuotationData` objects (minus logo) could grow with many line items | 50-entry cap + logo stripping keeps total storage under ~250KB |
| Workspace import with malformed backup JSON could corrupt localStorage | Validate `schema_version` and `type` before merging; wrap in try-catch with descriptive error toast |
| `_hadLogo` field could leak into exported quotation JSON if user re-exports a loaded history entry | The field is only present in localStorage history — `useQuotation.loadQuotation()` does a JSON.parse/stringify clone that drops extra fields naturally; export uses the live quotation state, not the history entry |
| If user clears localStorage manually, history is lost with no recovery | This is expected behavior for a local-first app — workspace backup is the documented recovery path |
