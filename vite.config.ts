import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          fontawesome: ['@fortawesome/fontawesome-svg-core', '@fortawesome/free-solid-svg-icons', '@fortawesome/free-regular-svg-icons', '@fortawesome/free-brands-svg-icons', '@fortawesome/react-fontawesome'],
          pdf: ['jspdf', 'jspdf-autotable'],
          ui: ['bootstrap', 'react-icons', 'lucide-react']
        }
      }
    }
  }
})
