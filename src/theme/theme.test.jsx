import { describe, it, expect, beforeEach, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen, act } from '@testing-library/react'
import { THEMES, DEFAULT_THEME } from './themes'

// Mirrors ThemeContext's key. Versioned only when the default actually changes.
const STORAGE_KEY = '3dport-theme-v2'
import { ThemeProvider, useTheme } from './ThemeContext'

const GRAMMAR_KEYS = ['nav', 'rhythm', 'button', 'display', 'chart', 'approach']
const CHART_KEYS = ['accent', 'surface', 'grid', 'textMuted', 'textStrong']

describe('theme registry', () => {
  it('ships the six originals plus the four signature themes; Quiet stays default until one is chosen', () => {
    expect(THEMES.map((t) => t.id)).toEqual([
      'daylight',
      'midnight',
      'cupertino',
      'paper',
      'studio',
      'quiet',
      'order',
      'throughput',
      'signal',
      'atrium',
    ])
    expect(DEFAULT_THEME).toBe('quiet')
  })

  it('gives each signature theme a distinct rhythm so they cannot collapse into one another', () => {
    const rhythmOf = (id) => THEMES.find((t) => t.id === id).grammar.rhythm
    expect(rhythmOf('order')).toBe('bordered')
    expect(rhythmOf('throughput')).toBe('bands')
    expect(rhythmOf('signal')).toBe('tiles')
    expect(rhythmOf('atrium')).toBe('planes')
    // Every signature theme names the gesture it owns, so App can mount one
    // signature layer per theme without a growing chain of id comparisons.
    ;['order', 'throughput', 'signal', 'atrium'].forEach((id) =>
      expect(THEMES.find((t) => t.id === id).grammar.signature).toBe(id)
    )
  })

  it('keeps all four signature themes in light mode, as briefed', () => {
    const css = readFileSync(resolve(__dirname, '../index.css'), 'utf-8')
    ;['order', 'throughput', 'signal', 'atrium'].forEach((theme) => {
      const block = css.match(new RegExp(`\\[data-theme='${theme}'\\]\\s*{([^}]+)}`))[1]
      expect(block, `${theme} must declare light color-scheme`).toMatch(/color-scheme:\s*light/)
    })
  })

  it('gives Quiet a restrained, bordered system with a muted green accent', () => {
    const quiet = THEMES.find((t) => t.id === 'quiet')
    expect(quiet.grammar.nav).toBe('default')
    expect(quiet.grammar.rhythm).toBe('bordered')
    expect(quiet.grammar.button).toBe('rounded')
    expect(quiet.grammar.chart.accent).toBe('#355E52')
  })

  it('gives Studio the monochrome color-block grammar on the standard nav', () => {
    const studio = THEMES.find((t) => t.id === 'studio')
    expect(studio.grammar.nav).toBe('default')
    expect(studio.grammar.rhythm).toBe('blocks')
    expect(studio.grammar.button).toBe('pill')
    // The block map assigns pastel panels; everything else stays white canvas.
    expect(studio.grammar.tiles.initiatives).toBe('lime')
    expect(studio.grammar.tiles['case-studies']).toBe('lilac')
    expect(studio.grammar.tiles.contact).toBe('mint')
    expect(studio.grammar.tiles.recommendations).toBe('navy')
    // Chart renders on the cool-white card inside the lilac evidence block;
    // deep teal keeps the operational palette consistent and accessible.
    expect(studio.grammar.chart.surface).toBe('#FAFAFF')
    expect(studio.grammar.chart.accent).toBe('#006959')
  })

  it('gives Paper the editorial grammar: serif display, bands, coral moments', () => {
    const paper = THEMES.find((t) => t.id === 'paper')
    expect(paper.grammar.nav).toBe('default')
    expect(paper.grammar.rhythm).toBe('bands')
    expect(paper.grammar.display).toBe('serif')
    // The surface map carries the signature moments: dark product chrome for
    // the case studies, the coral callout at Contact, the dark closing footer.
    expect(paper.grammar.tiles['case-studies']).toBe('dark')
    expect(paper.grammar.tiles.contact).toBe('coral')
    expect(paper.grammar.tiles.footer).toBe('dark')
    // Chart renders inside the dark navy card with the validated coral accent.
    expect(paper.grammar.chart.surface).toBe('#181715')
    expect(paper.grammar.chart.accent).toBe('#D3754E')
  })

  it('gives Cupertino the Apple grammar with a dark-tile chart palette', () => {
    const cupertino = THEMES.find((t) => t.id === 'cupertino')
    expect(cupertino.grammar.nav).toBe('global-bar')
    expect(cupertino.grammar.rhythm).toBe('tiles')
    expect(cupertino.grammar.button).toBe('pill')
    // Case studies sit on the near-black tile, so the chart uses the sky-blue
    // dark-surface accent (#2997FF on #272729 — validated), not Action Blue.
    expect(cupertino.grammar.chart.surface).toBe('#272729')
    expect(cupertino.grammar.chart.accent).toBe('#2997FF')
    // Every tile surface used by the section map is one of the three grammars.
    Object.values(cupertino.grammar.tiles).forEach((s) =>
      expect(['light', 'parchment', 'dark']).toContain(s)
    )
  })

  it('gives every theme a label and a complete grammar', () => {
    THEMES.forEach((t) => {
      expect(t.label).toBeTruthy()
      GRAMMAR_KEYS.forEach((k) => expect(t.grammar[k], `${t.id}.${k}`).toBeTruthy())
      CHART_KEYS.forEach((k) =>
        expect(t.grammar.chart[k], `${t.id}.chart.${k}`).toMatch(/^#[0-9A-Fa-f]{6}$/)
      )
      // The approach section's living surface: a color per slider detent.
      ;['pm', 'mid', 'eng'].forEach((k) =>
        expect(t.grammar.approach[k], `${t.id}.approach.${k}`).toMatch(/^#[0-9A-Fa-f]{6}$/)
      )
    })
  })
})

describe('theme tokens in index.css', () => {
  const css = readFileSync(resolve(__dirname, '../index.css'), 'utf-8')
  const varsIn = (block) => [...block.matchAll(/--(?:color|font|radius|tracking)-[\w-]+(?=\s*:)/g)].map((m) => m[0])

  it('defines full color overrides for every non-default theme', () => {
    const root = css.match(/:root\s*{([^}]+)}/)[1]
    const rootColorVars = varsIn(root).filter((v) => v.startsWith('--color'))
    expect(rootColorVars.length).toBeGreaterThanOrEqual(6)
    ;['midnight', 'cupertino', 'paper', 'studio', 'quiet', 'order', 'throughput', 'signal', 'atrium'].forEach((theme) => {
      const block = css.match(new RegExp(`\\[data-theme='${theme}'\\]\\s*{([^}]+)}`))[1]
      rootColorVars.forEach((v) => expect(varsIn(block), `${theme} missing ${v}`).toContain(v))
    })
  })

  it('re-establishes inherited text color inside every surface scope', () => {
    // Text without its own text-* class inherits the color computed at <body>,
    // which uses the ROOT ink — dark-on-dark inside dark surfaces. The rule is
    // theme-generic: any [data-surface] restarts inheritance with its own ink.
    expect(css).toMatch(/^\[data-surface\]\s*{[^}]*color:\s*rgb\(var\(--color-ink\)\)/m)
  })

  it('declares Studio block scopes, including the inverse navy block', () => {
    ;['lime', 'lilac', 'cream', 'mint'].forEach((block) => {
      expect(css).toMatch(
        new RegExp(`\\[data-theme='studio'\\] \\[data-surface='${block}'\\][^{]*{[^}]*--color-canvas`)
      )
    })
    expect(css).toMatch(/\[data-theme='studio'\] \[data-surface='navy'\][^{]*{[^}]*--color-ink/)
  })

  it('declares Paper surface scopes for its dark and coral moments', () => {
    expect(css).toMatch(/\[data-theme='paper'\] \[data-surface='dark'\][^{]*{[^}]*--color-ink/)
    expect(css).toMatch(/\[data-theme='paper'\] \[data-surface='coral'\][^{]*{[^}]*--color-canvas/)
  })

  it('gives Paper a serif display stack at weight 400', () => {
    const block = css.match(/\[data-theme='paper'\]\s*{([^}]+)}/)[1]
    expect(block).toMatch(/--font-display:[^;]*serif/)
    expect(css).toMatch(/\[data-theme='paper'\] \.font-display\s*{[^}]*font-weight:\s*400/)
  })

  it('scopes Cupertino tile surfaces so nested tokens re-resolve', () => {
    // Dark and parchment tiles override the vars locally; every Tailwind class
    // inside re-themes with zero component changes.
    expect(css).toMatch(/\[data-theme='cupertino'\] \[data-surface='dark'\][^{]*{[^}]*--color-ink/)
    expect(css).toMatch(
      /\[data-theme='cupertino'\] \[data-surface='parchment'\][^{]*{[^}]*--color-canvas/
    )
  })

  it('gives Cupertino the pill button radius', () => {
    const block = css.match(/\[data-theme='cupertino'\]\s*{([^}]+)}/)[1]
    expect(block).toMatch(/--radius-button:\s*9999px/)
  })

  it('sets color-scheme per theme so form controls follow', () => {
    expect(css).toMatch(/\[data-theme='midnight'\][^{]*{[^}]*color-scheme:\s*dark/)
  })
})

function Probe() {
  const { theme, setTheme, grammar } = useTheme()
  return (
    <div>
      <span data-testid="current">{theme}</span>
      <span data-testid="rhythm">{grammar.rhythm}</span>
      <button onClick={() => setTheme('midnight')}>go dark</button>
    </div>
  )
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  })

  it('applies the default theme to <html> and exposes its grammar', () => {
    render(<ThemeProvider><Probe /></ThemeProvider>)
    expect(document.documentElement.dataset.theme).toBe('quiet')
    expect(screen.getByTestId('rhythm').textContent).toBe('bordered')
  })

  it('switches theme, updates the attribute, and persists the choice', () => {
    render(<ThemeProvider><Probe /></ThemeProvider>)
    act(() => screen.getByText('go dark').click())
    expect(screen.getByTestId('current').textContent).toBe('midnight')
    expect(document.documentElement.dataset.theme).toBe('midnight')
    expect(localStorage.getItem(STORAGE_KEY)).toBe('midnight')
  })

  it('restores a stored choice on mount', () => {
    localStorage.setItem(STORAGE_KEY, 'midnight')
    render(<ThemeProvider><Probe /></ThemeProvider>)
    expect(screen.getByTestId('current').textContent).toBe('midnight')
  })

  it('shows the default to everyone regardless of OS color scheme — the authored default wins', () => {
    // Deliberate: auto-switching dark-OS visitors to Midnight would mean most
    // of them never see the signature theme. They can still pick it manually.
    matchMedia.mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
    render(<ThemeProvider><Probe /></ThemeProvider>)
    expect(screen.getByTestId('current').textContent).toBe('quiet')
  })

  it('ignores an unknown stored theme rather than breaking the page', () => {
    localStorage.setItem(STORAGE_KEY, 'vaporwave')
    render(<ThemeProvider><Probe /></ThemeProvider>)
    expect(screen.getByTestId('current').textContent).toBe('quiet')
  })
})
