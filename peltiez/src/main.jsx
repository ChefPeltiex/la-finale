import '@/lib/storageMigration.js'
import { initMonitoring } from '@/lib/monitoring.js'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Observabilité front (optionnel) : Sentry si DSN configuré.
initMonitoring()

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('Élément #root introuvable dans index.html — impossible de monter React.')
}

// Évite caches fantômes pendant le dev mobile ; en prod, active la PWA hors ligne.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch((err) => {
    console.warn('Service Worker registration failed:', err);
  });
}

ReactDOM.createRoot(rootEl).render(
  <App />
)