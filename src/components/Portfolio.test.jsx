import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme as render } from '../test/render'
import { Portfolio } from './Portfolio'
import { DOMAIN_GLYPHS } from './portfolio/domainGlyphs'
import { PROJECT_GLYPHS } from './portfolio/projectGlyphs'
import { site } from '../content/site'
import { strips } from '../content/strips'
import { slug } from '../lib/slug'

const TOTAL = site.portfolio.groups.reduce((n, g) => n + g.items.length, 0)
const ALL_ITEMS = site.portfolio.groups.flatMap((g) => g.items)
const ON_HOLD = 'Payroll Implementation — 1,600 Employees'

describe('Portfolio', () => {
  it('renders the section heading and intro', () => {
    render(<Portfolio />)
    expect(screen.getByRole('heading', { name: 'Projects Delivered.' })).toBeInTheDocument()
    expect(screen.getByText(site.portfolio.intro)).toBeInTheDocument()
  })

  it('collapses to a table of contents: every group row with its count, no entries', () => {
    render(<Portfolio />)
    site.portfolio.groups.forEach(({ group, items }) => {
      const row = screen.getByRole('button', { name: new RegExp(`${group} ${items.length} projects`, 'i') })
      expect(row).toHaveAttribute('aria-expanded', 'false')
    })
    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0)
  })

  it('expands a group to its entries and collapses it again', async () => {
    const user = userEvent.setup()
    render(<Portfolio />)
    const { group, items } = site.portfolio.groups[0]
    const row = screen.getByRole('button', { name: new RegExp(group, 'i') })

    await user.click(row)
    expect(row).toHaveAttribute('aria-expanded', 'true')
    items.forEach(({ title, desc }) => {
      expect(screen.getByRole('heading', { name: title, level: 3 })).toBeInTheDocument()
      expect(screen.getByText(desc)).toBeInTheDocument()
    })
    // Only this group opened.
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(items.length)

    await user.click(row)
    expect(row).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0)
  })

  it('anchors every entry with a slug id for direct linking once all groups are open', async () => {
    const user = userEvent.setup()
    const { container } = render(<Portfolio />)
    for (const { group } of site.portfolio.groups) {
      await user.click(screen.getByRole('button', { name: new RegExp(group, 'i') }))
    }
    expect(container.querySelector('#payroll-implementation-1-600-employees')).not.toBeNull()
    expect(container.querySelectorAll('article[id]').length).toBe(TOTAL)
    // Exactly one role chip per entry.
    expect(screen.getAllByText(/^(Led|Coordinated|Oversight)$/)).toHaveLength(TOTAL)
  })

  it('gives every project except the on-hold payroll a complete PM → System → Outcome strip', () => {
    ALL_ITEMS.forEach(({ title }) => {
      const strip = strips[slug(title)]
      if (title === ON_HOLD) {
        expect(strip).toBeUndefined()
      } else {
        expect(strip, title).toBeTruthy()
        expect(strip.problem).toBeTruthy()
        expect(strip.actions.length).toBeGreaterThanOrEqual(2)
        expect(strip.system).toBeTruthy()
        expect(strip.outcome).toBeTruthy()
      }
    })
    // No orphan strips for entries that no longer exist.
    const titles = new Set(ALL_ITEMS.map(({ title }) => slug(title)))
    Object.keys(strips).forEach((key) => expect(titles.has(key), key).toBe(true))
  })

  it('opens a compact strip modal from an entry, steps with wrap-around, closes on Escape', async () => {
    const user = userEvent.setup()
    render(<Portfolio />)
    const first = site.portfolio.groups[0]
    await user.click(screen.getByRole('button', { name: new RegExp(first.group, 'i') }))

    // The on-hold payroll entry offers no modal trigger.
    const payrollHeading = screen.getByRole('heading', { name: ON_HOLD, level: 3 })
    expect(payrollHeading.querySelector('button')).toBeNull()

    // Open the first strip-enabled entry.
    const opener = screen.getByRole('button', { name: first.items[0].title })
    await user.click(opener)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent('Problem')
    expect(dialog).toHaveTextContent('PM Action')
    expect(dialog).toHaveTextContent('System')
    expect(dialog).toHaveTextContent('Outcome')
    expect(dialog).toHaveTextContent(strips[slug(first.items[0].title)].problem)

    // Prev from the first entry wraps to the last strip-enabled project.
    await user.click(screen.getByRole('button', { name: /previous project/i }))
    const last = ALL_ITEMS.filter(({ title }) => strips[slug(title)]).at(-1)
    expect(screen.getByRole('dialog')).toHaveTextContent(last.title)

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('opens the containing group when the page loads with a deep link to an entry', () => {
    window.location.hash = '#payroll-implementation-1-600-employees'
    const { container } = render(<Portfolio />)
    expect(container.querySelector('#payroll-implementation-1-600-employees')).not.toBeNull()
    // Only the containing group opened.
    const openRows = screen
      .getAllByRole('button')
      .filter((b) => b.getAttribute('aria-expanded') === 'true')
    expect(openRows).toHaveLength(1)
    window.location.hash = ''
  })
})

describe('domain and project marks', () => {
  it('covers every portfolio category with a mark — adding a group without one fails here', () => {
    const groups = site.portfolio.groups.map((g) => g.group)
    groups.forEach((g) => expect(Object.keys(DOMAIN_GLYPHS), g).toContain(g))
    // And no orphaned marks for categories that no longer exist.
    Object.keys(DOMAIN_GLYPHS).forEach((k) => expect(groups).toContain(k))
  })

  it('gives every project its own mark, and every mark a project', () => {
    const titles = site.portfolio.groups.flatMap((g) => g.items.map((i) => i.title))
    titles.forEach((t) => expect(Object.keys(PROJECT_GLYPHS), t).toContain(t))
    Object.keys(PROJECT_GLYPHS).forEach((k) => expect(titles, `orphaned mark: ${k}`).toContain(k))
  })

  it('draws every project mark with unique geometry — no copy-paste marks', () => {
    const { renderToStaticMarkup } = require('react-dom/server')
    const drawings = Object.entries(PROJECT_GLYPHS).map(([title, G]) => [
      title,
      renderToStaticMarkup(<G />),
    ])
    const seen = new Map()
    drawings.forEach(([title, svg]) => {
      expect(seen.get(svg), `${title} duplicates ${seen.get(svg)}`).toBeUndefined()
      seen.set(svg, title)
    })
  })

  it('gives every expanded entry its category mark, hidden from assistive tech', async () => {
    const user = userEvent.setup()
    render(<Portfolio />)
    await user.click(screen.getByRole('button', { name: /ERP & HR Platforms/i }))
    const panel = document.getElementById('portfolio-group-erp-hr-platforms')
    const articles = panel.querySelectorAll('article')
    expect(articles.length).toBeGreaterThan(0)
    articles.forEach((a) => {
      const mark = a.querySelector('[data-domain-mark] svg')
      expect(mark).not.toBeNull()
      expect(mark.getAttribute('aria-hidden')).toBe('true')
      expect(mark.getAttribute('fill')).toBe('none')
    })
  })
})
