import { describe, it, expect, vi, afterEach } from 'vitest'
import { screen, fireEvent, act } from '@testing-library/react'
import { renderWithTheme as render } from '../test/render'
import { Lifecycle } from './Lifecycle'
import { lifecycle, artifactPreviews } from '../content/lifecycle'

// The section's own IntersectionObserver is always the last one created.
const lastIO = () => global.IntersectionObserverInstances.at(-1)
const enterView = () => act(() => lastIO().callback([{ isIntersecting: true }]))

describe('Lifecycle', () => {
  afterEach(() => vi.useRealTimers())

  it('renders the heading, subtitle, and every phase twice (row + chips)', () => {
    render(<Lifecycle />)
    expect(
      screen.getByRole('heading', { name: 'From Business Problem → Production.' })
    ).toBeInTheDocument()
    expect(screen.getByText(lifecycle.intro)).toBeInTheDocument()
    lifecycle.phases.forEach(({ name }) => {
      // One desktop pipeline entry + one sub-lg chip.
      expect(screen.getAllByRole('button', { name: new RegExp(`^${name}$`, 'i') })).toHaveLength(2)
    })
  })

  it('starts on Project Request and shows its description and artifacts', () => {
    render(<Lifecycle />)
    expect(screen.getByText(lifecycle.phases[0].desc)).toBeInTheDocument()
    lifecycle.phases[0].artifacts.forEach((a) =>
      expect(screen.getByText(a)).toBeInTheDocument()
    )
  })

  it('advances on its own clock once in view, and pauses while hovered', () => {
    vi.useFakeTimers()
    render(<Lifecycle />)
    enterView()
    act(() => vi.advanceTimersByTime(2900))
    expect(screen.getByText(lifecycle.phases[1].desc)).toBeInTheDocument()

    // Hover pauses; nothing advances while engaged.
    fireEvent.mouseEnter(screen.getByText(lifecycle.phases[1].desc).parentElement.parentElement)
    act(() => vi.advanceTimersByTime(6000))
    expect(screen.getByText(lifecycle.phases[1].desc)).toBeInTheDocument()
  })

  it('does not autoplay before the section scrolls into view', () => {
    vi.useFakeTimers()
    render(<Lifecycle />)
    act(() => vi.advanceTimersByTime(10000))
    expect(screen.getByText(lifecycle.phases[0].desc)).toBeInTheDocument()
  })

  it('clicking a phase activates it immediately, pauses, then autoplay resumes', () => {
    vi.useFakeTimers()
    render(<Lifecycle />)
    enterView()
    const uat = screen.getAllByRole('button', { name: /^UAT$/i })[0]
    fireEvent.click(uat)
    expect(uat).toHaveAttribute('aria-current', 'step')
    expect(screen.getByText(lifecycle.phases[6].desc)).toBeInTheDocument()

    // Paused right after the click…
    act(() => vi.advanceTimersByTime(3000))
    expect(screen.getByText(lifecycle.phases[6].desc)).toBeInTheDocument()
    // …and resumed a few seconds after the interaction stops.
    act(() => vi.advanceTimersByTime(3100)) // resume fires at 6s
    act(() => vi.advanceTimersByTime(2900)) // next tick of the restarted clock
    expect(screen.getByText(lifecycle.phases[7].desc)).toBeInTheDocument()
  })

  it('wraps from the last phase back to Project Request — the loop', () => {
    vi.useFakeTimers()
    render(<Lifecycle />)
    enterView()
    const last = lifecycle.phases.at(-1)
    const lastChip = screen.getAllByRole('button', { name: new RegExp(`^${last.name}$`, 'i') })[0]
    fireEvent.click(lastChip)
    act(() => vi.advanceTimersByTime(6100)) // click-pause elapses
    act(() => vi.advanceTimersByTime(2900)) // clock restarts and wraps
    expect(screen.getByText(lifecycle.phases[0].desc)).toBeInTheDocument()
  })

  it('opens a sanitized artifact example in a modal and closes on Escape', () => {
    render(<Lifecycle />)
    const scoping = screen.getAllByRole('button', { name: /^Scoping$/i })[0]
    fireEvent.click(scoping)
    fireEvent.click(screen.getByRole('button', { name: /Project Scope/ }))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent('Sanitized example')
    artifactPreviews['Project Scope'].sections.forEach(({ label }) =>
      expect(dialog).toHaveTextContent(label)
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('only artifacts with a sanitized preview are clickable; the rest are plain cards', () => {
    render(<Lifecycle />)
    // Phase 1 artifacts have no previews — none render as buttons.
    lifecycle.phases[0].artifacts.forEach((a) => {
      expect(artifactPreviews[a]).toBeUndefined()
      expect(screen.getByText(a).tagName).not.toBe('BUTTON')
    })
    // Every preview key corresponds to a real artifact somewhere.
    const all = new Set(lifecycle.phases.flatMap((p) => p.artifacts))
    Object.keys(artifactPreviews).forEach((k) => expect(all.has(k), k).toBe(true))
  })

  it('never touches page scrolling — no wheel/scroll handlers in the component source', () => {
    // React's root delegation makes runtime listener spies useless here, so
    // pin the contract at the source level: autoplay + hover + click only.
    const { readFileSync } = require('node:fs')
    const { resolve } = require('node:path')
    const source = readFileSync(resolve(__dirname, './Lifecycle.jsx'), 'utf-8')
    expect(source).not.toMatch(/onWheel|addEventListener\(['"](wheel|scroll|touchmove)/)
    expect(source).not.toMatch(/preventDefault/)
    expect(source).not.toMatch(/overflow-(x-)?auto|overflow-(x-)?scroll/)
  })
})
