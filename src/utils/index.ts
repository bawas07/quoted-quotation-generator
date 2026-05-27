// Utils barrel export — convenience imports for consumers
export { storage } from './localStorage'
export {
  calculateLineItemTotal,
  calculateSubtotal,
  calculateDiscount,
  calculateTax,
  calculateTotal,
} from './calculations'
export { formatCurrency } from './formatCurrency'
export { fuzzyMatch, fuzzySearch, fuzzyFind, looksLikeOneOff } from './fuzzyMatch'
export { generateFilename } from './generateFilename'
export { DEFAULT_CURRENCY, DEFAULT_STATUS, DEFAULT_TEMPLATE, DEFAULT_TAX_RATE, DEFAULT_DISCOUNT, DEFAULT_TAX_LABEL, createEmptyQuotation } from './defaults'
