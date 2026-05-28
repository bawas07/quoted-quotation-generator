<script setup lang="ts">
// App shell — two-column layout
// Composes all sidebar form components and preview components,
// wires all composables into a reactive quotation editing experience.

import { ref, watch } from 'vue'
import type { LineItem, CatalogEntry, CatalogSyncItem, QuotationStatus, TemplateId } from './types/quotation'

// Composables
import { useQuotation } from './composables/useQuotation'
import { exportQuotation, parseQuotationFile } from './composables/useJsonIO'
import { useToast } from './composables/useToast'
import { useCatalogSync } from './composables/useCatalogSync'
import { useCatalog } from './composables/useCatalog'

// Shells
import SidebarShell from './components/sidebar/SidebarShell.vue'
import PreviewPanel from './components/preview/PreviewPanel.vue'

// Sidebar form components
import LogoUpload from './components/sidebar/LogoUpload.vue'
import PartyFields from './components/sidebar/PartyFields.vue'
import MetaFields from './components/sidebar/MetaFields.vue'
import StatusSelector from './components/sidebar/StatusSelector.vue'
import LineItemsTable from './components/sidebar/LineItemsTable.vue'
import TotalsFields from './components/sidebar/TotalsFields.vue'
import NotesField from './components/sidebar/NotesField.vue'
import CatalogPanel from './components/catalog/CatalogPanel.vue'
import CatalogEditDrawer from './components/catalog/CatalogEditDrawer.vue'
import AppButton from './components/shared/AppButton.vue'
import AppToast from './components/shared/AppToast.vue'
import CatalogSyncPopup from './components/catalog/CatalogSyncPopup.vue'

// Preview components
import StatusBar from './components/preview/StatusBar.vue'
import TemplateSwitcher from './components/preview/TemplateSwitcher.vue'

// ── Composable instances ──────────────────────────────────────

const {
  quotation,
  isDirty,
  subtotal,
  discount_amount,
  tax_amount,
  total,
  loadQuotation,
  resetQuotation,
  updateMeta,
  updateFrom,
  updateTo,
  setLogo,
  addLineItem,
  removeLineItem,
  updateTotalsConfig,
  setStatus,
  setTemplate,
  setNotes,
} = useQuotation()

const { showToast } = useToast()
const catalogSync = useCatalogSync()
const { catalog } = useCatalog()

// ── Sync Popup State ──────────────────────────────────────────

const showSyncPopup = ref(false)
const pendingSyncItems = ref<CatalogSyncItem[]>([])

// ── Tab Switching ─────────────────────────────────────────────

type Tab = 'editor' | 'history' | 'catalog'
const activeTab = ref<Tab>('editor')

// ── Catalog Drawer State ─────────────────────────────────────

const showCatalogDrawer = ref(false)
const editingCatalogItem = ref<CatalogEntry | null>(null)

function openCatalogAddDrawer(): void {
  editingCatalogItem.value = null
  showCatalogDrawer.value = true
}

function openCatalogEditDrawer(item: CatalogEntry): void {
  editingCatalogItem.value = item
  showCatalogDrawer.value = true
}

function closeCatalogDrawer(): void {
  showCatalogDrawer.value = false
  editingCatalogItem.value = null
}

// ── Import file input ─────────────────────────────────────────

const importFileInput = ref<HTMLInputElement | null>(null)

async function handleImportFile(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    const data = await parseQuotationFile(file)
    loadQuotation(data)
    showToast('Quotation loaded successfully', 'success')
  } catch (err) {
    showToast(err instanceof Error ? err.message : 'Failed to import quotation', 'error')
  }
  input.value = ''
}

function triggerImport(): void {
  importFileInput.value?.click()
}

function handleDownload(): void {
  // Merge computed totals into a snapshot before serialization
  // The stored totals are never written back — computed values are the source of truth
  const forExport = {
    ...quotation.value,
    totals: {
      ...quotation.value.totals,
      subtotal: subtotal.value,
      discount_amount: discount_amount.value,
      tax_amount: tax_amount.value,
      total: total.value,
    },
  }
  exportQuotation(forExport)
  showToast('Quotation downloaded', 'success')
}

function handlePdf(): void {
  showToast('PDF export coming soon', 'warning')
}

// ── Unsaved Changes Confirmation ──────────────────────────────

const showUnsavedConfirm = ref(false)

function handleNew(): void {
  if (isDirty.value) {
    showUnsavedConfirm.value = true
  } else {
    resetQuotation()
    showToast('New quotation created', 'success')
  }
}

