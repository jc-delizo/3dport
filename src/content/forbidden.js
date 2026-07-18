import { createHash } from 'node:crypto'

/**
 * Confidentiality guard.
 *
 * This repository is public, so the forbidden terms are stored as truncated SHA-256
 * digests rather than plain text. Writing the literal names here — which an earlier
 * version of this file did — published exactly the strings the guard exists to keep
 * unpublished.
 *
 * To check a term without revealing it: hash every 1-, 2- and 3-word n-gram of the
 * text and look for a digest collision.
 */
const FORBIDDEN_DIGESTS = new Set([
  'ab8a1c796dbbdf68',
  '3474a1c3f9434bd7',
  '03dcd901054ac5a3',
  '12567f0af6c4217e',
  'e5ba1146416c9c3b',
  '64d8834cd10c0e02',
  '8312c5d48baec3e2',
  '5a1902cba351505d',
  '9840aae9510c78d7',
  '46576a7a823b6729',
  'fdb4598981c7173a',
])

const digest = (value) =>
  createHash('sha256').update(value.toLowerCase()).digest('hex').slice(0, 16)

/**
 * Returns the digests of any forbidden terms found in `text`.
 * Digests, not the terms themselves, so a failing test never prints a secret.
 */
export function findForbidden(text) {
  const words = text.split(/[^A-Za-z&]+/).filter(Boolean)
  const hits = new Set()

  for (let size = 1; size <= 3; size += 1) {
    for (let i = 0; i + size <= words.length; i += 1) {
      const d = digest(words.slice(i, i + size).join(' '))
      if (FORBIDDEN_DIGESTS.has(d)) hits.add(d)
    }
  }
  return [...hits]
}

export const FORBIDDEN_COUNT = FORBIDDEN_DIGESTS.size
