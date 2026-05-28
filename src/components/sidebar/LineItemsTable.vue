<script setup lang="ts">
// Line items table — editable item rows with quantity, rate, amount
// Autocomplete on description input with catalog search

import type { LineItem, CurrencyCode } from '../../types/quotation'
import { formatCurrency } from '../../utils/formatCurrency'
import { useAutocomplete } from '../../composables/useAutocomplete'

const props = defineProps<{
  items: LineItem[]
  currency: CurrencyCode
}>()

const emit = defineEmits<{
  'update:items': [value: LineItem[]]
  'remove:item': [id: string]
  'add:item': []
}>()

// ── Autocomplete ──────────────────────────────────────────────

const autocomplete = useAutocomplete()

// ── Item methods ──────────────────────────────────────────────

function updateItem(id: string, field: keyof LineItem, value: string | number): void {
  const updated = props.items.map((item) => {
    if (item.id !== id) return item
    const patch: Partial<LineItem> = { [field]: value }
    const next = { ...item, ...patch }
    next.amount = next.quantity * next.unit_price
    return next
  })
  emit('update:items', updated)
}

function removeItem(id: string): void {
  autocomplete.cleanup(id)
  emit('remove:item', id)
}

function addItem(): void {
  emit('add:item')
}

// ── Autocomplete event handlers ───────────────────────────────

function onInput(id: string, event: Event): void {
  const value = (event.target as HTMLInputElement).value
  updateItem(id, 'description', value)
  autocomplete.search(id, value)
}

function onFocus(id: string, event: Event): void {
  const value = (event.target as HTMLInputElement).value
  autocomplete.search(id, value)
}

function onBlur(id: string): void {
  autocomplete.handleBlur(id, () => {
    autocomplete.close(id)
  })
}

function onKeydown(id: string, event: KeyboardEvent): void {
  const result = autocomplete.handleKeydown(event, id)
  if (result.action === 'select' && result.index !== undefined) {
    handleSelect(id, result.index)
  } else if (result.action === 'close') {
    autocomplete.close(id)
  }
}

function handleSelect(id: string, index: number): void {
  const selected = autocomplete.select(id, index)
  if (!selected) return

  const priceField = getPriceField(id)

  // Update the item
  const updated = props.items.map((item) => {
    if (item.id !== id) return item
    const next = { ...item }
    next.description = selected.description
    next.unit_price = selected.unit_price
    next.amount = next.quantity * next.unit_price
    return next
  })
  emit('update:items', updated)

  // Flash price field
  if (priceField) {
    priceField.style.borderColor = 'var(--blue)'
    priceField.focus()
    setTimeout(() => {
      priceField.style.borderColor = ''
    }, 600)
  }
}

function handleCreateAndSelect(id: string, query: string): void {
  const result = autocomplete.createAndSelect(id, query, props.currency)
  const priceField = getPriceField(id)

  // Update item description with the new name
  const updated = props.items.map((item) => {
    if (item.id !== id) return item
    const next = { ...item }
    next.description = result.description
    next.unit_price = 0
    next.amount = 0
    return next
  })
  emit('update:items', updated)

  // Focus price field so user can set the price
  if (priceField) {
    priceField.focus()
    priceField.style.borderColor = 'var(--blue)'
    setTimeout(() => {
      priceField.style.borderColor = ''
    }, 2000)
  }
}

function getPriceField(id: string): HTMLInputElement | null {
  return document.querySelector<HTMLInputElement>(`#price-${CSS.escape(id)}`)
}

function onDropdownMouseDown(id: string, index: number, event: MouseEvent): void {
  event.preventDefault()
  handleSelect(id, index)
}

function onCreateMouseDown(id: string, query: string, event: MouseEvent): void {
  event.preventDefault()
  handleCreateAndSelect(id, query)
}

// ── Highlight helper ──────────────────────────────────────────

