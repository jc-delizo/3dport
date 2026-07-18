import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders a link with its label', () => {
    render(<Button href="#x">Go</Button>)
    expect(screen.getByRole('link', { name: 'Go' })).toHaveAttribute('href', '#x')
  })

  it('adds safe rel attributes for external links', () => {
    render(<Button href="https://example.com" external>Out</Button>)
    const link = screen.getByRole('link', { name: 'Out' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders the ghost variant without the filled accent background', () => {
    render(<Button href="#x" variant="ghost">Ghost</Button>)
    expect(screen.getByRole('link', { name: 'Ghost' }).className).not.toMatch(/bg-accent/)
  })
})
