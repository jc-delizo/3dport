import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Initiatives } from './Initiatives'
import { site } from '../content/site'

describe('Initiatives', () => {
  it('renders all five initiatives with title and category', () => {
    render(<Initiatives />)
    site.initiatives.forEach(({ title, category }) => {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
      expect(screen.getByText(category)).toBeInTheDocument()
    })
  })

  it('renders Problem, Approach and Outcome for each', () => {
    render(<Initiatives />)
    expect(screen.getAllByText('Problem')).toHaveLength(5)
    expect(screen.getAllByText('Approach')).toHaveLength(5)
    expect(screen.getAllByText('Outcome')).toHaveLength(5)
  })

  it('does not render a Lesson block, which the spec removed', () => {
    render(<Initiatives />)
    expect(screen.queryByText('Lesson')).toBeNull()
  })

  it('leaks no internal entity codenames', () => {
    const { container } = render(<Initiatives />)
    expect(container.textContent).not.toMatch(/\bCFB\b|PCNI|SUKI|Isla Terra|Moonrock/)
  })
})
