import { describe, it, expect, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithTheme as render } from '../test/render'
import { Approach } from './Approach'
import { site } from '../content/site'

describe('Approach section', () => {
  beforeEach(() => localStorage.clear())

  it('renders the heading, intro, and a real range slider defaulting to the balanced center', () => {
    render(<Approach />)
    expect(screen.getByRole('heading', { name: /how i approach software/i })).toBeInTheDocument()
    expect(screen.getByText(site.approach.intro)).toBeInTheDocument()
    const slider = screen.getByRole('slider')
    expect(slider).toHaveValue('50')
    expect(slider).toHaveAttribute('min', '0')
    expect(slider).toHaveAttribute('max', '100')
    // The center is the strongest state — the default says "both", not "either".
    expect(slider).toHaveAttribute('aria-valuetext', expect.stringMatching(/balanced/i))
  })

  it('keeps both perspectives visible at all times — no dragging required to understand it', () => {
    render(<Approach />)
    site.approach.pm.flow.forEach((step) =>
      expect(screen.getAllByText(step).length).toBeGreaterThan(0)
    )
    site.approach.eng.flow.forEach((step) =>
      expect(screen.getAllByText(step).length).toBeGreaterThan(0)
    )
    // The bridge — the visual highlight — is always in the document too.
    expect(screen.getAllByText('Business outcome').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Measurable outcome').length).toBeGreaterThan(0)
  })

  it('announces the blend as the slider moves: PM end, balanced center, engineer end', () => {
    render(<Approach />)
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '0' } })
    expect(slider).toHaveAttribute('aria-valuetext', expect.stringMatching(/project manager/i))
    fireEvent.change(slider, { target: { value: '100' } })
    expect(slider).toHaveAttribute('aria-valuetext', expect.stringMatching(/engineer/i))
    fireEvent.change(slider, { target: { value: '50' } })
    expect(slider).toHaveAttribute('aria-valuetext', expect.stringMatching(/balanced/i))
  })

  it('always settles on one of the three detents on release — never in between', () => {
    render(<Approach />)
    const slider = screen.getByRole('slider')
    const settle = (v) => {
      fireEvent.change(slider, { target: { value: String(v) } })
      fireEvent.pointerUp(slider)
      return slider.value
    }
    expect(settle(47)).toBe('50')
    expect(settle(58)).toBe('50')
    expect(settle(80)).toBe('100')
    expect(settle(10)).toBe('0')
  })

  it('steps between the three detents with arrow keys', () => {
    render(<Approach />)
    const slider = screen.getByRole('slider')
    expect(slider).toHaveValue('50')
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(slider).toHaveValue('100')
    fireEvent.keyDown(slider, { key: 'ArrowLeft' })
    fireEvent.keyDown(slider, { key: 'ArrowLeft' })
    expect(slider).toHaveValue('0')
    fireEvent.keyDown(slider, { key: 'ArrowUp' })
    expect(slider).toHaveValue('50')
  })

  it('hints that the slider is interactive until the first interaction', () => {
    render(<Approach />)
    const hint = screen.getByText(/slide me/i)
    expect(hint.className).not.toMatch(/opacity-0/)
    fireEvent.pointerDown(screen.getByRole('slider'))
    expect(screen.getByText(/slide me/i).className).toMatch(/opacity-0/)
  })

  it('arms the one-time attract demo via an intersection observer, remembered per visitor', () => {
    const before = global.IntersectionObserverInstances.length
    render(<Approach />)
    const io = global.IntersectionObserverInstances[global.IntersectionObserverInstances.length - 1]
    expect(global.IntersectionObserverInstances.length).toBeGreaterThan(before)
    io.callback([{ isIntersecting: true }])
    expect(localStorage.getItem('3dport-slider-demo')).toBe('1')
    // Grabbing the slider cancels the demo without errors.
    fireEvent.pointerDown(screen.getByRole('slider'))
  })

  it('carries the three captions, the closing message, and the credibility arc', () => {
    render(<Approach />)
    expect(screen.getByText(site.approach.pm.caption)).toBeInTheDocument()
    expect(screen.getByText(site.approach.eng.caption)).toBeInTheDocument()
    expect(screen.getByText(site.approach.bridge.caption)).toBeInTheDocument()
    expect(screen.getByText(/not just managing software/i)).toBeInTheDocument()
    expect(
      screen.getByText(/coordinating a technical team and leading technical delivery/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText('10+ years across engineering and software delivery')
    ).toBeInTheDocument()
    site.approach.arc.forEach((stage) =>
      expect(screen.getAllByText(stage).length).toBeGreaterThan(0)
    )
  })
})
