<script setup lang="ts">
// Totals fields — subtotal, discount, tax, grand total with formatted display

import type { QuotationTotals, CurrencyCode } from '../../types/quotation'
import { formatCurrency } from '../../utils/formatCurrency'

const props = defineProps<{
  totals: QuotationTotals
  currency: CurrencyCode
  subtotal: number
  discountAmount: number
  taxAmount: number
  total: number
  taxLabel: string
}>()

const emit = defineEmits<{
  'update:totals': [value: Partial<QuotationTotals> & { tax_label?: string }]
}>()

function updateDiscount(val: number): void {
  emit('update:totals', { discount_percent: Math.max(0, Math.min(100, val)) })
}

function updateTaxPercent(val: number): void {
  emit('update:totals', { tax_percent: Math.max(0, Math.min(100, val)) })
}
</script>

<template>
  <div class="totals-fields-section">
    <label class="field-label">Totals</label>

    <div class="totals-row">
      <span class="totals-label">Subtotal</span>
      <span class="totals-value">{{ formatCurrency(props.subtotal, props.currency) }}</span>
    </div>

    <div class="totals-row totals-input-row">
      <span class="totals-label">Discount</span>
      <div class="totals-input-group">
        <input
          class="totals-input"
          type="number"
          min="0"
          max="100"
          step="0.1"
          :value="props.totals.discount_percent"
          @input="updateDiscount(parseFloat(($event.target as HTMLInputElement).value) || 0)"
        />
        <span class="totals-suffix">%</span>
        <span class="totals-computed">({{ formatCurrency(props.discountAmount, props.currency) }})</span>
      </div>
    </div>

    <div class="totals-row">
      <span class="totals-label">Tax ({{ props.totals.tax_percent }}%)</span>
      <span class="totals-value">{{ formatCurrency(props.taxAmount, props.currency) }}</span>
    </div>

    <div class="totals-row totals-input-row">
      <span class="totals-label">Tax Label</span>
      <div class="totals-input-group">
        <input
          class="totals-input"
          type="text"
          placeholder="PPN"
          :value="props.taxLabel"
          @input="emit('update:totals', { tax_label: ($event.target as HTMLInputElement).value })"
        />
      </div>
    </div>

    <div class="totals-row totals-input-row">
      <span class="totals-label">Tax %</span>
      <div class="totals-input-group">
        <input
          class="totals-input"
          type="number"
          min="0"
          max="100"
          step="0.1"
          :value="props.totals.tax_percent"
          @input="updateTaxPercent(parseFloat(($event.target as HTMLInputElement).value) || 0)"
        />
        <span class="totals-suffix">%</span>
      </div>
    </div>

    <div class="totals-divider"></div>

    <div class="totals-row totals-grand">
      <span class="totals-label">Total</span>
      <span class="totals-value totals-grand-value">{{ formatCurrency(props.total, props.currency) }}</span>
    </div>
  </div>
</template>

<style scoped>
.totals-fields-section {
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

.totals-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.totals-label {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-dim);
  flex-shrink: 0;
}

.totals-value {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--text-on-dark);
  text-align: right;
}

.totals-input-row {
  gap: 8px;
}

.totals-input-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.totals-input {
  width: 60px;
  padding: 5px 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 1.5px solid var(--border-dark);
  border-radius: var(--r-sm);
  color: var(--text-on-dark);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  text-align: right;
  transition: all 0.15s;
  -moz-appearance: textfield;
}

.totals-input:focus {
  outline: none;
  border-color: var(--blue);
  background: rgba(255, 255, 255, 0.1);
}

.totals-input::-webkit-inner-spin-button,
.totals-input::-webkit-outer-spin-button {
  opacity: 0.4;
}

.totals-suffix {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-dim);
}

.totals-computed {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-dim);
  white-space: nowrap;
}

.totals-divider {
  height: 1px;
  background: var(--border-dark);
  margin: 6px 0;
}

.totals-grand {
  padding-top: 2px;
}

.totals-grand-value {
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--blue);
}
</style>
