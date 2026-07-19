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
//
// Must catch both the plain-literal form (src="/foo.svg") AND the JSX
// expression-container form (src={'/foo.svg'}, src={`/foo.svg`},
// src={cond ? '/a.svg' : '/b.svg'}) — the latter is the idiom this codebase
// already uses (see the `asset()` helper in src/components/About.jsx), so a
// contributor writing a bare path inside `{...}` must be flagged too.
//
//   (?<![\w-])            - not preceded by a word char or hyphen, so
//                            `data-src=` / `xlinkSrc=` etc. don't match
//                            "src" as a substring.
//   (?:src|srcSet|srcset) - the attribute name itself.
//   \s*=\s*               - the `=`, allowing incidental whitespace.
//   \{?                   - an optional opening `{` for the expression
//                            container form; absent for plain literals.
//   [^}>]*?               - anything up to the quote, EXCEPT `}` or `>` —
//                            this is what lets ternaries/expressions like
//                            `cond ? '/a.svg' : '/b.svg'` be scanned through,
//                            while still refusing to cross out of the
//                            attribute (and therefore out of the JSX tag)
//                            into unrelated markup, which would otherwise
//                            produce false positives.
//   ["'`]\/(?!\/)          - a quote character immediately followed by a
//                            root-absolute (not protocol-relative `//`) path.
const BARE_ASSET_PATH = /(?<![\w-])(?:src|srcSet|srcset)\s*=\s*\{?[^}>]*?["'`]\/(?!\/)/

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

describe('BARE_ASSET_PATH pattern', () => {
  // The regex above is load-bearing: it's the only thing standing between a
  // contributor writing a bare root-absolute path and a 404 in production.
  // A prior version of this pattern required the `=` to be immediately
  // followed by a quote, which silently missed every JSX
  // expression-container form. Assert each case from the audit matrix
  // directly against the pattern so a future "simplification" that
  // reintroduces the under-flagging gets caught here, not in production.
  const cases = [
    ['src="/logo.svg"', true],
    ["src={\"/logo.svg\"}", true],
    ["src={'/logo.svg'}", true],
    ['srcSet={`/logo.svg`}', true],
    ["src={cond ? '/a.svg' : '/b.svg'}", true],
    ["src={asset('head.jpg')}", false],
    ['data-src="/logo.svg"', false],
  ]

  it.each(cases)('%s -> shouldFlag=%s', (literal, shouldFlag) => {
    expect(BARE_ASSET_PATH.test(literal)).toBe(shouldFlag)
  })
})

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
