import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all /api/* requests to the .NET backend during local development.
      // Override the target via VITE_API_BASE_URL in .env.local if your backend
      // runs on a different port (e.g. https://localhost:7218).
      '/api': {
        target: 'http://localhost:5218',
        changeOrigin: true,
        secure: false,
        // Rewrite is NOT needed — backend routes already start with /api
      },
    },
  },
})
