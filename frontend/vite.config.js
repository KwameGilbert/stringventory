import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'PinnexVentures',
        short_name: 'PinnexVentures',
        description: 'Single company inventory and business management platform for PinnexVentures',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/favicon.ico',
            sizes: '32x32',
            type: 'image/x-icon'
          },
          {
            src: '/logo-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        categories: ['business', 'productivity'],
        screenshots: [
          {
            src: '/screenshot-540x720.png',
            sizes: '540x720',
            form_factor: 'narrow'
          },
          {
            src: '/screenshot-1280x720.png',
            sizes: '1280x720',
            form_factor: 'wide'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 10485760, // 10 MiB
        // Only static media; HTML, JS and CSS always come from the network so deploys are never stale
        globPatterns: ['**/*.{ico,png,svg,jpg,jpeg,gif,webp,woff,woff2,ttf,eot}'],
        // index.html is not precached, so don't serve it for navigations
        navigateFallback: null,
        runtimeCaching: [
          {
            // No networkTimeoutSeconds: the cache is only used when the request fails (offline)
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              cacheableResponse: { statuses: [200] },
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 1 day
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          recharts: ['recharts'],
        },
      },
    },
  },
})
