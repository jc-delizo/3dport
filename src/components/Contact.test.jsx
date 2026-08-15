import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme as render } from '../test/render'
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

  it('invites conversation without announcing a job search', () => {
    // JC is employed and the site is public: availability stays implied.
    // "exploring opportunities" phrasing is banned from this section.
    render(<Contact />)
    const { heading, body } = site.availability
    expect(screen.getByText(body)).toBeInTheDocument()
    const text = `${heading} ${body}`
    expect(text).not.toMatch(/opportunit|exploring|open to roles|job|hiring/i)
    expect(text).toMatch(/talk|conversation|reach/i)
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
