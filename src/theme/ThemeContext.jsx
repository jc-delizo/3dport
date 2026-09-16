import { createContext, useContext, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { THEMES, DEFAULT_THEME, themeById } from './themes'

// Versioned when the default changes (v2: Quiet, v3: Atrium) so returning
// visitors also see the new first impression. Choices made after each change
// still persist.
const STORAGE_KEY = '3dport-theme-v3'

const ThemeContext = createContext(null)

function initialTheme() {
  // Dev-only escape hatch: `VITE_FORCE_THEME=order npm run dev` pins a theme on
  // load so several sandboxes can run the same source on different ports and
  // each open on its own theme. Never consulted in a production build, and the
  // in-page switcher still works on top of it.
  if (import.meta.env?.DEV) {
    const forced = import.meta.env.VITE_FORCE_THEME
    if (forced && themeById(forced)) return forced
  }
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && themeById(stored)) return stored
  // No OS-scheme auto-switch: every viewer starts with the same authored
  // first impression; dark-preferring visitors can still pick Midnight.
  return DEFAULT_THEME
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(initialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const setTheme = (id) => {
    if (!themeById(id)) return
    const apply = () => {
      setThemeState(id)
      localStorage.setItem(STORAGE_KEY, id)
    }
    // A theme switch swaps the whole visual system at once; the browser-native
    // view transition turns that hard cut into a crossfade. flushSync so the
    // DOM change lands inside the transition's snapshot window. Progressive:
    // no API or reduced motion -> the plain instant switch.
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (typeof document.startViewTransition === 'function' && !reduced) {
      document.startViewTransition(() => flushSync(apply))
    } else {
      apply()
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES, grammar: themeById(theme).grammar }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
