import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProofBar } from './ProofBar'
import { site } from '../content/site'

describe('ProofBar', () => {
  it('renders exactly three stats', () => {
    const { container } = render(<ProofBar />)
    expect(container.querySelectorAll('[data-stat]')).toHaveLength(3)
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
})
