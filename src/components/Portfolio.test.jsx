import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme as render } from '../test/render'
import { Portfolio } from './Portfolio'
import { site } from '../content/site'

const TOTAL = site.portfolio.groups.reduce((n, g) => n + g.items.length, 0)

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
