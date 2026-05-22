import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { TOMES, TOME_BY_ID } from '../data/tomes.js'
import NavBar from '../components/NavBar.jsx'

function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="reading-progress-bar" style={{ width: `${progress}%` }} />
  )
}

export default function TomePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [revealed, setRevealed] = useState(false)
  const contentRef = useRef(null)

  const tome = TOME_BY_ID[parseInt(id)] || TOMES[0]
  const tomeIndex = TOMES.findIndex(t => t.id === tome.id)
  const prevTome = tomeIndex > 0 ? TOMES[tomeIndex - 1] : null
  const nextTome = tomeIndex < TOMES.length - 1 ? TOMES[tomeIndex + 1] : null

  useEffect(() => {
    window.scrollTo({ top: 0 })
    setRevealed(false)
    const t = setTimeout(() => setRevealed(true), 80)
    return () => clearTimeout(t)
  }, [id])

  const coverImage = tome.image || `codex-encyclopedie-${tome.domaines?.[0] ? '4A-chapitre1-opening' : '1A-couverture'}.png`

  return (
    <div style={{ minHeight: '100vh', background: 'var(--night)' }}>
      <ReadingProgress />
      <NavBar />

      {/* Hero banner */}
      <div style={{
        position: 'relative',
        height: '42vh',
        minHeight: '280px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        paddingBottom: '3rem',
      }}>
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `url(/codex-images/${coverImage}) center/cover no-repeat`,
          filter: 'brightness(0.25) saturate(0.6)',
          transform: 'scale(1.05)',
        }} />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,6,8,0.3) 0%, rgba(10,6,8,0.7) 60%, var(--night) 100%)',
        }} />

        {/* Animated particles */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="hero-particle animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                background: `rgba(201,168,76,${Math.random() * 0.5 + 0.2})`,
                animationDuration: `${Math.random() * 3 + 4}s`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        <div style={{
          position: 'relative', zIndex: 2,
          maxWidth: '900px', margin: '0 auto', padding: '0 2rem',
          width: '100%',
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          <div className="font-cinzel" style={{
            fontSize: '0.7rem', letterSpacing: '0.25em', color: 'var(--gold)',
            textTransform: 'uppercase', marginBottom: '0.6rem', opacity: 0.75,
          }}>
            Encyclopédie du Codex Magique
          </div>
          <h1 className="font-cinzel" style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
            color: 'var(--gold-light)',
            lineHeight: 1.15,
            marginBottom: '0.5rem',
            textShadow: '0 0 40px rgba(201,168,76,0.3)',
          }}>
            {tome.roman} — {tome.titre}
          </h1>
          <p className="font-garamond" style={{
            color: 'rgba(245,234,214,0.7)',
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            fontStyle: 'italic',
          }}>
            {tome.sousTitre}
          </p>
        </div>
      </div>

      {/* Lettre du seuil */}
      {tome.seuil && (
        <div style={{
          maxWidth: '700px', margin: '0 auto', padding: '2.5rem 2rem 0',
          opacity: revealed ? 1 : 0,
          transition: 'opacity 0.8s ease 0.3s',
        }}>
          <div style={{
            borderLeft: '3px solid var(--gold)',
            paddingLeft: '1.5rem',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
          }}>
            <div className="font-cinzel" style={{
              fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--gold)',
              textTransform: 'uppercase', marginBottom: '0.75rem', opacity: 0.65,
            }}>
              Lettre du seuil
            </div>
            <div className="prose-codex" style={{ maxWidth: '100%' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {tome.seuil}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{
        maxWidth: '760px',
        margin: '0 auto',
        padding: '3rem 2rem 2rem',
        opacity: revealed ? 1 : 0,
        transition: 'opacity 0.8s ease 0.5s',
      }}>
        {/* Gold ornament */}
        <div className="gold-line" style={{ marginBottom: '3rem' }}>
          <span className="font-cinzel" style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: 'var(--gold-dark)', whiteSpace: 'nowrap' }}>
            ✦ ✦ ✦
          </span>
        </div>

        {/* Markdown content */}
        <div className="prose-codex" ref={contentRef}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {tome.contenu || '*Ce tome est en cours de rédaction.*'}
          </ReactMarkdown>
        </div>

        {/* Planche images */}
        {tome.domaines && tome.domaines.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <div className="gold-line" style={{ marginBottom: '1.5rem' }}>
              <span className="font-cinzel" style={{
                fontSize: '0.68rem', letterSpacing: '0.2em',
                color: 'var(--gold)', textTransform: 'uppercase', whiteSpace: 'nowrap',
              }}>
                Domaines de ce tome
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {tome.domaines.map((d) => (
                <span key={d} style={{
                  background: 'rgba(201,168,76,0.08)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  color: 'var(--gold)',
                  padding: '0.3rem 0.85rem',
                  fontSize: '0.78rem',
                  fontFamily: "'Cinzel', serif",
                  letterSpacing: '0.05em',
                  borderRadius: '2px',
                }}>
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Navigation entre tomes */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '4rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(201,168,76,0.15)',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          {prevTome ? (
            <button
              className="card-codex"
              onClick={() => navigate(`/tome/${prevTome.id}`)}
              style={{ padding: '0.75rem 1.25rem', background: 'none', border: '1px solid rgba(201,168,76,0.2)', cursor: 'pointer', textAlign: 'left' }}
            >
              <div style={{ color: 'rgba(245,234,214,0.4)', fontSize: '0.65rem', letterSpacing: '0.15em', fontFamily: 'Cinzel', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                ← Tome précédent
              </div>
              <div className="font-cinzel text-gold" style={{ fontSize: '0.85rem' }}>
                {prevTome.roman} — {prevTome.titre}
              </div>
            </button>
          ) : <div />}

          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            className="nav-link"
          >
            ↑ Accueil
          </button>

          {nextTome ? (
            <button
              className="card-codex"
              onClick={() => navigate(`/tome/${nextTome.id}`)}
              style={{ padding: '0.75rem 1.25rem', background: 'none', border: '1px solid rgba(201,168,76,0.2)', cursor: 'pointer', textAlign: 'right' }}
            >
              <div style={{ color: 'rgba(245,234,214,0.4)', fontSize: '0.65rem', letterSpacing: '0.15em', fontFamily: 'Cinzel', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Tome suivant →
              </div>
              <div className="font-cinzel text-gold" style={{ fontSize: '0.85rem' }}>
                {nextTome.roman} — {nextTome.titre}
              </div>
            </button>
          ) : <div />}
        </div>
      </div>
    </div>
  )
}
