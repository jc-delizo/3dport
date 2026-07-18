import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Contact } from './Contact'
import { Tools } from './Tools'
import { site } from '../content/site'

describe('Contact', () => {
  it('renders a mailto link rather than a form', () => {
    const { container } = render(<Contact />)
    expect(container.querySelector('form')).toBeNull()
    expect(screen.getByRole('link', { name: new RegExp(site.contact.email, 'i') })).toHaveAttribute(
      'href',
      `mailto:${site.contact.email}`
    )
  })

  it('states availability using confident phrasing', () => {
    render(<Contact />)
    expect(screen.getByText(/selectively exploring/i)).toBeInTheDocument()
  })
})

describe('Tools', () => {
  it('renders every group and item, including Odoo', () => {
    render(<Tools />)
    site.tools.forEach(({ group, items }) => {
      expect(screen.getByText(group)).toBeInTheDocument()
      items.forEach((item) => expect(screen.getByText(item)).toBeInTheDocument())
    })
    expect(screen.getByText('Odoo ERP')).toBeInTheDocument()
  })
})
