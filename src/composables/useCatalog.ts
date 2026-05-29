// Catalog data management
// Singleton composable: module-level catalog ref loaded from localStorage.
// All mutations write through to localStorage immediately.

import { ref, readonly, type Ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { CatalogEntry } from '../types/quotation'
import { storage } from '../utils/localStorage'
import { fuzzySearch } from '../utils/fuzzyMatch'
import { STORAGE_KEYS } from '../types/quotation'

// Module-level singleton state
const catalog: Ref<CatalogEntry[]> = ref([])
let initialized = false

function ensureLoaded(): void {
  if (initialized) return
  const stored = storage.get<CatalogEntry[]>(STORAGE_KEYS.CATALOG)
  catalog.value = stored ?? []
  initialized = true
}

function persist(): void {
  storage.set(STORAGE_KEYS.CATALOG, catalog.value)
}

/**
 * Reset internal module state (for testing only).
 */
export function _resetCatalog(): void {
  catalog.value = []
  initialized = false
}

export function useCatalog() {
  ensureLoaded()

  function addItem(
    entry: Omit<CatalogEntry, 'id' | 'created' | 'updated' | 'times' | 'history'>,
  ): CatalogEntry {
    const now = new Date().toISOString()
    const newEntry: CatalogEntry = {
      ...entry,
      id: uuidv4(),
      times: 0,
      history: [],
      created: now,
      updated: now,
    }
    catalog.value.push(newEntry)
    persist()
    return newEntry
  }

  function updateItem(id: string, patch: Partial<CatalogEntry>): void {
    const idx = catalog.value.findIndex((e) => e.id === id)
    if (idx === -1) return
    catalog.value[idx] = {
      ...catalog.value[idx],
      ...patch,
      updated: new Date().toISOString(),
    }
    persist()
  }

  function removeItem(id: string): void {
    catalog.value = catalog.value.filter((e) => e.id !== id)
    persist()
  }

  function searchCatalog(query: string): CatalogEntry[] {
    if (!query || !query.trim()) {
      // Empty query returns first 6 entries (recent items)
      return catalog.value.slice(0, 6)
    }
    // fuzzySearch already returns entries with score > 0.3, sorted desc
    return fuzzySearch(query, catalog.value).slice(0, 6)
  }

  /**
   * Replace all catalog items with a new set and persist to localStorage.
   * Used by workspace import to restore a merged catalog.
   */
  function replaceAll(items: CatalogEntry[]): void {
    catalog.value = items
    persist()
  }

  return {
    catalog: readonly(catalog) as Ref<CatalogEntry[]>,
    addItem,
    updateItem,
    removeItem,
    searchCatalog,
    replaceAll,
  }
}
