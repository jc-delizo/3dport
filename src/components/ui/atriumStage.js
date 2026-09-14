import { useEffect, useState } from 'react'

// Stage direction for Atrium: the one-time entrance dolly and the cursor
// parallax. Both are decorative, so both stand down for reduced motion and
// for readers on data-saver connections — those get the composed resting
// state immediately, not a disabled effect.
//
// Parallax mechanism: pointer position becomes two custom properties on
// <html> (--par-rx/--par-ry), which every plane's transform already reads.
// Updates are rAF-coalesced, and the planes' own 600ms transform transition
// does the smoothing — each frame only moves the target.
const MAX_TILT_X = 2.2 // deg, left-right
const MAX_TILT_Y = 1.6 // deg, up-down

// Data-saver check, shared with App's decorative layers: a reader who asked
// their browser to save data should not pay for backdrop art or stage motion.
export function prefersLiteData() {
  return navigator.connection?.saveData === true
}

export function useAtriumStage(active) {
  const [arrived, setArrived] = useState(false)

  useEffect(() => {
    if (!active) return undefined

    const media = (q) => typeof window.matchMedia === 'function' && window.matchMedia(q).matches
    const still = media('(prefers-reduced-motion: reduce)') || prefersLiteData()
    if (still) {
      setArrived(true)
      return undefined
    }

    // Replay the dolly whenever Atrium becomes the active theme: one frame
    // deep in the room, then release — the transition carries the planes in.
    setArrived(false)
    const t = window.setTimeout(() => setArrived(true), 120)

    let frame = 0
    const root = document.documentElement
    const onMove = (e) => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const ry = (e.clientX / window.innerWidth - 0.5) * MAX_TILT_X
        const rx = (e.clientY / window.innerHeight - 0.5) * -MAX_TILT_Y
        root.style.setProperty('--par-rx', `${rx.toFixed(2)}deg`)
        root.style.setProperty('--par-ry', `${ry.toFixed(2)}deg`)
      })
    }
    // Touch scrolling fires pointermove, and the room swimming under a thumb
    // reads as jank — so coarse-primary devices skip the parallax. Gate on
    // NOT-coarse rather than fine: pointer-less environments (kiosks, some
    // headless/CI browsers) report neither, fire no pointer events, and lose
    // nothing by having the listener attached.
    const fine = !media('(pointer: coarse)')
    if (fine) window.addEventListener('pointermove', onMove, { passive: true })

    return () => {
      window.clearTimeout(t)
      if (fine) window.removeEventListener('pointermove', onMove)
      if (frame) window.cancelAnimationFrame(frame)
      root.style.removeProperty('--par-rx')
      root.style.removeProperty('--par-ry')
    }
  }, [active])

  return active ? { 'data-arrived': arrived ? 'true' : 'false' } : {}
}
