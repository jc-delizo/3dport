import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Experience } from './Experience'
import { site } from '../content/site'

describe('Experience', () => {
  it('renders a card per role with company, role and period', () => {
    render(<Experience />)
    site.experience.forEach(({ company, role, period }) => {
      expect(screen.getByRole('heading', { name: company })).toBeInTheDocument()
      expect(screen.getByText(role)).toBeInTheDocument()
      expect(screen.getByText(period)).toBeInTheDocument()
    })
  })

  it('does not repeat the 10x figure proven elsewhere', () => {
    const { container } = render(<Experience />)
    expect(container.textContent).not.toMatch(/10×|10x/)
  })
})
