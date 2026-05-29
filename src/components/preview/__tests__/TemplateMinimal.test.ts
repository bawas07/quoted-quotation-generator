import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TemplateMinimal from '../templates/TemplateMinimal.vue'
import type { QuotationData } from '../../../types/quotation'

function createSampleQuotation(): QuotationData {
  return {
    schema_version: '1.0',
    type: 'quotation',
    template: 'minimal',
    status: 'DRAFT',
    meta: {
      quotation_number: 'QUO-001',
      issue_date: '2026-05-19',
      valid_until: '2026-06-02',
      currency: 'IDR',
    },
    from: { name: 'Jane Doe', address: '123 Main St', email: 'jane@example.com', phone: '', website: '' },
    to: { name: 'Acme Corp', address: '456 Business Ave', email: 'billing@acme.com' },
    logo: null,
    line_items: [
      { id: 'item_1', description: 'Logo Design', quantity: 1, unit_price: 3500000, amount: 3500000 },
    ],
    totals: { subtotal: 3500000, discount_percent: 0, discount_amount: 0, tax_percent: 0, tax_amount: 0, total: 3500000 },
    tax_label: 'PPN',
    discount_label: 'Discount',
    notes: '',
    created_at: '2026-05-19T10:00:00Z',
    updated_at: '2026-05-19T10:00:00Z',
  }
}

describe('TemplateMinimal', () => {
  it('renders Quotation title', () => {
    const wrapper = mount(TemplateMinimal, { props: { quotation: createSampleQuotation() } })
    expect(wrapper.text()).toContain('Quotation')
  })

  it('renders status badge', () => {
    const wrapper = mount(TemplateMinimal, { props: { quotation: createSampleQuotation() } })
    expect(wrapper.text()).toContain('DRAFT')
    expect(wrapper.find('.tpl-status').exists()).toBe(true)
  })

  it('renders line items', () => {
    const wrapper = mount(TemplateMinimal, { props: { quotation: createSampleQuotation() } })
    expect(wrapper.text()).toContain('Logo Design')
  })

  it('renders party names', () => {
    const wrapper = mount(TemplateMinimal, { props: { quotation: createSampleQuotation() } })
    expect(wrapper.text()).toContain('Jane Doe')
    expect(wrapper.text()).toContain('Acme Corp')
  })

  it('renders Valid Until not Due Date', () => {
    const wrapper = mount(TemplateMinimal, { props: { quotation: createSampleQuotation() } })
    expect(wrapper.text()).toContain('Valid until')
    expect(wrapper.text()).not.toContain('Due Date')
  })

  it('mounts without crashing when notes are empty', () => {
    const wrapper = mount(TemplateMinimal, { props: { quotation: createSampleQuotation() } })
    expect(wrapper.exists()).toBe(true)
  })
})
