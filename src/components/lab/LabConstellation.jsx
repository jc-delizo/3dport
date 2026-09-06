const projects = [
  { id: 'ako', label: 'Ako may lesson plan na!', x: 18, y: 8, width: 192 },
  { id: 'oneday', label: 'OneDayOS', x: 18, y: 71, width: 192 },
  { id: 'way', label: 'The Way', x: 18, y: 134, width: 192 },
  { id: 'readwell', label: 'ReadWell', x: 450, y: 8, width: 192 },
  { id: 'stopcounter', label: 'Stopcounter', x: 450, y: 71, width: 192 },
  {
    id: 'ai-delivery',
    label: 'AI Delivery Platform',
    x: 450,
    y: 134,
    width: 192,
    professional: true,
  },
]

export function LabConstellation() {
  return (
    <div
      role="img"
      aria-label="Six project signals, including the AI Delivery Platform, connected to the Personal Lab."
      className="lab-constellation relative isolate min-h-[19rem] overflow-hidden rounded-card border border-hairline bg-card sm:h-56 sm:min-h-0"
    >
      <div className="lab-constellation-grid absolute inset-0" aria-hidden="true" />
      <div className="absolute left-5 top-4 z-10 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
        <span className="sm:hidden">Project map</span>
        <span className="hidden sm:inline">Project constellation</span>
      </div>
      <div className="absolute right-5 top-4 z-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
        <span className="lab-constellation-live h-1.5 w-1.5 rounded-full bg-accent" />
        06 signals mapped
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-2 px-3 pb-3 pt-14 sm:hidden">
        <div className="col-span-2 mx-auto mb-2 rounded-xl bg-ink px-5 py-3 text-center text-canvas">
          <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.12em]">
            Project map / 06
          </span>
          <span className="mt-0.5 block font-mono text-[7px] uppercase tracking-[0.2em] opacity-60">
            Builds
          </span>
        </div>
        {projects.map((project) => (
          <div
            key={project.id}
            className={`flex min-h-12 items-center gap-1.5 rounded-lg border bg-card px-2 font-mono text-[8px] font-semibold ${
              project.professional
                ? 'border-dashed border-accent text-accent'
                : 'border-hairline text-ink'
            }`}
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span className="whitespace-nowrap">{project.label}</span>
          </div>
        ))}
      </div>

      <svg
        aria-hidden="true"
        className="absolute inset-x-0 bottom-1 hidden h-[160px] w-full sm:block"
        viewBox="0 0 660 176"
        preserveAspectRatio="xMidYMid meet"
      >
        <g className="lab-constellation-links">
          <path d="M270 75C244 73 238 25 210 25" />
          <path d="M270 88H210" />
          <path d="M270 101C244 103 238 151 210 151" />
          <path d="M390 75C416 73 422 25 450 25" />
          <path d="M390 88H450" />
          <path d="M390 101C416 103 422 151 450 151" />
        </g>

        <g className="lab-constellation-core">
          <rect x="270" y="59" width="120" height="58" rx="16" />
          <circle cx="330" cy="74" r="4" />
          <text x="330" y="93" textAnchor="middle">MAP / 06</text>
          <text className="lab-constellation-core-note" x="330" y="108" textAnchor="middle">
            BUILDS
          </text>
        </g>

        {projects.map((project, index) => (
          <g
            key={project.id}
            className={`lab-constellation-project ${
              project.professional ? 'lab-constellation-project-professional' : ''
            }`}
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
