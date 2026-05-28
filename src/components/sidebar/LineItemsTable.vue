<script setup lang="ts">
// Line items table — editable item rows with quantity, rate, amount

import type { LineItem, CurrencyCode } from '../../types/quotation'
import { formatCurrency } from '../../utils/formatCurrency'

const props = defineProps<{
  items: LineItem[]
  currency: CurrencyCode
}>()

const emit = defineEmits<{
  'update:items': [value: LineItem[]]
  'remove:item': [id: string]
  'add:item': []
}>()

function updateItem(id: string, field: keyof LineItem, value: string | number): void {
  const updated = props.items.map((item) => {
    if (item.id !== id) return item
    const patch: Partial<LineItem> = { [field]: value }
    const next = { ...item, ...patch }
    // Recalculate amount
    next.amount = next.quantity * next.unit_price
    return next
  })
  emit('update:items', updated)
}

function removeItem(id: string): void {
  emit('remove:item', id)
}

function addItem(): void {
  emit('add:item')
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
          <input
            class="item-input"
            type="text"
            placeholder="Item description"
            :value="item.description"
            @input="updateItem(item.id, 'description', ($event.target as HTMLInputElement).value)"
          />
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
  align-items: center;
  margin-bottom: 6px;
}

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
