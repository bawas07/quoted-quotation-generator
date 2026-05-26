import { describe, it, expect, beforeEach } from 'vitest'
import { storage } from './localStorage'

const PREFIX = 'quoted_'

beforeEach(() => {
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

// ── get tests ─────────────────────────────────

describe('storage.get', () => {
  it('returns parsed value for a valid key', () => {
    localStorage.setItem(`${PREFIX}user`, JSON.stringify({ name: 'Alice' }))
    const result = storage.get<{ name: string }>('user')
    expect(result).toEqual({ name: 'Alice' })
  })

  it('returns null for a missing key', () => {
    expect(storage.get('nonexistent')).toBeNull()
  })

  it('returns null and does not throw for corrupt JSON', () => {
    localStorage.setItem(`${PREFIX}bad`, 'not-json{{{')
    expect(storage.get('bad')).toBeNull()
  })

  it('handles primitive values (number)', () => {
    localStorage.setItem(`${PREFIX}count`, '42')
    expect(storage.get<number>('count')).toBe(42)
  })

  it('handles arrays', () => {
    const items = [1, 2, 3]
    localStorage.setItem(`${PREFIX}items`, JSON.stringify(items))
    expect(storage.get<number[]>('items')).toEqual([1, 2, 3])
  })

  it('returns null when stored value is empty string', () => {
    localStorage.setItem(`${PREFIX}empty`, '')
    expect(storage.get('empty')).toBeNull()
  })
})

// ── set tests ─────────────────────────────────

describe('storage.set', () => {
  it('stores a value that can be retrieved', () => {
    storage.set('name', 'Bob')
    expect(JSON.parse(localStorage.getItem(`${PREFIX}name`)!)).toBe('Bob')
  })

  it('overwrites an existing value', () => {
    storage.set('key', 'first')
    storage.set('key', 'second')
    expect(storage.get<string>('key')).toBe('second')
  })

  it('handles nested objects', () => {
    const obj = { a: { b: { c: [1, 2] } } }
    storage.set('nested', obj)
    expect(storage.get<typeof obj>('nested')).toEqual(obj)
  })

  it('handles arrays', () => {
    const arr = ['x', 'y', 'z']
    storage.set('letters', arr)
    expect(storage.get<string[]>('letters')).toEqual(arr)
  })

  it('stores null value', () => {
    storage.set('nullish', null)
    expect(storage.get('nullish')).toBeNull()
  })

  it('stores boolean values', () => {
    storage.set('flag', true)
    expect(storage.get<boolean>('flag')).toBe(true)
  })
})

// ── remove tests ──────────────────────────────

describe('storage.remove', () => {
  it('removes a stored value', () => {
    storage.set('temp', 'value')
    storage.remove('temp')
    expect(storage.get('temp')).toBeNull()
  })

  it('does not throw when removing a non-existent key', () => {
    expect(() => storage.remove('never_set')).not.toThrow()
  })
})

// ── clearAll tests ────────────────────────────

describe('storage.clearAll', () => {
  it('removes all quoted_-prefixed keys', () => {
    storage.set('a', 1)
    storage.set('b', 2)
    localStorage.setItem('other_data', 'keep')
    storage.clearAll()
    expect(storage.get('a')).toBeNull()
    expect(storage.get('b')).toBeNull()
    expect(localStorage.getItem('other_data')).toBe('keep')
  })

  it('leaves non-prefixed keys untouched', () => {
    localStorage.setItem('native_key', 'native_value')
    storage.set('quo', 'val')
    storage.clearAll()
    expect(localStorage.getItem('native_key')).toBe('native_value')
  })

  it('is idempotent when no prefixed keys exist', () => {
    localStorage.setItem('only_native', 'x')
    expect(() => storage.clearAll()).not.toThrow()
    expect(localStorage.getItem('only_native')).toBe('x')
  })
})

// ── Prefix verification ───────────────────────

describe('prefix behavior', () => {
  it('uses quoted_ prefix when setting', () => {
    storage.set('test', 'hello')
    const raw = localStorage.getItem(`${PREFIX}test`)
    expect(raw).toBe(JSON.stringify('hello'))
    // Verify no unprefixed key exists
    expect(localStorage.getItem('test')).toBeNull()
  })

  it('reads only quoted_-prefixed keys', () => {
    localStorage.setItem(`${PREFIX}mykey`, '"prefixed"')
    localStorage.setItem('mykey', '"unprefixed"')
    const result = storage.get<string>('mykey')
    expect(result).toBe('prefixed')
  })

  it('remove only affects prefixed key', () => {
    localStorage.setItem(`${PREFIX}dup`, '"prefixed"')
    localStorage.setItem('dup', '"unprefixed"')
    storage.remove('dup')
    expect(localStorage.getItem('dup')).toBe('"unprefixed"')
    expect(localStorage.getItem(`${PREFIX}dup`)).toBeNull()
  })
})

// ── checkAvailable tests ──────────────────────

describe('storage.checkAvailable', () => {
  it('returns availability info with expected shape', () => {
    const info = storage.checkAvailable()
    expect(info).toHaveProperty('available')
    expect(info).toHaveProperty('usedMB')
    expect(info).toHaveProperty('remainingMB')
    expect(typeof info.available).toBe('boolean')
    expect(typeof info.usedMB).toBe('number')
    expect(typeof info.remainingMB).toBe('number')
  })

  it('reports usedMB as a non-negative number', () => {
    const info = storage.checkAvailable()
    expect(info.usedMB).toBeGreaterThanOrEqual(0)
  })

  it('reports remainingMB as a number', () => {
    const info = storage.checkAvailable()
    expect(info.remainingMB).toBeGreaterThanOrEqual(0)
  })
})
