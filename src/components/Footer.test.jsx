import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme as render } from '../test/render'
import { Footer } from './Footer'

describe('Footer', () => {
  it('keeps the copyright line', () => {
    render(<Footer />)
    expect(screen.getByText(/© \d{4} JC Delizo/)).toBeInTheDocument()
  })

  it('shows real build stats — stack, test count, commit, date', () => {
    render(<Footer />)
    const line = screen.getByTestId('build-info')
    expect(line).toHaveTextContent(/React \d+/)
    expect(line).toHaveTextContent(/Vite/)
    expect(line).toHaveTextContent(/\d+ tests/)
    expect(line).toHaveTextContent(/[0-9a-f]{7}/)
    expect(line).toHaveTextContent(/\d{4}-\d{2}-\d{2}/)
  })
})