function highlightText(text: string, query: string): string {
  if (!query || !query.trim()) return escapeHtml(text)
  const re = new RegExp(`(${escapeRegex(query)})`, 'gi')
  return escapeHtml(text).replace(re, '<mark>$1</mark>')
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// ── Check if query has an exact match in results ──────────────

function hasExactMatch(query: string, results: Array<{ name: string }>): boolean {
  if (!query || !query.trim()) return false
  const q = query.trim().toLowerCase()
  return results.some((r) => r.name.toLowerCase() === q)
}


</script>

<template>
  <div class="line-items-section">
    <label class="field-label">Line Items</label>

    <div class="items-table">
      <div class="items-header">
        <span class="col-desc">Description</span>
        <span class="col-qty">Qty</span>
        <span class="col-price">Unit Price</span>
        <span class="col-amount">Amount</span>
        <span class="col-remove"></span>
      </div>

      <div
        v-for="item in props.items"
        :key="item.id"
        class="items-row"
      >
        <div class="col-desc">
          <!-- Autocomplete wrapper -->
          <div class="acwrap">
            <input
              class="item-input"
              type="text"
              placeholder="Item description"
              :value="item.description"
              @input="onInput(item.id, $event)"
              @focus="onFocus(item.id, $event)"
              @blur="onBlur(item.id)"
              @keydown="onKeydown(item.id, $event)"
            />
            <!-- Dropdown -->
            <div
              class="acdrop"
              :class="{ open: autocomplete.isOpen[item.id] }"
            >
              <!-- Results -->
              <template v-if="autocomplete.results[item.id] && autocomplete.results[item.id].length > 0">
                <div
                  v-for="(entry, idx) in autocomplete.results[item.id]"
                  :key="entry.id"
                  class="ac-item"
                  :class="{ hi: autocomplete.highlightedIndex[item.id] === idx }"
                  @mousedown="onDropdownMouseDown(item.id, idx, $event)"
                >
                  <div class="ac-name" v-html="highlightText(entry.name, item.description)"></div>
                  <div class="ac-meta">
                    <span>{{ entry.desc || '—' }}</span>
                    <span class="ac-price">{{ formatCurrency(entry.price, entry.cur) }}</span>
                  </div>
                  <div class="ac-meta" style="margin-top:1px">
                    <span style="opacity:0.4">quoted {{ entry.times }}×</span>
                  </div>
                </div>
              </template>

              <!-- Create option: shown when no exact match and query non-empty -->
              <template v-if="item.description && item.description.trim() && autocomplete.results[item.id] && !hasExactMatch(item.description, autocomplete.results[item.id])">
                <div
                  class="ac-item ac-create"
                  :class="{ hi: autocomplete.highlightedIndex[item.id] === (autocomplete.results[item.id]?.length ?? 0) }"
                  @mousedown="onCreateMouseDown(item.id, item.description, $event)"
                >
                  <div class="ac-name" style="color:var(--blue)">
                    + Add "<strong>{{ item.description }}</strong>" to catalog
                  </div>
                  <div class="ac-meta"><span>Creates a new catalog item</span></div>
                </div>
              </template>

              <!-- Empty state (no results, no query) -->
              <template v-if="(!autocomplete.results[item.id] || autocomplete.results[item.id].length === 0) && (!item.description || !item.description.trim())">
                <div class="ac-item" style="cursor:default;opacity:0.5">
                  <div class="ac-name" style="font-size:11px">Catalog is empty</div>
                  <div class="ac-meta">Type to create a new item</div>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="col-qty">
          <input
            class="item-input item-number"
            type="number"
            min="0"
            step="1"
            :value="item.quantity"
            @input="updateItem(item.id, 'quantity', parseFloat(($event.target as HTMLInputElement).value) || 0)"
          />
        </div>
        <div class="col-price">
          <input
            :id="`price-${item.id}`"
            class="item-input item-number"
            type="number"
            min="0"
            step="0.01"
            :value="item.unit_price"
            @input="updateItem(item.id, 'unit_price', parseFloat(($event.target as HTMLInputElement).value) || 0)"
          />
        </div>
        <div class="col-amount amount-display">
          {{ formatCurrency(item.amount, props.currency) }}
        </div>
        <div class="col-remove">
          <button
            class="item-remove"
            type="button"
            :disabled="props.items.length <= 1"
            @click="removeItem(item.id)"
            :title="props.items.length <= 1 ? 'Cannot remove last item' : 'Remove item'"
          >
            ✕
          </button>
        </div>
      </div>
    </div>

    <button class="add-item-btn" type="button" @click="addItem">
      + Add item
    </button>
  </div>
</template>

<style scoped>
.line-items-section {
  margin-bottom: 20px;
}

.field-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 8px;
}

