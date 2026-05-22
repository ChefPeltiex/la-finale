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

const SOURCE_COLOR: Record<string, string> = {
  equations:  '#d4a843',
  culturel:   '#c47ab3',
  musique:    '#89d4a0',
  discipline: '#7eb8d4',
}

export default function CrystalPage({ crystal, index, total, onPrev, onNext, onBack }: Props) {
  const formulaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = formulaRef.current
    if (!el) return
    if (crystal.formule) {
      try {
        katex.render(crystal.formule, el, { throwOnError: false, displayMode: true })
      } catch {
        el.textContent = crystal.formule
      }
    } else {
      el.textContent = ''
    }
  }, [crystal])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') onNext()
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   onPrev()
      if (e.key === 'Escape'     || e.key === 'Backspace')  onBack()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onNext, onPrev, onBack])

  const color = SOURCE_COLOR[crystal.source] ?? '#e8dcc8'

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={crystal.id}
        initial={{ opacity: 0, rotateY: -12 }}
        animate={{ opacity: 1, rotateY: 0 }}
        exit={{ opacity: 0, rotateY: 12 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'relative', zIndex: 5,
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '5rem 2rem 3rem',
        }}
      >
        {/* Back */}
        <button onClick={onBack} style={{
          position: 'fixed', top: 24, left: 28, zIndex: 20,
          background: 'none', border: '1px solid #d4a84344',
          borderRadius: 4, padding: '0.4rem 1rem',
          color: '#d4a843', cursor: 'pointer',
          fontFamily: 'Cormorant Garamond, serif',
          letterSpacing: '0.15em', fontSize: '0.85rem',
        }}>← Portail</button>

        {/* Counter */}
        <p style={{
          position: 'fixed', top: 30, right: 28, zIndex: 20,
          fontFamily: 'Cormorant Garamond, serif',
          color: '#8892a4', fontSize: '0.85rem', letterSpacing: '0.2em',
        }}>{index + 1} / {total}</p>

        {/* Card */}
        <div style={{
          background: 'rgba(5,10,26,0.9)',
          border: `1px solid ${color}44`,
          borderRadius: 12,
          padding: 'clamp(1.8rem, 5vw, 3rem)',
          maxWidth: 700,
          width: '100%',
          boxShadow: `0 0 80px ${color}18`,
          backdropFilter: 'blur(10px)',
        }}>
          {/* Badge discipline */}
          <span style={{
            display: 'inline-block',
            background: `${color}1a`,
            border: `1px solid ${color}55`,
            borderRadius: 4,
            padding: '0.2rem 0.75rem',
            fontSize: '0.68rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color,
            fontFamily: 'Cormorant Garamond, serif',
            marginBottom: '1.2rem',
          }}>{crystal.discipline}</span>

          {/* Title */}
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            color: '#f0f0f0',
            fontSize: 'clamp(1.5rem, 4vw, 2.4rem)',
            fontWeight: 400,
            marginBottom: crystal.formule ? '1.6rem' : '1.2rem',
            lineHeight: 1.2,
          }}>{crystal.titre}</h1>

          {/* Maître */}
          {crystal.maitre && (
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#d4a84399',
              fontSize: '0.88rem',
              letterSpacing: '0.15em',
              marginBottom: '1.2rem',
              fontStyle: 'italic',
            }}>— {crystal.maitre}</p>
          )}

          {/* Formula KaTeX */}
          {crystal.formule && (
            <div style={{
              background: 'rgba(212,168,67,0.05)',
              border: '1px solid #d4a84330',
              borderRadius: 8,
              padding: '1.2rem 1rem',
              marginBottom: '1.6rem',
              textAlign: 'center',
              overflowX: 'auto',
            }}>
              <div ref={formulaRef} style={{ color: '#d4a843' }} />
            </div>
          )}

          {/* Definition */}
          <p style={{
            fontFamily: 'Cormorant Garamond, serif',
            color: '#c8bca8',
            fontSize: '1.05rem',
            lineHeight: 1.8,
            fontWeight: 300,
          }}>{crystal.definition}</p>

          {/* Wikipedia */}
          <a href={crystal.url} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-block',
            marginTop: '1.8rem',
            color: `${color}88`,
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '0.8rem',
            letterSpacing: '0.15em',
            textDecoration: 'none',
            borderBottom: `1px solid ${color}30`,
          }}>Lire sur Wikipédia →</a>
        </div>

        {/* Nav */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', alignItems: 'center' }}>
          <button onClick={onPrev} style={navBtn}>← Précédent</button>
          <span style={{ color: '#3a3040', fontFamily: 'Cormorant Garamond, serif', fontSize: '0.72rem' }}>
            ←  → clavier
          </span>
          <button onClick={onNext} style={navBtn}>Suivant →</button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

const navBtn: React.CSSProperties = {
  background: 'none',
  border: '1px solid #d4a84330',
  borderRadius: 4,
  padding: '0.45rem 1.2rem',
  color: '#d4a843',
  cursor: 'pointer',
  fontFamily: 'Cormorant Garamond, serif',
  fontSize: '0.9rem',
  letterSpacing: '0.1em',
}
