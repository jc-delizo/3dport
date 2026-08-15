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

  it('marks download links with the download attribute, in the same tab', () => {
    render(<Button href="/3dport/resume.pdf" download>Résumé</Button>)
    const link = screen.getByRole('link', { name: 'Résumé' })
    expect(link).toHaveAttribute('download')
    expect(link).not.toHaveAttribute('target')
  })

  it('renders the small size without the default padding classes', () => {
    render(<Button href="#x" size="sm">Small</Button>)
    const cls = screen.getByRole('link', { name: 'Small' }).className
    expect(cls).toMatch(/py-1\.5/)
    expect(cls).not.toMatch(/py-2\.5|text-body/)
  })

  it('uses a string download prop as the saved filename', () => {
    render(<Button href="/3dport/resume.pdf" download="JC Delizo - Resume.pdf">Résumé</Button>)
    expect(screen.getByRole('link', { name: 'Résumé' })).toHaveAttribute(
      'download',
      'JC Delizo - Resume.pdf'
    )
  })
})
