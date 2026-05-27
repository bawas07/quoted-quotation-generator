import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useToast } from '../useToast'

describe('useToast', () => {
  beforeEach(() => {
    const { clearToasts } = useToast()
    clearToasts()
  })

  // 1. toasts starts empty
  it('toasts starts empty', () => {
    const { toasts } = useToast()
    expect(toasts.value).toHaveLength(0)
  })

  // 2. showToast adds a toast with correct message and type
  it('showToast adds a toast with correct message and type', () => {
    const { toasts, showToast } = useToast()
    showToast('Operation successful', 'success')
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].message).toBe('Operation successful')
    expect(toasts.value[0].type).toBe('success')
  })

  // 3. showToast supports warning and error types
  it('showToast supports warning and error types', () => {
    const { toasts, showToast } = useToast()
    showToast('Warning message', 'warning')
    showToast('Error message', 'error')
    expect(toasts.value).toHaveLength(2)
    expect(toasts.value[0].type).toBe('warning')
    expect(toasts.value[1].type).toBe('error')
  })

  // 4. removeToast removes by id
  it('removeToast removes by id', () => {
    const { toasts, showToast, removeToast } = useToast()
    showToast('Test message', 'success')
    const id = toasts.value[0].id
    removeToast(id)
    expect(toasts.value).toHaveLength(0)
  })

  // 5. clearToasts empties the array
  it('clearToasts empties the array', () => {
    const { toasts, showToast, clearToasts } = useToast()
    showToast('First', 'success')
    showToast('Second', 'warning')
    expect(toasts.value).toHaveLength(2)
    clearToasts()
    expect(toasts.value).toHaveLength(0)
  })

  // 6. auto-dismiss removes toast after 3 seconds
  it('auto-dismiss removes toast after 3 seconds', () => {
    vi.useFakeTimers()

    const { toasts, showToast } = useToast()
    showToast('Auto dismiss', 'success')
    expect(toasts.value).toHaveLength(1)

    // Advance time by 3 seconds
    vi.advanceTimersByTime(3000)
    expect(toasts.value).toHaveLength(0)

    vi.useRealTimers()
  })
})
