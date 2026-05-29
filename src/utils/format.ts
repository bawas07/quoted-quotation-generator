// Shared formatting utilities for quotation templates
import { parse, format } from 'date-fns'
import type { CurrencyCode } from '../types/quotation'

const DATE_INPUT_FORMAT = 'dd-MM-yyyy'

const CURRENCY_LOCALE_MAP: Record<CurrencyCode, string> = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  IDR: 'id-ID',
  SGD: 'en-SG',
  MYR: 'ms-MY',
  AUD: 'en-AU',
  JPY: 'ja-JP',
}

const CURRENCY_DECIMALS: Record<CurrencyCode, number> = {
  USD: 2,
  EUR: 2,
  GBP: 2,
  IDR: 0,
  SGD: 2,
  MYR: 2,
  AUD: 2,
  JPY: 0,
}

export function formatAmount(amount: number, currency: CurrencyCode): string {
  const locale = CURRENCY_LOCALE_MAP[currency] || 'id-ID'
  const decimals = CURRENCY_DECIMALS[currency] ?? 2
  return amount.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = parse(dateStr, DATE_INPUT_FORMAT, new Date())
  if (isNaN(date.getTime())) return dateStr
  return format(date, 'MMM dd, yyyy')
}
