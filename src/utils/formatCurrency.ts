// Currency formatting utilities
// Defaults to IDR matching the reference design (docs/example-v2.html)
// Handles zero-decimal currencies (IDR, JPY) per locale conventions

const LOCALE_MAP: Record<string, string> = {
  IDR: 'id-ID',
  JPY: 'ja-JP',
  EUR: 'de-DE',
  GBP: 'en-GB',
  USD: 'en-US',
  SGD: 'en-SG',
  MYR: 'ms-MY',
  AUD: 'en-AU',
}

const ZERO_DECIMAL_CURRENCIES = new Set(['IDR', 'JPY'])

export function formatCurrency(amount: number, currency: string = 'IDR'): string {
  const locale = LOCALE_MAP[currency] || 'en-US'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: ZERO_DECIMAL_CURRENCIES.has(currency) ? 0 : 2,
    maximumFractionDigits: ZERO_DECIMAL_CURRENCIES.has(currency) ? 0 : 2,
  }).format(amount)
}
