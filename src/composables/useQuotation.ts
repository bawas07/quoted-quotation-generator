// Core quotation state management
// Central reactive state for the quotation form with computed totals,
// CRUD methods for every field, and isDirty tracking.

import { ref, computed, watch, type Ref } from 'vue'
import type { QuotationData, LineItem, QuotationStatus, TemplateId, QuotationMeta, Party, QuotationLogo, QuotationTotals } from '../types/quotation'
import { createEmptyQuotation } from '../utils/defaults'

export function useQuotation() {
  const quotation: Ref<QuotationData> = ref(createEmptyQuotation())
  const isDirty: Ref<boolean> = ref(false)

  // ── Computed Totals ──────────────────────────────────────────

  const subtotal = computed(() =>
    quotation.value.line_items.reduce((sum, item) => sum + item.amount, 0)
  )

  const discount_amount = computed(() =>
    subtotal.value * (quotation.value.totals.discount_percent / 100)
  )

  const tax_amount = computed(() =>
    (subtotal.value - discount_amount.value) * (quotation.value.totals.tax_percent / 100)
  )

  const total = computed(() =>
    subtotal.value - discount_amount.value + tax_amount.value
  )

  // ── Dirty Tracking ───────────────────────────────────────────

  // Deep watch catches any mutations not covered by explicit methods.
  // Most mutations are tracked explicitly in each function for reliability.
  let initialLoad = true
  watch(
    quotation,
    () => {
      if (!initialLoad) {
        isDirty.value = true
      }
      initialLoad = false
    },
    { deep: true }
  )

  function markDirty(): void {
    isDirty.value = true
  }

  // ── Lifecycle Methods ────────────────────────────────────────

  function loadQuotation(data: QuotationData): void {
    quotation.value = JSON.parse(JSON.stringify(data)) as QuotationData
    isDirty.value = false
  }

  function resetQuotation(): void {
    quotation.value = createEmptyQuotation()
    isDirty.value = false
  }

  // ── Field Updaters ───────────────────────────────────────────

  function updateMeta(patch: Partial<QuotationMeta>): void {
    Object.assign(quotation.value.meta, patch)
    markDirty()
  }

  function updateFrom(patch: Partial<Party>): void {
    Object.assign(quotation.value.from, patch)
    markDirty()
  }

  function updateTo(patch: Partial<Party>): void {
    Object.assign(quotation.value.to, patch)
    markDirty()
  }

  function setLogo(logo: QuotationLogo | null): void {
    quotation.value.logo = logo
    markDirty()
  }

  function addLineItem(): void {
    quotation.value.line_items.push({
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      unit_price: 0,
      amount: 0,
    })
    markDirty()
  }

  function updateLineItem(id: string, patch: Partial<LineItem>): void {
    const item = quotation.value.line_items.find((i) => i.id === id)
    if (!item) return
    Object.assign(item, patch)
    item.amount = item.quantity * item.unit_price
    markDirty()
  }

  function removeLineItem(id: string): void {
    if (quotation.value.line_items.length <= 1) {
      // Guard: cannot remove the last line item
      // Warning shown via toast in the component layer
      return
    }
    quotation.value.line_items = quotation.value.line_items.filter((i) => i.id !== id)
    markDirty()
  }

  function updateTotals(patch: Partial<Pick<QuotationTotals, 'discount_percent' | 'tax_percent'>> & { tax_label?: string }): void {
    if (patch.discount_percent !== undefined) {
      quotation.value.totals.discount_percent = patch.discount_percent
    }
    if (patch.tax_percent !== undefined) {
      quotation.value.totals.tax_percent = patch.tax_percent
    }
    if (patch.tax_label !== undefined) {
      quotation.value.tax_label = patch.tax_label
    }
    markDirty()
  }

  function setStatus(status: QuotationStatus): void {
    quotation.value.status = status
    markDirty()
  }

  function setTemplate(template: TemplateId): void {
    quotation.value.template = template
    markDirty()
  }

  function setNotes(notes: string): void {
    quotation.value.notes = notes
    markDirty()
  }

  return {
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
    updateLineItem,
    removeLineItem,
    updateTotals,
    setStatus,
    setTemplate,
    setNotes,
  }
}
