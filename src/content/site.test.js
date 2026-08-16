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
    expect(site.proof[2].label).toMatch(/^Projects delivered/)
    expect(site.proof[2].label).toMatch(/3 years/i)
    expect(site.proof[3].value).toBe('15')
    expect(site.proof[3].label).toMatch(/live in production/i)
  })

  it('counts throughput in projects everywhere — never "systems per year"', () => {
    // The audit flagged the unit switch ("2 systems/year" vs "20–28 projects/year")
    // as the site's biggest credibility risk. Throughput claims use one unit:
    // projects. "Systems" remains only for the count running in production.
    expect(corpus).not.toMatch(/\bsystems?\s*(\/|a |per )\s*year/i)
    expect(corpus).not.toMatch(/65 systems/)
  })
})

describe('résumé', () => {
  // The résumé ships with the site (public/resume.pdf) instead of linking out to
  // Google Drive: same-origin, downloadable, and updated atomically with the page.
  it('links the résumé to the self-hosted PDF everywhere, marked for download', () => {
    expect(site.contact.resume).toMatch(/resume\.pdf$/)
    const heroResume = site.hero.secondaryCtas.find((c) => /résumé/i.test(c.label))
    expect(heroResume.href).toBe(site.contact.resume)
    expect(heroResume.download).toBe('JC Delizo - Resume.pdf')
    // Every résumé button saves under the same human-readable name.
    expect(site.contact.resumeFilename).toBe('JC Delizo - Resume.pdf')
  })

  it('ships the PDF in public/', () => {
    const { existsSync } = require('node:fs')
    const { resolve } = require('node:path')
    expect(existsSync(resolve(__dirname, '../../public/resume.pdf'))).toBe(true)
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
  it('has exactly four initiatives — the approval platform lives in Case Studies only', () => {
    expect(site.initiatives).toHaveLength(4)
    expect(site.initiatives.map((i) => i.id)).not.toContain('approval-platform')
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

describe('tools data', () => {
  const groups = Object.fromEntries(site.tools.map((g) => [g.group, g.items]))

  it('places the Microsoft platforms: 365 + SharePoint in Enterprise, Power Automate with CRM', () => {
    expect(groups['Enterprise Systems']).toEqual(
      expect.arrayContaining(['Odoo ERP', 'Google Workspace', 'Microsoft 365', 'SharePoint'])
    )
    expect(groups['CRM & Automation']).toEqual(['HubSpot', 'GoHighLevel', 'Power Automate'])
  })

  it('covers the design and AI additions', () => {
    expect(groups['Design']).toEqual(
      expect.arrayContaining(['Figma', 'Canva', 'Adobe Creative Cloud', 'CapCut'])
    )
    expect(groups['AI']).toEqual(
      expect.arrayContaining(['ElevenLabs', 'Higgsfield', 'Gamma', 'Grok', 'OpenCode'])
    )
  })

  it('merges development, infra and analytics into one Engineering & Cloud group', () => {
    expect(groups['Development']).toBeUndefined()
    expect(groups['Infrastructure & Analytics']).toBeUndefined()
    expect(groups['Engineering & Cloud']).toEqual([
      'Git',
      'GitHub',
      'Vercel',
      'React',
      'Vite',
      'Node.js',
      'Laravel',
      'MongoDB',
      'MySQL',
      'Snowflake',
      'AWS',
      'DigitalOcean',
      'Contabo',
      'PostHog',
    ])
  })
})

describe('approach data', () => {
  it('carries the PM × Engineer slider content with complete flows', () => {
    expect(site.approach.pm.flow).toHaveLength(6)
    expect(site.approach.eng.flow).toHaveLength(6)
    expect(site.approach.bridge.flow).toHaveLength(7)
    expect(site.approach.pm.points.length).toBeGreaterThanOrEqual(5)
    expect(site.approach.eng.points.length).toBeGreaterThanOrEqual(5)
    expect(site.approach.arc).toEqual([
      'Engineering',
      'Software Development',
      'Project Management',
      'Digital Transformation',
    ])
  })
})

describe('capabilities data', () => {
  it('carries the twelve capabilities, all backed by the resume skills line', () => {
    expect(site.capabilities.map((c) => c.label)).toEqual([
      'Agile Transformation',
      'Technical Delivery Leadership',
      'AI Workflow Design',
      'Process Optimization',
      'Enterprise Systems (ERP / HRIS)',
      'Cross-Functional Leadership',
      'Portfolio & Program Governance',
      'Vendor Management',
      'Stakeholder Management',
      'Executive Reporting',
      'Change Management',
      'Risk & Dependency Management',
    ])
    site.capabilities.forEach((c) => expect(c.icon).toBeTruthy())
  })
})

describe('favicon', () => {
  const fs = require('node:fs')
  const path = require('node:path')
  const html = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf-8')

  it('paints its own background — the old logo was white-on-transparent, invisible in the tab', () => {
    const svg = fs.readFileSync(path.resolve(__dirname, '../../public/favicon.svg'), 'utf-8')
    expect(svg).toMatch(/<rect[^>]*fill="#0D0D0D"/)
    expect(html).toMatch(/rel="icon"[^>]*href="\/3dport\/favicon\.svg"/)
  })

  it('ships PNG fallbacks for browsers without SVG favicon support', () => {
    expect(fs.existsSync(path.resolve(__dirname, '../../public/favicon.png'))).toBe(true)
    expect(fs.existsSync(path.resolve(__dirname, '../../public/apple-touch-icon.png'))).toBe(true)
    expect(html).toMatch(/rel="icon" type="image\/png"/)
    expect(html).toMatch(/rel="apple-touch-icon"/)
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

  it('leads with the six strongest credentials, which are all the collapsed view shows', () => {
    // Governance/delivery (2), AI fluency (2), the national engineering ranking,
    // and the technical foundation — the mix the audit recommended surfacing.
    expect(site.certifications.slice(0, 6).map((c) => c.name)).toEqual([
      'Project Governance & PMO',
      'Delivering Successful IT Systems',
      'AI Fluency: Framework & Foundations',
      'AI Fluency for Builders',
      'Certified Instrumentation and Control Engineer',
      'Full Stack Web Development',
    ])
  })

  it('closes the expanded list with the PICS technician ranking', () => {
    const technician = site.certifications[site.certifications.length - 1]
    expect(technician.name).toBe('Certified Instrumentation and Control Technician')
    expect(technician.note).toMatch(/^Ranked/)
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

  it('leads each group with its heaviest item', () => {
    // Skimmers read the first row of each group; the flagship entry goes first.
    expect(groups.map((g) => g.items[0].title)).toEqual([
      'Enterprise ERP Transformation Program',
      'Multi-Company Recruitment Platform',
      'Loan Origination System',
      'Unified Collection Tool',
      'Field Itinerary Management — Uniformed Personnel',
      'Request-for-Payment Automation',
      'AI Delivery Platform',
      'Executive Scoreboard Dashboard',
      'Greenlight Document Workflow Platform',
    ])
  })

  it('groups the nav: Projects ▾ · Experience ▾ · Contact, mirroring page order', () => {
    expect(site.nav.map((n) => n.label)).toEqual(['Projects', 'Experience', 'Contact'])
    const [projects, experience, contact] = site.nav
    expect(projects.items.map((i) => i.id)).toEqual([
      'approach',
      'initiatives',
      'case-studies',
      'portfolio',
      'principles',
    ])
    expect(projects.items.find((i) => i.id === 'portfolio').label).toBe('Delivery Portfolio')
    expect(experience.items.map((i) => i.id)).toEqual([
      'experience',
      'capabilities',
      'tools',
      'certifications',
    ])
    expect(contact.id).toBe('contact')
  })
})

describe('case studies data', () => {
  it('tells the two approved stories: the approval platform and the AI delivery platform', () => {
    expect(site.caseStudies.map((c) => c.title)).toEqual([
      'Multi-Entity Approval Workflow Platform',
      'AI Delivery Platform',
    ])
  })

  it('gives every study a complete skeleton: stats, timeline, story, near-derailments', () => {
    site.caseStudies.forEach((c) => {
      expect(c.stats).toHaveLength(4)
      c.stats.forEach((s) => {
        expect(s.value).toBeTruthy()
        expect(s.label).toBeTruthy()
      })
      expect(c.timeline.length).toBeGreaterThanOrEqual(6)
      c.timeline.forEach((t) => {
        expect(t.date).toBeTruthy()
        expect(t.title).toBeTruthy()
        expect(t.detail).toMatch(/\.$/)
      })
      expect(c.story.length).toBeGreaterThanOrEqual(3)
      expect(c.moments.length).toBeGreaterThanOrEqual(4)
      c.moments.forEach((m) => {
        expect(m.title).toBeTruthy()
        expect(m.body).toMatch(/\.$/)
      })
      expect(c.summary).toBeTruthy()
      expect(c.sources).toMatch(/2026/)
    })
  })

  it('charts the AI platform commit history, matching the sourced 571 total', () => {
    const [approval, ai] = site.caseStudies
    expect(approval.chart).toBeUndefined()
    expect(ai.chart.points.map((p) => p.label)).toEqual([
      'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
    ])
    expect(ai.chart.points.reduce((n, p) => n + p.value, 0)).toBe(571)
  })

  it('keeps every metric traceable — no figures the briefs marked TBD', () => {
    const text = allStrings(site.caseStudies).join('\n')
    // Turnaround times and hours-saved were TBD in the source briefs; publishing
    // any such figure would be invented. Guard the phrasings that would carry one.
    expect(text).not.toMatch(/hours saved|turnaround time of|% faster/i)
  })
})
