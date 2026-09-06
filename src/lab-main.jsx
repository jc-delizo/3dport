import React from 'react'
import ReactDOM from 'react-dom/client'
import LabApp from './LabApp'
import { ThemeProvider } from './theme/ThemeContext'
import '@fontsource/geist-sans/400.css'
import '@fontsource/geist-sans/600.css'
import '@fontsource/geist-mono/400.css'
import '@fontsource/eb-garamond/400.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <LabApp />
    </ThemeProvider>
  </React.StrictMode>,
)
