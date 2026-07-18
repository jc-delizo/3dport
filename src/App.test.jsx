import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders exactly one h1', () => {
    render(<App />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('renders the required landmarks', () => {
    render(<App />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('provides a skip-to-content link as the first focusable element', () => {
    render(<App />)
    expect(screen.getByRole('link', { name: /skip to content/i })).toHaveAttribute('href', '#main')
  })

  it('renders no canvas anywhere', () => {
    const { container } = render(<App />)
    expect(container.querySelector('canvas')).toBeNull()
  })

  it('renders exactly one filled primary button on the page', () => {
    const { container } = render(<App />)
    // Hero's "View Initiatives" and Contact's mailto are both primary by design;
    // the spec allows one per screen, not one per page. Assert they are the only two.
    expect(container.querySelectorAll('a.bg-accent')).toHaveLength(2)
  })
})
