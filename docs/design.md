# design.md — Visual Language & Component Design
> Quotation Generator · Vue 3 + TypeScript

---

## 1. Design Philosophy

Same design language as the invoice app — **ink, cream, rust**. The two apps should feel like siblings. A user switching between them should feel at home immediately.

The one addition: **the catalog** introduces a data-management UI pattern that the invoice app doesn't have. This needs to feel like a lightweight CRM panel — scannable, structured, not overwhelming.

---

## 2. Color Tokens

Identical to invoice app. Shared design system.

```css
/* Base */
--color-cream:       #F5F0E8;
--color-white:       #FDFCFA;
--color-ink:         #1A1614;

/* Text */
--color-text-primary:   #1A1614;
--color-text-secondary: #4A4540;
--color-text-muted:     #8A8178;

/* Accent */
--color-rust:        #C4622D;
--color-rust-light:  #F0E8E0;
--color-rust-dark:   #A0501F;
--color-rust-pale:   #FAF3EE;

/* Borders */
--color-border:      #D9D2C5;
--color-border-ink:  rgba(245,240,232,0.12);

/* Status colors */
--status-draft:      #8A8178;     /* muted */
--status-sent:       #2E6DA4;     /* blue */
--status-accepted:   #3D7A5A;     /* green */
--status-rejected:   #C0392B;     /* red */

/* Catalog change types */
--change-new:        #3D7A5A;     /* green */
--change-update:     #B07D2A;     /* amber */
--change-same:       #8A8178;     /* muted */
```

---

## 3. Typography

Identical to invoice app — DM Serif Display + DM Mono + DM Sans.

```css
--font-serif:   'DM Serif Display', Georgia, serif;
--font-sans:    'DM Sans', system-ui, sans-serif;
--font-mono:    'DM Mono', 'Courier New', monospace;
```

---

## 4. Layout

Same two-column layout as invoice app — **sidebar (420px) + preview panel**.

Sidebar now has **3 tabs** instead of 2:

```
[ EDITOR ] [ HISTORY ] [ CATALOG ]
```

```
┌─────────────────────┬────────────────────────────────┐
│   SIDEBAR (420px)   │      PREVIEW (remaining)       │
│                     │                                │
│   [Header/Brand]    │   ┌──────────────────────┐    │
│   [3 Tabs]          │   │  Template Switcher   │    │
│   [Tab Content]     │   └──────────────────────┘    │
│                     │                                │
│                     │   ┌──────────────────────┐    │
│                     │   │  Status Bar          │    │
│                     │   └──────────────────────┘    │
│                     │                                │
│                     │   ┌──────────────────────┐    │
│                     │   │  Quotation Preview   │    │
│                     │   │  (A4 proportions)    │    │
│                     │   └──────────────────────┘    │
│                     │                                │
│   [Action Bar]      │   [Action Bar - bottom]        │
└─────────────────────┴────────────────────────────────┘
```

---

## 5. New Components (vs Invoice App)

### 5.1 Status Badge & Selector

Shown in the preview topbar, below the template switcher. A dropdown that doubles as a visual badge.

```
┌──────────────────────────────────────────┐
│ Status:  [ ● DRAFT ▾ ]                   │
└──────────────────────────────────────────┘
```

**Badge styles:**

| Status | Dot color | Text color | Background |
|--------|-----------|------------|------------|
| DRAFT | `--status-draft` | `--status-draft` | `rgba(138,129,120,0.1)` |
| SENT | `--status-sent` | `--status-sent` | `rgba(46,109,164,0.1)` |
| ACCEPTED | `--status-accepted` | `--status-accepted` | `rgba(61,122,90,0.1)` |
| REJECTED | `--status-rejected` | `--status-rejected` | `rgba(192,57,43,0.1)` |

```css
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 99px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  border: 1.5px solid currentColor;
  transition: all 0.15s;
}
.status-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: currentColor;
}
```

---

### 5.2 Autocomplete Dropdown

Appears below the description input in line items when user types ≥ 2 chars.

