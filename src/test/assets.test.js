import { describe, it, expect } from 'vitest'
import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

// The portrait ships as two derived files. If either goes missing, About renders a
// broken image; if either bloats, the page's size budget goes with it.
// Regenerate with `npm run headshot`.
const publicDir = resolve(__dirname, '../../public')

const AVIF_MAX = 40 * 1024
const JPEG_MAX = 60 * 1024

describe('portrait assets', () => {
  it('ships both the AVIF and its JPEG fallback', () => {
    expect(existsSync(resolve(publicDir, 'head.avif'))).toBe(true)
    expect(existsSync(resolve(publicDir, 'head.jpg'))).toBe(true)
  })

  it('keeps both inside the size budget', () => {
    expect(statSync(resolve(publicDir, 'head.avif')).size).toBeLessThanOrEqual(AVIF_MAX)
    expect(statSync(resolve(publicDir, 'head.jpg')).size).toBeLessThanOrEqual(JPEG_MAX)
  })
})
