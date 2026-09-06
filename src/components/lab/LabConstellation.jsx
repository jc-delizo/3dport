const projects = [
  { id: 'ako', label: 'Ako', x: 22, y: 25, width: 98 },
  { id: 'way', label: 'The Way', x: 18, y: 116, width: 112 },
  { id: 'oneday', label: 'OneDayOS', x: 154, y: 136, width: 126 },
  { id: 'readwell', label: 'ReadWell', x: 502, y: 25, width: 120 },
  { id: 'stopcounter', label: 'Stopcounter', x: 492, y: 116, width: 150 },
]

export function LabConstellation() {
  return (
    <div
      role="img"
      aria-label="Five project signals connected to the Personal Lab."
      className="lab-constellation relative isolate h-44 overflow-hidden rounded-card border border-hairline bg-card"
    >
      <div className="lab-constellation-grid absolute inset-0" aria-hidden="true" />
      <div className="absolute left-5 top-4 z-10 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
        <span className="sm:hidden">Project map</span>
        <span className="hidden sm:inline">Project constellation</span>
      </div>
      <div className="absolute right-5 top-4 z-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
        <span className="lab-constellation-live h-1.5 w-1.5 rounded-full bg-accent" />
        05 signals online
      </div>

      <svg
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[148px] w-full"
        viewBox="0 0 660 176"
        preserveAspectRatio="xMidYMid meet"
      >
        <g className="lab-constellation-links">
          <path d="M290 80C232 75 194 47 120 42" />
          <path d="M290 108C230 116 198 130 130 133" />
          <path d="M326 124C318 144 302 151 280 153" />
          <path d="M390 80C438 72 462 46 502 42" />
          <path d="M390 108C444 114 458 132 492 133" />
        </g>

        <g className="lab-constellation-core">
          <rect x="290" y="60" width="100" height="66" rx="20" />
          <circle cx="340" cy="78" r="4" />
          <text x="340" y="101" textAnchor="middle">LAB / 05</text>
          <text className="lab-constellation-core-note" x="340" y="116" textAnchor="middle">
            BUILDS
          </text>
        </g>

        {projects.map((project, index) => (
          <g
            key={project.id}
            className="lab-constellation-project"
            style={{ '--signal-delay': `${index * 180}ms` }}
          >
            <rect x={project.x} y={project.y} width={project.width} height="34" rx="11" />
            <circle cx={project.x + 15} cy={project.y + 17} r="3.5" />
            <text x={project.x + 27} y={project.y + 21}>{project.label}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}
