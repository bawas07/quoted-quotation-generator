import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppButton from '../AppButton.vue'

describe('AppButton', () => {
  // 7.4.1
  it('renders slot content', () => {
    const wrapper = mount(AppButton, {
      slots: { default: 'Click me' },
    })
    expect(wrapper.text()).toContain('Click me')
  })

  // 7.4.2
  it('applies primary variant class by default', () => {
    const wrapper = mount(AppButton, {
      slots: { default: 'OK' },
    })
    expect(wrapper.classes()).toContain('btn-primary')
  })

  // 7.4.3
  it('applies secondary variant class when prop set', () => {
    const wrapper = mount(AppButton, {
      props: { variant: 'secondary' },
      slots: { default: 'OK' },
    })
    expect(wrapper.classes()).toContain('btn-secondary')
    expect(wrapper.classes()).not.toContain('btn-primary')
  })

  // 7.4.4
  it('applies ghost variant class when prop set', () => {
    const wrapper = mount(AppButton, {
      props: { variant: 'ghost' },
      slots: { default: 'OK' },
    })
    expect(wrapper.classes()).toContain('btn-ghost')
  })

  // 7.4.5
  it('applies sm size class when prop set', () => {
    const wrapper = mount(AppButton, {
      props: { size: 'sm' },
      slots: { default: 'OK' },
    })
    expect(wrapper.classes()).toContain('btn-sm')
  })

  // 7.4.6
  it('forwards click events', async () => {
    const wrapper = mount(AppButton, {
      slots: { default: 'Click' },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
  })

  // 7.4.7
  it('respects disabled attribute', () => {
    const wrapper = mount(AppButton, {
      props: { disabled: true },
      slots: { default: 'OK' },
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('btn-primary')
  })
})
