/**
 * useCatalogSync — catalog sync composable
 *
 * Builds a categorized sync list from line items vs catalog entries
 * using fuzzy matching, classifies each as NEW / UPDATE / SAME,
 * and applies selected items back to the catalog with full
 * price history tracking.
 */

import { ref, computed, readonly, type ComputedRef, type Ref } from 'vue'
import type { LineItem, CatalogEntry, CatalogSyncItem, CurrencyCode } from '../types/quotation'
import { fuzzyFind, looksLikeOneOff } from '../utils/fuzzyMatch'
import { useCatalog } from './useCatalog'

export function useCatalogSync() {
  // ── Internal state ──────────────────────────────────────────

  const syncItems: Ref<CatalogSyncItem[]> = ref([])

  // ── Computed ────────────────────────────────────────────────

  const checkedCount: ComputedRef<number> = computed(
    () => syncItems.value.filter((i) => i.checked).length,
  )

  // ── buildSyncList ───────────────────────────────────────────

  /**
   * Build a categorized sync list from line items vs catalog.
   * Filters empty descriptions, classifies each item, sets initial
   * checked state based on change type and one-off detection.
   */
  function buildSyncList(
    lineItems: LineItem[],
    catalog: CatalogEntry[],
  ): CatalogSyncItem[] {
    const result: CatalogSyncItem[] = []

    for (const item of lineItems) {
      // Skip empty descriptions
      if (!item.description || item.description.trim() === '') continue

      const match = fuzzyFind(item.description, catalog)

      let changeType: 'NEW' | 'UPDATE' | 'SAME'
      let checked: boolean

      if (!match) {
        changeType = 'NEW'
        // Auto-uncheck one-off items (e.g. "Rush Fee", single-word round prices)
        checked = !looksLikeOneOff(item.description, item.unit_price)
      } else if (Math.abs(match.price - item.unit_price) >= 0.01) {
        changeType = 'UPDATE'
        checked = true
      } else {
        changeType = 'SAME'
        checked = false
      }

      result.push({
        item: { ...item },
        match,
        change_type: changeType,
        checked,
      })
    }

    syncItems.value = result
    return result
  }

  // ── applySyncItems ──────────────────────────────────────────

  /**
   * Apply selected sync items to the catalog.
   *
   * - NEW items: added via `useCatalog().addItem()`
   * - UPDATE items: price updated, price history pushed, times_quoted incremented
   * - SAME items: skipped (no changes needed)
   */
  function applySyncItems(
    selectedItems: CatalogSyncItem[],
    currency: CurrencyCode,
    toName: string,
    issueDate: string,
    quotationNumber: string,
  ): void {
    const catalog = useCatalog()

    for (const si of selectedItems) {
      if (si.change_type === 'SAME') continue

      if (si.change_type === 'NEW') {
        catalog.addItem({
          name: si.item.description ?? '',
          desc: '',
          price: si.item.unit_price ?? 0,
          cur: currency,
          unit: '',
        })
      }

      if (si.change_type === 'UPDATE' && si.match) {
        const entry = si.match
        const prevPrice = entry.price

        // Push price history before updating
        const historyEntry = {
          price: prevPrice,
          date: issueDate,
          client: toName,
          num: quotationNumber,
        }

        catalog.updateItem(entry.id, {
          price: si.item.unit_price ?? prevPrice,
          history: [...entry.history, historyEntry],
          times: entry.times + 1,
        })
      }
    }
  }

  // ── Expose ──────────────────────────────────────────────────

  return {
    syncItems: readonly(syncItems) as Ref<CatalogSyncItem[]>,
    checkedCount,
    buildSyncList,
    applySyncItems,
  }
}
