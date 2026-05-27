<script setup lang="ts">
// Meta fields — quotation number, issue date, valid until, currency

import type { QuotationMeta, CurrencyCode } from '../../types/quotation'

const ALL_CURRENCIES: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'IDR', 'SGD', 'MYR', 'AUD', 'JPY']

const props = defineProps<{
  meta: QuotationMeta
}>()

const emit = defineEmits<{
  'update:meta': [value: QuotationMeta]
}>()

function updateField<K extends keyof QuotationMeta>(key: K, value: QuotationMeta[K]): void {
  emit('update:meta', { ...props.meta, [key]: value })
}
</script>

<template>
  <div class="meta-fields-section">
    <label class="field-label">Quotation Details</label>

    <div class="field-group">
      <input
        class="field-input"
        type="text"
        placeholder="Quotation number"
        :value="props.meta.quotation_number"
        @input="updateField('quotation_number', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="field-row">
      <div class="field-group flex-1">
        <label class="field-sublabel">Issue date</label>
        <input
          class="field-input"
          type="text"
          placeholder="dd-MM-yyyy"
          :value="props.meta.issue_date"
          @input="updateField('issue_date', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="field-group flex-1">
        <label class="field-sublabel">Valid until</label>
        <input
          class="field-input"
          type="text"
          placeholder="dd-MM-yyyy"
          :value="props.meta.valid_until"
          @input="updateField('valid_until', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <div class="field-group">
      <label class="field-sublabel">Currency</label>
      <select
        class="field-input field-select"
        :value="props.meta.currency"
        @change="updateField('currency', ($event.target as HTMLSelectElement).value as CurrencyCode)"
      >
        <option
          v-for="c in ALL_CURRENCIES"
          :key="c"
          :value="c"
          :selected="props.meta.currency === c"
        >
          {{ c }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.meta-fields-section {
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

.field-group {
  margin-bottom: 8px;
}

.field-row {
  display: flex;
  gap: 8px;
}

.flex-1 {
  flex: 1;
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

.field-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(235,243,250,0.42)'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 28px;
}

.field-select option {
  background: var(--navy);
  color: var(--text-on-dark);
}
</style>
