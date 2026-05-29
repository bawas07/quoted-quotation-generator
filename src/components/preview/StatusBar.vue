<script setup lang="ts">
// Status bar — live quotation number, client name, and status badge dropdown
// Status is shown on the right side with a clickable dropdown

import { ref, onMounted, onUnmounted } from 'vue'
import type { QuotationStatus } from '../../types/quotation'

const STATUS_OPTIONS: QuotationStatus[] = ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED']

const STATUS_CLASS: Record<QuotationStatus, string> = {
  DRAFT: 'draft',
  SENT: 'sent',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
}

const props = defineProps<{
  quotationNumber: string
  clientName: string
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
  const target = e.target as HTMLElement
  if (!target.closest('.sb-status-wrap')) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onUnmounted(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
  <div class="status-bar">
    <div class="sb-left">
      <span class="sb-num">{{ quotationNumber }}</span>
      <span>·</span>
      <span>{{ clientName || '—' }}</span>
    </div>

    <div class="sb-right">
      <div class="sb-status-wrap">
        <button
          class="status-badge"
          :class="STATUS_CLASS[props.modelValue]"
          @click.stop="toggle"
        >
          <span class="status-dot"></span>
          <span>{{ props.modelValue }}</span>
          <span class="status-arrow">▾</span>
        </button>

        <div v-if="open" class="sb-status-dropdown">
          <button
            v-for="s in STATUS_OPTIONS"
            :key="s"
            class="sb-status-option"
            :class="{ active: s === props.modelValue }"
            @click="select(s)"
          >
            <span class="status-dot" :class="STATUS_CLASS[s]"></span>
            <span>{{ s }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 32px;
  background: rgba(235, 243, 250, 0.40);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
}

.sb-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sb-num {
  color: var(--blue);
  letter-spacing: 1px;
}

.sb-right {
  display: flex;
  align-items: center;
}

.sb-status-wrap {
  position: relative;
  display: inline-block;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
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

.sb-status-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 148px;
  background: var(--cloud);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-float);
  z-index: 200;
  overflow: hidden;
}

.sb-status-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 14px;
  background: none;
  border: none;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.1s;
}

.sb-status-option:hover {
  background: var(--blue-pale);
}

.sb-status-option.active {
  background: var(--blue-pale);
  color: var(--blue-dark);
}

.sb-status-option .status-dot {
  width: 6px;
  height: 6px;
}
</style>
