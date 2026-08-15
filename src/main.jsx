import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider } from './theme/ThemeContext'
import '@fontsource/geist-sans/400.css'
import '@fontsource/geist-sans/600.css'
import '@fontsource/geist-mono/400.css'
// Paper theme's display serif (Copernicus substitute), weight 400 only.
import '@fontsource/eb-garamond/400.css'
import './index.css'

// For the people who look under the hood.
// eslint-disable-next-line no-console
console.log(
  '%cHi — you found the console. This site is React + Vite, test-driven, themed with CSS custom properties.',
  'color:#2563eb;font-family:monospace;font-size:12px'
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
