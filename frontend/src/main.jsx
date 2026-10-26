import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'
import AppErrorBoundary from './components/ui/AppErrorBoundary'

// autoUpdate: reloads the page once a new service worker takes control
registerSW({ immediate: true })

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

// Log active service worker registrations for debugging.
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      console.log(`${registrations.length} service worker(s) registered`);
      registrations.forEach(registration => {
        console.log('Active Service Worker:', registration);
      });
    }).catch(error => {
      console.error('Error accessing service worker registrations:', error);
    });

    // Safely check notification permission without prompting unprompted on load
    // Browser standards require explicit user gesture to request permissions
    if ('Notification' in window) {
      try {
        console.log('Current notification permission status:', Notification.permission);
      } catch (e) {
        // Ignore if restricted
      }
    }
  });
}

