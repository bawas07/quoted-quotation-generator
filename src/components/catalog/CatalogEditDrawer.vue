<script setup lang="ts">
// Catalog edit drawer — slide-in overlay for adding/editing catalog items
// Positioned fixed, slides from left, with backdrop overlay.

import { ref, watch, type Ref } from 'vue'
import type { CatalogEntry, CurrencyCode } from '../../types/quotation'
import { useCatalog } from '../../composables/useCatalog'
import { useToast } from '../../composables/useToast'
import { formatCurrency } from '../../utils/formatCurrency'

// ── Props ─────────────────────────────────────────────────────

const props = defineProps<{
  open: boolean
  editingItem?: CatalogEntry | null
}>()

const emit = defineEmits<{
  close: []
}>()

// ── Composable instances ──────────────────────────────────────

const { addItem, updateItem } = useCatalog()
const { showToast } = useToast()

// ── Form state ────────────────────────────────────────────────

const isEditMode: Ref<boolean> = ref(false)
const name: Ref<string> = ref('')
const desc: Ref<string> = ref('')
const price: Ref<number> = ref(0)
const currency: Ref<CurrencyCode> = ref('IDR')
const unit: Ref<string> = ref('')

// Price history for the item being edited
const priceHistory: Ref<CatalogEntry['history']> = ref([])

// ── Watchers ──────────────────────────────────────────────────

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      if (props.editingItem) {
        // Edit mode
        isEditMode.value = true
        name.value = props.editingItem.name
        desc.value = props.editingItem.desc
        price.value = props.editingItem.price
        currency.value = props.editingItem.cur
        unit.value = props.editingItem.unit
        priceHistory.value = props.editingItem.history ?? []
      } else {
        // Create mode
        isEditMode.value = false
        name.value = ''
        desc.value = ''
        price.value = 0
        currency.value = 'IDR'
        unit.value = ''
        priceHistory.value = []
      }
    }
  },
)

// ── Methods ───────────────────────────────────────────────────

function handleSave(): void {
  if (!name.value.trim()) {
    showToast('Name is required', 'warning')
    return
  }

  if (isEditMode.value && props.editingItem) {
    updateItem(props.editingItem.id, {
      name: name.value.trim(),
      desc: desc.value.trim(),
      price: price.value,
      cur: currency.value,
      unit: unit.value.trim(),
    })
    showToast('Item updated', 'success')
  } else {
    addItem({
      name: name.value.trim(),
      desc: desc.value.trim(),
      price: price.value,
      cur: currency.value,
      unit: unit.value.trim(),
    })
    showToast('Item added to catalog', 'success')
  }

  emit('close')
}

function handleCancel(): void {
  emit('close')
}
</script>

<template>
  <!-- Backdrop overlay -->
  <Transition name="drawer-backdrop">
    <div
      v-if="open"
      class="drawer-backdrop"
      @click.self="handleCancel"
    />
  </Transition>

  <!-- Drawer panel -->
  <Transition name="drawer-slide">
    <div v-if="open" class="catalog-edit-drawer">
      <div class="drawer-header">
        <h3 class="drawer-title">{{ isEditMode ? 'Edit Item' : 'Add Item' }}</h3>
        <button class="drawer-close-btn" type="button" @click="handleCancel">✕</button>
      </div>

      <div class="drawer-body">
        <!-- Name (required) -->
        <div class="field-group">
          <label class="field-label">Name *</label>
          <input
            v-model="name"
            type="text"
            class="field-input"
            placeholder="Item name"
          />
        </div>

        <!-- Description -->
        <div class="field-group">
          <label class="field-label">Description</label>
          <textarea
            v-model="desc"
            class="field-textarea"
            placeholder="Item description"
            rows="3"
          />
        </div>

        <!-- Default Price -->
        <div class="field-group">
          <label class="field-label">Default Price</label>
          <div class="field-row">
            <input
              v-model.number="price"
              type="number"
              class="field-input field-price"
              min="0"
              step="0.01"
              placeholder="0"
            />
            <select v-model="currency" class="field-select">
              <option value="IDR">IDR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="SGD">SGD</option>
              <option value="MYR">MYR</option>
              <option value="AUD">AUD</option>
              <option value="JPY">JPY</option>
            </select>
          </div>
        </div>

        <!-- Unit -->
        <div class="field-group">
          <label class="field-label">Unit</label>
          <input
            v-model="unit"
            type="text"
            class="field-input"
            placeholder="e.g., pcs, hour, project"
          />
        </div>

        <!-- Price History (read-only) -->
        <div class="field-group" v-if="isEditMode && priceHistory.length > 0">
          <label class="field-label">Price History</label>
          <div class="price-history-list">
            <div
              v-for="(entry, idx) in priceHistory"
              :key="idx"
              class="price-history-row"
            >
              <span class="ph-date">{{ entry.date }}</span>
              <span class="ph-client">{{ entry.client }}</span>
              <span class="ph-price">{{ formatCurrency(entry.price, currency) }}</span>
            </div>
          </div>
        </div>
        <div class="field-group" v-else-if="isEditMode">
          <label class="field-label">Price History</label>
          <p class="ph-empty">No price history yet.</p>
        </div>
      </div>

      <!-- Footer actions -->
      <div class="drawer-footer">
        <button class="btn btn-primary" type="button" @click="handleSave">Save</button>
        <button class="btn btn-ghost" type="button" @click="handleCancel">Cancel</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ── Backdrop ────────────────────────────────────────────── */
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(26, 44, 61, 0.5);
  z-index: 300;
}

