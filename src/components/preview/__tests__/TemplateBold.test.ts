import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TemplateBold from '../templates/TemplateBold.vue'
import type { QuotationData } from '../../../types/quotation'

function createSampleQuotation(): QuotationData {
  return {
    schema_version: '1.0',
    type: 'quotation',
    template: 'bold',
    status: 'SENT',
    meta: {
      quotation_number: 'QUO-002',
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
    totals: { subtotal: 3500000, discount_percent: 0, discount_amount: 0, tax_percent: 11, tax_amount: 385000, total: 3885000 },
    tax_label: 'PPN',
    discount_label: 'Discount',
    notes: '',
    created_at: '2026-05-19T10:00:00Z',
    updated_at: '2026-05-19T10:00:00Z',
  }
}

describe('TemplateBold', () => {
  it('renders Quotation label', () => {
    const wrapper = mount(TemplateBold, { props: { quotation: createSampleQuotation() } })
    expect(wrapper.text()).toContain('QUOTATION')
  })

  it('renders status badge with SENT status', () => {
    const wrapper = mount(TemplateBold, { props: { quotation: createSampleQuotation() } })
    expect(wrapper.text()).toContain('SENT')
    expect(wrapper.find('.tpl-status').exists()).toBe(true)
  })

  it('renders header band with quotation number', () => {
    const wrapper = mount(TemplateBold, { props: { quotation: createSampleQuotation() } })
    expect(wrapper.text()).toContain('QUO-002')
  })

  it('renders issue and valid until dates', () => {
    const wrapper = mount(TemplateBold, { props: { quotation: createSampleQuotation() } })
    expect(wrapper.text()).toContain('Issued')
    expect(wrapper.text()).toContain('Valid until')
  })

  it('renders line items', () => {
    const wrapper = mount(TemplateBold, { props: { quotation: createSampleQuotation() } })
    expect(wrapper.text()).toContain('Logo Design')
  })

  it('renders party names', () => {
    const wrapper = mount(TemplateBold, { props: { quotation: createSampleQuotation() } })
    expect(wrapper.text()).toContain('Jane Doe')
    expect(wrapper.text()).toContain('Acme Corp')
  })
})
