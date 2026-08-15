import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme as render } from '../test/render'
import App from '../App'
import { Nav } from '../components/Nav'

describe('Cupertino experience', () => {
  beforeEach(() => {
    localStorage.setItem('3dport-theme', 'cupertino')
    delete document.documentElement.dataset.theme
  })

  it('replaces the default nav with a single black global bar holding the résumé CTA', () => {
    render(<Nav />)
    const bar = screen.getByTestId('global-nav')
    expect(bar).toBeInTheDocument()
    // One strip only — no frosted sub-bar with a duplicate role line.
    expect(screen.queryByText('Digital Transformation Project Manager')).toBeNull()
    const resume = screen.getByRole('link', { name: /résumé/i })
    expect(resume).toHaveAttribute('download', 'JC Delizo - Resume.pdf')
    expect(bar.contains(resume)).toBe(true)
  })

  it('keeps the grouped dropdowns working inside the global bar', () => {
    render(<Nav />)
    expect(screen.getByRole('button', { name: 'Projects' })).toHaveAttribute(
      'aria-haspopup',
      'true'
    )
    expect(screen.getByRole('button', { name: 'Experience' })).toBeInTheDocument()
  })

  it('lays the page out as full-bleed tiles with the approved surface pulse', () => {
    render(<App />)
    const surfaceOf = (id) => document.getElementById(id).closest('section').dataset.surface
    expect(surfaceOf('initiatives')).toBe('light')
    expect(surfaceOf('case-studies')).toBe('dark')
    expect(surfaceOf('principles')).toBe('parchment')
    expect(surfaceOf('contact')).toBe('dark')
    // Tiles divide by surface change, not by borders.
    const hero = document.getElementById('top')
    expect(hero.className).not.toMatch(/border-b/)
    expect(hero.dataset.surface).toBeTruthy()
  })
})

describe('Daylight keeps the bordered rhythm', () => {
  beforeEach(() => {
    // Explicit: Studio is the site default now, so Daylight must be chosen.
    localStorage.setItem('3dport-theme', 'daylight')
    delete document.documentElement.dataset.theme
  })

  it('renders bordered sections and the standard nav', () => {
    render(<App />)
    expect(screen.queryByTestId('global-nav')).toBeNull()
    const initiatives = document.getElementById('initiatives').closest('section')
    expect(initiatives.className).toMatch(/border-b/)
    expect(initiatives.dataset.surface).toBeUndefined()
  })
})
