import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Recommendations } from './Recommendations'
import { site } from '../content/site'

describe('Recommendations', () => {
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
