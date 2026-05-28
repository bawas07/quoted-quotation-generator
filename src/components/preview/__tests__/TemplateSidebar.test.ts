import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TemplateSidebar from '../templates/TemplateSidebar.vue'
import type { QuotationData } from '../../../types/quotation'

function createSampleQuotation(): QuotationData {
  return {
    schema_version: '1.0',
    type: 'quotation',
    template: 'sidebar',
    status: 'DRAFT',
    meta: {
      quotation_number: 'QUO-003',
      issue_date: '2026-05-19',
      valid_until: '2026-06-02',
      currency: 'IDR',
    },
    from: { name: 'Jane Doe', address: '123 Main St', email: 'jane@example.com', phone: '+62 812 0000', website: '' },
    to: { name: 'Acme Corp', address: '456 Business Ave', email: 'billing@acme.com' },
    logo: null,
    line_items: [
      { id: 'item_1', description: 'Logo Design', quantity: 1, unit_price: 3500000, amount: 3500000 },
      { id: 'item_2', description: 'Brand Guidelines', quantity: 2, unit_price: 750000, amount: 1500000 },
    ],
    totals: { subtotal: 5000000, discount_percent: 0, discount_amount: 0, tax_percent: 0, tax_amount: 0, total: 5000000 },
    tax_label: 'PPN',
    notes: '',
    created_at: '2026-05-19T10:00:00Z',
    updated_at: '2026-05-19T10:00:00Z',
  }
}

describe('TemplateSidebar', () => {
  it('renders Quotation title', () => {
    const wrapper = mount(TemplateSidebar, { props: { quotation: createSampleQuotation() } })
    expect(wrapper.text()).toContain('Quotation')
  })

  it('renders status badge', () => {
    const wrapper = mount(TemplateSidebar, { props: { quotation: createSampleQuotation() } })
    expect(wrapper.text()).toContain('DRAFT')
    expect(wrapper.find('.tpl-status').exists()).toBe(true)
  })

  it('renders sender info in sidebar', () => {
    const wrapper = mount(TemplateSidebar, { props: { quotation: createSampleQuotation() } })
    expect(wrapper.text()).toContain('Jane Doe')
  })

  it('renders recipient info', () => {
    const wrapper = mount(TemplateSidebar, { props: { quotation: createSampleQuotation() } })
    expect(wrapper.text()).toContain('Acme Corp')
  })

  it('renders all line items', () => {
    const wrapper = mount(TemplateSidebar, { props: { quotation: createSampleQuotation() } })
    expect(wrapper.text()).toContain('Logo Design')
    expect(wrapper.text()).toContain('Brand Guidelines')
  })

  it('renders Valid Until not Due Date', () => {
    const wrapper = mount(TemplateSidebar, { props: { quotation: createSampleQuotation() } })
    // Sidebar uses "Valid Until:" format
    expect(wrapper.text()).toContain('Valid Until')
    expect(wrapper.text()).not.toContain('Due Date')
  })
})
