import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Reveal } from './Reveal'

describe('Reveal', () => {
  it('renders its children', () => {
    render(<Reveal><p>content</p></Reveal>)
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('starts hidden so the entry animation has somewhere to travel from', () => {
    const { container } = render(<Reveal><p>content</p></Reveal>)
    expect(container.firstChild.className).toMatch(/reveal/)
  })
})