```
┌─────────────────────────────────────────┐
│ 🔍 logo des...                          │  ← input
├─────────────────────────────────────────┤
│ Logo Design              Rp 3.500.000   │  ← highlighted result
│ "Primary logo + 2 revisions"  quoted 2× │
├─────────────────────────────────────────┤
│ Logo + Brand Guidelines  Rp 5.000.000   │
│ "Full brand kit"          quoted 1×     │
└─────────────────────────────────────────┘
```

**Styles:**
```css
.autocomplete-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0; right: 0;
  background: var(--color-ink);
  border: 1px solid var(--color-border-ink);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 100;
  overflow: hidden;
  max-height: 240px;
  overflow-y: auto;
}
.autocomplete-item {
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid var(--color-border-ink);
  transition: background 0.1s;
}
.autocomplete-item:hover,
.autocomplete-item.highlighted {
  background: rgba(196,98,45,0.12);
}
.autocomplete-item-name {
  font-size: 13px;
  color: var(--color-cream);
  margin-bottom: 2px;
}
.autocomplete-item-name mark {
  background: none;
  color: var(--color-rust);
  font-weight: 600;
}
.autocomplete-item-meta {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-muted);
  display: flex;
  justify-content: space-between;
}
.autocomplete-item-price {
  color: var(--color-cream);
  font-size: 11px;
}
```

---

### 5.3 Catalog Tab Panel

The catalog is a lightweight data table — scannable, not dense.

```
┌─────────────────────────────────────────┐
│ 🔍 Search catalog...                    │
├─────────────────────────────────────────┤
│              [+ Add Item]               │
├─────────────────────────────────────────┤
│ Logo Design                             │
│ Rp 3.500.000 · quoted 2× · Mar 2026    │
│                              [✎] [✕]   │
├─────────────────────────────────────────┤
│ Brand Guidelines                        │
│ Rp 1.500.000 · quoted 1× · May 2026    │
│                              [✎] [✕]   │
├─────────────────────────────────────────┤
│ Social Media Kit                        │
│ Rp 2.000.000 · quoted 3× · May 2026    │
│                              [✎] [✕]   │
└─────────────────────────────────────────┘
│ [↓ Export Workspace] [↑ Import Workspace]│
└─────────────────────────────────────────┘
```

**Catalog item card:**
```css
.catalog-item {
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border-ink);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.catalog-item-name {
  font-size: 13px;
  color: var(--color-cream);
  font-weight: 500;
  margin-bottom: 3px;
}
.catalog-item-meta {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-muted);
  letter-spacing: 0.3px;
}
.catalog-item-price {
  color: var(--color-rust);
  font-family: var(--font-mono);
  font-size: 11px;
}
.catalog-item-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s;
}
.catalog-item:hover .catalog-item-actions { opacity: 1; }
```

**Item edit drawer** — slides in from the right of the sidebar:
```
┌──────────────────────┐
│ Edit Item         ×  │
│ ─────────────────── │
│ Name      [......] │
│ Description        │
│ [...............] │
│ Default Price      │
│ [......] [IDR ▾]  │
│ Unit      [......] │
│                    │
│ Price History      │  ← read-only
│ Rp 3.0M  Jan 2026 │
│ Rp 3.5M  Mar 2026 │
│                    │
│ [Save]   [Cancel] │
└──────────────────────┘
```

---

### 5.4 Catalog Sync Popup (Modal)

Triggered when status changes to SENT. Full-screen modal overlay.

```
┌──────────────────────────────────────────────┐
│  Save to Catalog?                            │
│  Review items from QUO-001 · Acme Corp       │
├──────────────────────────────────────────────┤
│                                              │
│  ☑  Logo Design              Rp 3.500.000   │
│       ● NEW                                  │
│                                              │
│  ☑  Brand Guidelines         Rp 1.500.000   │
│       ● NEW                                  │
│                                              │
│  ☑  Social Media Kit         Rp 2.000.000   │
│       ▲ UPDATE · was Rp 1.800.000            │
│         Mar 20, 2026 · Beta Studio           │
│                                              │
│  ☐  Rush Fee                 Rp   500.000   │
│       ● NEW · (unchecked by default          │
│         — looks like a one-off)             │
│                                              │
│  ──────────────────────────────────────────  │
│  ☑  Logo Animation           Rp 4.000.000   │
│       ✓ SAME · no change                    │
│                                              │
├──────────────────────────────────────────────┤
│  [Save Selected (3)]  [Save All]  [Skip]     │
└──────────────────────────────────────────────┘
```

