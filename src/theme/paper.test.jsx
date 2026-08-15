import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme as render } from '../test/render'
import App from '../App'

describe('Paper experience', () => {
  beforeEach(() => {
    localStorage.setItem('3dport-theme', 'paper')
    delete document.documentElement.dataset.theme
  })

  it('keeps the standard nav — Paper is editorial, not a product page', () => {
    render(<App />)
    expect(screen.queryByTestId('global-nav')).toBeNull()
  })

  it('renders bands: no section borders, surfaces only where the map says', () => {
    render(<App />)
    const sectionOf = (id) => document.getElementById(id).closest('section')
    expect(sectionOf('initiatives').className).not.toMatch(/border-b/)
    expect(sectionOf('initiatives').dataset.surface).toBeUndefined()
    expect(sectionOf('case-studies').dataset.surface).toBe('dark')
    expect(sectionOf('contact').dataset.surface).toBe('coral')
    expect(document.querySelector('footer').dataset.surface).toBe('dark')
  })

  it('does not center section headings — bands read left-aligned', () => {
    render(<App />)
    const heading = document.getElementById('initiatives').closest('div')
    expect(heading.className).not.toMatch(/text-center/)
  })

  it('sets display type via the font-display class on the page headlines', () => {
    render(<App />)
    const h1 = document.querySelector('h1')
    expect(h1.className).toMatch(/font-display/)
    document.querySelectorAll('h2').forEach((h2) => {
      expect(h2.className).toMatch(/font-display/)
    })
  })
})
