// Blueprint line-art glyph library for the Backdrop layer. Every glyph is
// stroke-only line art on a 64×64 grid: fill="none" stroke="currentColor" so
// each theme tints it through --color-ink, and every drawable element carries
// pathLength="1" so the GSAP draw-in can animate stroke-dashoffset 1→0 without
// ever measuring geometry (see Backdrop.jsx; the matching stroke-dasharray: 1
// lives in index.css so a no-JS render still shows solid strokes).
const P = { pathLength: 1 }

function Glyph({ children, ...rest }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className="block h-auto w-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const GLYPHS = {
  ruler: () => (
    <Glyph>
      <rect x="4" y="26" width="56" height="14" rx="2" {...P} />
      <line x1="12" y1="26" x2="12" y2="33" {...P} />
      <line x1="20" y1="26" x2="20" y2="36" {...P} />
      <line x1="28" y1="26" x2="28" y2="33" {...P} />
      <line x1="36" y1="26" x2="36" y2="36" {...P} />
      <line x1="44" y1="26" x2="44" y2="33" {...P} />
      <line x1="52" y1="26" x2="52" y2="36" {...P} />
    </Glyph>
  ),
  folder: () => (
    <Glyph>
      <path d="M6 18v-4a3 3 0 0 1 3-3h13l5 6h28a3 3 0 0 1 3 3v30a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V18Z" {...P} />
      <path d="M6 24h52" {...P} />
    </Glyph>
  ),
  setSquare: () => (
    <Glyph>
      <path d="M8 56 56 8v48H8Z" {...P} />
      <path d="M24 48 44 28v20H24Z" {...P} />
      <line x1="14" y1="53" x2="17" y2="50" {...P} />
      <line x1="22" y1="53" x2="25" y2="50" {...P} />
      <line x1="30" y1="53" x2="33" y2="50" {...P} />
    </Glyph>
  ),
  compass: () => (
    <Glyph>
      <circle cx="32" cy="10" r="4" {...P} />
      <path d="M29 13 14 54" {...P} />
      <path d="M35 13 50 54" {...P} />
      <path d="M18 42a26 26 0 0 0 28 0" {...P} />
      <line x1="12" y1="58" x2="16" y2="50" {...P} />
    </Glyph>
  ),
  pencil: () => (
    <Glyph>
      <path d="M14 50 44 10l8 8-30 40-11 3 3-11Z" {...P} />
      <path d="M40 15l8 8" {...P} />
      <path d="M14 50l8 8" {...P} />
    </Glyph>
  ),
  paperclip: () => (
    <Glyph>
      <path d="M42 16 22 36a8 8 0 0 0 11 11l20-20a13 13 0 0 0-18-18L15 29a18 18 0 0 0 25 25l16-15" {...P} />
    </Glyph>
  ),
  stickyNote: () => (
    <Glyph>
      <path d="M10 10h44v30L40 54H10V10Z" {...P} />
      <path d="M54 40H40v14" {...P} />
      <line x1="18" y1="24" x2="46" y2="24" {...P} />
      <line x1="18" y1="33" x2="38" y2="33" {...P} />
    </Glyph>
  ),
  clipboard: () => (
    <Glyph>
      <rect x="12" y="10" width="40" height="46" rx="3" {...P} />
      <path d="M24 10a8 8 0 0 1 16 0" {...P} />
      <rect x="24" y="6" width="16" height="8" rx="2" {...P} />
      <path d="m20 30 4 4 7-8" {...P} />
      <line x1="36" y1="31" x2="46" y2="31" {...P} />
      <path d="m20 44 4 4 7-8" {...P} />
      <line x1="36" y1="45" x2="46" y2="45" {...P} />
    </Glyph>
  ),
  gantt: () => (
    <Glyph>
      <path d="M10 8v48h46" {...P} />
      <rect x="14" y="14" width="24" height="8" rx="2" {...P} />
      <rect x="24" y="28" width="28" height="8" rx="2" {...P} />
      <rect x="34" y="42" width="20" height="8" rx="2" {...P} />
    </Glyph>
  ),
  cycle: () => (
    <Glyph>
      <path d="M14 26a20 20 0 0 1 36-6" {...P} />
      <path d="m50 8 1 13-13-1" {...P} />
      <path d="M50 38a20 20 0 0 1-36 6" {...P} />
      <path d="m14 56-1-13 13 1" {...P} />
    </Glyph>
  ),
  calendar: () => (
    <Glyph>
      <rect x="8" y="12" width="48" height="44" rx="3" {...P} />
      <line x1="8" y1="24" x2="56" y2="24" {...P} />
      <line x1="20" y1="6" x2="20" y2="16" {...P} />
      <line x1="44" y1="6" x2="44" y2="16" {...P} />
      <line x1="18" y1="34" x2="24" y2="34" {...P} />
      <line x1="29" y1="34" x2="35" y2="34" {...P} />
      <line x1="40" y1="34" x2="46" y2="34" {...P} />
      <line x1="18" y1="44" x2="24" y2="44" {...P} />
      <line x1="29" y1="44" x2="35" y2="44" {...P} />
    </Glyph>
  ),
  quote: () => (
    <Glyph>
      <path d="M14 38a10 10 0 0 1 10-10v-8A18 18 0 0 0 6 38v14h18V38H14Z" {...P} />
      <path d="M44 38a10 10 0 0 1 10-10v-8a18 18 0 0 0-18 18v14h18V38H44Z" {...P} />
    </Glyph>
  ),
  ribbon: () => (
    <Glyph>
      <circle cx="32" cy="24" r="16" {...P} />
      <circle cx="32" cy="24" r="9" {...P} />
      <path d="m24 37-6 21 14-8 14 8-6-21" {...P} />
    </Glyph>
  ),
  envelope: () => (
    <Glyph>
      <rect x="6" y="14" width="52" height="36" rx="3" {...P} />
      <path d="m6 18 26 20 26-20" {...P} />
    </Glyph>
  ),
  plane: () => (
    <Glyph>
      <path d="M58 8 6 30l16 6 4 16 8-12 16 8 8-40Z" {...P} />
      <path d="M58 8 22 36" {...P} />
    </Glyph>
  ),
  frame: () => (
    <Glyph>
      <rect x="10" y="8" width="44" height="48" rx="3" {...P} />
      <circle cx="32" cy="26" r="8" {...P} />
      <path d="M18 50a14 14 0 0 1 28 0" {...P} />
    </Glyph>
  ),
  magnifier: () => (
    <Glyph>
      <circle cx="27" cy="27" r="17" {...P} />
      <line x1="40" y1="40" x2="56" y2="56" {...P} />
      <path d="M18 26a9 9 0 0 1 8-8" {...P} />
    </Glyph>
  ),
  grid: () => (
    <Glyph>
      <rect x="8" y="8" width="20" height="20" rx="3" {...P} />
      <rect x="36" y="8" width="20" height="20" rx="3" {...P} />
      <rect x="8" y="36" width="20" height="20" rx="3" {...P} />
      <rect x="36" y="36" width="20" height="20" rx="3" {...P} />
    </Glyph>
  ),
}
