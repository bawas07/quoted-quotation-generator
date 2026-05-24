# PRD — Quotation Generator
> *"Never forget what you charged last time."*
> Local-first. No database. No account needed. Built-in item catalog with price memory.

---

## 1. Overview

A browser-based quotation generator for freelancers and small businesses. Users fill in a form, see a live preview, and download their quotation as a **self-contained JSON file**. What makes this different from a generic quote tool: a **persistent item catalog** that auto-learns from every quotation saved — so users never have to remember what they charged for "Logo Design" last March.

The catalog lives in `localStorage` (survives page refresh) and can be exported/imported as a JSON file.

---

## 2. Problem Statement

Freelancers and small business owners quote the same types of work repeatedly, but:
- They forget what they charged a client 3 months ago for the same service
- They quote inconsistently — different prices for the same item across clients
- They have no central place to manage their standard rates
- Generic tools require accounts and don't let them own their data

**This app gives them a growing personal rate card** — built automatically from their own quoting history, managed through a simple CRUD interface, and stored entirely on their machine.

---

## 3. Goals

| Goal | Description |
|------|-------------|
| **Price memory** | Catalog auto-saves items from every quotation |
| **Speed** | Autocomplete from catalog = filling quotes in seconds |
| **Ownership** | All data local — localStorage + exportable JSON |
| **Consistency** | Same item, same price — no more guessing |
| **No friction** | Zero sign-up, zero backend, zero database |

---

## 4. Non-Goals

- ❌ Connected to the invoice app (v2 consideration)
- ❌ Cloud sync or multi-device
- ❌ Sending quotations via email directly
- ❌ Client approval / e-signature workflow
- ❌ Tax calculation engine (manual % input)
- ❌ Multi-currency per line item
- ❌ Team / multi-user features

---

## 5. Users

**Primary:** Freelancers — designers, developers, consultants, copywriters, photographers
**Secondary:** Small agencies issuing project quotations regularly
**Assumption:** They quote similar services repeatedly; inconsistent pricing is a real daily pain

---

## 6. Core Features

### 6.1 Quotation Form
Same structure as the invoice app, adapted for quotations:

**From (Sender)**
- Business / full name
- Address (multiline)
- Email
- Phone (optional)
- Website (optional)

**To (Client)**
- Client name / company
- Address (multiline)
- Email (optional)

**Quotation Meta**
- Quotation number (auto-suggested: `QUO-001`)
- Issue date (defaults to today)
- Valid until date (defaults to today + 14 days)
- Currency (dropdown: USD, EUR, GBP, IDR, SGD, MYR, AUD, JPY)
- Status badge: `DRAFT` | `SENT` | `ACCEPTED` | `REJECTED` (stored in JSON)

**Logo**
- Upload image → stored as base64 in JSON
- Shown in quotation preview
- Removable

**Line Items** (dynamic rows, with catalog integration)
- Description field → **triggers catalog autocomplete** as user types
- Quantity
- Unit price (auto-filled from catalog if item matched)
- Amount (auto-calculated)
- Add / remove rows

**Totals**
- Subtotal (auto)
- Discount % (optional)
- Tax % + label (optional)
- Total (auto)

**Notes / Terms**
- Free text (validity clause, payment terms, scope notes)

---

### 6.2 Item Catalog

The heart of this app. A persistent list of services/products the user has quoted before.

**Catalog Entry schema:**
```json
{
  "id": "item_abc123",
  "name": "Logo Design",
  "description": "Primary logo + 2 revisions",
  "default_price": 3500000,
  "currency": "IDR",
  "unit": "project",
  "price_history": [
    { "price": 3000000, "quoted_at": "2026-01-15", "client": "Acme Corp" },
    { "price": 3500000, "quoted_at": "2026-03-20", "client": "Beta Studio" }
  ],
  "times_quoted": 2,
  "created_at": "2026-01-15T10:00:00Z",
  "updated_at": "2026-03-20T10:00:00Z",
  "tags": ["design", "branding"]
}
```

