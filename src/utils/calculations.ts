// Calculation helpers for line items and totals
// Parameter names align with LineItem type (unit_price)
// Discount applied to subtotal, then tax on discounted base
// Matches the calculation order in docs/example-v2.html

export function calculateLineItemTotal(quantity: number, unitPrice: number): number {
  return quantity * unitPrice
}

export function calculateSubtotal(items: Array<{ quantity: number; unit_price: number }>): number {
  return items.reduce((sum, item) => sum + calculateLineItemTotal(item.quantity, item.unit_price), 0)
}

export function calculateDiscount(subtotal: number, discountPercent: number): number {
  return subtotal * (discountPercent / 100)
}

export function calculateTax(baseAmount: number, taxRate: number): number {
  return baseAmount * (taxRate / 100)
}

export function calculateTotal(subtotal: number, discountPercent: number, taxRate: number): number {
  const discountAmount = calculateDiscount(subtotal, discountPercent)
  const base = subtotal - discountAmount
  const taxAmount = calculateTax(base, taxRate)
  return base + taxAmount
}
