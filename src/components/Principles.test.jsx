import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Principles } from './Principles'
import { Capabilities } from './Capabilities'
import { site } from '../content/site'

describe('Principles', () => {
  it('renders all four principles', () => {
    render(<Principles />)
    site.principles.forEach((p) => expect(screen.getByText(p)).toBeInTheDocument())
  })
})

describe('Capabilities', () => {
  it('renders all six capabilities', () => {
    render(<Capabilities />)
    site.capabilities.forEach(({ label }) => expect(screen.getByText(label)).toBeInTheDocument())
  })
})
