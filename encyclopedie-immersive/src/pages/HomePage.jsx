import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TOMES } from '../data/tomes.js'
import StarField from '../components/StarField.jsx'
import GrimoireBook from '../components/GrimoireBook.jsx'
import NavBar from '../components/NavBar.jsx'
import ConstellationLayer from '../components/ConstellationLayer.jsx'

const PARTICLES = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3.5 + 0.8,
  dur: Math.random() * 5 + 4,
  delay: Math.random() * 6,
  opacity: Math.random() * 0.35 + 0.12,
}))

function FloatingParticle({ p }) {
  return (
    <div
      className="hero-particle animate-float"
      style={{
        left: `${p.x}%`,
        top: `${p.y}%`,
        width: `${p.size}px`,
        height: `${p.size}px`,
        background: `rgba(201,168,76,${p.opacity})`,
        animationDuration: `${p.dur}s`,
        animationDelay: `${p.delay}s`,
        boxShadow: `0 0 ${p.size * 2.5}px rgba(201,168,76,0.45)`,
      }}
    />
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const [hoveredTome, setHoveredTome] = useState(null)
  const [entered, setEntered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100)
    return () => clearTimeout(t)
  }, [])

  // Subtle parallax on mouse
  useEffect(() => {
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      setMousePos({ x, y })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      className="cosmos-bg"
      style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}
    >
      {/* Constellation background layer */}
      <ConstellationLayer />

      <NavBar />

      {/* Floating particles */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        {PARTICLES.map(p => <FloatingParticle key={p.id} p={p} />)}
      </div>

      {/* Hero section with 3D */}
      <div
        ref={heroRef}
        style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
      >
        {/* 3D Canvas background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Canvas camera={{ position: [0, 0, 9], fov: 48 }}>
            <ambientLight intensity={0.2} color="#120d24" />
            <directionalLight position={[5, 5, 5]} intensity={0.7} color="#e8d08a" />
            <directionalLight position={[-5, -3, 2]} intensity={0.15} color="#3a2570" />
            {/* Point light follows mouse subtly */}
            <pointLight
              position={[mousePos.x * 4, mousePos.y * -4, 5]}
              color="#c9a84c"
              intensity={0.5}
              distance={12}
            />
            <StarField count={1800} />
            <GrimoireBook onClick={() => navigate('/tome/1')} />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={false}
              maxPolarAngle={Math.PI * 0.65}
              minPolarAngle={Math.PI * 0.35}
            />
          </Canvas>
        </div>

        {/* Hero text overlay */}
        <div
          style={{
            position: 'relative', zIndex: 2,
            textAlign: 'center',
            padding: '0 1.5rem',
            maxWidth: '820px',
            pointerEvents: 'none',
            marginTop: '-40vh',
            transform: `translate(${mousePos.x * -6}px, ${mousePos.y * -4}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: entered ? 0.7 : 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(0.62rem, 1.4vw, 0.82rem)',
              letterSpacing: '0.38em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '1.4rem',
            }}
          >
            Dominic Pelletier · fr-CA · Mai 2026
          </motion.div>

          <motion.h1
            className="title-codex text-bloom"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 28 }}
            transition={{ delay: 0.5, duration: 1.1 }}
            style={{
              fontSize: 'clamp(2.2rem, 5.5vw, 4.2rem)',
              color: 'var(--gold-light)',
              lineHeight: 1.08,
              marginBottom: '1.3rem',
              fontWeight: 300,
            }}
          >
            Encyclopédie<br />du Codex Magique
          </motion.h1>

          <motion.div
            className="gold-line"
            initial={{ opacity: 0 }}
            animate={{ opacity: entered ? 0.55 : 0 }}
            transition={{ delay: 0.9, duration: 1 }}
            style={{ marginBottom: '1.4rem' }}
          >
            <span className="font-cinzel text-gold" style={{ fontSize: '0.7rem', letterSpacing: '0.2em', whiteSpace: 'nowrap' }}>
              1 être · 3 natures · 5 mondes · 14 domaines · 126 fiches
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: entered ? 0.75 : 0 }}
            transition={{ delay: 1.1, duration: 1 }}
            style={{
              fontFamily: "'Cormorant Garamond', 'EB Garamond', Georgia, serif",
              fontSize: 'clamp(1.05rem, 2.1vw, 1.3rem)',
              color: 'var(--parchment)',
              fontStyle: 'italic',
              lineHeight: 1.75,
              textShadow: '0 1px 10px rgba(0,0,0,0.8)',
            }}
          >
            Atlas personnel d'une économie circulaire —<br />
            monde concret et monde du rêve
          </motion.p>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: entered ? 0.4 : 0 }}
          transition={{ delay: 2, duration: 1 }}
          style={{
            position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
            zIndex: 2, textAlign: 'center', pointerEvents: 'none',
          }}
        >
          <div className="font-cinzel text-gold" style={{ fontSize: '0.6rem', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
            ENTRER
          </div>
          <div
            className="scroll-hint"
            style={{
              width: '1px', height: '42px',
              background: 'linear-gradient(to bottom, var(--gold), transparent)',
              margin: '0 auto',
            }}
          />
        </motion.div>
      </div>

      {/* Tomes grid section */}
      <div style={{
        position: 'relative', zIndex: 3,
        padding: '5rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div className="gold-line" style={{ marginBottom: '3.5rem' }}>
          <h2
            className="font-cinzel text-gold"
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', letterSpacing: '0.18em', whiteSpace: 'nowrap', textTransform: 'uppercase' }}
          >
            Les Sept Tomes
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}>
          {TOMES.map((tome, idx) => (
            <motion.button
              key={tome.id}
              className="card-codex"
              onClick={() => navigate(`/tome/${tome.id}`)}
              onMouseEnter={() => setHoveredTome(tome.id)}
              onMouseLeave={() => setHoveredTome(null)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: idx * 0.07, duration: 0.6 }}
              style={{
                padding: '1.6rem',
                textAlign: 'left',
                background: hoveredTome === tome.id
                  ? 'linear-gradient(135deg, rgba(201,168,76,0.07) 0%, var(--velvet) 100%)'
                  : 'var(--velvet)',
                cursor: 'pointer',
                border: '1px solid rgba(201,168,76,0.18)',
                borderRadius: '3px',
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top accent line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: `linear-gradient(to right, transparent, ${tome.couleur}, transparent)`,
                opacity: hoveredTome === tome.id ? 1 : 0.25,
                transition: 'opacity 0.35s',
              }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                <span className="font-cinzel" style={{
                  fontSize: '2rem', color: tome.couleur, lineHeight: 1,
                  textShadow: `0 0 24px ${tome.couleur}55`,
                  minWidth: '3rem',
                }}>
                  {tome.roman}
                </span>
                <div>
                  <div
                    className="title-codex"
                    style={{ color: 'var(--gold-light)', fontSize: '1.05rem', letterSpacing: '0.03em', marginBottom: '0.2rem' }}
                  >
                    {tome.titre}
                  </div>
                  <div style={{ color: 'rgba(245,234,214,0.5)', fontSize: '0.8rem', fontStyle: 'italic', fontFamily: "'EB Garamond', serif" }}>
                    {tome.sousTitre}
                  </div>
                </div>
              </div>

              <p style={{ color: 'rgba(245,234,214,0.7)', fontSize: '0.88rem', lineHeight: 1.65, margin: 0, fontFamily: "'EB Garamond', Georgia, serif" }}>
                {tome.contenu?.trim().split('\n')[1]?.replace(/^##\s*/, '') || tome.sousTitre}
              </p>

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <span className="font-cinzel" style={{
                  fontSize: '0.65rem', letterSpacing: '0.15em', color: tome.couleur,
                  opacity: hoveredTome === tome.id ? 1 : 0,
                  transition: 'opacity 0.3s',
                  textTransform: 'uppercase',
                }}>
                  Lire ce tome →
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Galerie & Index links */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.button
            onClick={() => navigate('/galerie')}
            className="card-codex"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: '1rem 2.5rem',
              background: 'none',
              border: '1px solid rgba(201,168,76,0.28)',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <span className="font-cinzel text-gold" style={{ letterSpacing: '0.14em', fontSize: '0.82rem', textTransform: 'uppercase' }}>
              Galerie des Planches
            </span>
            <div style={{ color: 'rgba(245,234,214,0.48)', fontSize: '0.78rem', marginTop: '0.25rem', fontStyle: 'italic', fontFamily: "'EB Garamond', serif" }}>
              37 planches du Codex
            </div>
          </motion.button>

          <motion.button
            onClick={() => navigate('/index-secrets')}
            className="card-codex"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: '1rem 2.5rem',
              background: 'none',
              border: '1px solid rgba(201,168,76,0.28)',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <span className="font-cinzel text-gold" style={{ letterSpacing: '0.14em', fontSize: '0.82rem', textTransform: 'uppercase' }}>
              Index des Secrets
            </span>
            <div style={{ color: 'rgba(245,234,214,0.48)', fontSize: '0.78rem', marginTop: '0.25rem', fontStyle: 'italic', fontFamily: "'EB Garamond', serif" }}>
              20 concepts clés extraits
            </div>
          </motion.button>
        </div>

        {/* Footer signature */}
        <div style={{ textAlign: 'center', marginTop: '5rem', paddingBottom: '3rem' }}>
          <div className="gold-line" style={{ marginBottom: '1.5rem', opacity: 0.35 }}>
            <span className="font-cinzel" style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--gold-dark)', whiteSpace: 'nowrap' }}>
              ✦
            </span>
          </div>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', 'EB Garamond', Georgia, serif",
              color: 'rgba(245,234,214,0.32)',
              fontSize: '1rem',
              fontStyle: 'italic',
            }}
          >
            « La boucle vous attend. Revenez quand vous voulez. »
          </p>
          <p style={{ color: 'rgba(245,234,214,0.18)', fontSize: '0.72rem', marginTop: '0.5rem', fontFamily: 'Cinzel, serif', letterSpacing: '0.1em' }}>
            Dominic Pelletier · Limoilou, Québec · 2026
          </p>
        </div>
      </div>
    </div>
  )
}
