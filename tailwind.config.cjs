/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#FFFFFF',
        ink: '#09090B',
        muted: '#52525B',
        hairline: '#E4E4E7',
        card: '#FAFAFA',
        accent: '#2563EB',
      },
      fontFamily: {
        sans: ['"Geist Sans"', 'Inter', 'system-ui', 'sans-serif'],
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
