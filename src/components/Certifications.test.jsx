import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Certifications } from './Certifications'
import { site } from '../content/site'

describe('Certifications', () => {
  it('renders all 19 certifications as flat rows with issuer and date', () => {
    const { container } = render(<Certifications />)
    expect(site.certifications.length).toBe(19)
    site.certifications.forEach(({ name, issuer, date }) => {
      expect(screen.getByText(name)).toBeInTheDocument()
      expect(screen.getAllByText(issuer).length).toBeGreaterThan(0)
      expect(screen.getAllByText(date).length).toBeGreaterThan(0)
    })
    // One flat list: every entry is a row, no card headings remain.
    expect(container.querySelectorAll('li').length).toBe(19)
    expect(container.querySelectorAll('h3').length).toBe(0)
  })

  it('links every credentialed entry to its certificate in a new tab, safely', () => {
    const { container } = render(<Certifications />)
    const links = container.querySelectorAll('a')
    expect(links.length).toBe(18)
    links.forEach((a) => {
      expect(a.getAttribute('target')).toBe('_blank')
      expect(a.getAttribute('rel')).toBe('noopener noreferrer')
      expect(a.getAttribute('href')).toMatch(/^https:\/\//)
    })
  })

  it('renders the Alison entry as plain text — no anchor, no dead link', () => {
    render(<Certifications />)
    const alison = screen.getByText('Agile Project Management')
    expect(alison.closest('a')).toBeNull()
  })

  it('shows the two national exam rankings, the strongest verifiable credential', () => {
    render(<Certifications />)
    expect(screen.getByText(/8th of 1,057/)).toBeInTheDocument()
    expect(screen.getByText(/11th of 2,089/)).toBeInTheDocument()
  })

  it('omits the 2022 marketing and design courses, which dilute the positioning', () => {
    const { container } = render(<Certifications />)
    expect(container.textContent).not.toMatch(/Social Media Management|FB Ads|Copywriting|Canva/i)
  })
})
