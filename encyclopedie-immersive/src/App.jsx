import { useState, useEffect } from 'react'
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
      {/* Custom cursor */}
      <GoldCursor active={gateOpen} />

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

// Gold cursor dot with trail
function GoldCursor({ active }) {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [trail, setTrail] = useState([])

  useEffect(() => {
    if (active) {
      document.body.classList.add('has-gold-cursor')
    } else {
      document.body.classList.remove('has-gold-cursor')
    }
    return () => document.body.classList.remove('has-gold-cursor')
  }, [active])

  useEffect(() => {
    if (!active) return
    const history = []

    const onMove = (e) => {
      const p = { x: e.clientX, y: e.clientY }
      setPos(p)
      history.unshift(p)
      if (history.length > 8) history.pop()
      setTrail([...history])
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [active])

  if (!active) return null

  return (
    <>
      {/* Trail dots */}
      {trail.map((t, i) => (
        <div
          key={i}
          style={{
            position: 'fixed',
            left: t.x,
            top: t.y,
            width: Math.max(2, 6 - i),
            height: Math.max(2, 6 - i),
            borderRadius: '50%',
            background: `rgba(201,168,76,${Math.max(0, 0.4 - i * 0.05)})`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 99999,
          }}
        />
      ))}
      {/* Main cursor dot */}
      <div
        style={{
          position: 'fixed',
          left: pos.x,
          top: pos.y,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#c9a84c',
          boxShadow: '0 0 8px rgba(201,168,76,0.9), 0 0 16px rgba(201,168,76,0.4)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 100000,
        }}
      />
    </>
  )
}
