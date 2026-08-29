import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Card } from './Card'

describe('Card', () => {
  it('carries the springy hover lift', () => {
    const { container } = render(<Card>content</Card>)
    expect(container.firstChild.className).toMatch(/card-lift/)
  })

  it('still renders its children and custom classes', () => {
    const { container } = render(<Card className="h-full">content</Card>)
    expect(container.firstChild).toHaveTextContent('content')
    expect(container.firstChild.className).toMatch(/h-full/)
  })
})
