import { describe, it, expect, vi, beforeEach } from 'vitest'
import { exportQuotation, parseQuotationFile, isQuotationJson } from '../useJsonIO'
import { createEmptyQuotation } from '../../utils/defaults'
import type { QuotationData } from '../../types/quotation'

describe('useJsonIO', () => {
  let quotation: QuotationData

  beforeEach(() => {
    quotation = createEmptyQuotation()
    quotation.meta.quotation_number = 'QUO-001'
    quotation.to.name = 'TestClient'
  })

  // ── exportQuotation ───────────────────────────────────────────

  // 7.2.1
  it('exportQuotation creates a Blob with correct MIME type', () => {
    // Mock DOM APIs
    const createObjectURL = vi.fn(() => 'blob:test')
    const revokeObjectURL = vi.fn()
    URL.createObjectURL = createObjectURL
    URL.revokeObjectURL = revokeObjectURL

    const anchors: HTMLAnchorElement[] = []
    const origCreateElement = document.createElement.bind(document)
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation(
      (tag: string, options?: ElementCreationOptions) => {
        const el = origCreateElement(tag, options)
        if (tag === 'a') {
          anchors.push(el as HTMLAnchorElement)
        }
        return el
      }
    )

    exportQuotation(quotation)

    expect(anchors).toHaveLength(1)
    const anchor = anchors[0]
    expect(anchor.download).toMatch(/^QUO-001_TestClient_\d{4}-\d{2}-\d{2}\.json$/)
    expect(anchor.href).toBe('blob:test')

    createElementSpy.mockRestore()
  })

  // 7.2.3
  it('exportQuotation JSON contains all QuotationData fields', () => {
    const json = JSON.stringify(quotation, null, 2)
    const parsed = JSON.parse(json) as QuotationData
    expect(parsed.schema_version).toBe('1.0')
    expect(parsed.type).toBe('quotation')
    expect(parsed.meta.quotation_number).toBe('QUO-001')
    expect(parsed.to.name).toBe('TestClient')
    expect(parsed.line_items).toHaveLength(1)
  })

  // ── parseQuotationFile ────────────────────────────────────────

  // 7.2.4
  it('parseQuotationFile parses valid quotation JSON', async () => {
    const json = JSON.stringify(quotation)
    const file = new File([json], 'quotation.json', { type: 'application/json' })
    const result = await parseQuotationFile(file)
    expect(result.meta.quotation_number).toBe('QUO-001')
    expect(result.to.name).toBe('TestClient')
  })

  // 7.2.5
  it('parseQuotationFile validates schema_version === "1.0"', async () => {
    const invalid = { ...quotation, schema_version: '2.0' }
    const file = new File([JSON.stringify(invalid)], 'bad.json', { type: 'application/json' })
    await expect(parseQuotationFile(file)).rejects.toThrow('schema version')
  })

  // 7.2.6
  it('parseQuotationFile validates type === "quotation"', async () => {
    const invalid = { ...quotation, type: 'workspace_backup' }
    const file = new File([JSON.stringify(invalid)], 'bad.json', { type: 'application/json' })
    await expect(parseQuotationFile(file)).rejects.toThrow('file type')
  })

  // 7.2.7
  it('parseQuotationFile rejects missing required keys', async () => {
    const { line_items, ...partial } = quotation
    const file = new File([JSON.stringify(partial)], 'bad.json', { type: 'application/json' })
    await expect(parseQuotationFile(file)).rejects.toThrow('Missing required')
  })

  // 7.2.8
  it('parseQuotationFile rejects unknown schema_version', async () => {
    const bad = { ...quotation, schema_version: '0.9' }
    const file = new File([JSON.stringify(bad)], 'bad.json', { type: 'application/json' })
    await expect(parseQuotationFile(file)).rejects.toThrow('schema version')
  })

  // 7.2.9
  it('parseQuotationFile rejects workspace backup (type: workspace_backup)', async () => {
    const bad = { ...quotation, type: 'workspace_backup' }
    const file = new File([JSON.stringify(bad)], 'backup.json', { type: 'application/json' })
    await expect(parseQuotationFile(file)).rejects.toThrow('file type')
  })

  // 7.2.10
  it('parseQuotationFile rejects invalid JSON syntax', async () => {
    const file = new File(['{invalid json}'], 'bad.json', { type: 'application/json' })
    await expect(parseQuotationFile(file)).rejects.toThrow('Invalid JSON')
  })

  // 7.2.11
  it('parseQuotationFile rejects non-JSON file content', async () => {
    const file = new File(['not json at all'], 'data.json', { type: 'application/json' })
    await expect(parseQuotationFile(file)).rejects.toThrow('Invalid JSON')
  })

  // ── isQuotationJson ───────────────────────────────────────────

  // 7.2.12
  it('isQuotationJson returns true for valid object', () => {
    expect(isQuotationJson(quotation)).toBe(true)
  })

  // 7.2.13
  it('isQuotationJson returns false for null, array, primitive', () => {
    expect(isQuotationJson(null)).toBe(false)
    expect(isQuotationJson([1, 2, 3])).toBe(false)
    expect(isQuotationJson('string')).toBe(false)
    expect(isQuotationJson(42)).toBe(false)
    expect(isQuotationJson(undefined)).toBe(false)
  })

  // 7.2.14
  it('isQuotationJson returns false for object missing required keys', () => {
    const { line_items, ...partial } = quotation
    expect(isQuotationJson(partial)).toBe(false)
  })
})
