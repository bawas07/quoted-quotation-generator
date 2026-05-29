<script setup lang="ts">
// Template switcher — 5 pill buttons for template selection
// Labels use capitalized display names; modelValue uses lowercase template IDs.

import type { TemplateId } from '../../types/quotation'

interface TemplateOption {
  id: TemplateId
  label: string
}

const TEMPLATES: TemplateOption[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'bold', label: 'Bold' },
  { id: 'sidebar', label: 'Sidebar' },
  { id: 'friendly', label: 'Friendly' },
]

defineProps<{
  modelValue: TemplateId
}>()

const emit = defineEmits<{
  'update:modelValue': [value: TemplateId]
}>()
</script>

<template>
  <div class="tpl-switcher">
    <button
      v-for="tpl in TEMPLATES"
      :key="tpl.id"
      class="tpl-btn"
      :class="{ active: modelValue === tpl.id }"
      @click="emit('update:modelValue', tpl.id)"
    >
      {{ tpl.label }}
    </button>
  </div>
</template>
