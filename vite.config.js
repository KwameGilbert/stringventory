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
      // index.html links public/manifest.json
      manifest: false,
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
