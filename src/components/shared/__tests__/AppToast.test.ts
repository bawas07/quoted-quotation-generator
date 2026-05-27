import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AppToast from '../AppToast.vue'
import { useToast } from '../../../composables/useToast'

// We need to control the toast state for testing
// useToast uses module-level state, so we can push toasts directly

describe('AppToast', () => {
  beforeEach(() => {
    // Clear toasts before each test
    const { clearToasts } = useToast()
    clearToasts()
  })

  // 7.5.1
  it('renders nothing when toasts array is empty', () => {
    const wrapper = mount(AppToast)
    expect(wrapper.find('.toast-card').exists()).toBe(false)
  })

  // 7.5.2
  it('renders toast message and type color', () => {
    const { showToast } = useToast()
    showToast('Test message', 'success')

    const wrapper = mount(AppToast)
    expect(wrapper.text()).toContain('Test message')
    expect(wrapper.find('.toast-success').exists()).toBe(true)
  })

  // 7.5.3
  it('renders multiple toasts stacked', () => {
    const { showToast } = useToast()
    showToast('First', 'success')
    showToast('Second', 'warning')
    showToast('Third', 'error')

    const wrapper = mount(AppToast)
    const cards = wrapper.findAll('.toast-card')
    expect(cards).toHaveLength(3)
  })

  // 7.5.4
  it('close button removes toast immediately', async () => {
    const { showToast } = useToast()
    showToast('Dismiss me', 'success')

    const wrapper = mount(AppToast)
    expect(wrapper.findAll('.toast-card')).toHaveLength(1)

    await wrapper.find('.toast-close').trigger('click')
    // After remove, the toast should be gone
    const { toasts } = useToast()
    expect(toasts.value).toHaveLength(0)
  })

  // 7.5.5
  it('auto-dismiss after 3s (use vitest fake timers)', async () => {
    vi.useFakeTimers()

    const { showToast, toasts } = useToast()
    showToast('Auto dismiss', 'success')
    expect(toasts.value).toHaveLength(1)

    // Advance time by 3s
    vi.advanceTimersByTime(3000)
    expect(toasts.value).toHaveLength(0)

    vi.useRealTimers()
  })
})
