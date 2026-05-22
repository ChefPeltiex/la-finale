import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Golden particle explosion on click
function GoldParticle({ x, y, id }) {
  const angle = (id / 24) * Math.PI * 2
  const dist = 80 + Math.random() * 120
  return (
    <motion.div
      style={{
        position: 'fixed',
        left: x,
        top: y,
        width: 3 + Math.random() * 3,
        height: 3 + Math.random() * 3,
        borderRadius: '50%',
        background: `rgba(${200 + Math.random() * 55}, ${150 + Math.random() * 60}, 50, 1)`,
        pointerEvents: 'none',
        zIndex: 9999,
        boxShadow: '0 0 6px rgba(201,168,76,0.8)',
      }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        opacity: 0,
        scale: 0,
      }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    />
  )
}

export default function CodexGate({ onEnter }) {
  const [phase, setPhase] = useState('idle') // idle | clicking | dissolving
  const [particles, setParticles] = useState([])
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  // Check localStorage skip flag
  useEffect(() => {
    const skipped = localStorage.getItem('codex-gate-seen')
    if (skipped === '1') {
      onEnter()
    }
  }, [onEnter])

  const handleEnter = useCallback((e) => {
    if (phase !== 'idle') return
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setClickPos({ x: cx, y: cy })
    setParticles(Array.from({ length: 24 }, (_, i) => i))
    setPhase('clicking')

    setTimeout(() => {
      setPhase('dissolving')
    }, 400)

    setTimeout(() => {
      localStorage.setItem('codex-gate-seen', '1')
      onEnter()
    }, 1200)
  }, [phase, onEnter])

  return (
    <AnimatePresence>
      {phase !== 'dissolving' && (
        <motion.div
          key="gate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9000,
            background: 'radial-gradient(ellipse at 50% 40%, #0d0b18 0%, #060510 55%, #000000 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: hovered ? 'none' : 'default',
          }}
        >
          {/* Starfield background */}
          <StarCanvas />

          {/* Vignette */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%)',
          }} />

          {/* Sceau central lévitant */}
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'relative', zIndex: 10, marginBottom: '3rem' }}
          >
            {/* Halo glow */}
            <motion.div
              animate={{ opacity: [0.3, 0.65, 0.3], scale: [1, 1.08, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                inset: -20,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(201,168,76,0.25) 0%, transparent 70%)',
                filter: 'blur(12px)',
                pointerEvents: 'none',
              }}
            />
            {/* Outer orbit ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                inset: -14,
                borderRadius: '50%',
                border: '1px solid rgba(201,168,76,0.18)',
                pointerEvents: 'none',
              }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                inset: -28,
                borderRadius: '50%',
                border: '1px solid rgba(201,168,76,0.08)',
                pointerEvents: 'none',
              }}
            />

            {/* Sceau image */}
            <motion.img
              src="/codex-sceau.png"
              alt="Sceau du Codex"
              animate={phase === 'clicking' ? { rotate: 360, scale: 1.1 } : { rotate: 0, scale: 1 }}
              transition={phase === 'clicking' ? { duration: 0.8, ease: 'easeInOut' } : {}}
              style={{
                width: 'clamp(180px, 22vw, 260px)',
                height: 'clamp(180px, 22vw, 260px)',
                objectFit: 'contain',
                filter: `drop-shadow(0 0 24px rgba(201,168,76,0.5)) drop-shadow(0 0 8px rgba(201,168,76,0.3))`,
                display: 'block',
              }}
            />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}
          >
            <div style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(0.55rem, 1.2vw, 0.72rem)',
              letterSpacing: '0.4em',
              color: 'rgba(201,168,76,0.55)',
              textTransform: 'uppercase',
              marginBottom: '0.8rem',
            }}>
              Encyclopédie Immersive
            </div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', 'EB Garamond', Georgia, serif",
              fontSize: 'clamp(2rem, 5vw, 3.4rem)',
              color: '#e8d08a',
              fontWeight: 400,
              letterSpacing: '0.04em',
              lineHeight: 1.1,
              marginBottom: '0.6rem',
              textShadow: '0 0 40px rgba(201,168,76,0.3)',
            }}>
              Codex Magique
            </h1>

            {/* Gold divider */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              marginBottom: '2.5rem', justifyContent: 'center',
            }}>
              <div style={{ height: '1px', width: 60, background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.5))' }} />
              <span style={{ color: 'rgba(201,168,76,0.4)', fontSize: '0.6rem' }}>✦</span>
              <div style={{ height: '1px', width: 60, background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.5))' }} />
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={handleEnter}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                fontFamily: "'Cormorant Garamond', 'EB Garamond', Georgia, serif",
                fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
                fontStyle: 'italic',
                letterSpacing: '0.12em',
                color: phase === 'idle' ? '#e8d08a' : 'rgba(232,208,138,0.5)',
                background: 'none',
                border: '1px solid rgba(201,168,76,0.35)',
                borderRadius: '2px',
                padding: '0.85rem 2.8rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: hovered
                  ? '0 0 20px rgba(201,168,76,0.2), inset 0 0 20px rgba(201,168,76,0.05)'
                  : '0 0 8px rgba(201,168,76,0.08)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {hovered && (
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                  style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.1), transparent)',
                  }}
                />
              )}
              Entrer dans le Codex
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 1.5, duration: 1 }}
              style={{
                marginTop: '2rem',
                fontFamily: "'Cinzel', serif",
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                color: 'rgba(201,168,76,0.3)',
                textTransform: 'uppercase',
              }}
            >
              Presser une touche quelconque ou cliquer pour passer
            </motion.p>
          </motion.div>

          {/* Particle burst */}
          {particles.map((id) => (
            <GoldParticle key={id} id={id} x={clickPos.x} y={clickPos.y} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Lightweight star canvas (CSS/SVG based to avoid Three.js overhead on gate)
function StarCanvas() {
  const stars = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    r: Math.random() * 1.5 + 0.3,
    delay: Math.random() * 5,
    dur: Math.random() * 3 + 2,
    opacity: Math.random() * 0.5 + 0.1,
  }))

  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      preserveAspectRatio="xMidYMid slice"
    >
      {stars.map(s => (
        <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="#e8d08a">
          <animate
            attributeName="opacity"
            values={`${s.opacity};${Math.min(s.opacity + 0.5, 0.9)};${s.opacity}`}
            dur={`${s.dur}s`}
            begin={`${s.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  )
}
