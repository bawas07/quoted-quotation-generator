// Filename generation for exports
// Format: QUO-001_ClientName_2026-05-19.json
// Matches M1 milestone spec and docs/example-v2.html:1056

import { format } from 'date-fns'

export function generateFilename(
  quotationNumber: string,
  clientName: string = 'unknown',
  date?: Date,
): string {
  const dateStr = date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  const safeClient = clientName.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '')
  return `${quotationNumber}_${safeClient}_${dateStr}.json`
}
