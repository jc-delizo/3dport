import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme as render } from '../test/render'
import { Portfolio } from './Portfolio'
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
