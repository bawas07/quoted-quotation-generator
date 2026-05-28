<script setup lang="ts">
/**
 * CatalogSyncPopup — sync review modal
 *
 * Displays a modal with all line items categorized as NEW/UPDATE/SAME,
 * lets the user check/uncheck items, and emits save-selected, save-all,
 * or close actions.
 */

import { ref, computed, watch } from 'vue'
import type { CatalogSyncItem, CurrencyCode } from '../../types/quotation'
import { formatCurrency } from '../../utils/formatCurrency'
import AppModal from '../shared/AppModal.vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    items: CatalogSyncItem[]
    quotationNumber: string
    clientName: string
    currency?: CurrencyCode
  }>(),
  {
    open: false,
    currency: 'IDR',
  },
)

const emit = defineEmits<{
  close: []
  'save-selected': [items: CatalogSyncItem[]]
  'save-all': [items: CatalogSyncItem[]]
}>()

// ── Local editable copy of items ──────────────────────────────

const localItems = ref<CatalogSyncItem[]>([])

watch(
  () => props.items,
  (newItems) => {
    // Deep clone to avoid mutating the parent's readonly ref
    localItems.value = JSON.parse(JSON.stringify(newItems))
  },
  { immediate: true },
)

// ── Computed ──────────────────────────────────────────────────

const checkedCount = computed(() =>
  localItems.value.filter((i) => i.checked).length,
)

const checkedItems = computed(() =>
  localItems.value.filter((i) => i.checked),
)

// ── Handlers ──────────────────────────────────────────────────

function toggleItem(index: number, checked: boolean): void {
  if (localItems.value[index]) {
    localItems.value[index] = {
      ...localItems.value[index],
      checked,
    }
  }
}

function handleSaveSelected(): void {
  emit('save-selected', checkedItems.value)
}

function handleSaveAll(): void {
  emit('save-all', localItems.value)
}

function handleClose(): void {
  emit('close')
}

// ── Helpers ───────────────────────────────────────────────────

function cpillClass(type: string): string {
  switch (type) {
    case 'NEW':
      return 'cpill new'
    case 'UPDATE':
      return 'cpill update'
    case 'SAME':
      return 'cpill same'
    default:
      return 'cpill'
  }
}

function cpillLabel(type: string): string {
  switch (type) {
    case 'NEW':
      return '● NEW'
    case 'UPDATE':
      return '▲ UPDATE'
    case 'SAME':
      return '✓ SAME'
    default:
      return type
  }
}

function lastHistoryEntry(item: CatalogSyncItem): string {
  if (!item.match || !item.match.history || item.match.history.length === 0) {
    return ''
  }
  const last = item.match.history[item.match.history.length - 1]
  return `was ${formatCurrency(last.price, item.match.cur)} · ${last.date} · ${last.client}`
}
</script>

<template>
  <AppModal
    :open="open"
    :closable="true"
    title="Save to Catalog?"
    :subtitle="`Review items from ${quotationNumber} · ${clientName}`"
    @close="handleClose"
  >
    <!-- Empty state -->
    <div v-if="localItems.length === 0" class="sync-empty">
      No new or updated items found.
    </div>

    <!-- Item list -->
    <div v-else class="sync-list">
      <div
        v-for="(syncItem, index) in localItems"
        :key="syncItem.item.id ?? index"
        class="sync-item"
      >
        <input
          type="checkbox"
          class="sync-cb"
          :checked="syncItem.checked"
          @change="(e) => toggleItem(index, (e.target as HTMLInputElement).checked)"
        />

        <div class="sync-body">
          <div class="sync-name">{{ syncItem.item.description }}</div>

          <span :class="cpillClass(syncItem.change_type)">
            {{ cpillLabel(syncItem.change_type) }}
          </span>

          <div v-if="syncItem.change_type === 'UPDATE'" class="sync-hist">
            {{ lastHistoryEntry(syncItem) }}
          </div>
        </div>

        <div class="sync-price">
          {{ formatCurrency(syncItem.item.unit_price ?? 0, currency) }}
        </div>
      </div>
    </div>

    <!-- Footer actions -->
    <template #footer>
      <button
        class="btn btn-primary btn-sm"
        :disabled="checkedCount === 0"
        @click="handleSaveSelected"
      >
        Save Selected ({{ checkedCount }})
      </button>

      <button
        class="btn btn-secondary btn-sm"
        @click="handleSaveAll"
      >
        Save All
      </button>

      <button
        class="btn btn-ghost btn-sm"
        @click="handleClose"
      >
        Skip
      </button>
    </template>
  </AppModal>
</template>

<style scoped>
.sync-list {
  padding: 4px 0;
}

.sync-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px solid var(--border);
}

.sync-item:last-child {
  border-bottom: none;
}

.sync-cb {
  margin-top: 3px;
  accent-color: var(--blue);
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  cursor: pointer;
}

.sync-body {
  flex: 1;
  min-width: 0;
}

.sync-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.sync-hist {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-muted);
  margin-top: 3px;
}

.sync-price {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  flex-shrink: 0;
}

.cpill {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 99px;
}

.cpill.new {
  color: var(--c-new);
  background: rgba(46, 125, 90, 0.1);
}

.cpill.update {
  color: var(--c-update);
  background: rgba(176, 125, 42, 0.1);
}

.cpill.same {
  color: var(--c-same);
  background: rgba(138, 159, 176, 0.1);
}

.sync-empty {
  text-align: center;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
  padding: 24px 0;
}
</style>
