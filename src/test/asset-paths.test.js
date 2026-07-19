import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { resolve, join } from 'node:path'

// Vite rewrites asset paths in HTML and CSS but NOT in JS strings. A component
// writing `<img src="/logo.svg">` resolves against the site root at runtime, but
// this project deploys under the permanently non-root /3dport/ base, so a
// root-absolute literal 404s in production while every test using jsdom (which
// has no network) stays green. Public assets must instead be built with
// `${import.meta.env.BASE_URL}file` (see src/components/About.jsx's `asset()`
// helper), which resolves correctly under any base.
const srcDir = resolve(__dirname, '../../src')

// Root-absolute src/srcSet/srcset attribute literals, e.g. src="/foo.svg".
// (Not "/3dport/foo.svg" style already-based paths — those aren't bare.)
const BARE_ASSET_PATH = /\b(?:src|srcSet|srcset)=["']\/(?!\/)/

function collectSourceFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      collectSourceFiles(fullPath, acc)
    } else if (/\.jsx?$/.test(entry)) {
      // Exclude test files: they legitimately assert against already-based
      // literals like '/3dport/head.avif' inside expect() calls.
      if (!/\.test\.jsx?$/.test(entry)) acc.push(fullPath)
    }
  }
  return acc
}

describe('public asset paths', () => {
  it('never references a bare root-absolute asset path in JS/JSX', () => {
    const offenders = []

    for (const file of collectSourceFiles(srcDir)) {
      const contents = readFileSync(file, 'utf-8')
      if (BARE_ASSET_PATH.test(contents)) {
        offenders.push(file.replace(srcDir + '/', 'src/'))
      }
    }

    expect(
      offenders,
      offenders.length
        ? `Found root-absolute asset path(s) in: ${offenders.join(', ')}. ` +
          `Vite does not rewrite asset paths inside JS strings, so these will 404 ` +
          `under the /3dport/ deploy base. Route through ` +
          '`${import.meta.env.BASE_URL}file` instead (see the `asset()` helper in src/components/About.jsx).'
        : ''
    ).toEqual([])
  })
})
