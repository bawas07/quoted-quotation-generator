<script setup lang="ts">
// Notes field — terms, payment instructions, custom notes

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="notes-field-section">
    <label class="field-label">Notes</label>
    <textarea
      class="notes-input"
      placeholder="Additional notes..."
      :value="props.modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    ></textarea>
  </div>
</template>

<style scoped>
.notes-field-section {
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

.notes-input {
  width: 100%;
  min-height: 80px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1.5px solid var(--border-dark);
  border-radius: var(--r-sm);
  color: var(--text-on-dark);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  resize: vertical;
  transition: all 0.15s;
  box-sizing: border-box;
}

.notes-input::placeholder {
  color: var(--text-dim);
  opacity: 0.6;
}

.notes-input:focus {
  outline: none;
  border-color: var(--blue);
  background: rgba(255, 255, 255, 0.1);
}
</style>
