// Theme registry. A theme is tokens (CSS variables in index.css, keyed by
// data-theme) plus a "grammar" — the structural personality components consult:
//   nav:     'default' | 'global-bar' | 'marquee'
//   rhythm:  'bordered' | 'tiles' | 'blocks'
//   button:  'rounded' | 'pill'
//   display: 'sans' | 'sans-tight' | 'serif'
//   chart:   concrete hexes for the SVG chart (presentation attributes can't
//            read var(), and each set is validated with the palette validator
//            against its own surface — see the 2026-08-15 design spec).
// M2–M4 add cupertino / paper / studio here; nothing else changes.
export const THEMES = [
  {
    id: 'daylight',
    label: 'Daylight',
    grammar: {
      nav: 'default',
      rhythm: 'bordered',
      button: 'rounded',
      display: 'sans',
      chart: {
        accent: '#2563EB',
        surface: '#FFFFFF',
        grid: '#E4E4E7',
        textMuted: '#52525B',
        textStrong: '#09090B',
      },
      // The approach slider's living surface — one color per detent, blended
      // continuously between them as the slider moves.
      approach: { pm: '#E7F0FA', mid: '#FAF3DF', eng: '#E4F4ED' },
    },
  },
  {
    id: 'midnight',
    label: 'Midnight',
    grammar: {
      nav: 'default',
      rhythm: 'bordered',
      button: 'rounded',
      display: 'sans',
      chart: {
        accent: '#3B82F6',
        surface: '#09090B',
        grid: '#27272A',
        textMuted: '#A1A1AA',
        textStrong: '#FAFAFA',
      },
      // The approach slider's living surface — one color per detent, blended
      // continuously between them as the slider moves.
      approach: { pm: '#0E1A2B', mid: '#221C0E', eng: '#0F211C' },
    },
  },
  {
    id: 'cupertino',
    label: 'Cupertino',
    grammar: {
      nav: 'global-bar',
      rhythm: 'tiles',
      button: 'pill',
      display: 'sans-tight',
      // Which tile each section sits on — the surface change IS the divider.
      // data-surface scoping in index.css re-resolves all color tokens inside.
      tiles: {
        hero: 'light',
        proof: 'parchment',
        initiatives: 'light',
        'case-studies': 'dark',
        portfolio: 'light',
        principles: 'parchment',
        experience: 'light',
        recommendations: 'dark',
        capabilities: 'light',
        tools: 'parchment',
        certifications: 'light',
        about: 'parchment',
        contact: 'dark',
        footer: 'parchment',
      },
      chart: {
        // The chart lives in Case Studies, which sits on the dark tile — so the
        // sky-blue dark-surface accent, not Action Blue (both validated).
        accent: '#2997FF',
        surface: '#272729',
        grid: '#424245',
        textMuted: '#CCCCCE',
        textStrong: '#FFFFFF',
      },
      // The approach slider's living surface — one color per detent, blended
      // continuously between them as the slider moves.
      approach: { pm: '#EAF2FB', mid: '#F7F0DF', eng: '#E9F4EF' },
    },
  },
  {
    id: 'paper',
    label: 'Paper',
    grammar: {
      nav: 'default',
      rhythm: 'bands',
      button: 'rounded',
      display: 'serif',
      // Bands flow on the cream canvas; the map marks only the signature
      // moments — dark product chrome, the coral callout, the dark close.
      tiles: {
        'case-studies': 'dark',
        contact: 'coral',
        footer: 'dark',
      },
      chart: {
        // Inside the dark navy "product chrome" card. #D3754E is the coral step
        // that passes the dark-mode mark band on #181715 — the same accent the
        // dark surface scope uses, so UI and marks stay one hue.
        accent: '#D3754E',
        surface: '#181715',
        grid: '#3A3835',
        textMuted: '#A09D96',
        textStrong: '#FAF9F5',
      },
      // The approach slider's living surface — one color per detent, blended
      // continuously between them as the slider moves.
      approach: { pm: '#EBEDF5', mid: '#F5EBD7', eng: '#E7EFE7' },
    },
  },
  {
    id: 'studio',
    label: 'Studio',
    grammar: {
      nav: 'marquee',
      rhythm: 'blocks',
      button: 'pill',
      display: 'sans',
      // Oversized pastel color-block panels on a monochrome chrome; the page
      // returns to white canvas between every two blocks. Navy is the one
      // inverse story block.
      tiles: {
        initiatives: 'lime',
        'case-studies': 'lilac',
        principles: 'cream',
        recommendations: 'navy',
        contact: 'mint',
      },
      chart: {
        // The chart's card stays white inside the lilac block; the logo-orange
        // accent is the single saturated color in the monochrome system
        // (validated ≥3:1 on white).
        accent: '#F24E1E',
        surface: '#FFFFFF',
        grid: '#E5E5E5',
        textMuted: '#404040',
        textStrong: '#0D0D0D',
      },
      // The approach slider's living surface — one color per detent, blended
      // continuously between them as the slider moves.
      approach: { pm: '#D8E9F8', mid: '#F8EAC2', eng: '#CDEFE3' },
    },
  },
]

// Studio is the brand default — JC's pick after seeing all five. Every visitor
// gets it regardless of OS color scheme; the theme menu carries the rest.
export const DEFAULT_THEME = 'studio'

export const themeById = (id) => THEMES.find((t) => t.id === id)
