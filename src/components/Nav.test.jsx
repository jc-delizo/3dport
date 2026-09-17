import { describe, it, expect, vi } from 'vitest'
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

  it('keeps the wide variant flat — links only, switched from the compact variant by CSS at 1680px', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: 'Case Studies' })).toHaveAttribute('href', '#case-studies')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact')
    // The config itself stays flat; the compact Portfolio dropdown is
    // constructed in Nav, not in site.nav.
    expect(site.nav.some((n) => n.items)).toBe(false)
    const wide = screen.getByRole('link', { name: 'Case Studies' }).closest('div')
    expect(wide.className).toMatch(/min-\[1680px\]:flex/)
    expect(wide.className).toMatch(/\bhidden\b/)
    expect(wide.querySelector('[aria-haspopup="true"]')).toBeNull()
  })

  it('gives 13-inch-class widths one Portfolio dropdown holding every section', async () => {
    const user = userEvent.setup()
    render(<Nav />)
    const trigger = screen.getByRole('button', { name: 'Portfolio' })
    // Hidden from 1520px up — wherever the trail exists, no Portfolio button.
    // (closest('div') would stop at the Dropdown's own positioning wrapper.)
    let wrapper = trigger.parentElement
    while (wrapper && !wrapper.className.includes('min-[1520px]:hidden')) wrapper = wrapper.parentElement
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

  it('keeps section links same-document in the Lab view, and shows the way home', () => {
    const onBackHome = vi.fn()
    render(<Nav currentPage="lab" onBackHome={onBackHome} />)
    // Same-document hashes even in the Lab: the App's interceptor switches
    // the view when a target section is not mounted.
    site.nav
      .filter((n) => n.id)
      .forEach(({ id, label }) => {
        expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', `#${id}`)
      })
    const labs = screen.getAllByRole('link', { name: 'Lab' })
    labs.forEach((a) => expect(a).toHaveAttribute('aria-current', 'page'))
    // The back chip renders in every visible header variant.
    const chips = screen.getAllByRole('button', { name: /portfolio/i })
    expect(chips.length).toBeGreaterThan(0)
    chips[0].click()
    expect(onBackHome).toHaveBeenCalled()
  })

  it('opens the Lab view instead of navigating when the Lab link is plain-clicked', () => {
    const onOpenLab = vi.fn()
    render(<Nav onOpenLab={onOpenLab} />)
    const lab = screen.getAllByRole('link', { name: 'Lab' })[0]
    lab.click()
    expect(onOpenLab).toHaveBeenCalledTimes(1)
  })

  it('keeps a Lab-only band between trail arrival and the flat links (1520-1679px)', () => {
    render(<Nav />)
    const bands = [...document.querySelectorAll('div')].filter(
      (d) =>
        typeof d.className === 'string' &&
        d.className.includes('min-[1520px]:flex') &&
        d.className.includes('min-[1680px]:hidden')
    )
    // One per desktop nav render (the default header in this test).
    expect(bands).toHaveLength(1)
    // Only Lab: the compact trail carries section navigation in this band.
    const links = [...bands[0].querySelectorAll('a')]
    expect(links).toHaveLength(1)
    expect(links[0].textContent).toContain('Lab')
    expect(bands[0].querySelector('[aria-haspopup="true"]')).toBeNull()
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

describe('scroll progress bar', () => {
  it('never sizes itself with viewport units — 100vw includes the scrollbar on Windows', () => {
    render(<Nav />)
    const bar = document.querySelector('.nav-progress')
    expect(bar).not.toBeNull()
    expect(bar.className).not.toMatch(/w-screen|100vw/)
    expect(bar.className).toMatch(/inset-x-0/)
  })
})
