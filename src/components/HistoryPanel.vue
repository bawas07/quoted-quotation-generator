<script setup lang="ts">
// History panel — saved quotation history list
// Displays past quotations with click-to-load, logo indicator, and status badges.

import type { HistoryEntry } from '../composables/useHistory'
import { formatCurrency } from '../utils/formatCurrency'

defineProps<{
  history: HistoryEntry[]
}>()

const emit = defineEmits<{
  'load:entry': [entry: HistoryEntry]
}>()

function handleClick(entry: HistoryEntry): void {
  emit('load:entry', entry)
}

function statusClass(status: string | undefined): string {
  return (status || 'draft').toLowerCase()
}

function formatTotal(entry: HistoryEntry): string {
  const total = entry.totals?.total ?? 0
  const currency = entry.meta?.currency ?? 'IDR'
  return formatCurrency(total, currency)
}
</script>

<template>
  <div class="history-panel">
    <div v-if="history.length === 0" class="hist-empty">
      No quotations yet.<br>Create or upload one.
    </div>

    <div
      v-for="(entry, index) in history"
      :key="entry.meta?.quotation_number || index"
      class="hist-item"
      @click="handleClick(entry)"
    >
      <div class="hist-num">
        <span v-if="entry._hadLogo" class="logo-indicator" title="Original had a logo">📎</span>
        {{ entry.meta?.quotation_number || '—' }}
      </div>
      <div class="hist-client">{{ entry.to?.name || 'No client' }}</div>
      <div class="hist-meta">
        <span>{{ entry.meta?.issue_date || '—' }} · {{ formatTotal(entry) }}</span>
        <span
          class="hist-badge"
          :class="statusClass(entry.status)"
        >{{ entry.status || 'DRAFT' }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.history-panel {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ── Empty state ────────────────────────────────────────────── */
.hist-empty {
  text-align: center;
  padding: 40px 14px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-dim);
  letter-spacing: 0.3px;
  line-height: 2;
}

/* ── Entry row ──────────────────────────────────────────────── */
.hist-item {
  border: 1px solid var(--border-dark);
  border-radius: var(--r-md);
  padding: 12px 14px;
  margin-bottom: 7px;
  cursor: pointer;
  transition: all 0.18s;
  position: relative;
  overflow: hidden;
}

.hist-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--blue);
  transform: scaleY(0);
  transition: transform 0.18s;
}

.hist-item:hover {
  border-color: var(--border-dark-h);
  background: rgba(235, 243, 250, 0.04);
}

.hist-item:hover::before {
  transform: scaleY(1);
}

/* ── Entry content ──────────────────────────────────────────── */
.hist-num {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--blue);
  letter-spacing: 1px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 2px;
}

.logo-indicator {
  font-size: 9px;
  line-height: 1;
}

.hist-client {
  font-size: 13px;
  color: var(--text-on-dark);
  font-weight: 500;
  margin-bottom: 4px;
}

.hist-meta {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-dim);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
}

/* ── Status badge (read-only) ───────────────────────────────── */
.hist-badge {
  padding: 2px 7px;
  border-radius: 99px;
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: 1px solid currentColor;
  flex-shrink: 0;
}

.hist-badge.draft {
  color: var(--s-draft);
}

.hist-badge.sent {
  color: var(--s-sent);
}

.hist-badge.accepted {
  color: var(--s-accepted);
}

.hist-badge.rejected {
  color: var(--s-rejected);
}
</style>
