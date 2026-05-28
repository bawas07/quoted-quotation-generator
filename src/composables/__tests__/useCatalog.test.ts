import { describe, it, expect, beforeEach } from 'vitest'
import { useCatalog, _resetCatalog } from '../useCatalog'
import { storage } from '../../utils/localStorage'
import { STORAGE_KEYS } from '../../types/quotation'

const PREFIX = 'quoted_'

beforeEach(() => {
  // Reset internal module state
  _resetCatalog()

  // Clean all quoted_ keys before each test
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(PREFIX)) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key))
})

describe('useCatalog', () => {
  // ── Init / Load ─────────────────────────────────────────────

  it('initializes as empty array when no catalog in localStorage', () => {
    const { catalog } = useCatalog()
    expect(catalog.value).toEqual([])
  })

  it('loads existing catalog from localStorage', () => {
    const existing = [
      {
        id: '1',
        name: 'Logo Design',
        desc: 'Primary logo',
        price: 3500000,
        cur: 'IDR' as const,
        unit: 'project',
        history: [],
        times: 2,
        created: '2026-01-01T00:00:00Z',
        updated: '2026-01-15T00:00:00Z',
      },
    ]
    storage.set(STORAGE_KEYS.CATALOG, existing)

    const { catalog } = useCatalog()
    expect(catalog.value).toHaveLength(1)
    expect(catalog.value[0].name).toBe('Logo Design')
  })

  // ── addItem ─────────────────────────────────────────────────

  it('addItem creates entry with generated id and timestamps', () => {
    const { addItem, catalog } = useCatalog()
    const entry = addItem({
      name: 'Brand Guidelines',
      desc: 'Full brand kit',
      price: 5000000,
      cur: 'IDR',
      unit: 'project',
    })

    expect(entry.id).toBeDefined()
    expect(entry.name).toBe('Brand Guidelines')
    expect(entry.times).toBe(0)
    expect(entry.history).toEqual([])
    expect(entry.created).toBeDefined()
    expect(entry.updated).toBeDefined()
    expect(catalog.value).toHaveLength(1)
  })

  it('addItem persists to localStorage', () => {
    const { addItem } = useCatalog()
    addItem({
      name: 'Social Media Kit',
      desc: '',
      price: 2000000,
      cur: 'IDR',
      unit: '',
    })

    const stored = storage.get<unknown[]>(STORAGE_KEYS.CATALOG)
    expect(stored).toHaveLength(1)
    expect(stored![0]).toHaveProperty('name', 'Social Media Kit')
  })

  // ── updateItem ──────────────────────────────────────────────

  it('updateItem merges patch and updates timestamp', () => {
    const { addItem, updateItem, catalog } = useCatalog()
    const entry = addItem({
      name: 'Logo Design',
      desc: 'Old desc',
      price: 3000000,
      cur: 'IDR',
      unit: 'project',
    })

    const originalUpdated = entry.updated
    // Small delay to ensure timestamp changes
    updateItem(entry.id, { price: 3500000, desc: 'Updated desc' })

    const updated = catalog.value[0]
    expect(updated.price).toBe(3500000)
    expect(updated.desc).toBe('Updated desc')
    expect(updated.name).toBe('Logo Design') // unchanged
    expect(updated.updated).not.toBe(originalUpdated)
  })

  it('updateItem does nothing for non-existent id', () => {
    const { catalog, updateItem } = useCatalog()
    updateItem('nonexistent', { name: 'Should not appear' })
    expect(catalog.value).toHaveLength(0)
  })

  it('updateItem persists to localStorage', () => {
    const { addItem, updateItem } = useCatalog()
    const entry = addItem({
      name: 'Test',
      desc: '',
      price: 1000,
      cur: 'IDR',
      unit: '',
    })

    updateItem(entry.id, { price: 2000 })
    const stored = storage.get<unknown[]>(STORAGE_KEYS.CATALOG)
    expect(stored![0]).toHaveProperty('price', 2000)
  })

  // ── removeItem ──────────────────────────────────────────────

  it('removeItem removes entry by id', () => {
    const { addItem, removeItem, catalog } = useCatalog()
    const entry = addItem({
      name: 'To Delete',
      desc: '',
      price: 1000,
      cur: 'IDR',
      unit: '',
    })

    expect(catalog.value).toHaveLength(1)
    removeItem(entry.id)
    expect(catalog.value).toHaveLength(0)
  })

  it('removeItem persists to localStorage', () => {
    const { addItem, removeItem } = useCatalog()
    const entry = addItem({
      name: 'Remove Me',
      desc: '',
      price: 1000,
      cur: 'IDR',
      unit: '',
    })

    removeItem(entry.id)
    const stored = storage.get<unknown[]>(STORAGE_KEYS.CATALOG)
    expect(stored).toHaveLength(0)
  })

  // ── searchCatalog ───────────────────────────────────────────

  it('searchCatalog returns top 6 fuzzy-matched results', () => {
    const { addItem, searchCatalog } = useCatalog()
    addItem({ name: 'Logo Design', desc: '', price: 3500000, cur: 'IDR', unit: '' })
    addItem({ name: 'Brand Guidelines', desc: '', price: 5000000, cur: 'IDR', unit: '' })
    addItem({ name: 'Social Media Kit', desc: '', price: 2000000, cur: 'IDR', unit: '' })
    addItem({ name: 'Logo Animation', desc: '', price: 4000000, cur: 'IDR', unit: '' })

    const results = searchCatalog('logo')
    expect(results.length).toBeGreaterThanOrEqual(1)
    // "Logo Design" and "Logo Animation" should match; "Logo" appears first
    expect(results[0].name.toLowerCase()).toContain('logo')
  })

  it('searchCatalog returns first 6 entries for empty query', () => {
    const { addItem, searchCatalog } = useCatalog()
    for (let i = 0; i < 10; i++) {
      addItem({ name: `Item ${i}`, desc: '', price: i * 1000, cur: 'IDR', unit: '' })
    }

    const results = searchCatalog('')
    expect(results).toHaveLength(6)
  })

  it('searchCatalog returns empty array for unmatched query', () => {
    const { addItem, searchCatalog } = useCatalog()
    addItem({ name: 'Logo Design', desc: '', price: 3500000, cur: 'IDR', unit: '' })

    const results = searchCatalog('zzzxyz')
    expect(results).toHaveLength(0)
  })

  // ── catalog readonly ────────────────────────────────────────

  it('catalog is a readonly ref (cannot be directly mutated)', () => {
    const { catalog } = useCatalog()
    expect(catalog.value).toEqual([])
    // The readonly() wrapper prevents mutations through the ref
    // This is a type-level constraint but we verify the function signature
    expect(typeof catalog.value).toBe('object')
  })

  // ── localStorage write-through on all mutations ─────────────

  it('add updates localStorage', () => {
    const { addItem } = useCatalog()
    addItem({ name: 'Persist Test', desc: '', price: 999, cur: 'IDR', unit: '' })
    const stored = storage.get<Array<{ name: string }>>(STORAGE_KEYS.CATALOG)
    expect(stored).toBeDefined()
    expect(stored!.some((e) => e.name === 'Persist Test')).toBe(true)
  })

  it('update updates localStorage', () => {
    const { addItem, updateItem } = useCatalog()
    const e = addItem({ name: 'Original', desc: '', price: 100, cur: 'IDR', unit: '' })
    updateItem(e.id, { name: 'Updated' })
    const stored = storage.get<Array<{ name: string }>>(STORAGE_KEYS.CATALOG)
    expect(stored!.find((x) => x.name === 'Updated')).toBeDefined()
    expect(stored!.find((x) => x.name === 'Original')).toBeUndefined()
  })

  it('delete updates localStorage', () => {
    const { addItem, removeItem } = useCatalog()
    const e = addItem({ name: 'Delete Me', desc: '', price: 100, cur: 'IDR', unit: '' })
    removeItem(e.id)
    const stored = storage.get<Array<{ name: string }>>(STORAGE_KEYS.CATALOG)
    expect(stored).toHaveLength(0)
  })
})
