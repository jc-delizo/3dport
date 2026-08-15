# Theme System, Nav Restructure & Craft Package — Design

**Date:** 2026-08-15 · **Status:** Approved in chat (this session) · **Scope:** 4 milestones

## Goal

Make the portfolio feel unmistakably built by someone who ships software, while
staying recruiter-clean. Three workstreams:

1. **Nav restructure** — 9 flat items → grouped dropdowns.
2. **Craft package** — command palette, mono accents, animated counters,
   build-stats footer, console easter egg.
3. **Full-personality theme system** — five themes. Switching themes changes the
   *experience* (surface rhythm, typography voice, nav anatomy, button geometry,
   section treatment), not just colors. Explicit user requirement: "I want to
   feel that I use apple, claude, figma."

Plus: **inline text disclosures** replace the bordered See more/See less buttons.

## Non-goals

- No content changes (site.js data stays the single source of truth).
- No per-theme codebases — one component tree consulting a theme "grammar".
- No brand names in the public UI (themes are homages: Cupertino/Paper/Studio).
- ElevenLabs theme: explicitly skipped (overlaps Paper + Cupertino).

## Architecture

### Tokens
Tailwind color/font/radius values become CSS custom properties defined on
`:root` (Daylight) and overridden per `[data-theme="…"]` block in `index.css`.
Tailwind config references `var(--color-*)` so every existing utility class
re-themes for free. `color-scheme` is set per theme.

Token set: `--color-canvas, -ink, -muted, -hairline, -card, -accent,
-accent-contrast` + `--font-display, --font-body, --radius-card, --radius-button,
--tracking-display`.

### ThemeProvider & grammar
`src/theme/ThemeContext.jsx` — React context providing `{ theme, setTheme,
grammar }`. Sets `data-theme` on `<html>`; persists to
`localStorage['3dport-theme']`; default = `daylight`, or `midnight` when
`prefers-color-scheme: dark` and no stored choice.

`src/theme/themes.js` — registry. Each theme: `{ id, label, grammar }` where
grammar is a small enum object components branch on:

```js
{
  nav: 'default' | 'global-bar' | 'marquee',
  rhythm: 'bordered' | 'tiles' | 'blocks',
  button: 'rounded' | 'pill',
  display: 'sans' | 'sans-tight' | 'serif',
  chart: { accent, surface, grid, textMuted, textStrong } // validated per theme
}
```

### Themes

| id | label | feel | milestone |
|---|---|---|---|
| daylight | Daylight | current design (default) | M1 |
| midnight | Midnight | true dark counterpart of Daylight | M1 |
| cupertino | Cupertino | Apple: black 44px global bar + frosted sub-bar with pill Résumé CTA; full-bleed alternating tiles (white/#f5f5f7/#272729); centered tight-tracked headlines; blue #0066cc pills; scale(0.95) press; case studies on dark tiles | M2 |
| paper | Paper | Claude: cream #faf9f5 canvas; EB Garamond display 400 w/ negative tracking; coral #cc785c CTAs (8px radius); cream feature cards #efe9de; case studies + chart as dark #181715 "product chrome" cards; coral callout band before Contact; dark footer | M3 |
| studio | Studio | Figma: monochrome chrome, black pill CTAs, black marquee strip under nav (mono caps domains); pastel color-block sections (lime Initiatives, lilac Case Studies, cream Principles, mint Contact) with 24px radius, white canvas between; mono uppercase eyebrows | M4 |

Midnight palette (validated with the dataviz palette validator before shipping):
canvas #09090B · card #111113 · ink #FAFAFA · muted #A1A1AA · hairline #27272A ·
accent #3B82F6. Chart colors come from `grammar.chart`, not hard-coded hexes.

### Navigation (M1)

`site.nav` becomes a mixed array of links and groups:

```js
[
  { label: 'Projects', items: [initiatives, portfolio→'Delivery Portfolio', principles] },
  { id: 'case-studies', label: 'Case Studies' },
  { label: 'Experience', items: [experience→'Work History', capabilities, tools, certifications] },
  { id: 'contact', label: 'Contact' },
]
```

Desktop: click-to-open dropdowns, `aria-expanded`/`aria-haspopup`, Escape
closes, click-outside closes, focus returns to trigger. Mobile: groups render as
headed link lists in the existing panel. Right cluster: theme switcher
(dropdown, same a11y pattern), ⌘K hint button, Résumé download button.
Page section order already matches — no reordering.

### Inline disclosures (M1)

`SeeMoreToggle` is replaced by `InlineDisclosure` (text-styled `<button>`,
`aria-expanded`, no border chrome):

- **Initiatives / Case Studies** (text truncation): collapsed paragraph ends
  `… more` inline in accent color; expanded content ends with inline `less`.
- **Certifications / Experience** (list truncation): quiet text link naming the
  hidden count — `+ 13 more certifications` / `+ 3 earlier roles`; expanded
  shows `show less`.

### Craft package (M1)

- ~~Command palette~~ — built, then **removed same day at JC's request** (wrong
  audience: recruiters don't reach for ⌘K). The portfolio-entry slug anchors it
  introduced remain, as does the shipped-and-kept rest of this list. A
  replacement signature feature is being chosen; the case-studies section also
  reverted from inline disclosure to the bordered SeeMoreToggle (stat tiles sit
  between summary and hidden content, so inline "… more" mis-attaches).
- **Mono accents**: Geist Mono (@fontsource) on eyebrow labels, timeline dates,
  nav ⌘K hint, footer build line.
- **Animated counters**: ProofBar values count up on first scroll-in
  (IntersectionObserver); instant under `prefers-reduced-motion`.
- **Build-stats footer**: `__BUILD_INFO__` injected by vite.config define —
  short git sha, build date, test count (counted from `it(` occurrences in
  test files at config load). Rendered mono, muted.
- **Console easter egg**: styled `console.log` in `main.jsx`.

## Testing

TDD throughout, matching repo conventions:

- theme: provider sets `data-theme` + persists; registry entries complete;
  Midnight tokens defined for every token name Daylight defines.
- nav: groups render as dropdown triggers with correct aria; Escape/outside
  click close; every section link present (desktop + mobile).
- disclosures: inline "… more"/"less" behavior per section; count-labeled links
  for lists; aria-expanded preserved.
- palette: opens on keydown, filters, Enter navigates (scrollIntoView mocked),
  actions fire.
- counters: reduced-motion renders final values immediately.
- Existing suite (97 tests) stays green throughout; chart reads grammar colors.

## Milestones

- **M1 (this pass):** tokens, ThemeProvider, Midnight, switcher, nav
  restructure, inline disclosures, craft package. Site shippable after.
- **M2:** Cupertino (tiles rhythm, global-bar nav, pills, dark-tile chart).
- **M3:** Paper (serif display via EB Garamond, cream/coral/dark-chrome cards,
  coral callout band, dark footer).
- **M4:** Studio (marquee nav, pastel color-blocks, mono taxonomy).

Each homage theme lands with: grammar wiring, per-theme chart palette validated
via the dataviz validator, browser screenshot review, and suite green.

## Risks

- Tailwind `theme()`-in-CSS references must resolve to vars, not literals —
  verify focus ring + body classes after tokenization.
- SVG presentation attributes don't support `var()`; chart colors move to
  `style` props fed from `grammar.chart`.
- Command palette keyboard handling must not swallow `/` while user types in a
  future input (guard on event target).
- Homage themes must never name the inspiring brands in UI or public content.
