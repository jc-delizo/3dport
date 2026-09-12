import { useEffect, useRef, useState } from 'react'

// One plane on the Atrium stage. It starts tipped away from the reader and
// lifts to flat as it enters the viewport — the depth cue is carried by a
// data attribute, not inline transforms, so the whole motion contract lives in
// CSS and `prefers-reduced-motion` can cancel it in one place.
//
// Deliberately IntersectionObserver and not ScrollTrigger: this fires once per
// section and never needs per-frame work, so it costs nothing on scroll.
export function AtriumPlane({ className = '', children, ...rest }) {
  const ref = useRef(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // No IntersectionObserver (jsdom, very old browsers): show the resting
    // state rather than leaving the page permanently tipped away.
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '-12% 0px -12% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} data-depth={near ? 'near' : 'far'} className={`atrium-plane ${className}`} {...rest}>
      {children}
    </div>
  )
}
