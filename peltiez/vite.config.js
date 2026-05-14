import path from 'path'
import { fileURLToPath } from 'url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { visualizer } from "rollup-plugin-visualizer";

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', // Suppress warnings, only show errors
  resolve: {
    /** Évite « Invalid hook call » / useEffect null quand deux copies de React sont résolues (p.ex. R3F + éditeurs). */
    dedupe: ['react', 'react-dom', 'scheduler'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      /** Même copie physique que `react` — sinon le transform JSX peut tirer un second graphe en dev. */
      'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime.js'),
      'react/jsx-dev-runtime': path.resolve(__dirname, 'node_modules/react/jsx-dev-runtime.js'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@tanstack/react-query',
      'recharts',
      '@react-three/fiber',
      '@react-three/drei',
    ],
  },
  /**
   * Ne pas forcer react/react-dom dans un chunk async séparé : en prod ou avec PWA,
   * un ordre de chargement défavorable peut laisser le dispatcher React à null
   * (« Cannot read properties of null (reading 'useState') »). Vite découpe déjà
   * intelligemment ; l’alias + dedupe suffisent pour une seule copie de React.
   */
  build: {},
  plugins: [
    react(),
    visualizer({
      filename: "dist/stats.html",
      template: "treemap",
      gzipSize: true,
      brotliSize: true,
      emitFile: true,
      open: false,
    }),
  ],
  server: {
    // In local dev, you can run an API server on :8787 and keep using /api/... in the frontend.
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
    },
    /** Si le WebSocket HMR échoue (IDE / proxy), l’app fonctionne quand même — faire un rechargement forcé après changement de config. */
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
  },
});