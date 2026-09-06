import { createContext, useContext, useEffect, useState } from 'react'
import { THEMES, DEFAULT_THEME, themeById } from './themes'

// Versioned once when Quiet became the default so returning visitors also see
// the new first impression. Choices made after this change still persist.
const STORAGE_KEY = '3dport-theme-v2'

const ThemeContext = createContext(null)

function initialTheme() {
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
    setThemeState(id)
    localStorage.setItem(STORAGE_KEY, id)
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
