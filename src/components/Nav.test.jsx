import { describe, it, expect } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme as render } from '../test/render'
import { Nav } from './Nav'
import { site } from '../content/site'

const groups = site.nav.filter((n) => n.items)
const directLinks = site.nav.filter((n) => n.id)

describe('Nav structure', () => {
  it('renders group dropdown triggers closed, and direct links as anchors', () => {
    render(<Nav />)
    groups.forEach(({ label }) => {
      const trigger = screen.getByRole('button', { name: label })
      expect(trigger).toHaveAttribute('aria-haspopup', 'true')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })
    directLinks.forEach(({ id, label }) => {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', `#${id}`)
    })
    // Group section links are hidden until the dropdown opens.
    expect(screen.queryByRole('link', { name: 'Initiatives' })).toBeNull()
  })

  it('opens a dropdown on click, links every grouped section, closes on selection', async () => {
    const user = userEvent.setup()
    render(<Nav />)
    const trigger = screen.getByRole('button', { name: 'Portfolio' })
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    groups[0].items.forEach(({ id, label }) => {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', `#${id}`)
    })
    await user.click(screen.getByRole('link', { name: 'Initiatives' }))
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes an open dropdown on Escape and returns focus to its trigger', async () => {
    const user = userEvent.setup()
    render(<Nav />)
    const trigger = screen.getByRole('button', { name: 'Experience' })
    await user.click(trigger)
    await user.keyboard('{Escape}')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
  })

  it('closes an open dropdown when clicking outside it', async () => {
    const user = userEvent.setup()
    render(<Nav />)
    const trigger = screen.getByRole('button', { name: 'Portfolio' })
    await user.click(trigger)
    fireEvent.mouseDown(document.body)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('only one dropdown is open at a time', async () => {
    const user = userEvent.setup()
    render(<Nav />)
    const projects = screen.getByRole('button', { name: 'Portfolio' })
    const experience = screen.getByRole('button', { name: 'Experience' })
    await user.click(projects)
    await user.click(experience)
    expect(projects).toHaveAttribute('aria-expanded', 'false')
    expect(experience).toHaveAttribute('aria-expanded', 'true')
  })
})

describe('Nav utilities', () => {
  it('exposes a résumé link that downloads the self-hosted PDF', () => {
    render(<Nav />)
    const link = screen.getByRole('link', { name: /résumé/i })
    expect(link).toHaveAttribute('href', site.contact.resume)
    expect(link).toHaveAttribute('download', 'JC Delizo - Resume.pdf')
  })

  it('switches theme from the theme menu', async () => {
    const user = userEvent.setup()
    render(<Nav />)
    await user.click(screen.getByRole('button', { name: /theme/i }))
    await user.click(screen.getByRole('menuitemradio', { name: 'Midnight' }))
    expect(document.documentElement.dataset.theme).toBe('midnight')
  })

  it('uses a navigation landmark', () => {
    render(<Nav />)
    expect(screen.getAllByRole('navigation').length).toBeGreaterThan(0)
  })
})

describe('Nav mobile', () => {
  it('lists every grouped link under its group heading in the mobile panel', async () => {
    const user = userEvent.setup()
    render(<Nav />)
    await user.click(screen.getByRole('button', { name: /open menu/i }))
    groups.forEach(({ label, items }) => {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0)
      items.forEach(({ id, label: itemLabel }) => {
        expect(screen.getByRole('link', { name: itemLabel })).toHaveAttribute('href', `#${id}`)
      })
    })
  })
})
