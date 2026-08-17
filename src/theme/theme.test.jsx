import { describe, it, expect, beforeEach, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen, act } from '@testing-library/react'
import { THEMES, DEFAULT_THEME } from './themes'
import { ThemeProvider, useTheme } from './ThemeContext'

const GRAMMAR_KEYS = ['nav', 'rhythm', 'button', 'display', 'chart', 'approach']
const CHART_KEYS = ['accent', 'surface', 'grid', 'textMuted', 'textStrong']

describe('theme registry', () => {
  it('ships all five themes, Studio as the brand default', () => {
    expect(THEMES.map((t) => t.id)).toEqual([
      'daylight',
      'midnight',
      'cupertino',
      'paper',
      'studio',
    ])
    expect(DEFAULT_THEME).toBe('studio')
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
    // Chart renders on the white card inside the lilac block, in the validated
    // orange — the only saturated accent in an otherwise monochrome system.
    expect(studio.grammar.chart.surface).toBe('#FFFFFF')
    expect(studio.grammar.chart.accent).toBe('#F24E1E')
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
    ;['midnight', 'cupertino', 'paper', 'studio'].forEach((theme) => {
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
    expect(document.documentElement.dataset.theme).toBe('studio')
    expect(screen.getByTestId('rhythm').textContent).toBe('blocks')
  })

  it('switches theme, updates the attribute, and persists the choice', () => {
    render(<ThemeProvider><Probe /></ThemeProvider>)
    act(() => screen.getByText('go dark').click())
    expect(screen.getByTestId('current').textContent).toBe('midnight')
    expect(document.documentElement.dataset.theme).toBe('midnight')
    expect(localStorage.getItem('3dport-theme')).toBe('midnight')
  })

  it('restores a stored choice on mount', () => {
    localStorage.setItem('3dport-theme', 'midnight')
    render(<ThemeProvider><Probe /></ThemeProvider>)
    expect(screen.getByTestId('current').textContent).toBe('midnight')
  })

  it('shows Studio to everyone regardless of OS color scheme — the brand default wins', () => {
    // Deliberate: auto-switching dark-OS visitors to Midnight would mean most
    // of them never see the signature theme. They can still pick it manually.
    matchMedia.mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
    render(<ThemeProvider><Probe /></ThemeProvider>)
    expect(screen.getByTestId('current').textContent).toBe('studio')
  })

  it('ignores an unknown stored theme rather than breaking the page', () => {
    localStorage.setItem('3dport-theme', 'vaporwave')
    render(<ThemeProvider><Probe /></ThemeProvider>)
    expect(screen.getByTestId('current').textContent).toBe('studio')
  })
})
