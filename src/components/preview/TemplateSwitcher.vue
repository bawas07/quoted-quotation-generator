<script setup lang="ts">
// Template switcher — 5 pill buttons for template selection

import type { TemplateId } from '../../types/quotation'

const TEMPLATES: TemplateId[] = ['classic', 'minimal', 'bold', 'sidebar', 'friendly']

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
      :key="tpl"
      class="tpl-btn"
      :class="{ active: modelValue === tpl }"
      @click="emit('update:modelValue', tpl)"
    >
      {{ tpl }}
    </button>
  </div>
</template>
