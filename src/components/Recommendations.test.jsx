import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme as render } from '../test/render'
import { Recommendations } from './Recommendations'
import { site } from '../content/site'

describe('Recommendations', () => {
  it('carries the three real recommendations, Harrison from the TaskUs chapter included', () => {
    expect(site.recommendations).toHaveLength(3)
    const harrison = site.recommendations.find((r) => r.name === 'Harrison Wallace')
    // Dated to the end of the TaskUs working relationship, per JC.
    expect(harrison.date).toBe('June 2023')
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
