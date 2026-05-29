<script setup lang="ts">
// Catalog panel — browse and search catalog items
// Composes CatalogSearch, v-for CatalogItem, add/edit/delete wiring,
// workspace export/import placeholder buttons, empty state.

import { ref, computed } from 'vue'
import type { CatalogEntry } from '../../types/quotation'
import { useCatalog } from '../../composables/useCatalog'
import { useWorkspaceIO } from '../../composables/useWorkspaceIO'
import { useToast } from '../../composables/useToast'
import CatalogSearch from './CatalogSearch.vue'
import CatalogItem from './CatalogItem.vue'

const { catalog, searchCatalog, removeItem } = useCatalog()
const { showToast } = useToast()
const { exportWorkspace, importWorkspace } = useWorkspaceIO()

// ── Emits ─────────────────────────────────────────────────────

const emit = defineEmits<{
  'add:item': []
  'edit:item': [item: CatalogEntry]
}>()

// ── Search state ──────────────────────────────────────────────

const searchQuery = ref('')
const filteredItems = computed<CatalogEntry[]>(() => {
  if (!searchQuery.value) {
    return catalog.value
  }
  return searchCatalog(searchQuery.value)
})

function onSearch(query: string): void {
  searchQuery.value = query
}

// ── Add / Edit ────────────────────────────────────────────────

function openAddDrawer(): void {
  emit('add:item')
}

function openEditDrawer(id: string): void {
  const item = catalog.value.find((c) => c.id === id)
  if (item) {
    emit('edit:item', item)
  }
}

// ── Delete ────────────────────────────────────────────────────

function handleDelete(id: string): void {
  if (!confirm('Remove this item from catalog?')) return
  removeItem(id)
  showToast('Item removed from catalog', 'success')
}

// ── Export / Import ───────────────────────────────────────────

function handleExport(): void {
  exportWorkspace()
}

const importFileInput = ref<HTMLInputElement | null>(null)

function handleImportFile(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  input.value = ''
  importWorkspace(file)
}

function triggerImport(): void {
  importFileInput.value?.click()
}
</script>

<template>
  <div class="catalog-panel">
    <!-- Search -->
    <CatalogSearch @search="onSearch" />

    <!-- Add Item button -->
    <button class="add-item-btn" type="button" @click="openAddDrawer">
      + Add Item
    </button>

    <!-- Item list or empty state -->
    <div class="catalog-list">
      <div v-if="catalog.length === 0" class="catalog-empty">
        Your catalog is empty. Items appear here automatically after your first sent quotation.
      </div>

      <CatalogItem
        v-for="item in filteredItems"
        :key="item.id"
        :item="item"
        @edit="openEditDrawer"
        @delete="handleDelete"
      />
    </div>

    <!-- Export / Import buttons -->
    <div class="catalog-footer">
      <button class="footer-btn" type="button" @click="handleExport">
        ↓ Export Workspace
      </button>
      <input
        ref="importFileInput"
        type="file"
        accept=".json"
        style="display:none"
        @change="handleImportFile"
      />
      <button class="footer-btn" type="button" @click="triggerImport">
        ↑ Import Workspace
      </button>
    </div>
  </div>
</template>

<style scoped>
.catalog-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* ── Add Item button ────────────────────────────────────────── */
.add-item-btn {
  margin-bottom: 8px;
  padding: 8px 16px;
  background: rgba(74, 144, 196, 0.1);
  border: 1.5px dashed var(--blue);
  border-radius: var(--r-sm);
  color: var(--blue);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.15s;
  width: 100%;
}

.add-item-btn:hover {
  background: rgba(74, 144, 196, 0.2);
}

/* ── Item list ──────────────────────────────────────────────── */
.catalog-list {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.catalog-empty {
  padding: 24px 12px;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-dim);
  line-height: 1.6;
}

/* ── Footer ─────────────────────────────────────────────────── */
.catalog-footer {
  display: flex;
  gap: 6px;
  padding-top: 8px;
  border-top: 1px solid var(--border-dark);
  margin-top: auto;
}

.footer-btn {
  flex: 1;
  padding: 7px 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-dark);
  border-radius: var(--r-sm);
  color: var(--text-dim);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.12s;
}

.footer-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-on-dark);
  border-color: var(--border-dark-h);
}
</style>
