import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useTemplate } from '../useTemplate'

describe('useTemplate', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('isSwitching initializes to false', () => {
    const { isSwitching } = useTemplate()
    expect(isSwitching.value).toBe(false)
  })

  it('triggerSwitch sets isSwitching to true', () => {
    const { isSwitching, triggerSwitch } = useTemplate()
    triggerSwitch()
    expect(isSwitching.value).toBe(true)
  })

  it('triggerSwitch resets isSwitching to false after 150ms', () => {
    const { isSwitching, triggerSwitch } = useTemplate()
    triggerSwitch()
    expect(isSwitching.value).toBe(true)

    vi.advanceTimersByTime(150)
    expect(isSwitching.value).toBe(false)
  })

  it('triggerSwitch clears any previous timer before starting new one', () => {
    const { isSwitching, triggerSwitch } = useTemplate()
    triggerSwitch()
    // Call again before timer fires
    triggerSwitch()
    vi.advanceTimersByTime(150)
    expect(isSwitching.value).toBe(false)
  })

  it('multiple triggerSwitch calls work sequentially', () => {
    const { isSwitching, triggerSwitch } = useTemplate()

    triggerSwitch()
    vi.advanceTimersByTime(150)
    expect(isSwitching.value).toBe(false)

    triggerSwitch()
    expect(isSwitching.value).toBe(true)
    vi.advanceTimersByTime(150)
    expect(isSwitching.value).toBe(false)
  })
})
