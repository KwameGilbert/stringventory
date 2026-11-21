import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppErrorBoundary from './components/ui/AppErrorBoundary'

// A lazy chunk failed to load, usually because a deploy replaced it.
// Reload once to pick up the new build; the guard prevents reload loops.
const PRELOAD_RELOAD_KEY = 'vite_preload_reload_at'
window.addEventListener('vite:preloadError', (event) => {
  try {
    const lastReload = Number(sessionStorage.getItem(PRELOAD_RELOAD_KEY) || 0)
    if (Date.now() - lastReload < 10000) return
    sessionStorage.setItem(PRELOAD_RELOAD_KEY, String(Date.now()))
  } catch {
    // sessionStorage unavailable; reload anyway
  }
  event.preventDefault()
  window.location.reload()
})

createRoot(document.getElementById('root')).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
)
