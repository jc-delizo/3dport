import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Recommendations } from './Recommendations'
import { Certifications } from './Certifications'
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

describe('Certifications', () => {
  it('renders every certification with issuer and date', () => {
    render(<Certifications />)
    site.certifications.forEach(({ name, issuer, date }) => {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument()
      expect(screen.getAllByText(issuer).length).toBeGreaterThan(0)
      expect(screen.getAllByText(date).length).toBeGreaterThan(0)
    })
  })

  it('leads with the two national exam rankings, which are the strongest credential', () => {
    render(<Certifications />)
    expect(screen.getByText(/8th of 1,057/)).toBeInTheDocument()
    expect(screen.getByText(/11th of 2,089/)).toBeInTheDocument()
  })

  it('omits the 2022 marketing and design courses, which dilute the positioning', () => {
    const { container } = render(<Certifications />)
    expect(container.textContent).not.toMatch(/Social Media Management|FB Ads|Copywriting|Canva/i)
  })
})