**Auto-learn behavior:**
- When user downloads a quotation JSON → all line items are scanned
- New item descriptions → added to catalog with that price as `default_price`
- Existing item descriptions (fuzzy match) → `price_history` gets a new entry, `default_price` updates to latest price, `times_quoted` increments
- Auto-learn is non-destructive — user can always edit or delete catalog entries

**CRUD operations:**
- **Create** — add item manually from Catalog page
- **Read** — browse/search full catalog list
- **Update** — edit name, description, default price, tags
- **Delete** — remove item (with confirmation)

---

### 6.3 Autocomplete in Line Items

When user types in the item description field:
- Fuzzy search against catalog item names
- Dropdown appears with matching items: name + default price + times quoted
- User selects → description fills in + unit price auto-fills from `default_price`
- User can still override the price manually
- If no match → user types freely, item gets saved to catalog on download

**Autocomplete dropdown entry:**
```
Logo Design                    Rp 3.500.000
"Primary logo + 2 revisions"   quoted 2×
```

---

### 6.4 Quotation Templates

Same template-switching concept as the invoice app. Same data, different skin.

| Template | Vibe |
|----------|------|
| **Classic** | Clean, corporate, ruled table |
| **Minimal** | Whitespace-heavy, editorial |
| **Bold** | High contrast, rust header band |
| **Sidebar** | Left column sender info |
| **Friendly** | Rounded cards, warm palette |

Template stored in quotation JSON (`"template": "classic"`).

---

### 6.5 JSON Export (Quotation)

- "Download JSON" → saves quotation as `.json`
- Filename: `QUO-001_ClientName_2026-05-19.json`
- JSON is self-contained (logo as base64)
- Schema versioned: `"schema_version": "1.0"`
- **Does NOT trigger auto-learn** — catalog update is a separate intentional action tied to status change

**Quotation JSON structure:**
```json
{
  "schema_version": "1.0",
  "type": "quotation",
  "template": "classic",
  "status": "DRAFT",
  "meta": {
    "quotation_number": "QUO-001",
    "issue_date": "2026-05-19",
    "valid_until": "2026-06-02",
    "currency": "IDR"
  },
  "from": {
    "name": "Jane Doe",
    "address": "123 Main St, Jakarta",
    "email": "jane@example.com",
    "phone": "+62 812 0000 0000",
    "website": "janedoe.com"
  },
  "to": {
    "name": "Acme Corp",
    "address": "456 Business Ave",
    "email": "procurement@acme.com"
  },
  "logo": {
    "data": "data:image/png;base64,...",
    "position": "left"
  },
  "line_items": [
    {
      "id": "item_1",
      "description": "Logo Design",
      "quantity": 1,
      "unit_price": 3500000,
      "amount": 3500000
    }
  ],
  "totals": {
    "subtotal": 3500000,
    "discount_percent": 0,
    "discount_amount": 0,
    "tax_percent": 11,
    "tax_label": "PPN",
    "tax_amount": 385000,
    "total": 3885000
  },
  "notes": "Quotation valid for 14 days. 50% down payment upon acceptance.",
  "created_at": "2026-05-19T10:00:00Z",
  "updated_at": "2026-05-19T10:00:00Z"
}
```

---

### 6.6 Workspace Backup — Export & Import

A single backup file covering everything in localStorage: the item catalog **and** the full quotation history (logos stripped). This is the user's safety net if they switch browsers, clear storage, or move to a new device.

**Export:**
- "Export Workspace" button → `workspace_backup_2026-05-19.json`
- Contains catalog + history, no base64 logo data

**Import:**
- "Import Workspace" → merges catalog (no duplicates by name) + restores history
- Conflict resolution: latest `updated_at` wins for catalog items

