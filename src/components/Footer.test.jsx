import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme as render } from '../test/render'
import { Footer } from './Footer'
import { site } from '../content/site'

describe('Footer', () => {
  it('keeps the copyright line', () => {
    render(<Footer />)
    expect(screen.getByText(/© \d{4} JC Delizo/)).toBeInTheDocument()
  })

  it('shows the stack and build stats — tools, test count, commit; no date', () => {
    render(<Footer />)
    const line = screen.getByTestId('build-info')
    expect(line).toHaveTextContent(/React \d+/)
    expect(line).toHaveTextContent(/Vite/)
    expect(line).toHaveTextContent(/Tailwind CSS/)
    expect(line).toHaveTextContent(/GSAP/)
    expect(line).toHaveTextContent(/draw\.io/)
    expect(line).toHaveTextContent(/\d+ tests/)
    expect(line).toHaveTextContent(/[0-9a-f]{7}/)
    expect(line).not.toHaveTextContent(/\d{4}-\d{2}-\d{2}/)
  })
})

describe('footer sitemap (the demoted nav sections)', () => {
  it('links every footerNav section on the main page', () => {
    render(<Footer />)
    site.footerNav.forEach(({ id, label }) => {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', `#${id}`)
    })
  })

  it('routes sitemap links back to the portfolio when rendered on the Lab page', () => {
    render(<Footer currentPage="lab" />)
    site.footerNav.forEach(({ id, label }) => {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute(
        'href',
        `${import.meta.env.BASE_URL}#${id}`
      )
    })
  })
})
