import { describe, it, expect } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithTheme as render } from '../test/render'
import { Approach } from './Approach'
import { site } from '../content/site'

describe('Approach section', () => {
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

  it('gently snaps to the balanced center when released within ±4 points', () => {
    render(<Approach />)
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '47' } })
    fireEvent.pointerUp(slider)
    expect(slider).toHaveValue('50')
    // Outside the magnet zone nothing moves.
    fireEvent.change(slider, { target: { value: '58' } })
    fireEvent.pointerUp(slider)
    expect(slider).toHaveValue('58')
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
