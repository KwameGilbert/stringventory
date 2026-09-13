import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppErrorBoundary from './components/ui/AppErrorBoundary'

createRoot(document.getElementById('root')).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
)

// Register Service Worker for PWA
// The vite-plugin-pwa will handle most of the registration,
// but we also log active registrations for debugging.
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

