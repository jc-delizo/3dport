/** @type {import('tailwindcss').Config} */
// Colors, fonts and radii resolve to CSS variables declared in src/index.css,
// where each [data-theme] block overrides them — that's the whole theme system
// from Tailwind's point of view.
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        hairline: 'rgb(var(--color-hairline) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'accent-contrast': 'rgb(var(--color-accent-contrast) / <alpha-value>)',
      },
      fontFamily: {
        sans: 'var(--font-body)',
        display: 'var(--font-display)',
        mono: 'var(--font-mono)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        button: 'var(--radius-button)',
      },
      letterSpacing: {
        display: 'var(--tracking-display)',
      },
      fontSize: {
        label: ['0.8125rem', { lineHeight: '1.25rem' }], // 13px
        body: ['1rem', { lineHeight: '1.65rem' }], // 16px
        'card-title': ['1.25rem', { lineHeight: '1.75rem' }], // 20px
        section: ['2rem', { lineHeight: '2.4rem' }], // 32px
        hero: ['3.5rem', { lineHeight: '3.9rem' }], // 56px
        'hero-lg': ['4rem', { lineHeight: '4.4rem' }], // 64px
      },
    },
  },
  plugins: [],
}
