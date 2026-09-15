import { describe, it, expect } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme as render } from '../test/render'
import { Nav } from './Nav'
import { site } from '../content/site'

const directLinks = site.nav.filter((n) => n.id)
const pageLinks = site.nav.filter((n) => n.href)

describe('Nav structure', () => {
  it('uses the name and role as the navbar identity lockup', () => {
    render(<Nav />)
    const brand = screen.getByRole('link', { name: /JC Delizo Technical Project Manager/i })
    expect(brand).toHaveAttribute('href', '#top')
  })

  it('renders the flat primary links as anchors — no dropdowns anywhere', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: 'Case Studies' })).toHaveAttribute('href', '#case-studies')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact')
    expect(screen.getByRole('link', { name: 'Lab' })).toBeInTheDocument()
    // The 2026-09-15 flattening: the config carries no groups, so nothing in
    // the navigation may render a dropdown trigger. (The theme menu lives in
    // the utility cluster and is exempt — it is a menu, not navigation.)
    expect(site.nav.some((n) => n.items)).toBe(false)
    const nav = screen.getAllByRole('navigation')[0]
    const triggers = [...nav.querySelectorAll('[aria-haspopup="true"]')].filter(
      (el) => !/theme/i.test(el.getAttribute('aria-label') ?? el.textContent)
    )
    expect(triggers).toHaveLength(0)
  })

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

  it('routes section links back to the portfolio when rendered on the Lab page', async () => {
    const user = userEvent.setup()
    render(<Nav currentPage="lab" />)
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'href',
      `${import.meta.env.BASE_URL}#contact`,
    )
    site.nav
      .filter((n) => n.id)
      .forEach(({ id, label }) => {
        expect(screen.getByRole('link', { name: label })).toHaveAttribute(
          'href',
          `${import.meta.env.BASE_URL}#${id}`,
        )
      })
    expect(screen.getByRole('link', { name: 'Lab' })).toHaveAttribute('aria-current', 'page')
  })
})

describe('Nav mobile', () => {
  it('lists every flat link in the mobile panel', async () => {
    const user = userEvent.setup()
    render(<Nav />)
    await user.click(screen.getByRole('button', { name: /open menu/i }))
    site.nav
      .filter((n) => n.id)
      .forEach(({ id, label }) => {
        expect(screen.getAllByRole('link', { name: label }).length).toBeGreaterThan(0)
        expect(
          screen.getAllByRole('link', { name: label }).some((a) => a.getAttribute('href') === `#${id}`)
        ).toBe(true)
      })
    expect(screen.getByRole('radio', { name: 'Quiet' })).toBeInTheDocument()
  })
})
