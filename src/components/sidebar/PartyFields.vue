<script setup lang="ts">
// Party fields — from/to company/client details

import type { Party } from '../../types/quotation'

const props = defineProps<{
  modelValue: Party
  label: 'From' | 'To'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Party]
}>()

function updateField<K extends keyof Party>(key: K, value: Party[K]): void {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <div class="party-fields-section">
    <label class="field-label">{{ label }}</label>

    <div class="field-group">
      <input
        class="field-input"
        type="text"
        :placeholder="`${label === 'From' ? 'Your' : 'Client'} name`"
        :value="props.modelValue.name"
        @input="updateField('name', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="field-group">
      <textarea
        class="field-input field-textarea"
        :placeholder="`${label === 'From' ? 'Your' : 'Client'} address`"
        :value="props.modelValue.address"
        @input="updateField('address', ($event.target as HTMLTextAreaElement).value)"
      ></textarea>
    </div>

    <div class="field-group">
      <input
        class="field-input"
        type="email"
        placeholder="Email"
        :value="props.modelValue.email"
        @input="updateField('email', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="field-group" v-if="props.modelValue.phone !== undefined && props.modelValue.phone !== ''">
      <input
        class="field-input"
        type="tel"
        placeholder="Phone (optional)"
        :value="props.modelValue.phone"
        @input="updateField('phone', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="field-group" v-if="props.modelValue.website !== undefined && props.modelValue.website !== ''">
      <input
        class="field-input"
        type="url"
        placeholder="Website (optional)"
        :value="props.modelValue.website"
        @input="updateField('website', ($event.target as HTMLInputElement).value)"
      />
    </div>
  </div>
</template>

<style scoped>
.party-fields-section {
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

.field-group {
  margin-bottom: 8px;
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

.field-textarea {
  min-height: 52px;
  resize: vertical;
}
</style>
