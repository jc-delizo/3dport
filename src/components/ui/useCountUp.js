import { useEffect } from 'react'

// '10×' → { target: 10, suffix: '×' }; '20–28' → { target: 20, suffix: '–28' }.
export function parseStat(value) {
  const m = /^(\d+)(.*)$/.exec(value)
  return m ? { target: Number(m[1]), suffix: m[2] } : null
}

// Count every numeric run so a range such as 20–28 animates as a range rather
// than showing the confusing intermediate state "7–28".
export function statAtProgress(value, progress) {
  return value.replace(/\d+/g, (number) => String(Math.round(Number(number) * progress)))
}

// Progressive enhancement only: markup always carries the final value; when the
// element scrolls into view (and the user hasn't asked for reduced motion) the
// number replays 0 → target. If none of that happens, nothing was lost.
export function useCountUp(value, ref, delay = 0) {
  useEffect(() => {
    const parsed = parseStat(value)
    const el = ref.current
    if (!parsed || !el) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let frame = 0
    let timer = 0
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        el.textContent = statAtProgress(value, 0)
        timer = window.setTimeout(() => {
          const start = performance.now()
          const duration = 1200
          const tick = (now) => {
            const t = Math.min((now - start) / duration, 1)
            const eased = 1 - (1 - t) ** 3
            el.textContent = statAtProgress(value, eased)
            if (t < 1) frame = requestAnimationFrame(tick)
          }
          frame = requestAnimationFrame(tick)
        }, delay)
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(timer)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [value, ref, delay])
}