**Workspace backup JSON structure:**
```json
{
  "schema_version": "1.0",
  "type": "workspace_backup",
  "exported_at": "2026-05-19T10:00:00Z",
  "catalog": [
    {
      "id": "item_abc123",
      "name": "Logo Design",
      "default_price": 3500000,
      "currency": "IDR",
      "price_history": [
        { "price": 3000000, "quoted_at": "2026-01-15", "client": "Acme Corp" },
        { "price": 3500000, "quoted_at": "2026-03-20", "client": "Beta Studio" }
      ],
      "times_quoted": 2,
      "tags": ["design", "branding"],
      "created_at": "2026-01-15T10:00:00Z",
      "updated_at": "2026-03-20T10:00:00Z"
    }
  ],
  "history": [
    {
      "schema_version": "1.0",
      "type": "quotation",
      "template": "classic",
      "status": "SENT",
      "meta": {
        "quotation_number": "QUO-001",
        "issue_date": "2026-05-19",
        "valid_until": "2026-06-02",
        "currency": "IDR"
      },
      "from": { "name": "Jane Doe", "email": "jane@example.com" },
      "to": { "name": "Acme Corp", "email": "billing@acme.com" },
      "logo": null,
      "line_items": [...],
      "totals": {...},
      "notes": "..."
    }
  ]
}
```

**Two export types, two different purposes:**

| Export | File | Contains | Use case |
|--------|------|----------|----------|
| **Quotation JSON** | `QUO-001_ClientName_2026-05-19.json` | Single quotation + logo (base64) | Archive, share, re-edit |
| **Workspace Backup** | `workspace_backup_2026-05-19.json` | Catalog + all history (no logos) | Migrate browser, backup everything |

---

### 6.7 JSON Re-upload (Resume / Edit)

- Upload previously downloaded quotation JSON
- Repopulates form + template + status
- Added to session history

---

### 6.8 History Panel

- Session-only list of quotations created or uploaded
- Each entry: quotation number · client · date · total · status badge
- Click → loads into form

---

### 6.9 Print / PDF Export

- "Download PDF" → `window.print()` with print CSS
- Sidebar and UI chrome hidden, preview panel prints as A4

---

## 7. Information Architecture

```
App
├── Sidebar (left)
│   ├── Tab: Editor
│   │   ├── Logo Upload
│   │   ├── From fields
│   │   ├── To fields
│   │   ├── Quotation Meta (number, dates, currency, status)
│   │   ├── Line Items (with catalog autocomplete)
│   │   ├── Totals
│   │   └── Notes / Terms
│   ├── Tab: History
│   │   └── Session quotation list
│   └── Tab: Catalog ← NEW vs invoice app
│       ├── Search bar
│       ├── [+ Add Item] button
│       ├── Item list (name, price, times quoted)
│       ├── Item detail / edit drawer
│       └── [Export Workspace] [Import Workspace]
│
├── Preview Panel (right)
│   ├── Template Switcher Bar
│   ├── Status Badge (DRAFT / SENT / ACCEPTED / REJECTED)
│   │   └── onChange SENT → triggers Catalog Sync Popup
│   ├── Live quotation render
│   └── Action Bar
│       ├── [Upload JSON]
│       ├── [Download JSON]
│       ├── [Download PDF]
│       └── [New Quote]
│
└── Catalog Sync Popup (modal, on status → SENT)
    ├── Item list with checkboxes (NEW / UPDATE / SAME)
    ├── Price history context on UPDATE items
    └── [Save Selected] [Save All] [Skip]
```

---

## 8. Storage Strategy

| Data | Storage | Survives Refresh? | Export |
|------|---------|-------------------|--------|
| Current quotation (form state) | In-memory (JS) | ❌ | Via Quotation JSON download |
| Quotation history | `localStorage` (base64 stripped) | ✅ | Via Workspace Backup |
| Item catalog | `localStorage` | ✅ | Via Workspace Backup |
| Full quotation (with logo) | User's file system (JSON) | ✅ | Always |

