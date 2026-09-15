import { afterEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithTheme as render } from './test/render'
import App from './App'

describe('App', () => {
  afterEach(() => {
    window.history.replaceState({}, '', '/')
  })

  it('renders exactly one h1', () => {
    render(<App />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('renders the required landmarks', () => {
    render(<App />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('provides a skip-to-content link as the first focusable element', () => {
    render(<App />)
    expect(screen.getByRole('link', { name: /skip to content/i })).toHaveAttribute('href', '#main')
  })

  it('renders no canvas anywhere', () => {
    const { container } = render(<App />)
    expect(container.querySelector('canvas')).toBeNull()
  })

  it('renders exactly one filled primary button on the page', () => {
    const { container } = render(<App />)
    // Hero's "View Initiatives" and Contact's mailto are both primary by design;
    // the spec allows one per screen, not one per page. Assert they are the only two.
    expect(container.querySelectorAll('a.bg-accent')).toHaveLength(2)
  })

  it('resolves a cross-page hash after React mounts the target section', async () => {
    // Hash loads land via scrollToSection (layout-true, header-offset), so
    // the observable call is window.scrollTo with instant behavior.
    const scrollTo = vi.fn()
    vi.stubGlobal('scrollTo', scrollTo)
    window.history.replaceState({}, '', `${import.meta.env.BASE_URL}#contact`)

    render(<App />)

    await waitFor(() =>
      expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'instant' })),
    )
    vi.unstubAllGlobals()
  })
})
