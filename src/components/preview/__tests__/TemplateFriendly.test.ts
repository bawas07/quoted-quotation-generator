import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TemplateFriendly from '../templates/TemplateFriendly.vue'
import type { QuotationData } from '../../../types/quotation'

function createSampleQuotation(): QuotationData {
  return {
    schema_version: '1.0',
    type: 'quotation',
    template: 'friendly',
    status: 'ACCEPTED',
    meta: {
      quotation_number: 'QUO-004',
      issue_date: '2026-05-19',
      valid_until: '2026-06-02',
      currency: 'USD',
    },
    from: { name: 'Jane Doe', address: '123 Main St', email: 'jane@example.com', phone: '', website: '' },
    to: { name: 'Acme Corp', address: '456 Business Ave', email: 'billing@acme.com' },
    logo: null,
    line_items: [
      { id: 'item_1', description: 'Logo Design', quantity: 1, unit_price: 3500, amount: 3500 },
    ],
    totals: { subtotal: 3500, discount_percent: 0, discount_amount: 0, tax_percent: 0, tax_amount: 0, total: 3500 },
    tax_label: 'GST',
    notes: 'Thank you for your business!',
    created_at: '2026-05-19T10:00:00Z',
    updated_at: '2026-05-19T10:00:00Z',
  }
}

describe('TemplateFriendly', () => {
  it('renders Quotation badge', () => {
    const wrapper = mount(TemplateFriendly, { props: { quotation: createSampleQuotation() } })
    expect(wrapper.text()).toContain('Quotation')
  })

  it('renders status badge with ACCEPTED status', () => {
    const wrapper = mount(TemplateFriendly, { props: { quotation: createSampleQuotation() } })
    expect(wrapper.text()).toContain('ACCEPTED')
    expect(wrapper.find('.tpl-status').exists()).toBe(true)
  })

  it('renders party cards', () => {
    const wrapper = mount(TemplateFriendly, { props: { quotation: createSampleQuotation() } })
    expect(wrapper.text()).toContain('Jane Doe')
    expect(wrapper.text()).toContain('Acme Corp')
  })

  it('renders info strip with dates', () => {
    const wrapper = mount(TemplateFriendly, { props: { quotation: createSampleQuotation() } })
    expect(wrapper.text()).toContain('Issue Date')
    expect(wrapper.text()).toContain('Valid Until')
  })

  it('renders line items', () => {
    const wrapper = mount(TemplateFriendly, { props: { quotation: createSampleQuotation() } })
    expect(wrapper.text()).toContain('Logo Design')
  })

  it('renders notes card when notes present', () => {
    const wrapper = mount(TemplateFriendly, { props: { quotation: createSampleQuotation() } })
    expect(wrapper.text()).toContain('Thank you for your business!')
  })

  it('renders currency in info strip', () => {
    const wrapper = mount(TemplateFriendly, { props: { quotation: createSampleQuotation() } })
    expect(wrapper.text()).toContain('USD')
  })
})
