import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { Reveal } from './Reveal'

describe('Reveal', () => {
  beforeEach(() => {
    global.IntersectionObserverInstances = []
  })

  afterEach(() => {
    global.IntersectionObserverInstances = []
  })

  it('renders its children', () => {
    render(<Reveal><p>content</p></Reveal>)
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('starts hidden so the entry animation has somewhere to travel from', () => {
    const { container } = render(<Reveal><p>content</p></Reveal>)
    const element = container.firstChild
    expect(element.className).toContain('reveal')
    expect(element.className).not.toContain('reveal-visible')
  })

  it('reveals element when intersection observer detects it', () => {
    const { container } = render(<Reveal><p>content</p></Reveal>)
    const element = container.firstChild

    // Verify initially hidden
    expect(element.className).not.toContain('reveal-visible')

    // Trigger the observer callback
    const observer = global.IntersectionObserverInstances[0]
    act(() => {
      observer.callback([{ isIntersecting: true }])
    })

    // Verify now visible
    expect(element.className).toContain('reveal-visible')
  })
})
