import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme as render } from '../test/render'
import App from '../App'

describe('Studio experience', () => {
  beforeEach(() => {
    localStorage.setItem('3dport-theme', 'studio')
    delete document.documentElement.dataset.theme
  })

  it('uses the standard nav with no extra chrome — no global bar, no marquee strip', () => {
    const { container } = render(<App />)
    expect(screen.queryByTestId('global-nav')).toBeNull()
    expect(container.querySelector('.marquee')).toBeNull()
  })

  it('wraps mapped sections in rounded pastel color-block panels', () => {
    render(<App />)
    const blockOf = (id) => document.getElementById(id).closest('[data-surface]')
    expect(blockOf('initiatives').dataset.surface).toBe('lime')
    expect(blockOf('case-studies').dataset.surface).toBe('lilac')
    expect(blockOf('portfolio').dataset.surface).toBe('sky')
    expect(blockOf('capabilities').dataset.surface).toBe('peach')
    expect(blockOf('contact').dataset.surface).toBe('mint')
    expect(blockOf('recommendations').dataset.surface).toBe('navy')
    // The panel is a rounded inset, not a full-bleed section.
    expect(blockOf('initiatives').tagName).not.toBe('SECTION')
    expect(blockOf('initiatives').className).toMatch(/rounded/)
  })

  it('returns to plain white canvas between blocks — unmapped sections carry no surface', () => {
    render(<App />)
    const experience = document.getElementById('experience').closest('section')
    expect(document.getElementById('experience').closest('[data-surface]')).toBeNull()
    expect(experience.className).not.toMatch(/border-b/)
  })
})
