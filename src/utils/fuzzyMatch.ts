// Fuzzy string matching for catalog search and sync
// Returns similarity score 0–1 per M2 milestone spec
// Also exports fuzzySearch (ranked results) and fuzzyFind (exact threshold match)

import type { CatalogEntry } from '../types/quotation'

export function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '')
}

/**
 * Compute word-set Jaccard similarity between query and target.
 * Returns a score 0–1 where 1 = exact match.
 * Threshold for catalog sync UPDATE classification: ≥0.85
 * Threshold for autocomplete results: >0.3
 */
export function fuzzyMatch(query: string, target: string): number {
  const nq = normalize(query)
  const nt = normalize(target)

  if (!nq) return 0
  if (nq === nt) return 1

  // Direct substring is a strong signal
  if (nt.includes(nq)) return 0.9
  if (nq.includes(nt)) return 0.85

  // Word-set Jaccard similarity
  const queryWords = new Set(nq.split(/\s+/).filter(Boolean))
  const targetWords = new Set(nt.split(/\s+/).filter(Boolean))

  if (queryWords.size === 0) return 0

  let intersection = 0
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const word of queryWords) {
    if (targetWords.has(word)) intersection++
  }

  const union = new Set([...queryWords, ...targetWords])
  const jaccard = union.size > 0 ? intersection / union.size : 0

  // Boost by character-level overlap for partial word matches
  const queryChars = nq.replace(/\s/g, '')
  const targetChars = nt.replace(/\s/g, '')
  let charMatches = 0
  let qi = 0
  for (let ti = 0; ti < targetChars.length && qi < queryChars.length; ti++) {
    if (targetChars[ti] === queryChars[qi]) {
      charMatches++
      qi++
    }
  }
  const charRatio = queryChars.length > 0 ? charMatches / queryChars.length : 0

  // Weighted blend: Jaccard (60%) + character sequence (40%)
  return Math.min(1, Math.round((jaccard * 0.6 + charRatio * 0.4) * 100) / 100)
}

/**
 * Search catalog entries ranked by fuzzy match score.
 * Returns entries with score > 0.3, sorted descending.
 */
export function fuzzySearch(query: string, catalog: CatalogEntry[]): CatalogEntry[] {
  if (!query || !query.trim()) return []
  return catalog
    .map((entry) => ({ entry, score: fuzzyMatch(query, entry.name) }))
    .filter((r) => r.score > 0.3)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.entry)
}

/**
 * Find the best catalog match for a name (strict threshold for sync).
 * Returns the entry only if fuzzyMatch ≥ 0.85, or null.
 */
export function fuzzyFind(name: string, catalog: CatalogEntry[]): CatalogEntry | null {
  if (!name || !name.trim()) return null
  let best: CatalogEntry | null = null
  let bestScore = 0
  for (const entry of catalog) {
    const score = fuzzyMatch(name, entry.name)
    if (score > bestScore) {
      bestScore = score
      best = entry
    }
  }
  return bestScore >= 0.85 ? best : null
}

/**
 * Determine if a line item description looks like a one-off entry
 * (e.g. "Rush Fee", single word, round number price).
 * Used by catalog sync to auto-uncheck one-off items.
 */
export function looksLikeOneOff(description: string, price: number): boolean {
  if (!description || !description.trim()) return true
  const words = description.trim().split(/\s+/)
  // Single-word descriptions with round prices are likely one-offs
  if (words.length <= 2 && price % 1 === 0 && price % 100000 === 0) return true
  // Known generic service terms
  const genericTerms = ['fee', 'service', 'consulting', 'consultation']
  const lower = description.toLowerCase()
  if (genericTerms.some((t) => lower.includes(t)) && words.length <= 3) return true
  return false
}