.drawer-backdrop-enter-active,
.drawer-backdrop-leave-active {
  transition: opacity 0.2s ease;
}

.drawer-backdrop-enter-from,
.drawer-backdrop-leave-to {
  opacity: 0;
}

/* ── Drawer panel ────────────────────────────────────────── */
.catalog-edit-drawer {
  position: fixed;
  top: 0;
  left: 0;
  width: 420px;
  height: 100vh;
  background: var(--navy);
  border-right: 1px solid var(--border-dark-h);
  box-shadow: var(--shadow-drop);
  z-index: 301;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.drawer-slide-enter-active {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-slide-leave-active {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(-100%);
}

/* ── Header ──────────────────────────────────────────────── */
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-dark);
}

.drawer-title {
  font-family: var(--font-sans);
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--text-on-dark);
  margin: 0;
}

.drawer-close-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-dim);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.12s;
}

.drawer-close-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: var(--text-on-dark);
}

/* ── Body ────────────────────────────────────────────────── */
.drawer-body {
  flex: 1;
  padding: 16px 20px;
  overflow-y: auto;
}

.field-group {
  margin-bottom: 16px;
}

.field-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 6px;
}

.field-input,
.field-textarea,
.field-select {
  width: 100%;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1.5px solid var(--border-dark);
  border-radius: var(--r-sm);
  color: var(--text-on-dark);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  transition: all 0.15s;
  box-sizing: border-box;
}

.field-input::placeholder,
.field-textarea::placeholder {
  color: var(--text-dim);
  opacity: 0.5;
}

.field-input:focus,
.field-textarea:focus,
.field-select:focus {
  outline: none;
  border-color: var(--blue);
  background: rgba(255, 255, 255, 0.1);
}

.field-textarea {
  resize: vertical;
  min-height: 60px;
}

.field-row {
  display: flex;
  gap: 8px;
}

.field-price {
  flex: 1;
}

.field-select {
  width: auto;
  min-width: 80px;
  cursor: pointer;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(235,243,250,0.42)'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 26px;
}

/* ── Price History ───────────────────────────────────────── */
.price-history-list {
  border: 1px solid var(--border-dark);
  border-radius: var(--r-sm);
  overflow: hidden;
}

.price-history-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--border-dark);
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-on-dark);
}

.price-history-row:last-child {
  border-bottom: none;
}

.ph-date {
  flex-shrink: 0;
  color: var(--text-dim);
  min-width: 60px;
}

.ph-client {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-dim);
}

.ph-price {
  color: var(--blue);
  white-space: nowrap;
}

.ph-empty {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-dim);
  margin: 4px 0;
}

/* ── Footer ──────────────────────────────────────────────── */
.drawer-footer {
  display: flex;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-dark);
}

.btn {
  padding: 8px 16px;
  border-radius: var(--r-sm);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1px;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: all 0.12s;
  text-transform: uppercase;
}

.btn-primary {
  background: var(--blue);
  color: #fff;
  border-color: var(--blue);
}

.btn-primary:hover {
  background: var(--blue-dark);
}

.btn-ghost {
  background: transparent;
  color: var(--text-dim);
  border-color: var(--border-dark);
}

.btn-ghost:hover {
  color: var(--text-on-dark);
  border-color: var(--border-dark-h);
}
</style>
