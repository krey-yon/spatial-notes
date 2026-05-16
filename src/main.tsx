import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { injectThemeVariables } from './lib/theme-injector'
import './index.css'

// Inject CSS custom properties from the single theme config
// BEFORE React mounts so all components read the same tokens.
injectThemeVariables()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
