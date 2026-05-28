// Autocomplete — catalog item search and selection for line items
// Singleton composable managing per-row reactive autocomplete state.
// Methods accept itemId to operate on specific line item rows.

import { reactive } from 'vue'
import type { CatalogEntry, CurrencyCode } from '../types/quotation'
import { useCatalog } from './useCatalog'

// ── Module-level reactive maps ────────────────────────────────

const results: Record<string, CatalogEntry[]> = reactive({})
const isOpen: Record<string, boolean> = reactive({})
const highlightedIndex: Record<string, number> = reactive({})

// Query cache (not reactive — internal tracking only)
const queries: Record<string, string> = {}

// Per-row blur timers for delayed close
const blurTimers: Record<string, ReturnType<typeof setTimeout>> = {}

/**
 * Reset internal module state (for testing only).
 */
export function _resetAutocomplete(): void {
  Object.keys(results).forEach((k) => delete results[k])
  Object.keys(isOpen).forEach((k) => delete isOpen[k])
  Object.keys(highlightedIndex).forEach((k) => delete highlightedIndex[k])
  Object.keys(queries).forEach((k) => delete queries[k])
  Object.keys(blurTimers).forEach((k) => {
    clearTimeout(blurTimers[k])
    delete blurTimers[k]
  })
}

/**
 * Normalize an itemId so state lookups are predictable.
 * For line items this is just the item.id string.
 */
function key(itemId: string): string {
  return itemId
}

// ── Composable ────────────────────────────────────────────────

export function useAutocomplete() {
  const { searchCatalog, addItem } = useCatalog()

  /**
   * Fuzzy-search the catalog and update results for the given row.
   * Search fires on every keystroke. Empty query shows recent items (first 6).
   */
  function search(itemId: string, query: string): void {
    const k = key(itemId)
    queries[k] = query
    results[k] = searchCatalog(query)
    isOpen[k] = results[k].length > 0 || query.length >= 1
    highlightedIndex[k] = 0
  }

  /**
   * Select an item from the results by index.
   * Returns the entry's name and price, and closes the dropdown.
   */
  function select(
    itemId: string,
    index: number,
  ): { description: string; unit_price: number } | null {
    const k = key(itemId)
    const items = results[k]
    if (!items || !items[index]) return null
    const entry = items[index]
    isOpen[k] = false
    return { description: entry.name, unit_price: entry.price }
  }

  /**
   * Create a new catalog entry from typed text and return it for selection.
   * Adds with price 0 so the user can set the price afterward.
   */
  function createAndSelect(
    itemId: string,
    name: string,
    currency: CurrencyCode = 'IDR',
  ): { description: string; unit_price: number } {
    const k = key(itemId)
    const entry = addItem({
      name: name.trim(),
      desc: '',
      price: 0,
      cur: currency,
      unit: '',
    })
    isOpen[k] = false
    return { description: entry.name, unit_price: 0 }
  }

  /**
   * Close the dropdown for a given row (immediately).
   */
  function close(itemId: string): void {
    const k = key(itemId)
    isOpen[k] = false
  }

  /**
   * Handle keyboard events for autocomplete navigation.
   * Returns an action descriptor for the caller to execute.
   */
  function handleKeydown(
    event: KeyboardEvent,
    itemId: string,
  ): { action: 'select' | 'close' | null; index?: number } {
    const k = key(itemId)
    if (!isOpen[k]) return { action: null }

    const items = results[k] ?? []
    const maxIndex = items.length

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault()
        if (maxIndex <= 0) return { action: null }
        const current = highlightedIndex[k] ?? 0
        highlightedIndex[k] = Math.min(current + 1, maxIndex - 1)
        return { action: null }
      }
      case 'ArrowUp': {
        event.preventDefault()
        const current = highlightedIndex[k] ?? 0
        highlightedIndex[k] = Math.max(current - 1, 0)
        return { action: null }
      }
      case 'Enter': {
        event.preventDefault()
        const idx = highlightedIndex[k] ?? 0
        if (idx >= 0 && idx < maxIndex) {
          return { action: 'select', index: idx }
        }
        return { action: null }
      }
      case 'Escape': {
        event.preventDefault()
        isOpen[k] = false
        return { action: 'close' }
      }
      default:
        return { action: null }
    }
  }

  /**
   * Remove all state for a given row (cleanup on row removal).
   */
  function cleanup(itemId: string): void {
    const k = key(itemId)
    delete results[k]
    delete isOpen[k]
    delete highlightedIndex[k]
    delete queries[k]
    if (blurTimers[k]) {
      clearTimeout(blurTimers[k])
      delete blurTimers[k]
    }
  }

  /**
   * Blur handler with 150ms delay to allow mousedown on dropdown items.
   */
  function handleBlur(itemId: string, callback: () => void): void {
    const k = key(itemId)
    if (blurTimers[k]) {
      clearTimeout(blurTimers[k])
    }
    blurTimers[k] = setTimeout(() => {
      callback()
      delete blurTimers[k]
    }, 150)
  }

  return {
    results,
    isOpen,
    highlightedIndex,
    search,
    select,
    createAndSelect,
    close,
    handleKeydown,
    cleanup,
    handleBlur,
  }
}
