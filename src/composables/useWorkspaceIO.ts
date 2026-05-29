// Workspace IO — export/import full workspace backup (catalog + history)
// Singleton composable that reads from useCatalog and useHistory stores
// to produce or consume a combined workspace backup JSON file.

import { useCatalog } from './useCatalog'
import { useHistory } from './useHistory'
import { useToast } from './useToast'
import { normalize } from '../utils/fuzzyMatch'
import type { WorkspaceBackup, CatalogEntry, QuotationData } from '../types/quotation'

function todayDateString(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Deep clone via JSON round-trip.
 */
function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function useWorkspaceIO() {
  const { catalog } = useCatalog()
  const { history } = useHistory()
  const { showToast } = useToast()

  /**
   * Export the entire workspace as a backup JSON file.
   * Combines catalog + history into a WorkspaceBackup object and triggers download.
   * History entries already have logos stripped (handled by useHistory).
   */
  function exportWorkspace(): void {
    const backup: WorkspaceBackup = {
      schema_version: '1.0',
      type: 'workspace_backup',
      exported_at: new Date().toISOString(),
      catalog: clone(catalog.value),
      history: clone(history.value),
    }

    const json = JSON.stringify(backup, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `workspace_backup_${todayDateString()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    showToast('Workspace exported ✓')
  }

  /**
   * Import a workspace backup file.
   * Validates schema_version and type, then merges catalog and history
   * into the existing stores with conflict resolution (latest updated_at wins).
   */
  async function importWorkspace(file: File): Promise<void> {
    try {
      const text = await file.text()
      let parsed: unknown

      try {
        parsed = JSON.parse(text)
      } catch {
        showToast('Couldn\'t read this file.', 'error')
        return
      }

      // Validate shape
      if (!parsed || typeof parsed !== 'object') {
        showToast('Couldn\'t read this file.', 'error')
        return
      }

      const backup = parseAndValidateWorkspace(parsed)
      if (!backup) {
        showToast('Couldn\'t read this file.', 'error')
        return
      }

      applyWorkspaceData(backup)
    } catch {
      showToast('Couldn\'t read this file.', 'error')
    }
  }

  /**
   * Import workspace data that has already been parsed and validated.
   * Used when App.vue detects a workspace_backup type during JSON upload.
   */
  function importWorkspaceData(data: WorkspaceBackup): void {
    applyWorkspaceData(data)
    const catCount = data.catalog?.length || 0
    const histCount = data.history?.length || 0
    showToast(
      `Workspace restored — ${catCount} item${catCount !== 1 ? 's' : ''}, ` +
      `${histCount} quotation${histCount !== 1 ? 's' : ''} ✓`
    )
  }

  return {
    exportWorkspace,
    importWorkspace,
    importWorkspaceData,
  }
}

// ── Internal helpers ──────────────────────────────────────

/**
 * Parse and validate an unknown value as a WorkspaceBackup.
 * Returns the parsed backup or null if invalid.
 */
function parseAndValidateWorkspace(parsed: unknown): WorkspaceBackup | null {
  if (!parsed || typeof parsed !== 'object') return null
  const data = parsed as Record<string, unknown>
  if (data.schema_version !== '1.0' || data.type !== 'workspace_backup') return null
  return data as unknown as WorkspaceBackup
}

/**
 * Apply merged workspace data to the catalog and history stores.
 * Shared by importWorkspace (file) and importWorkspaceData (parsed).
 */
function applyWorkspaceData(backup: WorkspaceBackup): void {
  const { catalog, replaceAll } = useCatalog()
  const { history, addToHistory, clearHistory } = useHistory()

  // Merge catalog
  const importedCatalog = backup.catalog || []
  const currentCatalog = clone(catalog.value)
  const mergedCatalog = mergeCatalogItems(currentCatalog, importedCatalog)

  // Merge history
  const importedHistory = backup.history || []
  const currentHistory = clone(history.value)
  const mergedHistory = mergeHistoryEntries(currentHistory, importedHistory)

  // Persist merged data
  replaceAll(mergedCatalog)

  clearHistory()
  for (const entry of mergedHistory) {
    addToHistory(entry)
  }
}

// ── Catalog Merge Logic ──────────────────────────────────────

/**
 * Merge imported catalog items into the current catalog.
 * Conflict resolution: items matched by normalized name, latest `updated` wins.
 * Items not found in current catalog are appended as new.
 */
function mergeCatalogItems(current: CatalogEntry[], imported: CatalogEntry[]): CatalogEntry[] {
  const result = clone(current)

  for (const item of imported) {
    const normalizedName = normalize(item.name)

    // Check if an item with the same normalized name exists
    const existingIdx = result.findIndex(
      (existing) => normalize(existing.name) === normalizedName
    )

    if (existingIdx === -1) {
      // Not found — add as new
      result.push(clone(item))
    } else {
      // Found — compare updated timestamps, latest wins
      const existing = result[existingIdx]
      const existingTime = new Date(existing.updated).getTime()
      const importedTime = new Date(item.updated).getTime()

      if (importedTime > existingTime) {
        result[existingIdx] = clone(item)
      }
      // else keep existing (it's newer or equal)
    }
  }

  return result
}

// ── History Merge Logic ──────────────────────────────────────

/**
 * Merge imported history entries into the current history.
 * Conflict resolution: entries matched by meta.quotation_number, latest updated_at wins.
 * Result is sorted newest-first.
 */
function mergeHistoryEntries(current: QuotationData[], imported: QuotationData[]): QuotationData[] {
  // Build a map of current entries by quotation_number
  const entryMap = new Map<string, QuotationData>()
  for (const entry of current) {
    const key = entry.meta?.quotation_number
    if (key) {
      entryMap.set(key, entry)
    }
  }

  // Process imported entries
  for (const importedEntry of imported) {
    const key = importedEntry.meta?.quotation_number
    if (!key) {
      // Entry without a number — add as new
      entryMap.set(`_unnamed_${Date.now()}_${Math.random()}`, importedEntry)
      continue
    }

    const existing = entryMap.get(key)
    if (!existing) {
      // New entry — add it
      entryMap.set(key, importedEntry)
    } else {
      // Conflict — latest updated_at wins
      const existingTime = new Date(existing.updated_at).getTime()
      const importedTime = new Date(importedEntry.updated_at).getTime()
      if (importedTime > existingTime) {
        entryMap.set(key, importedEntry)
      }
      // else keep existing (it's newer or equal)
    }
  }

  // Convert map to array, sorted by updated_at descending (newest first)
  const result: QuotationData[] = []
  for (const entry of entryMap.values()) {
    result.push(clone(entry))
  }
  result.sort((a, b) => {
    const aTime = new Date(a.updated_at).getTime()
    const bTime = new Date(b.updated_at).getTime()
    return bTime - aTime
  })

  return result
}
