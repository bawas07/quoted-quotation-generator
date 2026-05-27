<script setup lang="ts">
// Status selector — clickable badge with dropdown for quotation status

import { ref } from 'vue'
import type { QuotationStatus } from '../../types/quotation'

const STATUS_OPTIONS: QuotationStatus[] = ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED']

const STATUS_CLASS: Record<QuotationStatus, string> = {
  DRAFT: 'draft',
  SENT: 'sent',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
}

const props = defineProps<{
  modelValue: QuotationStatus
}>()

const emit = defineEmits<{
  'update:modelValue': [value: QuotationStatus]
}>()

const open = ref(false)

function toggle(): void {
  open.value = !open.value
}

function select(status: QuotationStatus): void {
  emit('update:modelValue', status)
  open.value = false
}

function onDocumentClick(e: MouseEvent): void {
  // Close dropdown when clicking outside
  const target = e.target as HTMLElement
  if (!target.closest('.status-selector-wrap')) {
    open.value = false
  }
}

// Use event listener on mount — cleaned up with scope
import { onMounted, onUnmounted } from 'vue'

onMounted(() => document.addEventListener('click', onDocumentClick))
onUnmounted(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
  <div class="status-selector-wrap">
    <button
      class="status-badge"
      :class="STATUS_CLASS[props.modelValue]"
      @click.stop="toggle"
    >
      <span class="status-dot"></span>
      <span>{{ props.modelValue }}</span>
      <span class="status-arrow">▾</span>
    </button>

    <div v-if="open" class="status-dropdown">
      <button
        v-for="s in STATUS_OPTIONS"
        :key="s"
        class="status-option"
        :class="{ active: s === props.modelValue }"
        @click="select(s)"
      >
        <span class="status-dot" :class="STATUS_CLASS[s]"></span>
        <span>{{ s }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.status-selector-wrap {
  position: relative;
  display: inline-block;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 13px;
  border-radius: 99px;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  border: 1.5px solid currentColor;
  transition: all 0.15s;
  background: transparent;
}

.status-badge.draft { color: var(--s-draft); }
.status-badge.sent { color: var(--s-sent); }
.status-badge.accepted { color: var(--s-accepted); }
.status-badge.rejected { color: var(--s-rejected); }

.status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

.status-arrow {
  font-size: 7px;
  margin-left: 2px;
}

.status-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 160px;
  background: var(--navy-lt);
  border: 1px solid var(--border-dark-h);
  border-radius: var(--r-sm);
  box-shadow: var(--shadow-drop);
  z-index: 100;
  overflow: hidden;
}

.status-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 14px;
  background: none;
  border: none;
  color: var(--text-on-dark);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.12s;
}

.status-option:hover {
  background: rgba(255, 255, 255, 0.06);
}

.status-option.active {
  background: rgba(74, 144, 196, 0.12);
}

.status-option .status-dot {
  width: 6px;
  height: 6px;
}
</style>
