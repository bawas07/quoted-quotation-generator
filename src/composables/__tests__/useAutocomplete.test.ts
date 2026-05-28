import { describe, it, expect, beforeEach } from 'vitest'
import { useAutocomplete, _resetAutocomplete } from '../useAutocomplete'
import { useCatalog, _resetCatalog } from '../useCatalog'

const PREFIX = 'quoted_'

beforeEach(() => {
  // Reset internal module state
  _resetCatalog()
  _resetAutocomplete()

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

// Helper to seed the catalog with some entries
function seedCatalog(): void {
  const { addItem } = useCatalog()
  addItem({ name: 'Logo Design', desc: 'Primary logo + 2 revisions', price: 3500000, cur: 'IDR', unit: 'project' })
  addItem({ name: 'Brand Guidelines', desc: 'Full brand kit', price: 5000000, cur: 'IDR', unit: 'project' })
  addItem({ name: 'Social Media Kit', desc: '3 platforms', price: 2000000, cur: 'IDR', unit: 'project' })
  addItem({ name: 'Logo Animation', desc: 'Animated logo', price: 4000000, cur: 'IDR', unit: 'project' })
}

describe('useAutocomplete', () => {
  // ── search ──────────────────────────────────────────────────

  it('search updates results map', () => {
    seedCatalog()
    const ac = useAutocomplete()
    ac.search('row1', 'logo')

    expect(ac.results['row1']).toBeDefined()
    expect(ac.results['row1'].length).toBeGreaterThanOrEqual(1)
    // Should match "Logo Design" and "Logo Animation"
    expect(ac.results['row1'][0].name.toLowerCase()).toContain('logo')
  })

  it('search sets isOpen true when results exist', () => {
    seedCatalog()
    const ac = useAutocomplete()
    ac.search('row1', 'logo')
    expect(ac.isOpen['row1']).toBe(true)
  })

  it('search sets isOpen true for non-matching non-empty query', () => {
    seedCatalog()
    const ac = useAutocomplete()
    ac.search('row1', 'zzz')
    expect(ac.isOpen['row1']).toBe(true) // query has content
  })

  it('search with empty query shows recent items and opens dropdown', () => {
    seedCatalog()
    const ac = useAutocomplete()
    ac.search('row1', '')

    // Empty query returns first 6 entries
    expect(ac.results['row1']).toBeDefined()
    expect(ac.results['row1'].length).toBeGreaterThanOrEqual(1)
    // isOpen: if results exist, open; if results.length > 0, open
    expect(ac.isOpen['row1']).toBe(true)
  })

  it('search sets highlightedIndex to 0', () => {
    seedCatalog()
    const ac = useAutocomplete()
    ac.search('row1', 'logo')
    expect(ac.highlightedIndex['row1']).toBe(0)
  })

  // ── select ──────────────────────────────────────────────────

  it('select returns entry name and price for valid index', () => {
    seedCatalog()
    const ac = useAutocomplete()
    ac.search('row1', 'logo')

    const result = ac.select('row1', 0)
    expect(result).not.toBeNull()
    expect(result).toHaveProperty('description')
    expect(result).toHaveProperty('unit_price')
    expect(typeof result!.unit_price).toBe('number')
  })

  it('select closes dropdown', () => {
    seedCatalog()
    const ac = useAutocomplete()
    ac.search('row1', 'logo')
    expect(ac.isOpen['row1']).toBe(true)

    ac.select('row1', 0)
    expect(ac.isOpen['row1']).toBe(false)
  })

  it('select returns null for invalid index', () => {
    seedCatalog()
    const ac = useAutocomplete()
    ac.search('row1', 'logo')

    const result = ac.select('row1', 999)
    expect(result).toBeNull()
  })

  // ── createAndSelect ─────────────────────────────────────────

  it('createAndSelect adds entry to catalog', () => {
    const { catalog } = useCatalog()
    expect(catalog.value).toHaveLength(0)

    const ac = useAutocomplete()
    const result = ac.createAndSelect('row1', 'Rush Fee')

    expect(result).toEqual({ description: 'Rush Fee', unit_price: 0 })
    // Check that the entry was added to the catalog
    expect(catalog.value).toHaveLength(1)
    expect(catalog.value[0].name).toBe('Rush Fee')
    expect(catalog.value[0].price).toBe(0)
  })

  it('createAndSelect closes dropdown', () => {
    const ac = useAutocomplete()
    ac.search('row1', 'test')
    expect(ac.isOpen['row1']).toBe(true)

    ac.createAndSelect('row1', 'New Item')
    expect(ac.isOpen['row1']).toBe(false)
  })

  // ── close ───────────────────────────────────────────────────

  it('close sets isOpen false', () => {
    const ac = useAutocomplete()
    ac.search('row1', 'logo')
    expect(ac.isOpen['row1']).toBe(true)

    ac.close('row1')
    expect(ac.isOpen['row1']).toBe(false)
  })

  // ── handleKeydown: ArrowDown/Up navigation ──────────────────

  it('ArrowDown increments highlightedIndex', () => {
    seedCatalog()
    const ac = useAutocomplete()
    ac.search('row1', 'logo')

    const first = ac.handleKeydown(
      new KeyboardEvent('keydown', { key: 'ArrowDown' }),
      'row1',
    )
    expect(first.action).toBeNull()
    expect(ac.highlightedIndex['row1']).toBe(1)
  })

  it('ArrowUp decrements highlightedIndex', () => {
    seedCatalog()
    const ac = useAutocomplete()
    ac.search('row1', 'logo')

    // Move down first, then up
    ac.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }), 'row1')
    expect(ac.highlightedIndex['row1']).toBe(1)

    const upResult = ac.handleKeydown(
      new KeyboardEvent('keydown', { key: 'ArrowUp' }),
      'row1',
    )
    expect(upResult.action).toBeNull()
    expect(ac.highlightedIndex['row1']).toBe(0)
  })

  it('ArrowUp clamps at 0', () => {
    seedCatalog()
    const ac = useAutocomplete()
    ac.search('row1', 'logo')
    expect(ac.highlightedIndex['row1']).toBe(0)

    ac.handleKeydown(
      new KeyboardEvent('keydown', { key: 'ArrowUp' }),
      'row1',
    )
    expect(ac.highlightedIndex['row1']).toBe(0)
  })

  // ── handleKeydown: Enter selects ────────────────────────────

  it('Enter returns select action with highlighted index', () => {
    seedCatalog()
    const ac = useAutocomplete()
    ac.search('row1', 'logo')

    const result = ac.handleKeydown(
      new KeyboardEvent('keydown', { key: 'Enter' }),
      'row1',
    )
    expect(result.action).toBe('select')
    expect(result.index).toBe(0)
  })

  // ── handleKeydown: Escape closes ────────────────────────────

  it('Escape returns close action', () => {
    seedCatalog()
    const ac = useAutocomplete()
    ac.search('row1', 'logo')

    const result = ac.handleKeydown(
      new KeyboardEvent('keydown', { key: 'Escape' }),
      'row1',
    )
    expect(result.action).toBe('close')
    expect(ac.isOpen['row1']).toBe(false)
  })

  // ── handleKeydown: no-op when dropdown is closed ────────────

  it('handleKeydown returns null action when dropdown is closed', () => {
    seedCatalog()
    const ac = useAutocomplete()

    const result = ac.handleKeydown(
      new KeyboardEvent('keydown', { key: 'ArrowDown' }),
      'row1',
    )
    expect(result.action).toBeNull()
  })

  // ── cleanup ─────────────────────────────────────────────────

  it('cleanup removes all state for a row', () => {
    seedCatalog()
    const ac = useAutocomplete()
    ac.search('row1', 'logo')
    expect(ac.results['row1']).toBeDefined()
    expect(ac.isOpen['row1']).toBe(true)

    ac.cleanup('row1')
    expect(ac.results['row1']).toBeUndefined()
    expect(ac.isOpen['row1']).toBeUndefined()
    expect(ac.highlightedIndex['row1']).toBeUndefined()
  })

  // ── Multiple rows have independent state ────────────────────

  it('multiple rows maintain independent state', () => {
    seedCatalog()
    const ac = useAutocomplete()

    ac.search('row1', 'logo')
    ac.search('row2', 'brand')

    expect(ac.results['row1'].length).toBeGreaterThanOrEqual(1)
    expect(ac.results['row2'].length).toBeGreaterThanOrEqual(1)

    // Close row1 only
    ac.close('row1')
    expect(ac.isOpen['row1']).toBe(false)
    expect(ac.isOpen['row2']).toBe(true)
  })
})
