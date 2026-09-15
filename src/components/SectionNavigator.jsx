import { useEffect, useState } from 'react'

// Floating left-rail section map — the page's outline, where documents keep
// theirs; a quiet "system interface" layer that lets
// a visitor read the whole page structure in a glance and jump anywhere.
// Real anchors (native smooth scroll, already reduced-motion aware via the
// global scroll-behavior rules); IntersectionObserver drives the active state.
//
// The trail always shows its labels (JC, 2026-09-15: numbers alone read as
// unexplained). What scales with the gutter is the type:
//   >=1520px  compact — 9px, tight tracking, left-3: ~117px total, inside the
//             ~144px gutter of a scaled 15.6" laptop (1536px viewport).
//   >=1680px  full size. Below 1520px the Portfolio nav dropdown carries
//             navigation and the trail stands down.
export const SECTIONS = [
  { id: 'top', label: 'Home' },
  { id: 'initiatives', label: 'Initiatives' },
  { id: 'case-studies', label: 'Case Studies' },
  { id: 'experience', label: 'Experience' },
  { id: 'lifecycle', label: 'Lifecycle' },
  { id: 'portfolio', label: 'Projects' },
  { id: 'principles', label: 'Principles' },
  { id: 'recommendations', label: 'References' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'tools', label: 'Tools' },
  { id: 'lab', label: 'Lab' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

export function SectionNavigator() {
  const [active, setActive] = useState(null)

  // Active tracking: a narrow band across the upper-middle of the viewport;
  // whichever section occupies it is "where you are". The band (not a 0.5
  // threshold) keeps tall sections active while you read them and stops the
  // state flickering at boundaries.
  useEffect(() => {
    const byElement = new Map()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = byElement.get(entry.target)
          if (entry.isIntersecting && id) setActive(id)
        })
      },
      { rootMargin: '-35% 0px -55% 0px' }
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)?.closest('section')
      if (el) {
        byElement.set(el, id)
        io.observe(el)
      }
    })
    return () => io.disconnect()
  }, [])

  return (
    <nav
      aria-label="Section shortcuts"
      className="fixed left-3 top-1/2 z-20 hidden -translate-y-1/2 min-[1520px]:block min-[1680px]:left-5 2xl:left-7"
    >
      <div className="relative">
        <ol className="flex flex-col items-start gap-1.5">
          {SECTIONS.map(({ id, label }, i) => {
            const isActive = active === id
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-label={label}
                  title={label}
                  aria-current={isActive ? 'true' : undefined}
                  className={`flex items-baseline gap-2 py-0.5 font-mono text-[9px] leading-5 tracking-[0.06em] min-[1680px]:text-label min-[1680px]:tracking-widest uppercase transition-[opacity,transform,color] duration-200 ease-out hover:translate-x-1 hover:text-ink hover:opacity-100 focus-visible:translate-x-1 focus-visible:text-ink focus-visible:opacity-100 ${
                    isActive
                      ? 'translate-x-1 text-ink opacity-100'
                      : 'text-muted opacity-55'
                  }`}
                >
                  <span className={isActive ? 'text-accent' : 'opacity-60'}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`section-rail-label whitespace-nowrap border-b pb-0.5 transition-[border-color] duration-200 ${
                      isActive ? 'border-accent font-semibold' : 'border-transparent'
                    }`}
                  >
                    {label}
                  </span>
                </a>
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
