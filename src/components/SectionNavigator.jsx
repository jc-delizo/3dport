import { useEffect, useRef, useState } from 'react'

// Floating right-rail section map — a quiet "system interface" layer that lets
// a recruiter read the whole page structure in a glance and jump anywhere.
// Real anchors (native smooth scroll, already reduced-motion aware via the
// global scroll-behavior rules); IntersectionObserver drives the active state;
// a single indicator dash travels between items instead of blinking on/off.
//
// Shown only where it has clean air: content is 72rem wide, so below ~1450px
// the rail would overlap it — there the existing menus carry navigation.
export const SECTIONS = [
  { id: 'top', label: 'Home' },
  { id: 'approach', label: 'Approach' },
  { id: 'initiatives', label: 'Initiatives' },
  { id: 'case-studies', label: 'Case Studies' },
  { id: 'portfolio', label: 'Projects' },
  { id: 'principles', label: 'Principles' },
  { id: 'experience', label: 'Experience' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'tools', label: 'Tools' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

export function SectionNavigator() {
  const [active, setActive] = useState(null)
  const [indicatorTop, setIndicatorTop] = useState(null)
  const itemRefs = useRef({})

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

  // The indicator travels: its top eases to the active item's center.
  useEffect(() => {
    const el = itemRefs.current[active]
    if (el) setIndicatorTop(el.offsetTop + el.offsetHeight / 2)
  }, [active])

  return (
    <nav
      aria-label="Section shortcuts"
      className="group fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 min-[1450px]:block"
    >
      <div className="relative">
        {/* The travelling position dash. */}
        <span
          data-rail-indicator
          aria-hidden="true"
          className="absolute -left-6 h-px w-4 bg-accent transition-[top,opacity] duration-300 ease-out"
          style={{ top: indicatorTop ?? 0, opacity: indicatorTop === null ? 0 : 1 }}
        />
        <ol className="flex flex-col items-end gap-1.5">
          {SECTIONS.map(({ id, label }, i) => {
            const isActive = active === id
            return (
              <li key={id} ref={(el) => (itemRefs.current[id] = el)}>
                <a
                  href={`#${id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`flex items-baseline gap-2 py-0.5 font-mono text-[10px] uppercase tracking-widest transition-[opacity,transform,color] duration-200 ease-out hover:-translate-x-1 hover:text-ink hover:opacity-100 focus-visible:-translate-x-1 focus-visible:text-ink focus-visible:opacity-100 ${
                    isActive
                      ? 'text-ink opacity-100'
                      : 'text-muted opacity-40 group-hover:opacity-70'
                  }`}
                >
                  <span className={isActive ? 'text-accent' : 'opacity-60'}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {label}
                </a>
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
