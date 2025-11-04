import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'scanner': ['@zxing/browser'],
          'ocr': ['tesseract.js'],
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true, // Expose to network for mobile testing
  },
})
