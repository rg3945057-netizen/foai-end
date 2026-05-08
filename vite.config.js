import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      // ISS position — open-notify.org (HTTP, needs proxy to avoid CORS)
      '/api/iss-now': {
        target:      'http://api.open-notify.org',
        changeOrigin: true,
        rewrite:     () => '/iss-now.json',
      },
      // Astronauts — open-notify.org
      '/api/astros': {
        target:      'http://api.open-notify.org',
        changeOrigin: true,
        rewrite:     () => '/astros.json',
      },
      // Nominatim reverse geocoding — User-Agent set server-side by proxy
      '/api/geo/reverse': {
        target:      'https://nominatim.openstreetmap.org',
        changeOrigin: true,
        secure:       true,
        rewrite:     () => '/reverse',
        headers:     { 'User-Agent': 'ISS-Orbit-Dashboard/1.0' },
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return;
          if (id.includes('leaflet') || id.includes('react-leaflet')) return 'maps';
          if (id.includes('recharts') || id.includes('d3-'))           return 'charts';
          if (id.includes('framer-motion'))                             return 'motion';
          if (id.includes('react-dom') || id.includes('react-router')) return 'vendor';
        },
      },
    },
  },
});
