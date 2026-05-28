import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusBar from '../StatusBar.vue'

describe('StatusBar', () => {
  it('renders quotation number', () => {
    const wrapper = mount(StatusBar, {
      props: {
        quotationNumber: 'QUO-001',
        clientName: 'Acme Corp',
        modelValue: 'DRAFT',
      },
    })
    expect(wrapper.text()).toContain('QUO-001')
  })

  it('renders client name', () => {
    const wrapper = mount(StatusBar, {
      props: {
        quotationNumber: 'QUO-001',
        clientName: 'Acme Corp',
        modelValue: 'DRAFT',
      },
    })
    expect(wrapper.text()).toContain('Acme Corp')
  })

  it('shows fallback dash when no client name', () => {
    const wrapper = mount(StatusBar, {
      props: {
        quotationNumber: 'QUO-001',
        clientName: '',
        modelValue: 'DRAFT',
      },
    })
    expect(wrapper.text()).toContain('—')
  })

  it('renders status badge with current status', () => {
    const wrapper = mount(StatusBar, {
      props: {
        quotationNumber: 'QUO-001',
        clientName: 'Acme Corp',
        modelValue: 'SENT',
      },
    })
    expect(wrapper.text()).toContain('SENT')
    expect(wrapper.find('.status-badge').exists()).toBe(true)
  })

  it('status badge has correct class for status', () => {
    const wrapper = mount(StatusBar, {
      props: {
        quotationNumber: 'QUO-001',
        clientName: 'Acme Corp',
        modelValue: 'SENT',
      },
    })
    expect(wrapper.find('.status-badge').classes()).toContain('sent')
  })

  it('emits update:modelValue when status option clicked', async () => {
    const wrapper = mount(StatusBar, {
      props: {
        quotationNumber: 'QUO-001',
        clientName: 'Acme Corp',
        modelValue: 'DRAFT',
      },
    })

    // Click the badge to open dropdown
    await wrapper.find('.status-badge').trigger('click')

    // Click the "SENT" option
    const options = wrapper.findAll('.sb-status-option')
    const sentOption = options.find((o) => o.text().includes('SENT'))
    expect(sentOption).toBeTruthy()
    await sentOption!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['SENT'])
  })
})
