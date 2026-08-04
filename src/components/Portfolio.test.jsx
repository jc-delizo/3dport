import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Portfolio } from './Portfolio'
import { site } from '../content/site'

describe('Portfolio', () => {
  it('renders the section heading and intro', () => {
    render(<Portfolio />)
    expect(screen.getByRole('heading', { name: 'Delivery Portfolio.' })).toBeInTheDocument()
    expect(screen.getByText(site.portfolio.intro)).toBeInTheDocument()
  })

  it('renders every group label with its entry count', () => {
    render(<Portfolio />)
    site.portfolio.groups.forEach(({ group, items }) => {
      expect(screen.getByText(`${group} · ${items.length}`)).toBeInTheDocument()
    })
  })

  it('renders every entry as a heading with its description', () => {
    render(<Portfolio />)
    site.portfolio.groups.forEach(({ items }) => {
      items.forEach(({ title, desc }) => {
        expect(screen.getByRole('heading', { name: title, level: 3 })).toBeInTheDocument()
        expect(screen.getByText(desc)).toBeInTheDocument()
      })
    })
  })

  it('renders exactly one role chip per entry', () => {
    render(<Portfolio />)
    const total = site.portfolio.groups.reduce((n, g) => n + g.items.length, 0)
    expect(screen.getAllByText(/^(Led|Coordinated|Oversight)$/)).toHaveLength(total)
  })
})
