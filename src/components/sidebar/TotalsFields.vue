<script setup lang="ts">
// Totals summary — read-only computed values with custom labels

import type { CurrencyCode } from '../../types/quotation'
import { formatCurrency } from '../../utils/formatCurrency'

defineProps<{
  currency: CurrencyCode
  subtotal: number
  discountAmount: number
  taxAmount: number
  total: number
  discountLabel: string
  taxLabel: string
}>()
</script>

<template>
  <div class="totals-section">
    <label class="field-label">Total</label>

    <div class="totals-row">
      <span class="totals-label">Subtotal</span>
      <span class="totals-value">{{ formatCurrency(subtotal, currency) }}</span>
    </div>

    <div class="totals-row">
      <span class="totals-label">{{ discountLabel }}</span>
      <span class="totals-value">({{ formatCurrency(discountAmount, currency) }})</span>
    </div>

    <div class="totals-row">
      <span class="totals-label">{{ taxLabel }}</span>
      <span class="totals-value">{{ formatCurrency(taxAmount, currency) }}</span>
    </div>

    <div class="totals-divider"></div>

    <div class="totals-row totals-grand">
      <span class="totals-label">Total</span>
      <span class="totals-value totals-grand-value">{{ formatCurrency(total, currency) }}</span>
    </div>
  </div>
</template>

<style scoped>
.totals-section {
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
