import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme as render } from '../test/render'
import { Recommendations } from './Recommendations'
import { site } from '../content/site'

describe('Recommendations', () => {
  it('carries the five real recommendations with corrected attributions', () => {
    expect(site.recommendations.map((r) => r.name)).toEqual([
      'Emmanuel Louis Gonzaga',
      'Jae-Mar Arenque',
      'Ronak Viramgama',
      'Harrison Wallace',
      'Lisette Racoma',
    ])
    const jaeMar = site.recommendations.find((r) => r.name === 'Jae-Mar Arenque')
    // Verbatim from LinkedIn (August 28, 2026); cross-company peer.
    expect(jaeMar.date).toBe('August 2026')
    expect(jaeMar.quote).toMatch(/enterprise system development/)
    expect(jaeMar.context).toMatch(/Program Manager/)
    const harrison = site.recommendations.find((r) => r.name === 'Harrison Wallace')
    expect(harrison.context).toMatch(/COO/)
    // Dated to the end of the TaskUs working relationship, per JC.
    expect(harrison.date).toBe('June 2023')
    const emmanuel = site.recommendations.find((r) => r.name === 'Emmanuel Louis Gonzaga')
    expect(emmanuel.date).toBe('December 2024')
    // Toned down at JC's request — the superlative stack is gone.
    expect(emmanuel.quote).not.toMatch(/strongly recommend|flawless|exceptional|outstanding/i)
  })

  it('scrolls horizontally with the scrollbar hidden, cards snapping into place', () => {
    const { container } = render(<Recommendations />)
    const scroller = container.querySelector('.no-scrollbar')
    expect(scroller).not.toBeNull()
    expect(scroller.className).toMatch(/overflow-x-auto/)
    expect(scroller.className).toMatch(/snap-x/)
    // Keyboard users can still reach and scroll it.
    expect(scroller).toHaveAttribute('tabindex', '0')
  })

  it('renders every recommendation with its attribution', () => {
    render(<Recommendations />)
    site.recommendations.forEach(({ name, quote }) => {
      expect(screen.getByText(name)).toBeInTheDocument()
      expect(screen.getByText(quote)).toBeInTheDocument()
    })
  })

  it('does not carry the old frontend-developer positioning', () => {
    // The site sells delivery leadership. A 2023 recommendation praising CSS and React
    // was deliberately left out; this catches it being pasted back in unthinkingly.
    const { container } = render(<Recommendations />)
    expect(container.textContent).not.toMatch(/Full Stack Web Developer/i)
  })

  it('uses figure/blockquote so quotes are marked up as quotes', () => {
    const { container } = render(<Recommendations />)
    expect(container.querySelectorAll('figure').length).toBe(site.recommendations.length)
    expect(container.querySelectorAll('blockquote').length).toBe(site.recommendations.length)
  })
})