function confirmDiscard(): void {
  showUnsavedConfirm.value = false
  resetQuotation()
  showToast('New quotation created', 'success')
}

function cancelDiscard(): void {
  showUnsavedConfirm.value = false
}

// ── Line item handlers ────────────────────────────────────────

function handleAddItem(): void {
  addLineItem()
}

function handleRemoveItem(id: string): void {
  if (quotation.value.line_items.length <= 1) {
    showToast('Cannot remove the last line item', 'warning')
    return
  }
  removeLineItem(id)
}

function handleUpdateItems(items: LineItem[]): void {
  quotation.value.line_items = items
}

// ── Status Change Handler (catalog sync interception) ─────────

function handleStatusChange(val: QuotationStatus): void {
  if (val !== 'SENT') {
    setStatus(val)
    return
  }

  // Build sync list from current line items vs catalog
  const syncItems = catalogSync.buildSyncList(
    quotation.value.line_items,
    catalog.value,
  )

  if (syncItems.length === 0) {
    setStatus('SENT')
    showToast('Status updated to SENT')
    return
  }

  // Show popup, delay status update
  pendingSyncItems.value = syncItems
  showSyncPopup.value = true
}

// ── Sync Popup Event Handlers ─────────────────────────────────

function handleSyncSaveSelected(checkedItems: CatalogSyncItem[]): void {
  // Filter out SAME items — they're skipped by applySyncItems
  const toApply = checkedItems.filter((i) => i.change_type !== 'SAME')

  catalogSync.applySyncItems(
    toApply,
    quotation.value.meta.currency,
    quotation.value.to.name,
    quotation.value.meta.issue_date,
    quotation.value.meta.quotation_number,
  )
  setStatus('SENT')
  showToast(`${toApply.length} items saved to catalog ✓`)
  showSyncPopup.value = false
  pendingSyncItems.value = []
}

function handleSyncSaveAll(items: CatalogSyncItem[]): void {
  // Filter out SAME items — they're skipped by applySyncItems
  const toApply = items.filter((i) => i.change_type !== 'SAME')

  catalogSync.applySyncItems(
    toApply,
    quotation.value.meta.currency,
    quotation.value.to.name,
    quotation.value.meta.issue_date,
    quotation.value.meta.quotation_number,
  )
  setStatus('SENT')
  showToast(`${toApply.length} items saved to catalog ✓`)
  showSyncPopup.value = false
  pendingSyncItems.value = []
}

function handleSyncClose(): void {
  setStatus('SENT')
  showToast('Status updated to SENT, catalog unchanged')
  showSyncPopup.value = false
  pendingSyncItems.value = []
}

// ── 80ms debounce for preview updates ─────────────────────────

const debouncedNumber = ref(quotation.value.meta.quotation_number)
const debouncedClient = ref(quotation.value.to.name)
const debouncedTemplate = ref(quotation.value.template)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(
  [
    () => quotation.value.meta.quotation_number,
    () => quotation.value.to.name,
    () => quotation.value.template,
  ],
  ([num, name, tpl]) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      debouncedNumber.value = num
      debouncedClient.value = name
      debouncedTemplate.value = tpl
    }, 80)
  },
  { flush: 'post' },
)
</script>

