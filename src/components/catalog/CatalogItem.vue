<script setup lang="ts">
// Catalog item — individual catalog entry display
// Shows name, formatted price, quoted count, last quoted date.
// Edit (✎) and delete (✕) buttons revealed on hover.

import type { CatalogEntry } from '../../types/quotation'
import { formatCurrency } from '../../utils/formatCurrency'

const props = defineProps<{
  item: CatalogEntry
}>()

const emit = defineEmits<{
  edit: [id: string]
  delete: [id: string]
}>()

function handleEdit(): void {
  emit('edit', props.item.id)
}

function handleDelete(): void {
  emit('delete', props.item.id)
}

function lastQuotedDate(): string {
  const h = props.item.history
  if (!h || h.length === 0) return ''
  return h[h.length - 1].date
}
</script>

<template>
  <div class="catalog-item">
    <div class="catalog-item-body">
      <div class="catalog-item-name">{{ item.name }}</div>
      <div class="catalog-item-meta">
        <span class="catalog-item-price">{{ formatCurrency(item.price, item.cur) }}</span>
        <span class="catalog-item-sep">·</span>
        <span>quoted {{ item.times }}×</span>
        <span v-if="lastQuotedDate()" class="catalog-item-sep">·</span>
        <span v-if="lastQuotedDate()">{{ lastQuotedDate() }}</span>
      </div>
    </div>
    <div class="catalog-item-actions">
      <button
        class="cat-action-btn"
        type="button"
        title="Edit"
        @click="handleEdit"
      >✎</button>
      <button
        class="cat-action-btn cat-action-delete"
        type="button"
        title="Delete"
        @click="handleDelete"
      >✕</button>
    </div>
  </div>
</template>

<style scoped>
.catalog-item {
  padding: 11px 0;
  border-bottom: 1px solid var(--border-dark);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.catalog-item:last-child {
  border-bottom: none;
}

.catalog-item-body {
  flex: 1;
  min-width: 0;
}

.catalog-item-name {
  font-size: 13px;
  color: var(--text-on-dark);
  font-weight: 500;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.catalog-item-meta {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-dim);
  letter-spacing: 0.3px;
}

.catalog-item-price {
  color: var(--blue);
}

.catalog-item-sep {
  margin: 0 4px;
  opacity: 0.4;
}

.catalog-item-actions {
  display: flex;
  gap: 3px;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.15s;
}

.catalog-item:hover .catalog-item-actions {
  opacity: 1;
}

.cat-action-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-dim);
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.12s;
}

.cat-action-btn:hover {
  background: rgba(74, 144, 196, 0.15);
  color: var(--text-on-dark);
}

.cat-action-delete:hover {
  background: rgba(192, 57, 43, 0.15);
  color: var(--error);
}
</style>
