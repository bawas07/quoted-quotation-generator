<script setup lang="ts">
// Tax & Discount section — editable inputs for labels and percentages

defineProps<{
  discountLabel: string
  taxLabel: string
  discountPercent: number
  taxPercent: number
}>()

const emit = defineEmits<{
  'update:totals': [value: { discount_percent?: number; tax_percent?: number; tax_label?: string; discount_label?: string }]
}>()

function updateDiscount(val: number): void {
  emit('update:totals', { discount_percent: Math.max(0, Math.min(100, val)) })
}

function updateTaxPercent(val: number): void {
  emit('update:totals', { tax_percent: Math.max(0, Math.min(100, val)) })
}
</script>

<template>
  <div class="tax-discount-section">
    <label class="field-label">Tax &amp; Discount</label>

    <div class="field-row">
      <div class="field-group flex-1">
        <div class="field-item">
          <label class="field-sublabel">Discount Label</label>
          <input
            class="field-input"
            type="text"
            placeholder="Discount"
            :value="discountLabel"
            @input="emit('update:totals', { discount_label: ($event.target as HTMLInputElement).value })"
          />
        </div>

        <div class="field-item">
          <label class="field-sublabel">Tax Label</label>
          <input
            class="field-input"
            type="text"
            placeholder="PPN"
            :value="taxLabel"
            @input="emit('update:totals', { tax_label: ($event.target as HTMLInputElement).value })"
          />
        </div>
      </div>

      <div class="field-group flex-1">
        <div class="field-item">
          <label class="field-sublabel">Discount %</label>
          <div class="percent-input-wrap">
            <input
              class="field-input"
              type="number"
              min="0"
              max="100"
              step="0.1"
              :value="discountPercent"
              @input="updateDiscount(parseFloat(($event.target as HTMLInputElement).value) || 0)"
            />
            <span class="percent-suffix">%</span>
          </div>
        </div>

        <div class="field-item">
          <label class="field-sublabel">Tax %</label>
          <div class="percent-input-wrap">
            <input
              class="field-input"
              type="number"
              min="0"
              max="100"
              step="0.1"
              :value="taxPercent"
              @input="updateTaxPercent(parseFloat(($event.target as HTMLInputElement).value) || 0)"
            />
            <span class="percent-suffix">%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tax-discount-section {
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

.field-sublabel {
  display: block;
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 4px;
}

.field-row {
  display: flex;
  gap: 8px;
}

.flex-1 {
  flex: 1;
}

.field-group {
  margin-bottom: 8px;
}

.field-item {
  margin-bottom: 12px;
}

.field-item:last-child {
  margin-bottom: 0;
}

.field-input {
  width: 100%;
  padding: 9px 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1.5px solid var(--border-dark);
  border-radius: var(--r-sm);
  color: var(--text-on-dark);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  transition: all 0.15s;
  box-sizing: border-box;
}

.field-input::placeholder {
  color: var(--text-dim);
  opacity: 0.6;
}

.field-input:focus {
  outline: none;
  border-color: var(--blue);
  background: rgba(255, 255, 255, 0.1);
}

/* Hide number input spinners */
.field-input[type='number'] {
  -moz-appearance: textfield;
}

.field-input[type='number']::-webkit-inner-spin-button,
.field-input[type='number']::-webkit-outer-spin-button {
  opacity: 0.4;
}

.percent-input-wrap {
  position: relative;
}

.percent-input-wrap .field-input {
  padding-right: 28px;
}

.percent-suffix {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-dim);
  pointer-events: none;
}
</style>