**localStorage key structure:**
```
invoicy_quo_history      → JSON array of QuotationData[] (logo stripped)
invoicy_catalog          → JSON array of CatalogEntry[]
invoicy_catalog_meta     → { item_count, last_updated, version }
```

---

## 9. Catalog Sync — Status-Triggered, User-Controlled

Auto-learn does NOT fire silently. It is triggered intentionally when the user marks a quotation as **SENT**, and requires explicit user confirmation before anything is written to the catalog.

### Trigger
```
User changes status dropdown → SENT
  ↓
App scans all line items against catalog
  ↓
Catalog Sync Popup appears
```

### Catalog Sync Popup

Displays a reviewable list of what would be saved. Each item is shown with its change type and a checkbox the user can toggle:

```
┌─────────────────────────────────────────────────┐
│  Save to Catalog?                               │
│  Review items from QUO-001 before saving.       │
├─────────────────────────────────────────────────┤
│  ✓  Logo Design          Rp 3.500.000   [NEW]   │
│  ✓  Brand Guidelines     Rp 1.500.000   [NEW]   │
│  ✓  Social Media Kit     Rp 2.000.000   [UPDATE]│
│       └ was Rp 1.800.000 (Mar 20, 2026)         │
│  ✗  Rush Fee             Rp   500.000   [NEW]   │
│       (unchecked — user doesn't want this saved) │
├─────────────────────────────────────────────────┤
│  [Save Selected]   [Save All]   [Skip]          │
└─────────────────────────────────────────────────┘
```

**Change type labels:**
- `[NEW]` — item description not found in catalog
- `[UPDATE]` — fuzzy match found; shows previous price + date for context
- `[SAME]` — price unchanged from catalog default; shown but pre-unchecked (no point re-saving)

**User actions:**
- **Save Selected** — only checked items written to catalog
- **Save All** — all items saved regardless of checkbox state
- **Skip** — catalog unchanged; status still updates to SENT

### What gets written to catalog on save

```
For each saved item:
  if NEW:
    create CatalogEntry {
      name: item.description,
      default_price: item.unit_price,
      price_history: [{ price, quoted_at: today, client: to.name }],
      times_quoted: 1
    }

  if UPDATE:
    catalog_item.price_history.push({ price, quoted_at: today, client: to.name })
    catalog_item.default_price = item.unit_price   ← user confirmed this
    catalog_item.times_quoted++
    catalog_item.updated_at = now

save updated catalog to localStorage
```

### Why this design is better than silent auto-learn
- User gave a **special discount** this time? Uncheck it — standard rate stays intact
- User added a one-off **rush fee** they'll never use again? Uncheck it
- User sees the **price history context** before deciding to overwrite
- Nothing ever gets silently overwritten — full user control, zero surprises

Fuzzy match uses normalized string comparison (lowercase, trim, ignore punctuation). Threshold: similarity > 0.85. No external library — custom `utils/fuzzyMatch.ts` (~20 lines).

---

## 10. Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | **Vue 3 + TypeScript** | Same as invoice app, consistent |
| Styling | Tailwind CSS or CSS Modules | TBD in design.md |
| State | `ref()`, `reactive()`, composables | Vue built-in reactivity |
| Catalog storage | `localStorage` | Persists across sessions, no backend |
| Quotation state | In-memory | Session only, exported to JSON |
| Fuzzy match | Custom util (~20 lines) | No external dep needed |
| PDF | `window.print()` + print CSS | Zero dependency |
| Build | **Vite** | Same as invoice app |
| Deploy | **Cloudflare Pages** | Same as invoice app, free tier |

---

## 11. Constraints & Principles

1. **No backend** — everything in browser
2. **No account** — no auth, no sessions server-side
3. **Catalog is the user's asset** — always exportable, always importable
4. **Auto-learn is additive** — never deletes or overwrites existing data destructively
5. **Quotation JSON = source of truth** for that quote
6. **localStorage as catalog home** — with JSON export as the safety net
7. **Same design language as invoice app** — ink + cream + rust, DM type family

