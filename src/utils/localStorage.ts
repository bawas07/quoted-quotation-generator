/**
 * Typed localStorage wrapper with `quoted_` prefix.
 *
 * Why a prefix instead of raw keys:
 * - Avoids collisions with other apps using the same domain
 * - Enables prefix-scoped clearAll() without wiping unrelated data
 * - Self-documenting when inspecting DevTools
 *
 * Source: docs/example-v2.html — uses `quoted_` prefix for all keys.
 */

const PREFIX = 'quoted_'

function prefixed(key: string): string {
  return `${PREFIX}${key}`
}

export const storage = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(prefixed(key))
      if (raw === null) return null
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(prefixed(key), JSON.stringify(value))
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded — export workspace to free space')
      } else {
        throw error
      }
    }
  },

  remove(key: string): void {
    localStorage.removeItem(prefixed(key))
  },

  clearAll(): void {
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(PREFIX)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key))
  },

  checkAvailable(): { available: boolean; usedMB: number; remainingMB: number } {
    try {
      // Probe by writing a small test value
      const testKey = prefixed('_probe_')
      localStorage.setItem(testKey, '1')
      localStorage.removeItem(testKey)
      return {
        available: true,
        usedMB: getUsedMB(),
        remainingMB: estimateRemaining(),
      }
    } catch {
      return { available: false, usedMB: getUsedMB(), remainingMB: 0 }
    }
  },
}

function getUsedMB(): number {
  let total = 0
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) {
      total += key.length + (localStorage.getItem(key)?.length ?? 0)
    }
  }
  return Math.round((total / (1024 * 1024)) * 100) / 100
}

function estimateRemaining(): number {
  let size = 0
  const testKey = prefixed('_quota_test_')
  try {
    const step = 100 * 1024 // 100KB steps
    while (true) {
      size += step
      localStorage.setItem(testKey, 'x'.repeat(size))
    }
  } catch {
    // Quota exceeded at approximately 'size' bytes
  }
  const maxBytes = localStorage.getItem(testKey)?.length ?? 0
  try {
    localStorage.removeItem(testKey)
  } catch {
    // Best-effort cleanup
  }
  const maxMB = maxBytes / (1024 * 1024)
  const used = getUsedMB()
  return Math.round(Math.max(0, maxMB - used) * 100) / 100
}
