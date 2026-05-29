// Quotation history management
// Singleton composable: module-level history ref loaded from localStorage.
// All mutations write through to localStorage immediately.
// History entries have logo stripped and _hadLogo flag set if original had logo.

import { ref, readonly, type Ref } from 'vue'
import type { QuotationData } from '../types/quotation'
import { storage } from '../utils/localStorage'
import { useToast } from './useToast'
import { STORAGE_KEYS } from '../types/quotation'

/**
 * History entry extends QuotationData with an internal-only _hadLogo flag.
 * The flag is set to true when the original quotation had a logo before stripping.
 * It's only present in localStorage history, never in exported JSON.
 */
export interface HistoryEntry extends QuotationData {
  _hadLogo?: boolean
}

const history: Ref<HistoryEntry[]> = ref([])
let initialized = false

function ensureLoaded(): void {
  if (initialized) return
  const stored = storage.get<HistoryEntry[]>(STORAGE_KEYS.HISTORY)
  history.value = stored ?? []
  initialized = true
}

function persist(): void {
  // Proactive storage check: try writing a small probe value
  try {
    localStorage.setItem('quoted__probe_', '1')
    localStorage.removeItem('quoted__probe_')
  } catch {
    const { showToast } = useToast()
    showToast('Storage full — export your workspace to free up space.', 'warning')
  }

  storage.set(STORAGE_KEYS.HISTORY, history.value)
}

/**
 * Deep clone via JSON round-trip to strip reactivity and prevent mutation.
 */
function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Extract the numeric suffix from a quotation number string.
 * "QUO-001" → 1, "QUO-042" → 42, "QUO-ABC" → 0
 */
function extractNumber(quotationNumber: string): number {
  const match = quotationNumber.match(/\d+/)
  return match ? parseInt(match[0], 10) : 0
}

export function useHistory() {
  ensureLoaded()

  /**
   * Add a quotation to history.
   * - Strips logo (base64) to reduce storage size
   * - Sets _hadLogo = true if original had a logo
   * - Deduplicates by meta.quotation_number (latest wins)
   * - Caps at 50 entries, oldest dropped
   * - Writes through to localStorage
   */
  function addToHistory(quotation: QuotationData): void {
    const entry = clone(quotation) as HistoryEntry

    // Strip logo and mark if one existed
    const hadLogo = entry.logo !== null && (entry.logo?.data?.length ?? 0) > 0
    entry._hadLogo = hadLogo
    entry.logo = null

    // Refresh updated_at to now
    entry.updated_at = new Date().toISOString()

    // Deduplicate: remove existing entry with same quotation_number
    const existingIdx = history.value.findIndex(
      (h) => h.meta?.quotation_number === entry.meta?.quotation_number
    )
    if (existingIdx !== -1) {
      history.value.splice(existingIdx, 1)
    }

    // Insert at top (newest first)
    history.value.unshift(entry)

    // Cap at 50 entries, oldest dropped
    if (history.value.length > 50) {
      history.value = history.value.slice(0, 50)
    }

    persist()
  }

  /**
   * Load a quotation from history by index.
   * Returns a deep clone to prevent mutation of stored data.
   */
  function loadFromHistory(index: number): HistoryEntry {
    if (index < 0 || index >= history.value.length) {
      throw new Error(`History index ${index} out of bounds (length: ${history.value.length})`)
    }
    return clone(history.value[index]) as HistoryEntry
  }

  /**
   * Clear all history entries from memory and localStorage.
   */
  function clearHistory(): void {
    history.value = []
    storage.remove(STORAGE_KEYS.HISTORY)
  }

  /**
   * Scan all history entries and return the next quotation number.
   * Finds the highest numeric suffix in existing entries and returns max + 1.
   * Returns 1 if history is empty or no numeric entries exist.
   */
  function getNextQuotationNumber(): number {
    if (history.value.length === 0) return 1
    let maxNum = 0
    for (const entry of history.value) {
      const num = extractNumber(entry.meta?.quotation_number || '')
      if (num > maxNum) {
        maxNum = num
      }
    }
    return maxNum + 1
  }

  return {
    history: readonly(history) as Ref<HistoryEntry[]>,
    addToHistory,
    loadFromHistory,
    clearHistory,
    getNextQuotationNumber,
  }
}

/**
 * Reset internal module state (for testing only).
 */
export function _resetHistory(): void {
  history.value = []
  initialized = false
}
