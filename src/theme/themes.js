// Theme registry. A theme is tokens (CSS variables in index.css, keyed by
// data-theme) plus a "grammar" — the structural personality components consult:
//   nav:     'default' | 'global-bar'
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
        lab: 'dark',
        'professional-work': 'parchment',
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
        'professional-work': 'dark',
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
      nav: 'default',
      rhythm: 'blocks',
      button: 'pill',
      display: 'sans',
      // Oversized pastel color-block panels on a monochrome chrome; the page
      // returns to white canvas between every two blocks. Navy is the one
      // inverse story block.
      tiles: {
        hero: 'navy',
        initiatives: 'lime',
        'case-studies': 'lilac',
        portfolio: 'sky',
        principles: 'cream',
        recommendations: 'navy',
        capabilities: 'peach',
        lab: 'mint',
        'professional-work': 'cream',
        contact: 'mint',
      },
      chart: {
        accent: '#006959',
        surface: '#FAFAFF',
        grid: '#C2C3D9',
        textMuted: '#4F5B5B',
        textStrong: '#0F191B',
      },
      // The approach slider's living surface — one color per detent, blended
      // continuously between them as the slider moves.
      approach: { pm: '#DCECEF', mid: '#F1E8CF', eng: '#DDEFCB' },
    },
  },
  {
    id: 'quiet',
    label: 'Quiet',
    grammar: {
      nav: 'default',
      rhythm: 'bordered',
      button: 'rounded',
      display: 'sans-tight',
      // Bordered sections stay flat; only the full-screen readers receive a
      // soft neutral backdrop so their white reading sheet has clear depth.
      tiles: {
        initiatives: 'soft',
        'case-studies': 'soft',
      },
      chart: {
        accent: '#355E52',
        surface: '#FFFFFD',
        grid: '#DADFDA',
        textMuted: '#626762',
        textStrong: '#1C1F1D',
      },
      approach: { pm: '#EDF2EF', mid: '#F3F0E8', eng: '#E8F0EC' },
    },
  },
]

// Quiet is the deliberate first impression: restrained, legible, and focused
// on evidence. The other visual systems remain available in the theme menu.
export const DEFAULT_THEME = 'quiet'

export const themeById = (id) => THEMES.find((t) => t.id === id)
