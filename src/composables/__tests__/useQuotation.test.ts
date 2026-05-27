import { describe, it, expect, beforeEach } from 'vitest'
import { useQuotation } from '../useQuotation'
import { createEmptyQuotation } from '../../utils/defaults'

describe('useQuotation', () => {
  let q: ReturnType<typeof useQuotation>

  beforeEach(() => {
    q = useQuotation()
  })

  // 7.1.1
  it('initial state has default values from createEmptyQuotation', () => {
    const defaults = createEmptyQuotation()
    expect(q.quotation.value.schema_version).toBe(defaults.schema_version)
    expect(q.quotation.value.type).toBe('quotation')
    expect(q.quotation.value.status).toBe('DRAFT')
    expect(q.quotation.value.template).toBe('classic')
    expect(q.quotation.value.meta.currency).toBe('IDR')
    expect(q.quotation.value.line_items).toHaveLength(1)
    expect(q.quotation.value.line_items[0].description).toBe('')
  })

  // 7.1.2
  it('isDirty starts false', () => {
    expect(q.isDirty.value).toBe(false)
  })

  // 7.1.3
  it('updating meta sets isDirty = true', () => {
    q.updateMeta({ quotation_number: 'QUO-002' })
    expect(q.isDirty.value).toBe(true)
  })

  // 7.1.4
  it('updating from/to sets isDirty = true', () => {
    q.updateFrom({ name: 'Acme Corp' })
    expect(q.isDirty.value).toBe(true)
  })

  // 7.1.5
  it('adding line item sets isDirty = true', () => {
    q.addLineItem()
    expect(q.isDirty.value).toBe(true)
  })

  // 7.1.6
  it('updating line item sets isDirty = true', () => {
    const id = q.quotation.value.line_items[0].id
    q.updateLineItem(id, { description: 'New item' })
    expect(q.isDirty.value).toBe(true)
  })

  // 7.1.7
  it('removing line item sets isDirty = true', () => {
    q.addLineItem()
    // Reset isDirty
    q.isDirty.value = false
    const id = q.quotation.value.line_items[1].id
    q.removeLineItem(id)
    expect(q.isDirty.value).toBe(true)
  })

  // 7.1.8
  it('updating totals sets isDirty = true', () => {
    q.updateTotals({ discount_percent: 10 })
    expect(q.isDirty.value).toBe(true)
  })

  // 7.1.9
  it('setting status sets isDirty = true', () => {
    q.setStatus('SENT')
    expect(q.isDirty.value).toBe(true)
  })

  // 7.1.10
  it('setting template sets isDirty = true', () => {
    q.setTemplate('bold')
    expect(q.isDirty.value).toBe(true)
  })

  // 7.1.11
  it('setting notes sets isDirty = true', () => {
    q.setNotes('Some notes')
    expect(q.isDirty.value).toBe(true)
  })

  // 7.1.12
  it('loadQuotation replaces state and resets isDirty', () => {
    const data = createEmptyQuotation()
    data.meta.quotation_number = 'LOADED-001'
    q.loadQuotation(data)
    expect(q.quotation.value.meta.quotation_number).toBe('LOADED-001')
    expect(q.isDirty.value).toBe(false)
  })

  // 7.1.13
  it('resetQuotation creates fresh state and resets isDirty', () => {
    q.updateMeta({ quotation_number: 'CHANGED' })
    q.resetQuotation()
    expect(q.quotation.value.meta.quotation_number).not.toBe('CHANGED')
    expect(q.isDirty.value).toBe(false)
  })

  // 7.1.14
  it('computed subtotal sums line items correctly', () => {
    q.addLineItem()
    const items = q.quotation.value.line_items
    items[0].amount = 100
    items[1].amount = 250
    expect(q.subtotal.value).toBe(350)
  })

  // 7.1.15
  it('computed discount_amount applies percent to subtotal', () => {
    q.quotation.value.line_items[0].amount = 200
    q.quotation.value.totals.discount_percent = 10
    expect(q.discount_amount.value).toBe(20)
  })

  // 7.1.16
  it('computed tax_amount applies percent to discounted base', () => {
    q.quotation.value.line_items[0].amount = 200
    q.quotation.value.totals.discount_percent = 10
    q.quotation.value.totals.tax_percent = 11
    // subtotal=200, discount=20, base=180, tax=180*11%=19.8
    expect(q.tax_amount.value).toBeCloseTo(19.8)
  })

  // 7.1.17
  it('computed total = subtotal - discount + tax', () => {
    q.quotation.value.line_items[0].amount = 200
    q.quotation.value.totals.discount_percent = 10
    q.quotation.value.totals.tax_percent = 11
    // subtotal=200, discount=20, tax=19.8, total=199.8
    expect(q.total.value).toBeCloseTo(199.8)
  })

  // 7.1.18
  it('addLineItem appends item with unique id', () => {
    const origLen = q.quotation.value.line_items.length
    q.addLineItem()
    expect(q.quotation.value.line_items).toHaveLength(origLen + 1)
    const added = q.quotation.value.line_items[q.quotation.value.line_items.length - 1]
    expect(added.id).toBeTruthy()
    expect(added.description).toBe('')
    expect(added.quantity).toBe(1)
    expect(added.unit_price).toBe(0)
  })

  // 7.1.19
  it('updateLineItem recalculates amount = qty * unit_price', () => {
    const id = q.quotation.value.line_items[0].id
    q.updateLineItem(id, { quantity: 3, unit_price: 50 })
    const item = q.quotation.value.line_items[0]
    expect(item.amount).toBe(150)
  })

  // 7.1.20
  it('removeLineItem removes by id', () => {
    q.addLineItem()
    const items = q.quotation.value.line_items
    const idToRemove = items[0].id
    q.removeLineItem(idToRemove)
    expect(q.quotation.value.line_items.find((i) => i.id === idToRemove)).toBeUndefined()
  })

  // 7.1.21
  it('removeLineItem on last item does nothing (guard)', () => {
    // Only 1 item by default
    const itemsBefore = q.quotation.value.line_items.length
    q.removeLineItem(q.quotation.value.line_items[0].id)
    expect(q.quotation.value.line_items).toHaveLength(itemsBefore)
  })

  // 7.1.22
  it('loadQuotation deep clones — mutating loaded object does not affect original', () => {
    const data = createEmptyQuotation()
    data.meta.quotation_number = 'ORIGINAL'
    q.loadQuotation(data)
    data.meta.quotation_number = 'MUTATED'
    expect(q.quotation.value.meta.quotation_number).toBe('ORIGINAL')
  })

  // 7.1.24
  it('setting logo sets isDirty = true', () => {
    q.setLogo({ data: 'data:image/png;base64,abc', name: 'logo.png' })
    expect(q.isDirty.value).toBe(true)
  })

  // 7.1.25
  it('setting same status again still sets isDirty = true', () => {
    q.isDirty.value = false
    q.setStatus('DRAFT')
    expect(q.isDirty.value).toBe(true)
  })

  // 7.1.26
  it('computed totals update reactively when line items change', () => {
    const item = q.quotation.value.line_items[0]
    q.updateLineItem(item.id, { quantity: 5, unit_price: 100 })
    expect(q.subtotal.value).toBe(500)
    expect(q.total.value).toBeGreaterThan(0)
  })
})
