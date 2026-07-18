import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('test harness', () => {
  it('renders React into jsdom', () => {
    render(<h1>hello</h1>)
    expect(screen.getByRole('heading', { name: 'hello' })).toBeInTheDocument()
  })
})