.items-table {
  width: 100%;
}

.items-header {
  display: grid;
  grid-template-columns: 1fr 50px 80px 90px 28px;
  gap: 6px;
  padding: 0 0 6px;
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--text-dim);
  border-bottom: 1px solid var(--border-dark);
  margin-bottom: 6px;
}

.items-row {
  display: grid;
  grid-template-columns: 1fr 50px 80px 90px 28px;
  gap: 6px;
  align-items: flex-start;
  margin-bottom: 6px;
}

/* ── Autocomplete wrapper ───────────────────────────────────── */
.acwrap {
  position: relative;
}

.acdrop {
  position: absolute;
  top: calc(100% + 3px);
  left: 0;
  right: 0;
  background: var(--navy);
  border: 1px solid var(--border-dark-h);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-float);
  z-index: 200;
  overflow: hidden;
  display: none;
  max-height: 240px;
  overflow-y: auto;
}

.acdrop.open {
  display: block;
  animation: dropIn 0.15s ease;
}

@keyframes dropIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ac-item {
  padding: 9px 12px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-dark);
  transition: background 0.1s;
}

.ac-item:last-child {
  border-bottom: none;
}

.ac-item:hover,
.ac-item.hi {
  background: rgba(74, 144, 196, 0.12);
}

.ac-name {
  font-size: 13px;
  color: var(--text-on-dark);
  margin-bottom: 2px;
}

.ac-name :deep(mark) {
  background: none;
  color: var(--blue);
  font-weight: 600;
}

.ac-meta {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-dim);
  display: flex;
  justify-content: space-between;
}

.ac-price {
  color: var(--text-on-dark);
  font-size: 11px;
}

/* ── Inputs ─────────────────────────────────────────────────── */
.item-input {
  width: 100%;
  padding: 7px 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 1.5px solid var(--border-dark);
  border-radius: var(--r-sm);
  color: var(--text-on-dark);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  transition: all 0.15s;
  box-sizing: border-box;
}

.item-input::placeholder {
  color: var(--text-dim);
  opacity: 0.5;
}

.item-input:focus {
  outline: none;
  border-color: var(--blue);
  background: rgba(255, 255, 255, 0.1);
}

.item-number {
  text-align: right;
  -moz-appearance: textfield;
}

.item-number::-webkit-inner-spin-button,
.item-number::-webkit-outer-spin-button {
  opacity: 0.4;
}

.amount-display {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--text-on-dark);
  text-align: right;
  padding: 0 4px;
  white-space: nowrap;
  padding-top: 7px;
}

.item-remove {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  background: rgba(192, 57, 43, 0.12);
  color: var(--error);
  font-size: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.12s;
}

.item-remove:hover:not(:disabled) {
  background: rgba(192, 57, 43, 0.3);
}

.item-remove:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

.add-item-btn {
  margin-top: 8px;
  padding: 8px 16px;
  background: rgba(74, 144, 196, 0.1);
  border: 1.5px dashed var(--blue);
  border-radius: var(--r-sm);
  color: var(--blue);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.15s;
  width: 100%;
}

.add-item-btn:hover {
  background: rgba(74, 144, 196, 0.2);
}
</style>
