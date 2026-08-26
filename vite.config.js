import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Task 96: dev proxy — forwards /api to the local backend, avoids CORS in development
  server: {
    proxy: {
      // Proxy all /api/* requests to the .NET backend during local development.
      // Backend runs on http://localhost:5000 (launchSettings.json → http profile).
      // If you run the https profile, change target to https://localhost:7000
      // and set secure: false.
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
