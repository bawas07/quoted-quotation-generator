import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TemplateClassic from '../templates/TemplateClassic.vue'
import type { QuotationData } from '../../../types/quotation'

function createSampleQuotation(): QuotationData {
  return {
    schema_version: '1.0',
    type: 'quotation',
    template: 'classic',
    status: 'DRAFT',
    meta: {
      quotation_number: 'QUO-001',
      issue_date: '2026-05-19',
      valid_until: '2026-06-02',
      currency: 'IDR',
    },
    from: {
      name: 'Jane Doe',
      address: '123 Main St',
      email: 'jane@example.com',
      phone: '+62 812 0000',
      website: 'janedoe.com',
    },
    to: {
      name: 'Acme Corp',
      address: '456 Business Ave',
      email: 'billing@acme.com',
    },
    logo: null,
    line_items: [
      { id: 'item_1', description: 'Logo Design', quantity: 1, unit_price: 3500000, amount: 3500000 },
      { id: 'item_2', description: 'Brand Guidelines', quantity: 1, unit_price: 1500000, amount: 1500000 },
    ],
    totals: {
      subtotal: 5000000,
      discount_percent: 10,
      discount_amount: 500000,
      tax_percent: 11,
      tax_amount: 495000,
      total: 4995000,
    },
    tax_label: 'PPN',
    notes: 'Valid for 14 days.',
    created_at: '2026-05-19T10:00:00Z',
    updated_at: '2026-05-19T10:00:00Z',
  }
}

describe('TemplateClassic', () => {
  it('renders Quotation title', () => {
    const wrapper = mount(TemplateClassic, {
      props: { quotation: createSampleQuotation() },
    })
    expect(wrapper.text()).toContain('Quotation')
  })

  it('renders status badge with correct status', () => {
    const wrapper = mount(TemplateClassic, {
      props: { quotation: createSampleQuotation() },
    })
    expect(wrapper.text()).toContain('DRAFT')
    expect(wrapper.find('.tpl-status').exists()).toBe(true)
  })

  it('renders all line items', () => {
    const wrapper = mount(TemplateClassic, {
      props: { quotation: createSampleQuotation() },
    })
    expect(wrapper.text()).toContain('Logo Design')
    expect(wrapper.text()).toContain('Brand Guidelines')
  })

  it('renders from party name', () => {
    const wrapper = mount(TemplateClassic, {
      props: { quotation: createSampleQuotation() },
    })
    expect(wrapper.text()).toContain('Jane Doe')
  })

  it('renders to party name', () => {
    const wrapper = mount(TemplateClassic, {
      props: { quotation: createSampleQuotation() },
    })
    expect(wrapper.text()).toContain('Acme Corp')
  })

  it('renders Valid Until not Due Date', () => {
    const wrapper = mount(TemplateClassic, {
      props: { quotation: createSampleQuotation() },
    })
    expect(wrapper.text()).toContain('Valid until')
    expect(wrapper.text()).not.toContain('Due Date')
  })

  it('renders totals including discount and tax', () => {
    const wrapper = mount(TemplateClassic, {
      props: { quotation: createSampleQuotation() },
    })
    expect(wrapper.text()).toContain('PPN')
  })

  it('renders notes when present', () => {
    const wrapper = mount(TemplateClassic, {
      props: { quotation: createSampleQuotation() },
    })
    expect(wrapper.text()).toContain('Valid for 14 days.')
  })

  it('hides logo section when logo is null', () => {
    const wrapper = mount(TemplateClassic, {
      props: { quotation: createSampleQuotation() },
    })
    // Should not have an img tag since logo is null
    expect(wrapper.find('img').exists()).toBe(false)
  })
})
