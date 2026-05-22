import { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import HomePage from './pages/HomePage.jsx'
import TomePage from './pages/TomePage.jsx'
import GaleriePage from './pages/GaleriePage.jsx'
import IndexPage from './pages/IndexPage.jsx'
import CodexGate from './components/CodexGate.jsx'

// Grimoire page-turn transition
function PageTransition({ children }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
        animate={{ opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{ minHeight: '100vh' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  const [gateOpen, setGateOpen] = useState(false)

  return (
    <>
      {/* Codex Gate */}
      {!gateOpen && (
        <CodexGate onEnter={() => setGateOpen(true)} />
      )}

      {/* Main app */}
      {gateOpen && (
        <PageTransition>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tome/:id" element={<TomePage />} />
            <Route path="/galerie" element={<GaleriePage />} />
            <Route path="/index-secrets" element={<IndexPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransition>
      )}
    </>
  )
}
