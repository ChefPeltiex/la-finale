import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar.jsx'
import imageDescriptions from '../data/image-descriptions.json'

const ALL_IMAGES = [
  'codex-encyclopedie-1A-couverture',
  'codex-encyclopedie-1B-cadre-or',
  'codex-encyclopedie-1C-fractal-circulaire',
  'codex-encyclopedie-1D-texture-noir-dorures',
  'codex-encyclopedie-2A-titre',
  'codex-encyclopedie-2B-sous-titre',
  'codex-encyclopedie-2C-ligne-editoriale',
  'codex-encyclopedie-3A-sommaire-ornement',
  'codex-encyclopedie-3B-index-visuel',
  'codex-encyclopedie-3C-ornements',
  'codex-encyclopedie-4A-chapitre1-opening',
  'codex-encyclopedie-4B-chapitre1-divider',
  'codex-encyclopedie-4C-chapitre1-icons',
  'codex-encyclopedie-5A-chapitre2-opening',
  'codex-encyclopedie-5B-chapitre2-divider',
  'codex-encyclopedie-5C-chapitre2-footer',
  'codex-encyclopedie-6A-chapitre3-opening',
  'codex-encyclopedie-6B-chapitre3-margin',
  'codex-encyclopedie-6C-chapitre3-corners',
  'codex-encyclopedie-7A-diagramme-abstract',
  'codex-encyclopedie-7B-diagramme-reseau',
  'codex-encyclopedie-7C-diagramme-radial',
  'codex-encyclopedie-8A-medallions',
  'codex-encyclopedie-8B-bordures',
  'codex-encyclopedie-8C-textures',
  'codex-encyclopedie-9A-annexes-tabs',
  'codex-encyclopedie-9B-annexes-grille',
  'codex-encyclopedie-9C-annexes-sceaux',
  'codex-encyclopedie-10A-credits-header',
  'codex-encyclopedie-10B-colophon-divider',
  'codex-encyclopedie-10C-colophon-footer',
  'codex-encyclopedie-11A-dos-spine',
  'codex-encyclopedie-11B-tranche',
  'codex-encyclopedie-11C-tranche-top',
  'codex-encyclopedie-12A-fermeture-sceau',
  'codex-encyclopedie-12B-fermeture-rubans',
  'codex-encyclopedie-12C-fermeture-vignette',
]

const CATEGORIES = ['Toutes', 'couverture', 'ornement', 'chapitre', 'diagramme', 'medallion', 'annexe', 'colophon', 'reliure', 'fermeture']

