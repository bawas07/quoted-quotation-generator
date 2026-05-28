import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TemplateSwitcher from '../TemplateSwitcher.vue'

describe('TemplateSwitcher', () => {
  it('renders all 5 template pills with display names', () => {
    const wrapper = mount(TemplateSwitcher, {
      props: { modelValue: 'classic' },
    })
    const buttons = wrapper.findAll('.tpl-btn')
    expect(buttons).toHaveLength(5)

    const labels = buttons.map((b) => b.text())
    expect(labels).toContain('Classic')
    expect(labels).toContain('Minimal')
    expect(labels).toContain('Bold')
    expect(labels).toContain('Sidebar')
    expect(labels).toContain('Friendly')
  })

  it('does not use raw template IDs as labels', () => {
    const wrapper = mount(TemplateSwitcher, {
      props: { modelValue: 'classic' },
    })
    // Raw IDs should NOT be visible
    expect(wrapper.text()).not.toContain('classic')
    expect(wrapper.text()).not.toContain('minimal')
    expect(wrapper.text()).not.toContain('bold')
    expect(wrapper.text()).not.toContain('sidebar')
    expect(wrapper.text()).not.toContain('friendly')
  })

  it('highlights active template', () => {
    const wrapper = mount(TemplateSwitcher, {
      props: { modelValue: 'bold' },
    })
    const activeButtons = wrapper.findAll('.tpl-btn.active')
    expect(activeButtons).toHaveLength(1)
    expect(activeButtons[0].text()).toBe('Bold')
  })

  it('emits update:modelValue with template id when clicked', async () => {
    const wrapper = mount(TemplateSwitcher, {
      props: { modelValue: 'classic' },
    })
    const buttons = wrapper.findAll('.tpl-btn')
    const minimalBtn = buttons.find((b) => b.text() === 'Minimal')
    expect(minimalBtn).toBeTruthy()
    await minimalBtn!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['minimal'])
  })
})
