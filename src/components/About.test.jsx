import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { About } from './About'

describe('About', () => {
  it('renders the portrait with real alt text', () => {
    render(<About />)
    expect(screen.getByAltText('JC Delizo')).toBeInTheDocument()
  })

  it('offers AVIF first, with the JPEG as the img fallback', () => {
    const { container } = render(<About />)
    const source = container.querySelector('picture source')
    expect(source).toHaveAttribute('type', 'image/avif')
    expect(source.getAttribute('srcset')).toMatch(/head\.avif$/)
    expect(screen.getByAltText('JC Delizo').getAttribute('src')).toMatch(/head\.jpg$/)
    // querySelector('picture source') matches regardless of document order, so it
    // cannot by itself prove the AVIF <source> precedes the <img> fallback. Pin
    // source order explicitly: it is the entire mechanism by which <picture>
    // prefers AVIF over the JPEG.
    expect(container.querySelector('picture > *:first-child')).toBe(source)
  })

  it('prefixes both asset paths with the deploy base', () => {
    // Vite rewrites asset paths in HTML and CSS but not in JS strings. A bare
    // "/head.avif" would 404 under the /3dport/ base. This is the only component
    // that references a public asset, so nothing else guards it.
    //
    // Verified 2026-07-19: under Vitest 2.1.9 + jsdom, import.meta.env.BASE_URL
    // resolves to '/3dport/' (it inherits vite.config.js `base`), so this
    // assertion distinguishes correct code from the bug. Do not assume this —
    // some Vitest setups resolve BASE_URL to '/' in test mode, which would make
    // the assertion untestable rather than merely fragile.
    const { container } = render(<About />)
    expect(container.querySelector('picture source').getAttribute('srcset')).toBe('/3dport/head.avif')
    expect(screen.getByAltText('JC Delizo').getAttribute('src')).toBe('/3dport/head.jpg')
  })

  it('reserves the image box so the portrait cannot shift layout', () => {
    render(<About />)
    const img = screen.getByAltText('JC Delizo')
    expect(img).toHaveAttribute('width', '240')
    expect(img).toHaveAttribute('height', '320')
  })
})