**Change type pill styles:**
```css
.change-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 99px;
}
.change-pill.new      { color: var(--change-new);    background: rgba(61,122,90,0.12);  }
.change-pill.update   { color: var(--change-update); background: rgba(176,125,42,0.12); }
.change-pill.same     { color: var(--change-same);   background: rgba(138,129,120,0.1); }
```

**Popup item row:**
```css
.sync-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border);
}
.sync-item-check { margin-top: 2px; accent-color: var(--color-rust); }
.sync-item-body { flex: 1; }
.sync-item-name { font-size: 14px; font-weight: 500; margin-bottom: 4px; }
.sync-item-history {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-muted);
  margin-top: 4px;
}
.sync-item-price {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}
```

**Save Selected button** — count updates dynamically as user checks/unchecks:
```
[Save Selected (3)]   ← number reflects checked count
```

---

### 5.5 Status Bar (Preview Panel)

Sits between the template switcher and the preview:

```
┌──────────────────────────────────────────────┐
│  QUO-001 · Acme Corp            ● DRAFT ▾   │
└──────────────────────────────────────────────┘
```

- Left: quotation number + client name (live from form)
- Right: status badge (clickable dropdown)
- Clicking status → opens status dropdown inline

---

### 5.6 History Tab — Quotation List

Same pattern as invoice app but with status badges:

```
┌─────────────────────────────────────────┐
│ QUO-003                                 │
│ Pixel Studio                            │  ← client name
│ 2026-05-19          Rp 7.885.000  SENT │  ← date · total · badge
├─────────────────────────────────────────┤
│ QUO-002                                 │
│ Beta Agency                             │
│ 2026-04-10          Rp 3.500.000  DRAFT│
└─────────────────────────────────────────┘
```

Status badge in history is **read-only color indicator**, not a dropdown.

---

## 6. Quotation Templates

Identical to invoice app templates — same 5 skins, adapted for quotation vocabulary:

- "Invoice" label → "Quotation"
- "Due date" → "Valid until"
- Invoice number → Quotation number
- Status badge added to all templates (top-right corner or header band)

| Template | Status badge position |
|----------|-----------------------|
| Classic | Top-right, below quotation number |
| Minimal | Below meta row, mono text |
| Bold | Inside rust band, right side |
| Sidebar | Below quotation number in main column |
| Friendly | Inside the rounded badge |

---

## 7. Print / PDF CSS

Same as invoice app. Sidebar, template switcher, status bar, action bar all hidden.

```css
@media print {
  .sidebar,
  .preview-topbar,
  .status-bar,
  .action-bar { display: none !important; }
  .invoice-paper {
    width: 210mm;
    min-height: 297mm;
    box-shadow: none;
  }
  @page { size: A4; margin: 0; }
}
```

---

## 8. Micro-interactions

| Interaction | Behaviour |
|-------------|-----------|
| Status → SENT | Badge pulses once (scale 1 → 1.05 → 1, 200ms) before popup opens |
| Autocomplete appears | Slides down (height 0→auto, 150ms) |
| Autocomplete select | Row price field animates: highlight flash (rust tint, 300ms) |
| Catalog item save | Row slides in (same as line item add) |
| Catalog item delete | Row slides out + fades |
| Sync popup open | Modal scales in (0.95→1, 200ms) with overlay fade |
| Checked count update | "[Save Selected (N)]" number cross-fades |
| Workspace export | Button spinner → checkmark, 2s |
| History load | Preview cross-fades (150ms) |
| Template switch | Preview cross-fades (150ms) |

---

## 9. Empty States

| Location | Empty state message |
|----------|---------------------|
| Catalog tab | "Your catalog is empty. Items appear here automatically after your first sent quotation." |
| History tab | "No quotations yet. Create or upload one." |
| Autocomplete | (no dropdown shown — free typing only) |
| Sync popup (all SAME) | "All prices already match your catalog. Nothing to update." + [Close] |
| Price history in edit drawer | "No price history yet." |

---

*Next: `milestones.md` → build phases and task breakdown*