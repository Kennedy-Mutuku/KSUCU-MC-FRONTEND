import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    watch: {
      usePolling: true,
      interval: 100
    },
    hmr: {
      overlay: true
    },
    proxy: {
      '/users': {
        target: 'https://ksucu-mc.co.ke',
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: 'localhost',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // Remove problematic headers
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
          });
        }
      },
      '/news': {
        target: 'https://ksucu-mc.co.ke',
        changeOrigin: true,
        secure: true
      },
      '/attendance': {
        target: 'https://ksucu-mc.co.ke',
        changeOrigin: true,
        secure: true
      },
      '/api': {
        target: 'https://ksucu-mc.co.ke',
        changeOrigin: true,
        secure: true
      },
      '/adminnews': {
        target: 'https://ksucu-mc.co.ke',
        changeOrigin: true,
        secure: true
      },
      '/adminmission': {
        target: 'https://ksucu-mc.co.ke',
        changeOrigin: true,
        secure: true
      },
      '/adminBs': {
        target: 'https://ksucu-mc.co.ke',
        changeOrigin: true,
        secure: true
      },
      '/sadmin': {
        target: 'https://ksucu-mc.co.ke',
        changeOrigin: true,
        secure: true
      },
      '/admissionadmin': {
        target: 'https://ksucu-mc.co.ke',
        changeOrigin: true,
        secure: true
      },
      '/polling-officer': {
        target: 'https://ksucu-mc.co.ke',
        changeOrigin: true,
        secure: true
      },
      '/documents': {
        target: 'https://ksucu-mc.co.ke',
        changeOrigin: true,
        secure: true
      },
      '/minutes': {
        target: 'https://ksucu-mc.co.ke',
        changeOrigin: true,
        secure: true
      },
      '/commitmentForm': {
        target: 'https://ksucu-mc.co.ke',
        changeOrigin: true,
        secure: true
      },
      '/chat': {
        target: 'https://ksucu-mc.co.ke',
        changeOrigin: true,
        secure: true
      },
      '/messages': {
        target: 'https://ksucu-mc.co.ke',
        changeOrigin: true,
        secure: true
      }
    }
  },
  css: {
    devSourcemap: true
  },
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
