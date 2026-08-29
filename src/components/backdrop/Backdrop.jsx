import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { GLYPHS } from './glyphs'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// The drafting layer: faint blueprint line-art (rulers, folders, drafting
// tools) fixed in the viewport gutters, behind the reading column. Each
// section owns a small set of objects that echo its meaning; a set sketches
// itself in (stroke draw) while its section is in view, cross-fading to the
// next set as the reader travels. Objects also drift at per-glyph depths for
// gentle parallax. Same visibility contract as the SectionNavigator: the
// layer only exists at min-[1450px], where the gutters are real.
//
// `anchor` is a SectionHeading/Section id from the app; the trigger is that
// element's enclosing <section>, so set boundaries match what the reader sees.
// `depth` scales the parallax travel (0 = pinned still, 1 = fastest).
// Left gutter only: the right gutter belongs to the SectionNavigator's section
// trail, and glyphs behind it made the labels hard to read. Sizes are
// deliberately mixed (w-10 accents through w-36 statements) so each set reads
// as scattered desk objects, not a repeated stamp. The hero has no set at all:
// its glare sweep stays the only motion on first paint.
export const BACKDROP_SETS = [
  {
    anchor: 'approach',
    mobile: { glyph: 'setSquare', className: 'right-[3%] top-[16%] w-16 rotate-6', depth: 0.25 },
    items: [
      { glyph: 'setSquare', className: 'left-[0.3%] top-[26%] w-36 rotate-6', depth: 0.3 },
      { glyph: 'ruler', className: 'left-[1.4%] top-[56%] w-24 -rotate-[24deg]', depth: 0.55 },
      { glyph: 'pencil', className: 'left-[2.4%] top-[74%] w-14 rotate-[42deg]', depth: 0.7 },
      { glyph: 'grid', className: 'left-[2.8%] top-[12%] w-12 rotate-3', depth: 0.5 },
    ],
  },
  {
    anchor: 'lifecycle',
    mobile: { glyph: 'cycle', className: 'right-[4%] top-[20%] w-14 -rotate-6', depth: 0.3 },
    items: [
      { glyph: 'cycle', className: 'left-[0.5%] top-[30%] w-32 rotate-3', depth: 0.35, accent: true },
      { glyph: 'clipboard', className: 'left-[1.8%] top-[58%] w-20 rotate-[10deg]', depth: 0.55 },
      { glyph: 'gantt', className: 'left-[0.8%] top-[12%] w-16 -rotate-6', depth: 0.7 },
      { glyph: 'paperclip', className: 'left-[3%] top-[80%] w-10 -rotate-[20deg]', depth: 0.45 },
    ],
  },
  {
    anchor: 'initiatives',
    mobile: { glyph: 'stickyNote', className: 'right-[3%] top-[14%] w-14 rotate-[10deg]', depth: 0.35 },
    items: [
      { glyph: 'stickyNote', className: 'left-[0.4%] top-[20%] w-28 -rotate-6', depth: 0.4 },
      { glyph: 'pencil', className: 'left-[2%] top-[48%] w-16 -rotate-[30deg]', depth: 0.6 },
      { glyph: 'stickyNote', className: 'left-[1.2%] top-[68%] w-14 rotate-[14deg]', depth: 0.75 },
      { glyph: 'magnifier', className: 'left-[2.6%] top-[8%] w-12 rotate-12', depth: 0.5 },
    ],
  },
  {
    anchor: 'case-studies',
    mobile: { glyph: 'magnifier', className: 'right-[5%] top-[18%] w-12 rotate-12', depth: 0.3 },
    items: [
      { glyph: 'magnifier', className: 'left-[0.5%] top-[34%] w-28 rotate-12', depth: 0.4 },
      { glyph: 'folder', className: 'left-[1.2%] top-[60%] w-32 -rotate-6', depth: 0.3 },
      { glyph: 'stickyNote', className: 'left-[2.4%] top-[14%] w-14 rotate-6', depth: 0.65 },
      { glyph: 'paperclip', className: 'left-[0.8%] top-[84%] w-10 rotate-[26deg]', depth: 0.8 },
    ],
  },
  {
    anchor: 'portfolio',
    mobile: { glyph: 'folder', className: 'right-[3%] top-[12%] w-16 -rotate-6', depth: 0.3 },
    items: [
      { glyph: 'folder', className: 'left-[0.3%] top-[16%] w-32 -rotate-[8deg]', depth: 0.3 },
      { glyph: 'folder', className: 'left-[1.6%] top-[42%] w-24 rotate-6', depth: 0.5, accent: true },
      { glyph: 'folder', className: 'left-[0.7%] top-[64%] w-16 -rotate-3', depth: 0.65 },
      { glyph: 'folder', className: 'left-[2.8%] top-[82%] w-12 rotate-[12deg]', depth: 0.8 },
      { glyph: 'paperclip', className: 'left-[3%] top-[6%] w-10 rotate-[18deg]', depth: 0.55 },
    ],
  },
  {
    anchor: 'principles',
    mobile: { glyph: 'stickyNote', className: 'right-[4%] top-[20%] w-12 rotate-6', depth: 0.35 },
    items: [
      { glyph: 'stickyNote', className: 'left-[0.4%] top-[26%] w-28 rotate-6', depth: 0.35 },
      { glyph: 'paperclip', className: 'left-[2%] top-[52%] w-14 -rotate-[20deg]', depth: 0.55 },
      { glyph: 'quote', className: 'left-[1%] top-[70%] w-16 -rotate-6', depth: 0.7 },
    ],
  },
  {
    anchor: 'experience',
    mobile: { glyph: 'calendar', className: 'right-[3%] top-[16%] w-14 -rotate-3', depth: 0.3 },
    items: [
      { glyph: 'calendar', className: 'left-[0.4%] top-[22%] w-28 -rotate-3', depth: 0.3 },
      { glyph: 'gantt', className: 'left-[1.4%] top-[50%] w-32 rotate-3', depth: 0.5 },
      { glyph: 'clipboard', className: 'left-[2.6%] top-[76%] w-14 rotate-[8deg]', depth: 0.7 },
      { glyph: 'paperclip', className: 'left-[2.8%] top-[8%] w-10 -rotate-[28deg]', depth: 0.6 },
    ],
  },
  {
    anchor: 'recommendations',
    mobile: { glyph: 'quote', className: 'right-[4%] top-[18%] w-14 rotate-3', depth: 0.35 },
    items: [
      { glyph: 'quote', className: 'left-[0.5%] top-[28%] w-32 -rotate-6', depth: 0.35, accent: true },
      { glyph: 'paperclip', className: 'left-[2.2%] top-[56%] w-12 rotate-[28deg]', depth: 0.6 },
      { glyph: 'stickyNote', className: 'left-[1%] top-[72%] w-20 rotate-[10deg]', depth: 0.5 },
    ],
  },
  {
    anchor: 'capabilities',
    mobile: { glyph: 'grid', className: 'right-[3%] top-[14%] w-12 rotate-6', depth: 0.3 },
    items: [
      { glyph: 'grid', className: 'left-[0.5%] top-[24%] w-28 rotate-3', depth: 0.35 },
      { glyph: 'setSquare', className: 'left-[1.6%] top-[52%] w-20 -rotate-12', depth: 0.55 },
      { glyph: 'compass', className: 'left-[2.4%] top-[74%] w-14 rotate-6', depth: 0.7 },
    ],
  },
  {
    anchor: 'tools',
    mobile: { glyph: 'ruler', className: 'right-[2%] top-[20%] w-16 rotate-[14deg]', depth: 0.3 },
    items: [
      { glyph: 'ruler', className: 'left-[0.2%] top-[34%] w-36 rotate-[16deg]', depth: 0.4 },
      { glyph: 'pencil', className: 'left-[2%] top-[62%] w-16 rotate-[40deg]', depth: 0.6 },
      { glyph: 'setSquare', className: 'left-[1%] top-[10%] w-16 -rotate-6', depth: 0.5 },
      { glyph: 'magnifier', className: 'left-[3%] top-[84%] w-10 -rotate-12', depth: 0.75 },
    ],
  },
  {
    anchor: 'certifications',
    mobile: { glyph: 'ribbon', className: 'right-[4%] top-[16%] w-12 -rotate-6', depth: 0.3 },
    items: [
      { glyph: 'ribbon', className: 'left-[0.6%] top-[26%] w-24 -rotate-6', depth: 0.35 },
      { glyph: 'clipboard', className: 'left-[1.8%] top-[54%] w-16 rotate-6', depth: 0.55 },
      { glyph: 'ribbon', className: 'left-[2.6%] top-[76%] w-12 rotate-[14deg]', depth: 0.7 },
    ],
  },
  {
    anchor: 'about',
    mobile: { glyph: 'frame', className: 'right-[3%] top-[18%] w-14 rotate-3', depth: 0.3 },
    items: [
      { glyph: 'frame', className: 'left-[0.5%] top-[24%] w-28 rotate-6', depth: 0.35 },
      { glyph: 'pencil', className: 'left-[2%] top-[54%] w-16 -rotate-[24deg]', depth: 0.55 },
      { glyph: 'stickyNote', className: 'left-[1.2%] top-[74%] w-14 -rotate-6', depth: 0.7 },
    ],
  },
  {
    anchor: 'contact',
    mobile: { glyph: 'plane', className: 'right-[4%] top-[16%] w-14 rotate-6', depth: 0.35 },
    items: [
      { glyph: 'envelope', className: 'left-[0.4%] top-[30%] w-32 -rotate-6', depth: 0.35 },
      { glyph: 'plane', className: 'left-[1.8%] top-[58%] w-20 rotate-6', depth: 0.6, accent: true },
      { glyph: 'paperclip', className: 'left-[2.8%] top-[14%] w-10 rotate-[24deg]', depth: 0.5 },
      { glyph: 'stickyNote', className: 'left-[0.8%] top-[80%] w-14 rotate-[8deg]', depth: 0.75 },
    ],
  },
]

