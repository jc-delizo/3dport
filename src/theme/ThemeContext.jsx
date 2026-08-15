import { createContext, useContext, useEffect, useState } from 'react'
import { THEMES, DEFAULT_THEME, themeById } from './themes'

const STORAGE_KEY = '3dport-theme'

const ThemeContext = createContext(null)

function initialTheme() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && themeById(stored)) return stored
  // No OS-scheme auto-switch: Studio is the brand's first impression for
  // everyone; dark-preferring visitors can pick Midnight from the menu.
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
