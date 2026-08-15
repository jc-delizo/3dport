import { useEffect } from 'react'

// '10×' → { target: 10, suffix: '×' }; '20–28' → { target: 20, suffix: '–28' }.
export function parseStat(value) {
  const m = /^(\d+)(.*)$/.exec(value)
  return m ? { target: Number(m[1]), suffix: m[2] } : null
}

// Progressive enhancement only: markup always carries the final value; when the
// element scrolls into view (and the user hasn't asked for reduced motion) the
// number replays 0 → target. If none of that happens, nothing was lost.
export function useCountUp(value, ref) {
  useEffect(() => {
    const parsed = parseStat(value)
    const el = ref.current
    if (!parsed || !el) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        const start = performance.now()
        const duration = 900
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1)
          const eased = 1 - (1 - t) ** 3
          el.textContent = `${Math.round(parsed.target * eased)}${parsed.suffix}`
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [value, ref])
}
