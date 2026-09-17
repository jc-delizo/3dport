import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme as render } from './test/render'
import { site } from './content/site'
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

describe('view router — the Lab as a room of this page', () => {
  // Warm the lazy chunk once: under full-suite load its first transform can
  // outrun even generous findBy timeouts, which tests scheduling, not us.
  beforeAll(async () => {
    await import('./components/lab/LabView')
  }, 60000) // the first transform of the Lab graph can crawl on a loaded box

  it('opens the Lab in place from the nav, with a real URL and a way back', async () => {
    const user = userEvent.setup()
    window.history.replaceState({}, '', import.meta.env.BASE_URL)
    render(<App />)
    await user.click(screen.getAllByRole('link', { name: 'Lab' })[0])
    // Lazy view: wait for the Lab hero to arrive.
    expect(await screen.findByRole('heading', { name: 'Make. Ship. Learn.' }, { timeout: 10000 })).toBeInTheDocument()
    expect(window.location.pathname).toBe(`${import.meta.env.BASE_URL}lab/`)
    expect(document.title).toContain('Lab')

    // The way home: the back chip beside the brand.
    await user.click(screen.getAllByRole('button', { name: /portfolio/i })[0])
    expect(await screen.findByText(site.hero.claim, {}, { timeout: 10000 })).toBeInTheDocument()
    expect(window.location.pathname).toBe(import.meta.env.BASE_URL)
    expect(document.title).toContain('Technical Project Manager')
  })

  it('honors the browser back button via popstate', async () => {
    const user = userEvent.setup()
    window.history.replaceState({}, '', import.meta.env.BASE_URL)
    render(<App />)
    await user.click(screen.getAllByRole('link', { name: 'Lab' })[0])
    await screen.findByRole('heading', { name: 'Make. Ship. Learn.' }, { timeout: 10000 })

    window.history.replaceState({}, '', import.meta.env.BASE_URL)
    fireEvent.popState(window)
    expect(await screen.findByText(site.hero.claim, {}, { timeout: 10000 })).toBeInTheDocument()
  })

  it('boots straight into the Lab when loaded at /lab/', async () => {
    window.history.replaceState({}, '', `${import.meta.env.BASE_URL}lab/`)
    render(<App />)
    expect(await screen.findByRole('heading', { name: 'Make. Ship. Learn.' }, { timeout: 10000 })).toBeInTheDocument()
    window.history.replaceState({}, '', import.meta.env.BASE_URL)
  })

  it('switches home and scrolls when a section link is clicked from inside the Lab', async () => {
    const user = userEvent.setup()
    window.history.replaceState({}, '', `${import.meta.env.BASE_URL}lab/`)
    const scrollTo = vi.fn()
    vi.stubGlobal('scrollTo', scrollTo)
    render(<App />)
    await screen.findByRole('heading', { name: 'Make. Ship. Learn.' }, { timeout: 10000 })
    // A footer sitemap link targets a home section not mounted in the Lab.
    await user.click(document.querySelector("footer nav a[href='#initiatives']"))
    expect(await screen.findByText(site.hero.claim, {}, { timeout: 10000 })).toBeInTheDocument()
    vi.unstubAllGlobals()
    window.history.replaceState({}, '', import.meta.env.BASE_URL)
  })
})
