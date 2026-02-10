import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base: '/dhexstream/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    manifest: true, // Generate manifest.json for backend integration
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation': ['gsap', 'lenis'],
          'utils': ['axios']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 3000,
    host: true, // Listen on all addresses (0.0.0.0)
    proxy: {
      // Proxy all /dhexstream/api/index.php requests to Apache
      '/dhexstream/api/index.php': {
        target: 'http://127.0.0.1',
        changeOrigin: true,
        secure: false
      }
    }
  }
}))