<template>
  <div class="app">
    <!-- ════ SIDEBAR ════ -->
    <SidebarShell>
      <div class="sidebar-header">
        <div class="brand">
          <div class="brand-icon">✦</div>
          Quoted
        </div>
        <div class="brand-sub">by Bawas · Quotation Generator</div>
      </div>

      <div class="tabs">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'editor' }"
          @click="activeTab = 'editor'"
        >Editor</button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'history' }"
          @click="activeTab = 'history'"
        >History</button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'catalog' }"
          @click="activeTab = 'catalog'"
        >Catalog</button>
      </div>

      <div class="sidebar-body">
        <!-- Editor tab -->
        <div class="tab-pane" :class="{ active: activeTab === 'editor' }">
          <LogoUpload
            :modelValue="quotation.logo"
            @update:modelValue="(val) => setLogo(val)"
          />

          <PartyFields
            label="From"
            :modelValue="quotation.from"
            @update:modelValue="(val) => updateFrom(val)"
          />

          <PartyFields
            label="To"
            :modelValue="quotation.to"
            @update:modelValue="(val) => updateTo(val)"
          />

          <MetaFields
            :meta="quotation.meta"
            @update:meta="(val) => updateMeta(val)"
          />

          <LineItemsTable
            :items="quotation.line_items"
            :currency="quotation.meta.currency"
            @update:items="handleUpdateItems"
            @add:item="handleAddItem"
            @remove:item="handleRemoveItem"
          />

          <TotalsFields
            :totals="quotation.totals"
            :currency="quotation.meta.currency"
            :subtotal="subtotal"
            :discountAmount="discount_amount"
            :taxAmount="tax_amount"
            :total="total"
            :taxLabel="quotation.tax_label"
            @update:totals="(patch) => updateTotalsConfig(patch)"
          />

          <NotesField
            :modelValue="quotation.notes"
            @update:modelValue="(val) => setNotes(val)"
          />
        </div>

        <!-- History tab -->
        <div class="tab-pane" :class="{ active: activeTab === 'history' }">
          <div class="hist-empty">No quotations yet.<br>Create or upload one.</div>
        </div>

        <!-- Catalog tab -->
        <div class="tab-pane" :class="{ active: activeTab === 'catalog' }">
          <CatalogPanel
            @add:item="openCatalogAddDrawer"
            @edit:item="openCatalogEditDrawer"
          />
        </div>
      </div>

      <!-- Catalog Edit Drawer (top-level overlay) -->
      <CatalogEditDrawer
        :open="showCatalogDrawer"
        :editing-item="editingCatalogItem"
        @close="closeCatalogDrawer"
      />

      <!-- Unsaved changes confirmation overlay -->
      <div v-if="showUnsavedConfirm" class="unsaved-overlay">
        <div class="unsaved-card">
          <p class="unsaved-text">Discard unsaved changes?</p>
          <div class="unsaved-actions">
            <button class="btn btn-ghost btn-sm" @click="cancelDiscard">Cancel</button>
            <button class="btn btn-primary btn-sm" @click="confirmDiscard">Discard</button>
          </div>
        </div>
      </div>

      <div class="sidebar-actions">
        <input
          ref="importFileInput"
          type="file"
          accept=".json"
          style="display:none"
          @change="handleImportFile"
        />
        <AppButton variant="ghost" size="sm" @click="triggerImport">
          ↑ Upload
        </AppButton>
        <AppButton variant="primary" size="sm" @click="handleDownload">
          ↓ JSON
        </AppButton>
        <AppButton variant="secondary" size="sm" @click="handlePdf">
          ⎙ PDF
        </AppButton>
        <AppButton variant="ghost" size="sm" @click="handleNew">
          + New
        </AppButton>
      </div>
    </SidebarShell>

    <!-- ════ PREVIEW PANEL ════ -->
    <PreviewPanel>
      <div class="preview-topbar">
        <TemplateSwitcher
          :modelValue="debouncedTemplate"
          @update:modelValue="(tpl: TemplateId) => setTemplate(tpl)"
        />
        <div class="preview-actions">
          <div class="status-wrap">
            <StatusSelector
              :modelValue="quotation.status"
              @update:modelValue="handleStatusChange"
            />
          </div>
        </div>
      </div>

      <StatusBar
        :quotationNumber="debouncedNumber"
        :clientName="debouncedClient"
      />

      <div class="preview-scroll">
        <div class="invoice-paper">
          <!-- Template render target — M4 -->
        </div>
      </div>
    </PreviewPanel>

    <!-- ════ SYNC POPUP ════ -->
    <CatalogSyncPopup
      v-if="showSyncPopup"
      :open="showSyncPopup"
      :items="pendingSyncItems"
      :quotationNumber="quotation.meta.quotation_number"
      :clientName="quotation.to.name"
      :currency="quotation.meta.currency"
      @close="handleSyncClose"
      @save-selected="handleSyncSaveSelected"
      @save-all="handleSyncSaveAll"
    />

    <!-- ════ TOAST CONTAINER ════ -->
    <AppToast />
  </div>
</template>

<style scoped>
/* Unsaved changes confirmation overlay */
.unsaved-overlay {
  position: absolute;
  inset: 0;
  background: rgba(26, 44, 61, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(4px);
}

.unsaved-card {
  background: var(--navy-mid);
  border: 1px solid var(--border-dark-h);
  border-radius: var(--r-md);
  padding: 24px 28px;
  text-align: center;
  box-shadow: var(--shadow-drop);
}

.unsaved-text {
  font-family: var(--font-sans);
  font-size: var(--text-md);
  color: var(--text-on-dark);
  margin: 0 0 16px;
}

.unsaved-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
