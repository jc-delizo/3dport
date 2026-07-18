import { useEffect, useRef, useState } from 'react'

export function Reveal({ as: Tag = 'div', delay = 0, className = '', children }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Respect the user's motion preference: show immediately, never animate.
    // Listened to rather than read once, so switching the OS setting mid-session
    // reveals anything still waiting instead of leaving it stuck hidden.
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (query.matches) {
      setVisible(true)
      return
    }

    const onPreferenceChange = (event) => {
      if (event.matches) setVisible(true)
    }
    query.addEventListener('change', onPreferenceChange)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect() // reveal once, never re-hide
        }
      },
      { rootMargin: '0px 0px -10% 0px' }
    )
    observer.observe(node)

    return () => {
      query.removeEventListener('change', onPreferenceChange)
      observer.disconnect()
    }
  }, [])

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}
    >
      {children}
    </Tag>
  )
}
