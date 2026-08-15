import { render } from '@testing-library/react'
import { ThemeProvider } from '../theme/ThemeContext'

// Components that consult the theme grammar must render inside ThemeProvider.
export const renderWithTheme = (ui) => render(<ThemeProvider>{ui}</ThemeProvider>)
