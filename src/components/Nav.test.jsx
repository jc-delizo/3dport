import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Nav } from './Nav'
import { site } from '../content/site'

describe('Nav', () => {
  it('renders every nav link pointing at its section anchor', () => {
    render(<Nav />)
    site.nav.forEach(({ id, label }) => {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', `#${id}`)
    })
  })

  it('exposes a résumé link', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /résumé/i })).toHaveAttribute('href', site.contact.resume)
  })

  it('uses a navigation landmark', () => {
    render(<Nav />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
