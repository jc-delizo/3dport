import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'
import { site } from '../content/site'

describe('Hero', () => {
  it('renders the name as the only h1', () => {
    render(<Hero />)
    const h1s = screen.getAllByRole('heading', { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0]).toHaveTextContent(site.hero.name)
  })

  it('states the central claim and the supporting metric', () => {
    render(<Hero />)
    expect(screen.getByText(site.hero.claim)).toBeInTheDocument()
    expect(screen.getByText(/20–28 projects\/year/)).toBeInTheDocument()
  })

  it('renders exactly one filled primary button', () => {
    const { container } = render(<Hero />)
    expect(container.querySelectorAll('a.bg-accent')).toHaveLength(1)
  })

  it('renders every pipeline stage', () => {
    render(<Hero />)
    site.pipeline.forEach((stage) => {
      expect(screen.getByText(stage)).toBeInTheDocument()
    })
  })

  it('renders no canvas element', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('canvas')).toBeNull()
  })
})
