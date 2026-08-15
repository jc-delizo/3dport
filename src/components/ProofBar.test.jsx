import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme as render } from '../test/render'
import { ProofBar } from './ProofBar'
import { site } from '../content/site'

describe('ProofBar', () => {
  it('renders exactly four stats', () => {
    const { container } = render(<ProofBar />)
    expect(container.querySelectorAll('[data-stat]')).toHaveLength(4)
  })

  it('renders each value and label', () => {
    render(<ProofBar />)
    site.proof.forEach(({ value, label }) => {
      expect(screen.getByText(value)).toBeInTheDocument()
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })

  it('does not claim 26 initiatives', () => {
    const { container } = render(<ProofBar />)
    expect(container.textContent).not.toMatch(/\b26\b/)
  })

  it('wires each stat for count-up animation while rendering the final value', () => {
    const { container } = render(<ProofBar />)
    const stats = [...container.querySelectorAll('[data-stat]')]
    // The numeric part of each value is exposed as the animation target
    // ('10×' → 10, '20–28' → 20); markup still shows the real value so nothing
    // depends on JS timing or motion preference.
    expect(stats.map((s) => s.dataset.countupTarget)).toEqual(['10', '20', '65', '15'])
    site.proof.forEach(({ value }) => expect(screen.getByText(value)).toBeInTheDocument())
  })
})
