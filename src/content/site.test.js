import { describe, it, expect } from 'vitest'
import { site } from './site'
import { findForbidden, FORBIDDEN_COUNT } from './forbidden'

// Every string in the content tree, flattened.
function allStrings(value, acc = []) {
  if (typeof value === 'string') acc.push(value)
  else if (Array.isArray(value)) value.forEach((v) => allStrings(v, acc))
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => allStrings(v, acc))
  return acc
}

const corpus = allStrings(site).join('\n')

describe('confidentiality', () => {
  // Terms are compared as hashes (src/content/forbidden.js) because this repo is public.
  // Listing them literally here — as an earlier version did — published the very strings
  // the guard exists to protect.
  it('leaks none of the forbidden terms', () => {
    expect(findForbidden(corpus)).toEqual([])
  })

  it('guards the full list, not a subset', () => {
    expect(FORBIDDEN_COUNT).toBe(11)
  })

  it('still names the employer, which is permitted', () => {
    expect(corpus).toContain('Oak Drive Ventures')
  })
})

describe('factual rules', () => {
  it('never claims 26 initiatives', () => {
    expect(corpus).not.toMatch(/\b26\b/)
  })

  it('uses 65 delivered and 15 live in production as the closing proof stats', () => {
    expect(site.proof).toHaveLength(4)
    expect(site.proof[2].value).toBe('65')
    expect(site.proof[2].label).toMatch(/3 years/i)
    expect(site.proof[3].value).toBe('15')
    expect(site.proof[3].label).toMatch(/live in production/i)
  })
})

describe('link preview', () => {
  it('keeps the meta description within 155 characters', () => {
    expect(site.meta.description.length).toBeLessThanOrEqual(155)
  })

  it('uses an absolute og:image URL', () => {
    // Relative paths are the most common cause of blank preview cards.
    expect(site.meta.ogImage).toMatch(/^https:\/\//)
  })
})

describe('structure', () => {
  it('has exactly five initiatives, each with a category', () => {
    expect(site.initiatives).toHaveLength(5)
    site.initiatives.forEach((i) => {
      expect(i.category).toBeTruthy()
      expect(i.approach.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('has exactly four principles', () => {
    expect(site.principles).toHaveLength(4)
  })

  it('does not repeat the 10x figure in experience bullets', () => {
    // Spec §5.5: proven in hero, proof bar and initiative 1 already.
    const experienceText = allStrings(site.experience).join('\n')
    expect(experienceText).not.toMatch(/10×|10x/)
  })
})

describe('meta drift guard', () => {
  it('index.html meta tags match site.meta', () => {
    const fs = require('node:fs')
    const path = require('node:path')

    // Read index.html from project root
    const indexPath = path.resolve(__dirname, '../../index.html')
    const htmlContent = fs.readFileSync(indexPath, 'utf-8')

    // Helper to decode HTML entities
    function decodeHtmlEntities(str) {
      const entities = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
      }
      return str.replace(/&(?:amp|lt|gt|quot|#39);/g, (match) => entities[match] || match)
    }

    // Extract title
    const titleMatch = htmlContent.match(/<title>([^<]+)<\/title>/)
    const htmlTitle = titleMatch ? decodeHtmlEntities(titleMatch[1]) : null

    // Extract meta description (handles multiline attributes)
    const descMatch = htmlContent.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i)
    const htmlDescription = descMatch ? decodeHtmlEntities(descMatch[1]) : null

    // Extract og:image (handles multiline attributes)
    const ogImageMatch = htmlContent.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i)
    const htmlOgImage = ogImageMatch ? ogImageMatch[1] : null

    // Assert they match
    expect(htmlTitle).toBe(site.meta.title)
    expect(htmlDescription).toBe(site.meta.description)
    expect(htmlOgImage).toBe(site.meta.ogImage)
  })
})

describe('certifications data', () => {
  it('has 19 entries; 18 carry https credential URLs, Alison carries none', () => {
    expect(site.certifications.length).toBe(19)
    const withUrl = site.certifications.filter((c) => c.url)
    expect(withUrl.length).toBe(18)
    withUrl.forEach((c) => expect(c.url).toMatch(/^https:\/\//))
    const alison = site.certifications.find((c) => c.issuer === 'Alison')
    expect(alison.name).toBe('Agile Project Management')
    expect(alison.url).toBeUndefined()
  })

  it('sorts newest first, closing with the two 2018 PICS national-ranking certifications', () => {
    const years = site.certifications.map((c) => Number(c.date))
    years.forEach((y, i) => i > 0 && expect(y).toBeLessThanOrEqual(years[i - 1]))
    const [engineer, technician] = site.certifications.slice(-2)
    expect(engineer.name).toBe('Certified Instrumentation and Control Engineer')
    expect(technician.name).toBe('Certified Instrumentation and Control Technician')
    ;[engineer, technician].forEach((c) => expect(c.note).toMatch(/^Ranked/))
    expect(site.certifications.some((c) => c.featured)).toBe(false)
  })

  it('uses year-only dates in this section', () => {
    site.certifications.forEach((c) => expect(c.date).toMatch(/^\d{4}$/))
  })

  it('shows each Anthropic credential ID, matching its verification URL', () => {
    const anthropic = site.certifications.filter((c) => c.issuer === 'Anthropic')
    expect(anthropic.length).toBe(6)
    anthropic.forEach((c) => {
      expect(c.note).toBe(c.url.split('/').pop())
    })
  })
})

describe('portfolio data', () => {
  const groups = site.portfolio.groups
  const items = groups.flatMap((g) => g.items)

  it('has 9 groups totalling 57 entries, in the approved order', () => {
    expect(groups).toHaveLength(9)
    expect(items).toHaveLength(57)
    expect(groups.map((g) => g.items.length)).toEqual([9, 4, 7, 6, 7, 2, 7, 8, 7])
  })

  it('uses only the three role chips, in the approved split', () => {
    const count = (role) => items.filter((i) => i.role === role).length
    expect(count('Led')).toBe(35)
    expect(count('Coordinated')).toBe(8)
    expect(count('Oversight')).toBe(14)
    expect(items.every((i) => ['Led', 'Coordinated', 'Oversight'].includes(i.role))).toBe(true)
  })

  it('keeps every entry complete, with a one-line single-sentence description', () => {
    items.forEach(({ title, role, desc }) => {
      expect(title).toBeTruthy()
      expect(role).toBeTruthy()
      expect(desc).toMatch(/\.$/)
      expect(desc).not.toMatch(/\n/)
    })
  })

  it('has unique titles across all groups', () => {
    expect(new Set(items.map((i) => i.title)).size).toBe(items.length)
  })

  it('adds the Portfolio nav entry directly after Initiatives', () => {
    const ids = site.nav.map((n) => n.id)
    expect(site.nav).toHaveLength(7)
    expect(ids.indexOf('portfolio')).toBe(ids.indexOf('initiatives') + 1)
  })
})
