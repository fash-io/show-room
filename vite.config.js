import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      // Proxy requests to the TMDB API
      '/api': {
        target: 'https://api.themoviedb.org',
        changeOrigin: true, // This helps to avoid CORS issues
        rewrite: (path) => path.replace(/^\/api/, ''), // Rewrite URL to match API endpoint structure
      }
    }
  }
})
