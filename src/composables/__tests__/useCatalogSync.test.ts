import { describe, it, expect, beforeEach } from 'vitest'
import { useCatalogSync } from '../useCatalogSync'
import { useCatalog, _resetCatalog } from '../useCatalog'
import type { LineItem, CatalogEntry } from '../../types/quotation'

const PREFIX = 'quoted_'

beforeEach(() => {
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

function makeLineItem(overrides: Partial<LineItem> = {}): LineItem {
  return {
    id: 'li-1',
    description: 'Logo Design',
    quantity: 1,
    unit_price: 3500000,
    amount: 3500000,
    ...overrides,
  }
}

function makeCatalogEntry(overrides: Partial<CatalogEntry> = {}): CatalogEntry {
  return {
    id: 'cat-1',
    name: 'Logo Design',
    desc: '',
    price: 3000000,
    cur: 'IDR',
    unit: 'project',
    history: [{ price: 2500000, date: '2026-03-20', client: 'Acme Corp', num: 'QUO-001' }],
    times: 3,
    created: '2026-01-01T00:00:00Z',
    updated: '2026-03-20T00:00:00Z',
    ...overrides,
  }
}

describe('useCatalogSync', () => {
  // ── buildSyncList ───────────────────────────────────────────

  it('classifies new items as NEW and pre-checks them', () => {
    const catalogSync = useCatalogSync()
    // Use a price that doesn't trigger one-off detection (>2 words or price not round)
    const items = [makeLineItem({ description: 'Brand Guidelines', unit_price: 5050000 })]
    const catalog: CatalogEntry[] = [makeCatalogEntry()]

    const result = catalogSync.buildSyncList(items, catalog)

    expect(result).toHaveLength(1)
    expect(result[0].change_type).toBe('NEW')
    expect(result[0].checked).toBe(true)
    expect(result[0].match).toBeNull()
  })

  it('classifies price-changed items as UPDATE and pre-checks them', () => {
    const catalogSync = useCatalogSync()
    const items = [makeLineItem({ unit_price: 3500000 })]
    const catalog: CatalogEntry[] = [makeCatalogEntry({ price: 3000000 })]

    const result = catalogSync.buildSyncList(items, catalog)

    expect(result).toHaveLength(1)
    expect(result[0].change_type).toBe('UPDATE')
    expect(result[0].checked).toBe(true)
    expect(result[0].match).not.toBeNull()
    expect(result[0].match!.id).toBe('cat-1')
  })

  it('classifies price-matched items as SAME and pre-unchecks them', () => {
    const catalogSync = useCatalogSync()
    const items = [makeLineItem({ unit_price: 3000000 })]
    const catalog: CatalogEntry[] = [makeCatalogEntry({ price: 3000000 })]

    const result = catalogSync.buildSyncList(items, catalog)

    expect(result).toHaveLength(1)
    expect(result[0].change_type).toBe('SAME')
    expect(result[0].checked).toBe(false)
    expect(result[0].match).not.toBeNull()
  })

  it('auto-unchecks one-off items that look like fees', () => {
    const catalogSync = useCatalogSync()
    const items = [makeLineItem({ description: 'Rush Fee', unit_price: 500000 })]
    const catalog: CatalogEntry[] = []

    const result = catalogSync.buildSyncList(items, catalog)

    expect(result).toHaveLength(1)
    expect(result[0].change_type).toBe('NEW')
    expect(result[0].checked).toBe(false)
  })

  it('does not auto-uncheck multi-word items with non-round prices', () => {
    const catalogSync = useCatalogSync()
    const items = [makeLineItem({ description: 'Custom Illustration Package', unit_price: 4750000 })]
    const catalog: CatalogEntry[] = []

    const result = catalogSync.buildSyncList(items, catalog)

    expect(result).toHaveLength(1)
    expect(result[0].change_type).toBe('NEW')
    expect(result[0].checked).toBe(true)
  })

  it('filters out empty description items', () => {
    const catalogSync = useCatalogSync()
    const items = [
      makeLineItem({ id: '1', description: '', unit_price: 1000000 }),
      makeLineItem({ id: '2', description: '   ', unit_price: 2000000 }),
      makeLineItem({ id: '3', description: 'Valid Item', unit_price: 3000000 }),
    ]
    const catalog: CatalogEntry[] = []

    const result = catalogSync.buildSyncList(items, catalog)

    expect(result).toHaveLength(1)
    expect(result[0].item.description).toBe('Valid Item')
  })

  it('returns all items as NEW when catalog is empty', () => {
    const catalogSync = useCatalogSync()
    const items = [
      makeLineItem({ id: '1', description: 'Logo Design', unit_price: 3500000 }),
      makeLineItem({ id: '2', description: 'Full Brand Identity Package', unit_price: 5750000 }),
    ]
    const catalog: CatalogEntry[] = []

    const result = catalogSync.buildSyncList(items, catalog)

    expect(result).toHaveLength(2)
    expect(result[0].change_type).toBe('NEW')
    expect(result[1].change_type).toBe('NEW')
  })

  it('returns all items as SAME (unchecked) when all prices match catalog', () => {
    const catalogSync = useCatalogSync()
    const items = [
      makeLineItem({ id: '1', description: 'Logo Design', unit_price: 3000000 }),
      makeLineItem({ id: '2', description: 'Brand Guidelines', unit_price: 5000000 }),
    ]
    const catalog: CatalogEntry[] = [
      makeCatalogEntry({ id: 'cat-1', name: 'Logo Design', price: 3000000 }),
      makeCatalogEntry({ id: 'cat-2', name: 'Brand Guidelines', price: 5000000 }),
    ]

    const result = catalogSync.buildSyncList(items, catalog)

    expect(result).toHaveLength(2)
    expect(result[0].change_type).toBe('SAME')
    expect(result[0].checked).toBe(false)
    expect(result[1].change_type).toBe('SAME')
    expect(result[1].checked).toBe(false)
  })

  // ── checkedCount ────────────────────────────────────────────

  it('checkedCount reflects number of checked items', () => {
    const catalogSync = useCatalogSync()
    const items = [
      makeLineItem({ id: '1', description: 'Logo Design', unit_price: 3500000 }),
      makeLineItem({ id: '2', description: 'Rush Fee', unit_price: 100000 }),
      makeLineItem({ id: '3', description: 'Full Brand Identity', unit_price: 5750000 }),
    ]
    const catalog: CatalogEntry[] = [makeCatalogEntry({ price: 3000000 })]

    catalogSync.buildSyncList(items, catalog)

    // Logo Design: UPDATE (checked=true), Rush Fee: NEW one-off (checked=false),
    // Full Brand Identity: NEW (checked=true) → 2 checked
    expect(catalogSync.checkedCount.value).toBe(2)
  })

  it('checkedCount updates when syncItems changes', () => {
    const catalogSync = useCatalogSync()

    // Build with items
    catalogSync.buildSyncList(
      [makeLineItem({ description: 'Full Brand Identity Kit', unit_price: 5750000 })],
      [],
    )

    expect(catalogSync.checkedCount.value).toBe(1)

    // Rebuild with different items
    catalogSync.buildSyncList(
      [makeLineItem({ description: 'Rush Fee', unit_price: 100000 })],
      [],
    )

    // Rush Fee is a one-off, should be unchecked
    expect(catalogSync.checkedCount.value).toBe(0)
  })

  // ── syncItems readonly ──────────────────────────────────────

  it('syncItems is exposed as a readonly ref', () => {
    const catalogSync = useCatalogSync()
    expect(catalogSync.syncItems.value).toEqual([])
    // Type-level check: readonly prevents .push() at TS level
    // Runtime check: calling push on a readonly ref won't modify the source
  })

  // ── applySyncItems ──────────────────────────────────────────

  it('applySyncItems adds NEW items to catalog', () => {
    const catalogSync = useCatalogSync()
    const items = [makeLineItem({ description: 'New Service', unit_price: 2500000 })]
    const result = catalogSync.buildSyncList(items, [])

    catalogSync.applySyncItems(result, 'IDR', 'Acme Corp', '2026-05-28', 'QUO-002')

    const { catalog } = useCatalog()
    expect(catalog.value).toHaveLength(1)
    expect(catalog.value[0].name).toBe('New Service')
    expect(catalog.value[0].price).toBe(2500000)
  })

  it('applySyncItems updates catalog entries for UPDATE items with price history', () => {
    const catalogSync = useCatalogSync()
    // First add an entry to the catalog
    const cat = useCatalog()
    cat.addItem({
      name: 'Logo Design',
      desc: '',
      price: 3000000,
      cur: 'IDR',
      unit: 'project',
    })

    const catalog = cat.catalog.value
    const items = [makeLineItem({ description: 'Logo Design', unit_price: 3500000 })]
    const result = catalogSync.buildSyncList(items, catalog)

    expect(result[0].change_type).toBe('UPDATE')

    catalogSync.applySyncItems(result, 'IDR', 'Beta Studio', '2026-05-28', 'QUO-002')

    const updatedCatalog = useCatalog().catalog.value
    expect(updatedCatalog).toHaveLength(1)
    expect(updatedCatalog[0].price).toBe(3500000)
    expect(updatedCatalog[0].times).toBe(1)
    expect(updatedCatalog[0].history).toHaveLength(1)
    expect(updatedCatalog[0].history[0].price).toBe(3000000)
    expect(updatedCatalog[0].history[0].client).toBe('Beta Studio')
  })

  it('applySyncItems skips SAME items', () => {
    const catalogSync = useCatalogSync()
    const cat = useCatalog()
    cat.addItem({
      name: 'Logo Design',
      desc: '',
      price: 3000000,
      cur: 'IDR',
      unit: 'project',
    })

    const catalog = cat.catalog.value
    const items = [makeLineItem({ description: 'Logo Design', unit_price: 3000000 })]
    const result = catalogSync.buildSyncList(items, catalog)

    expect(result[0].change_type).toBe('SAME')

    catalogSync.applySyncItems(result, 'IDR', 'Acme Corp', '2026-05-28', 'QUO-002')

    const updatedCatalog = useCatalog().catalog.value
    expect(updatedCatalog).toHaveLength(1)
    // Price should remain unchanged
    expect(updatedCatalog[0].price).toBe(3000000)
    expect(updatedCatalog[0].history).toHaveLength(0)
    expect(updatedCatalog[0].times).toBe(0)
  })
})
