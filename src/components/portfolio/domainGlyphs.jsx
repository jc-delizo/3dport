// Domain marks for the delivery portfolio — one per category, every entry
// covered, zero confidentiality risk (decision-log 2026-09-15: chosen over
// real app logos, which would have broken the site's anonymization promise
// and left most entries bare). Same line-art language as the backdrop
// library: 64×64 grid, stroke-only, currentColor — but no pathLength, since
// these render statically and must not inherit the backdrop's draw-in dash.
function Mark({ children, ...rest }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className="block h-full w-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

// Keys must match site.portfolio.groups[].group exactly — a coverage test
// fails when a category is added without a mark.
export const DOMAIN_GLYPHS = {
  'ERP & HR Platforms': () => (
    <Mark>
      {/* org tree: one system, connected roles */}
      <rect x="24" y="8" width="16" height="12" rx="2" />
      <rect x="6" y="42" width="16" height="12" rx="2" />
      <rect x="42" y="42" width="16" height="12" rx="2" />
      <path d="M32 20v10M32 30H14v12M32 30h18v12" />
    </Mark>
  ),
  'Recruitment & Onboarding': () => (
    <Mark>
      {/* person, accepted */}
      <circle cx="26" cy="20" r="9" />
      <path d="M8 54c0-10 8-17 18-17s18 7 18 17" />
      <path d="M42 24l6 6 12-12" />
    </Mark>
  ),
  'Lending & Credit': () => (
    <Mark>
      {/* the note, with its rate */}
      <rect x="10" y="8" width="44" height="48" rx="4" />
      <circle cx="24" cy="24" r="5" />
      <circle cx="40" cy="40" r="5" />
      <path d="M42 20 22 44" />
    </Mark>
  ),
  'Collections & Recovery': () => (
    <Mark>
      {/* value coming back around */}
      <path d="M52 34a20 20 0 1 1-6-16" />
      <path d="M46 8v10H36" />
      <circle cx="32" cy="34" r="7" />
    </Mark>
  ),
  'Field & Branch Operations': () => (
    <Mark>
      {/* the route and the pin */}
      <path d="M8 54c14 0 10-16 22-16" />
      <path d="M42 8a12 12 0 0 1 12 12c0 9-12 20-12 20S30 29 30 20A12 12 0 0 1 42 8Z" />
      <circle cx="42" cy="20" r="4" />
    </Mark>
  ),
  'Finance Automation': () => (
    <Mark>
      {/* the ledger, machined */}
      <rect x="8" y="10" width="34" height="44" rx="4" />
      <path d="M15 20h20M15 30h20M15 40h12" />
      <circle cx="48" cy="44" r="9" />
      <path d="M48 35v-4M48 57v-4M39 44h-4M61 44h-4" />
    </Mark>
  ),
  'AI & Automation': () => (
    <Mark>
      {/* one node, thinking outward */}
      <circle cx="32" cy="32" r="8" />
      <path d="M38 26 50 14M38 38l12 12M26 38 14 50M26 26 14 14" />
      <circle cx="53" cy="11" r="3.5" />
      <circle cx="53" cy="53" r="3.5" />
      <circle cx="11" cy="53" r="3.5" />
      <circle cx="11" cy="11" r="3.5" />
    </Mark>
  ),
  'Data & Analytics': () => (
    <Mark>
      {/* the bars and the trend they make */}
      <path d="M12 54V38M28 54V26M44 54V32M60 54" />
      <path d="M8 54h50" />
      <path d="M10 24l18-10 16 6 12-10" />
    </Mark>
  ),
  'Internal Platforms': () => (
    <Mark>
      {/* the stack everything runs on */}
      <path d="M32 8 56 20 32 32 8 20Z" />
      <path d="M8 32l24 12 24-12" />
      <path d="M8 44l24 12 24-12" />
    </Mark>
  ),
}
