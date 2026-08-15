import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme as render } from '../test/render'
import userEvent from '@testing-library/user-event'
import { Certifications } from './Certifications'
import { site } from '../content/site'

describe('Certifications', () => {
  it('shows only the six featured certifications when collapsed', () => {
    const { container } = render(<Certifications />)
    expect(container.querySelectorAll('li').length).toBe(6)
    site.certifications.slice(0, 6).forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument()
    })
    // The strongest credential note is visible without expanding.
    expect(screen.getByText(/8th of 1,057/)).toBeInTheDocument()
  })

  it('expands to all 19 via See more and collapses again via See less', async () => {
    const user = userEvent.setup()
    const { container } = render(<Certifications />)

    const toggle = screen.getByRole('button', { name: /\+ 13 more certifications/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)
    expect(container.querySelectorAll('li').length).toBe(19)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(toggle).toHaveTextContent(/show less/i)
    expect(screen.getByText(/11th of 2,089/)).toBeInTheDocument()

    await user.click(toggle)
    expect(container.querySelectorAll('li').length).toBe(6)
    expect(toggle).toHaveTextContent(/13 more certifications/i)
  })

  it('links every credentialed entry to its certificate in a new tab, safely', async () => {
    const user = userEvent.setup()
    const { container } = render(<Certifications />)
    await user.click(screen.getByRole('button', { name: /\+ 13 more certifications/i }))

    const links = container.querySelectorAll('a')
    expect(links.length).toBe(18)
    links.forEach((a) => {
      expect(a.getAttribute('target')).toBe('_blank')
      expect(a.getAttribute('rel')).toBe('noopener noreferrer')
      expect(a.getAttribute('href')).toMatch(/^https:\/\//)
    })
  })

  it('renders the Alison entry as plain text — no anchor, no dead link', async () => {
    const user = userEvent.setup()
    render(<Certifications />)
    await user.click(screen.getByRole('button', { name: /\+ 13 more certifications/i }))
    const alison = screen.getByText('Agile Project Management')
    expect(alison.closest('a')).toBeNull()
  })

  it('omits the 2022 marketing and design courses, which dilute the positioning', async () => {
    const user = userEvent.setup()
    const { container } = render(<Certifications />)
    await user.click(screen.getByRole('button', { name: /\+ 13 more certifications/i }))
    expect(container.textContent).not.toMatch(/Social Media Management|FB Ads|Copywriting|Canva/i)
  })
})
