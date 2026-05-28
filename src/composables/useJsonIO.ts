// JSON IO — export/import quotation JSON with schema validation

import type { QuotationData } from '../types/quotation'
import { generateFilename } from '../utils/generateFilename'

const REQUIRED_KEYS: (keyof QuotationData)[] = [
  'meta', 'from', 'to', 'line_items', 'totals', 'status', 'template',
]

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function hasRequiredKeys(data: Record<string, unknown>): boolean {
  return REQUIRED_KEYS.every((key) => key in data)
}

/**
 * Type guard: checks if an unknown value is a valid QuotationData shape.
 */
export function isQuotationJson(data: unknown): data is QuotationData {
  if (!isObject(data)) return false
  if (data.schema_version !== '1.0') return false
  if (data.type !== 'quotation') return false
  return hasRequiredKeys(data)
}

/**
 * Serialize a QuotationData to JSON and trigger a file download.
 */
export function exportQuotation(quotation: QuotationData): void {
  const json = JSON.stringify(quotation, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const filename = generateFilename(
    quotation.meta.quotation_number,
    quotation.to.name,
  )
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Parse a File as quotation JSON, validate the schema, and return the data.
 * Throws a descriptive error on validation failure.
 */
export function parseQuotationFile(file: File): Promise<QuotationData> {
  return new Promise<QuotationData>((resolve, reject) => {
    // Validate file type hint (accept .json extension)
    if (!file.name.endsWith('.json')) {
      reject(new Error('Invalid file type. Please upload a .json file.'))
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      try {
        const text = reader.result as string
        let parsed: unknown
        try {
          parsed = JSON.parse(text)
        } catch {
          reject(new Error('Invalid JSON syntax. The file could not be parsed.'))
          return
        }

        if (!isObject(parsed)) {
          reject(new Error('Invalid quotation file: expected a JSON object.'))
          return
        }

        if (parsed.schema_version !== '1.0') {
          reject(new Error(
            `Unsupported schema version "${String(parsed.schema_version)}". Expected "1.0".`
          ))
          return
        }

        if (parsed.type !== 'quotation') {
          reject(new Error(
            `Invalid file type "${String(parsed.type)}". Expected "quotation".`
          ))
          return
        }

        if (!hasRequiredKeys(parsed)) {
          const missing = REQUIRED_KEYS.filter((key) => !(key in parsed))
          reject(new Error(
            `Missing required fields: ${missing.join(', ')}.`
          ))
          return
        }

        // Validate nested field types to prevent crashes from malformed data
        if (typeof parsed.meta !== 'object' || parsed.meta === null) {
          reject(new Error('Invalid quotation file: "meta" must be an object.'))
          return
        }
        if (typeof parsed.from !== 'object' || parsed.from === null) {
          reject(new Error('Invalid quotation file: "from" must be an object.'))
          return
        }
        if (typeof parsed.to !== 'object' || parsed.to === null) {
          reject(new Error('Invalid quotation file: "to" must be an object.'))
          return
        }
        if (!Array.isArray(parsed.line_items)) {
          reject(new Error('Invalid quotation file: "line_items" must be an array.'))
          return
        }
        if (typeof parsed.totals !== 'object' || parsed.totals === null) {
          reject(new Error('Invalid quotation file: "totals" must be an object.'))
          return
        }

        resolve(parsed as unknown as QuotationData)
      } catch (err) {
        reject(new Error(
          err instanceof Error ? err.message : 'Failed to parse quotation file.'
        ))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file.'))
    }

    reader.readAsText(file)
  })
}
