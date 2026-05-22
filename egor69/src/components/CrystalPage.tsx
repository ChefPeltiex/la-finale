import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import katex from 'katex'
import type { Crystal } from '../data/crystals'

interface Props {
  crystal: Crystal
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
  onBack: () => void
}

export default function CrystalPage({ crystal, index, total, onPrev, onNext, onBack }: Props) {
  const formulaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (formulaRef.current && crystal.formula) {
      try {
        katex.render(crystal.formula, formulaRef.current, {
          throwOnError: false,
          displayMode: true,
        })
      } catch {
        if (formulaRef.current) {
          formulaRef.current.textContent = crystal.formula
        }
      }
    }
  }, [crystal])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') onNext()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') onPrev()
      if (e.key === 'Escape' || e.key === 'Backspace') onBack()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onNext, onPrev, onBack])

  const domainColor: Record<string, string> = {
    formule: '#d4af37', science: '#7eb8d4', art: '#c47ab3',
    musique: '#89d4a0', loisir: '#d4a07e', default: '#e8dcc8',
  }
  const color = domainColor[crystal.domain] ?? domainColor['default']

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={crystal.id}
        initial={{ opacity: 0, rotateY: -15 }}
        animate={{ opacity: 1, rotateY: 0 }}
        exit={{ opacity: 0, rotateY: 15 }}
        transition={{ duration: 0.45 }}
        style={{
          position: 'relative', zIndex: 5,
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '2rem',
        }}
      >
        {/* Back button */}
        <button
          onClick={onBack}
          style={{
            position: 'absolute', top: 24, left: 28,
            background: 'none', border: '1px solid #d4af3733',
            borderRadius: 4, padding: '0.4rem 1rem',
            color: '#d4af37', cursor: 'pointer',
            fontFamily: 'Cormorant Garamond, serif',
            letterSpacing: '0.15em', fontSize: '0.85rem',
          }}
        >← Portail</button>

        {/* Counter */}
        <p style={{
          position: 'absolute', top: 30, right: 28,
          fontFamily: 'Cormorant Garamond, serif',
          color: '#a09080', fontSize: '0.85rem', letterSpacing: '0.2em',
        }}>
          {index + 1} / {total}
        </p>

        {/* Card */}
        <div style={{
          background: 'rgba(10,8,20,0.85)',
          border: `1px solid ${color}44`,
          borderRadius: 12,
          padding: 'clamp(2rem, 5vw, 3rem)',
          maxWidth: 680,
          width: '100%',
          boxShadow: `0 0 80px ${color}1a`,
          backdropFilter: 'blur(8px)',
        }}>
          {/* Domain badge */}
          <span style={{
            display: 'inline-block',
            background: `${color}22`,
            border: `1px solid ${color}55`,
            borderRadius: 4,
            padding: '0.2rem 0.7rem',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color,
            fontFamily: 'Cormorant Garamond, serif',
            marginBottom: '1.2rem',
          }}>
            {crystal.category}
          </span>

          {/* Title */}
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            color: '#e8dcc8',
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
            fontWeight: 400,
            marginBottom: '1.4rem',
            lineHeight: 1.25,
          }}>
            {crystal.title}
          </h1>

          {/* Formula */}
          {crystal.formula && (
            <div style={{
              background: 'rgba(212,175,55,0.06)',
              border: '1px solid #d4af3733',
              borderRadius: 8,
              padding: '1.2rem',
              marginBottom: '1.6rem',
              textAlign: 'center',
              overflowX: 'auto',
            }}>
              <div ref={formulaRef} style={{ color: '#d4af37' }} />
            </div>
          )}

          {/* Summary */}
          <p style={{
            fontFamily: 'Cormorant Garamond, serif',
            color: '#c8bca8',
            fontSize: '1.05rem',
            lineHeight: 1.75,
            fontWeight: 300,
          }}>
            {crystal.summary}
          </p>

          {/* Wikipedia link */}
          <a
            href={crystal.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              marginTop: '1.6rem',
              color: `${color}99`,
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '0.82rem',
              letterSpacing: '0.15em',
              textDecoration: 'none',
              borderBottom: `1px solid ${color}33`,
            }}
          >
            Lire sur Wikipédia →
          </a>
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex', gap: '1.5rem', marginTop: '2rem',
          alignItems: 'center',
        }}>
          <button onClick={onPrev} style={navBtnStyle}>← Précédent</button>
          <span style={{ color: '#60504a', fontFamily: 'Cormorant Garamond, serif', fontSize: '0.75rem' }}>
            ← → ou touches clavier
          </span>
          <button onClick={onNext} style={navBtnStyle}>Suivant →</button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

const navBtnStyle: React.CSSProperties = {
  background: 'none',
  border: '1px solid #d4af3733',
  borderRadius: 4,
  padding: '0.45rem 1.2rem',
  color: '#d4af37',
  cursor: 'pointer',
  fontFamily: 'Cormorant Garamond, serif',
  fontSize: '0.9rem',
  letterSpacing: '0.1em',
}