const DRAWABLES = 'path, rect, circle, line, polyline, ellipse'

export function Backdrop() {
  const layerRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(
        {
          reduce: '(prefers-reduced-motion: reduce)',
          full: '(prefers-reduced-motion: no-preference)',
          desktopPointer: '(min-width: 1450px) and (pointer: fine)',
        },
        (ctx) => {
          const { reduce, desktopPointer } = ctx.conditions
          const activeSets = new Set()

          BACKDROP_SETS.forEach(({ anchor }) => {
            const anchorEl = document.getElementById(anchor)
            const setEl = layerRef.current?.querySelector(`[data-backdrop-set="${anchor}"]`)
            if (!anchorEl || !setEl) return // isolated render (tests) or removed section
            const trigger = anchorEl.closest('section') ?? anchorEl

            gsap.set(setEl, { autoAlpha: 0 })
            const strokes = setEl.querySelectorAll(DRAWABLES)

            ScrollTrigger.create({
              trigger,
              start: 'top 60%',
              end: 'bottom 40%',
              onToggle: (self) => {
                if (self.isActive) activeSets.add(setEl)
                else activeSets.delete(setEl)
                gsap.to(setEl, {
                  autoAlpha: self.isActive ? 1 : 0,
                  duration: reduce ? 0 : 0.5,
                  overwrite: 'auto',
                })
                if (self.isActive && !reduce) {
                  // Sketch the set in: pathLength=1 on every element makes
                  // dashoffset 1→0 a full draw regardless of geometry.
                  gsap.fromTo(
                    strokes,
                    { strokeDashoffset: 1 },
                    { strokeDashoffset: 0, duration: 1.2, stagger: 0.05, ease: 'power2.out', overwrite: 'auto' }
                  )
                }
              },
            })

            if (!reduce) {
              setEl.querySelectorAll('[data-glyph]').forEach((el) => {
                const depth = parseFloat(el.dataset.depth) || 0.3
                gsap.fromTo(
                  el,
                  { y: 120 * depth },
                  {
                    y: -120 * depth,
                    ease: 'none',
                    scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true },
                  }
                )
              })
            }
          })

          // Cursor awareness (desktop fine-pointer only): visible glyphs ease a
          // few pixels away from the pointer, on the inner [data-repel] wrapper
          // so it composes with the scrubbed parallax on the outer one.
          if (!reduce && desktopPointer) {
            const RADIUS = 180
            const MAX_PUSH = 14
            const quicks = new WeakMap()
            let raf = 0
            const onMove = (event) => {
              if (raf) return
              raf = requestAnimationFrame(() => {
                raf = 0
                activeSets.forEach((setEl) => {
                  setEl.querySelectorAll('[data-repel]').forEach((el) => {
                    const box = el.getBoundingClientRect()
                    const dx = box.left + box.width / 2 - event.clientX
                    const dy = box.top + box.height / 2 - event.clientY
                    const dist = Math.hypot(dx, dy)
                    let q = quicks.get(el)
                    if (!q) {
                      q = {
                        x: gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' }),
                        y: gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' }),
                      }
                      quicks.set(el, q)
                    }
                    if (dist > 0 && dist < RADIUS) {
                      const push = ((RADIUS - dist) / RADIUS) * MAX_PUSH
                      q.x((dx / dist) * push)
                      q.y((dy / dist) * push)
                    } else {
                      q.x(0)
                      q.y(0)
                    }
                  })
                })
              })
            }
            window.addEventListener('pointermove', onMove, { passive: true })
            return () => {
              window.removeEventListener('pointermove', onMove)
              cancelAnimationFrame(raf)
            }
          }
        }
      )
    },
    { scope: layerRef }
  )

  return (
    <div
      ref={layerRef}
      data-backdrop
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] text-ink"
    >
      {BACKDROP_SETS.map(({ anchor, items, mobile }) => {
        const M = GLYPHS[mobile.glyph]
        return (
          <div
            key={anchor}
            data-backdrop-set={anchor}
            className="absolute inset-y-0 left-6 right-0 opacity-0"
          >
            {/* display:contents keeps items positioned against the set while
                letting one class hide the whole desktop group below 1450px */}
            <div data-backdrop-desktop className="hidden min-[1450px]:contents">
              {items.map(({ glyph, className, depth, accent }, i) => {
                const G = GLYPHS[glyph]
                return (
                  <div
                    key={`${glyph}-${i}`}
                    data-glyph={glyph}
                    data-depth={depth}
                    className={`absolute ${
                      accent ? 'text-accent opacity-[0.16]' : 'opacity-[0.09]'
                    } ${className}`}
                  >
                    <div data-repel>
                      <G />
                    </div>
                  </div>
                )
              })}
            </div>
            {/* Below 1450px there is no gutter: one faint watermark carries
                the concept instead, on the right where no rail lives there */}
            <div
              data-backdrop-watermark
              data-glyph={mobile.glyph}
              data-depth={mobile.depth}
              className={`absolute opacity-[0.06] min-[1450px]:hidden ${mobile.className}`}
            >
              <M />
            </div>
          </div>
        )
      })}
    </div>
  )
}