export default function GaleriePage() {
  const navigate = useNavigate()
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [filter, setFilter] = useState('Toutes')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0 })
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  const getInfo = (key) => imageDescriptions[key] || {
    title: key.split('-').slice(3).join(' '),
    description: 'Planche du Codex Magique.',
    category: 'ornement',
  }

  const filteredImages = ALL_IMAGES.filter(key => {
    if (filter === 'Toutes') return true
    return getInfo(key).category === filter
  })

  const handleKey = useCallback((e) => {
    if (selectedIdx === null) return
    if (e.key === 'Escape') setSelectedIdx(null)
    if (e.key === 'ArrowRight') setSelectedIdx(i => Math.min(i + 1, filteredImages.length - 1))
    if (e.key === 'ArrowLeft') setSelectedIdx(i => Math.max(i - 1, 0))
  }, [selectedIdx, filteredImages.length])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--night)' }}>
      <NavBar />

      {/* Header */}
      <div style={{
        paddingTop: '7rem',
        paddingBottom: '2rem',
        textAlign: 'center',
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}>
        <div className="font-cinzel text-gold" style={{
          fontSize: '0.68rem', letterSpacing: '0.3em', textTransform: 'uppercase',
          marginBottom: '0.75rem', opacity: 0.65,
        }}>
          Encyclopédie du Codex Magique
        </div>
        <h1 className="font-cinzel" style={{
          fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
          color: 'var(--gold-light)',
          marginBottom: '0.75rem',
          textShadow: '0 0 40px rgba(201,168,76,0.25)',
        }}>
          Galerie des Planches
        </h1>
        <p className="font-garamond" style={{
          color: 'rgba(245,234,214,0.6)', fontSize: '1.05rem',
          fontStyle: 'italic', marginBottom: '2rem',
        }}>
          37 planches visuelles du Codex — descriptions authentiques
        </p>

        {/* Category filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', padding: '0 1rem' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '0.35rem 0.9rem',
                background: filter === cat ? 'rgba(201,168,76,0.15)' : 'transparent',
                border: `1px solid ${filter === cat ? 'rgba(201,168,76,0.6)' : 'rgba(201,168,76,0.2)'}`,
                color: filter === cat ? 'var(--gold)' : 'rgba(245,234,214,0.5)',
                fontFamily: "'Cinzel', serif",
                fontSize: '0.68rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: '2px',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery grid */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem 1.5rem 4rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1rem',
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.8s ease 0.2s',
      }}>
        {filteredImages.map((key, idx) => {
          const info = getInfo(key)
          return (
            <div
              key={key}
              className="img-gallery-item"
              onClick={() => setSelectedIdx(idx)}
              style={{ aspectRatio: '1 / 1', position: 'relative', overflow: 'hidden', background: 'var(--velvet)' }}
            >
              <img
                src={`/codex-images/${key}.png`}
                alt={info.title}
                loading="lazy"
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transition: 'transform 0.4s ease',
                  display: 'block',
                }}
                onMouseOver={e => e.target.style.transform = 'scale(1.08)'}
                onMouseOut={e => e.target.style.transform = 'scale(1)'}
              />
              {/* Overlay on hover */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(10,6,8,0.9) 0%, transparent 50%)',
                opacity: 0,
                transition: 'opacity 0.3s',
                display: 'flex', alignItems: 'flex-end', padding: '0.75rem',
                pointerEvents: 'none',
              }}
                className="gallery-overlay"
              >
                <div>
                  <div className="font-cinzel" style={{ color: 'var(--gold)', fontSize: '0.7rem', letterSpacing: '0.06em' }}>
                    {info.title}
                  </div>
                </div>
              </div>
              {/* Always visible title at bottom */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(10,6,8,0.88) 0%, transparent 100%)',
                padding: '0.5rem 0.6rem 0.4rem',
              }}>
                <div className="font-cinzel" style={{
                  color: 'var(--gold)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.04em',
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {info.title}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Lightbox */}
      {selectedIdx !== null && (
        <div
          className="lightbox-overlay"
          onClick={() => setSelectedIdx(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              width: '100%',
            }}
          >
            {/* Image */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', overflow: 'hidden', borderRadius: '3px', border: '1px solid rgba(201,168,76,0.3)' }}>
              <img
                src={`/codex-images/${filteredImages[selectedIdx]}.png`}
                alt={getInfo(filteredImages[selectedIdx]).title}
                style={{ maxHeight: '65vh', maxWidth: '100%', objectFit: 'contain', display: 'block' }}
              />
            </div>

            {/* Info */}
            <div style={{ background: 'rgba(18,13,20,0.95)', padding: '1.25rem', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '3px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h2 className="font-cinzel" style={{ color: 'var(--gold-light)', fontSize: '1.1rem' }}>
                  {getInfo(filteredImages[selectedIdx]).title}
                </h2>
                <span style={{
                  background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)',
                  color: 'var(--gold)', padding: '0.2rem 0.6rem', fontSize: '0.65rem',
                  fontFamily: 'Cinzel', textTransform: 'uppercase', letterSpacing: '0.1em',
                }}>
                  {getInfo(filteredImages[selectedIdx]).category}
                </span>
              </div>
              <p className="font-garamond" style={{ color: 'rgba(245,234,214,0.8)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                {getInfo(filteredImages[selectedIdx]).description}
              </p>
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => setSelectedIdx(i => Math.max(i - 1, 0))}
                disabled={selectedIdx === 0}
                style={{
                  background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)',
                  color: 'var(--gold)', padding: '0.5rem 1.25rem', cursor: 'pointer',
                  fontFamily: 'Cinzel', fontSize: '0.75rem', letterSpacing: '0.1em',
                  opacity: selectedIdx === 0 ? 0.3 : 1,
                }}
              >
                ← Précédente
              </button>
              <span style={{ color: 'rgba(245,234,214,0.35)', fontFamily: 'Cinzel', fontSize: '0.68rem', letterSpacing: '0.1em' }}>
                {selectedIdx + 1} / {filteredImages.length}
              </span>
              <button
                onClick={() => setSelectedIdx(i => Math.min(i + 1, filteredImages.length - 1))}
                disabled={selectedIdx === filteredImages.length - 1}
                style={{
                  background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)',
                  color: 'var(--gold)', padding: '0.5rem 1.25rem', cursor: 'pointer',
                  fontFamily: 'Cinzel', fontSize: '0.75rem', letterSpacing: '0.1em',
                  opacity: selectedIdx === filteredImages.length - 1 ? 0.3 : 1,
                }}
              >
                Suivante →
              </button>
            </div>

            <button
              onClick={() => setSelectedIdx(null)}
              style={{
                position: 'fixed', top: '1.5rem', right: '1.5rem',
                background: 'rgba(10,6,8,0.8)', border: '1px solid rgba(201,168,76,0.3)',
                color: 'var(--gold)', width: '2.5rem', height: '2.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '1.2rem', borderRadius: '50%',
              }}
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