---

## 12. Differences from Invoice App

| Feature | Invoice App | Quotation App |
|---------|-------------|---------------|
| Document type | Invoice | Quotation |
| Number prefix | INV- | QUO- |
| Date field 2 | Due date | Valid until date |
| Status field | ❌ | ✅ DRAFT/SENT/ACCEPTED/REJECTED |
| Item catalog | ❌ | ✅ (localStorage + JSON export) |
| Auto-learn | ❌ | ✅ (on every JSON download) |
| Catalog CRUD tab | ❌ | ✅ |
| Catalog autocomplete | ❌ | ✅ |
| History | Session-only (in-memory) | localStorage (base64 stripped, persists) |

---

## 13. Open Questions

| # | Question | Status |
|---|----------|--------|
| 1 | Should accepted quotations be convertible to invoices (even manually)? | 🟡 V2 |
| 2 | Should catalog support item categories / tags in v1? | 🟡 TBD in design.md |
| 3 | Fuzzy match threshold — 0.85 right? Or let user configure? | 🟡 TBD |
| 4 | Should price history be visible in the quotation form (not just catalog)? | 🟡 TBD |
| 5 | Catalog import conflict resolution — latest wins or prompt user? | 🟡 TBD — leaning latest wins |
| 6 | Catalog sync popup re-triggers if user re-uploads JSON and sets status → SENT again? | ✅ Yes — popup always fires on SENT, user can Skip if no changes needed |
| 7 | Should `valid until` date auto-extend if status is still DRAFT? | ❌ Out of scope v1 |

---

## 14. Monetization Roadmap

V1 is intentionally free and local-first. No database, no auth, no infra cost. The goal is to validate the core product and build a user base before introducing paid features.

The natural upgrade trigger is **user frustration with localStorage limitations** — losing history when switching devices, or catalog not syncing. That frustration is the signal to introduce a paid tier.

```
V1 — Local-first, free, no database
  localStorage for catalog + history (base64 stripped)
  Ship fast, validate core idea

V2 — Optional account + cloud database (e.g. Supabase)
  Free tier: keeps all V1 features
  Paid tier: unlocks cloud features
  ├── History sync across devices
  ├── Unlimited catalog storage
  ├── Shareable quotation link (client view URL)
  └── Convert quotation → invoice

V3 — Full SaaS
  ├── Client portal (view + accept/reject quotes online)
  ├── Team workspace (share catalog across team)
  ├── Invoice + quotation in one app (shared catalog)
  └── Payment integration
```

| Feature | V1 Free | V2 Free | V2 Paid |
|---------|---------|---------|---------|
| Quotation generator | ✅ | ✅ | ✅ |
| Item catalog (localStorage) | ✅ | ✅ | ✅ |
| History (localStorage) | ✅ | ✅ | ✅ |
| Cloud sync across devices | ❌ | ❌ | ✅ |
| Shareable quotation link | ❌ | ❌ | ✅ |
| Convert quotation → invoice | ❌ | ❌ | ✅ |
| Unlimited cloud catalog | ❌ | ❌ | ✅ |
| Client portal | ❌ | ❌ | ✅ |

**Decision:** Do not introduce a database until real users report localStorage limitations as a blocker. Ship V1, collect feedback, charge at V2.

| Metric | Target |
|--------|--------|
| Time to first quote with catalog | < 60 seconds (vs 2 min from scratch) |
| Catalog grows naturally | After 5 quotes, catalog has 80%+ of user's standard items |
| Zero price inconsistency | Same item, same default price every time |
| JSON round-trip accuracy | 100% — re-upload restores exact state |

---

*Next: `flow.md` → user flows including catalog interactions*
*Then: `design.md` → catalog UI, autocomplete component, status badge*
*Then: `milestones.md` → build phases*
*Then: `example.html` → working prototype*
