import { describe, it, expect, vi } from 'vitest'
import { screen, act } from '@testing-library/react'
import { renderWithTheme as render } from '../test/render'
import { Hero } from './Hero'
import { site } from '../content/site'

describe('Hero', () => {
  it('renders the name as the only h1', () => {
    render(<Hero />)
    const h1s = screen.getAllByRole('heading', { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0]).toHaveTextContent(site.hero.name)
  })

  it('states the central claim and the supporting metric', () => {
    render(<Hero />)
    expect(screen.getByText(site.hero.claim)).toBeInTheDocument()
    expect(screen.getByText(/20–28 projects\/year/)).toBeInTheDocument()
  })

  it('renders exactly one filled primary button', () => {
    const { container } = render(<Hero />)
    expect(container.querySelectorAll('a.bg-accent')).toHaveLength(1)
  })

  it('renders every pipeline stage', () => {
    render(<Hero />)
    site.pipeline.forEach((stage) => {
      expect(screen.getByText(stage)).toBeInTheDocument()
    })
  })

  it('renders no canvas element', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('canvas')).toBeNull()
  })

  it('glares the six key claims once, in reading order, then goes still', () => {
    vi.useFakeTimers()
    render(<Hero />)
    // Nothing glares before the start delay.
    expect(document.querySelectorAll('.text-glare')).toHaveLength(0)

    const expected = [
      site.hero.title,
      '2 to 20–28 projects/year',
      'Agile, AI-powered workflows, and scalable delivery systems',
      ...site.pipeline,
    ]
    act(() => vi.advanceTimersByTime(950))
    expected.forEach((text, i) => {
      const glaring = document.querySelectorAll('.text-glare')
      expect(glaring, `step ${i}`).toHaveLength(1)
      expect(glaring[0].textContent).toBe(text)
      act(() => vi.advanceTimersByTime(1100))
    })

    // One pass only — after the last step the hero goes still for good.
    expect(document.querySelectorAll('.text-glare')).toHaveLength(0)
    act(() => vi.advanceTimersByTime(10000))
    expect(document.querySelectorAll('.text-glare')).toHaveLength(0)
    vi.useRealTimers()
  })
})
