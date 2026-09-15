import { describe, it, expect } from 'vitest'
import { screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme as render } from '../test/render'
import { Nav } from './Nav'
import { site } from '../content/site'
import { SECTIONS } from './SectionNavigator'

const directLinks = site.nav.filter((n) => n.id)
const pageLinks = site.nav.filter((n) => n.href)

describe('Nav structure', () => {
  it('uses the name and role as the navbar identity lockup', () => {
    render(<Nav />)
    const brand = screen.getByRole('link', { name: /JC Delizo Technical Project Manager/i })
    expect(brand).toHaveAttribute('href', '#top')
  })

  it('keeps the wide variant flat — links only, switched from the compact variant by CSS at 1440px', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: 'Case Studies' })).toHaveAttribute('href', '#case-studies')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact')
    // The config itself stays flat; the compact Portfolio dropdown is
    // constructed in Nav, not in site.nav.
    expect(site.nav.some((n) => n.items)).toBe(false)
    const wide = screen.getByRole('link', { name: 'Case Studies' }).closest('div')
    expect(wide.className).toMatch(/min-\[1440px\]:flex/)
    expect(wide.className).toMatch(/\bhidden\b/)
    expect(wide.querySelector('[aria-haspopup="true"]')).toBeNull()
  })

  it('gives 13-inch-class widths one Portfolio dropdown holding every section', async () => {
    const user = userEvent.setup()
    render(<Nav />)
    const trigger = screen.getByRole('button', { name: 'Portfolio' })
    // Hidden from 1440px up, where the flat links and the trail take over.
    // (closest('div') would stop at the Dropdown's own positioning wrapper.)
    let wrapper = trigger.parentElement
    while (wrapper && !wrapper.className.includes('min-[1440px]:hidden')) wrapper = wrapper.parentElement
    expect(wrapper, 'trigger must sit inside the compact-only wrapper').not.toBeNull()
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    // Scoped to the compact wrapper: the same labels also exist as flat links
    // in the wide variant alongside it.
    SECTIONS.filter(({ id }) => id !== 'top' && id !== 'lab').forEach(({ id, label }) => {
      expect(within(wrapper).getByRole('link', { name: label })).toHaveAttribute('href', `#${id}`)
    })
    await user.keyboard('{Escape}')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
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
    // Lab renders in both width variants; each must mark the current page.
    const labs = screen.getAllByRole('link', { name: 'Lab' })
    expect(labs.length).toBeGreaterThan(0)
    labs.forEach((a) => expect(a).toHaveAttribute('aria-current', 'page'))
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
