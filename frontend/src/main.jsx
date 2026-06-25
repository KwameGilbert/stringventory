import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <App />
)

// Register Service Worker for PWA
// The vite-plugin-pwa will handle most of the registration,
// but we also register our custom service worker for push notifications
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Let vite-plugin-pwa handle the main registration
    // Our custom push notification logic is in the generated SW
    navigator.serviceWorker.getRegistrations().then(registrations => {
      console.log(`${registrations.length} service worker(s) registered`);
      registrations.forEach(registration => {
        console.log('Active Service Worker:', registration);
      });
    }).catch(error => {
      console.error('Error accessing service worker registrations:', error);
    });

    // Request notification permission on first load
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  });
}

