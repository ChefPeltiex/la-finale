import { useState, useMemo, useCallback } from 'react'
import StarField from './components/StarField'
import IntroCrawl from './components/IntroCrawl'
import ChooseDestiny from './components/ChooseDestiny'
import CrystalPage from './components/CrystalPage'
import { crystals } from './data/crystals'
import type { Crystal } from './data/crystals'

type Phase = 'crawl' | 'hub' | 'list' | 'crystal'

export default function App() {
  const [phase, setPhase] = useState<Phase>('crawl')
  const [domain, setDomain] = useState<string>('all')
  const [crystalIndex, setCrystalIndex] = useState(0)

  const filtered = useMemo(() => {
    if (domain === 'all') return crystals
    return crystals.filter(c => c.domain === domain)
  }, [domain])

  const handleCrawlFinish = useCallback(() => setPhase('hub'), [])

  const handleDoorSelect = useCallback((d: string) => {
    if (d === 'random') {
      const idx = Math.floor(Math.random() * crystals.length)
      setDomain('all')
      setCrystalIndex(idx)
      setPhase('crystal')
    } else {
      setDomain(d)
      setCrystalIndex(0)
      setPhase('list')
    }
  }, [])

  const handleListCrystalSelect = useCallback((idx: number) => {
    setCrystalIndex(idx)
    setPhase('crystal')
  }, [])

  const handlePrev = useCallback(() => {
    setCrystalIndex(i => (i - 1 + filtered.length) % filtered.length)
  }, [filtered.length])

  const handleNext = useCallback(() => {
    setCrystalIndex(i => (i + 1) % filtered.length)
  }, [filtered.length])

  const handleBackToHub = useCallback(() => setPhase('hub'), [])
  const handleBackToList = useCallback(() => setPhase('list'), [])

  return (
    <>
      <StarField />

      {phase === 'crawl' && (
        <IntroCrawl onFinish={handleCrawlFinish} />
      )}

      {phase === 'hub' && (
        <ChooseDestiny onSelect={handleDoorSelect} />
      )}

      {phase === 'list' && (
        <ListPage
          crystals={filtered}
          domain={domain}
          onSelect={handleListCrystalSelect}
          onBack={handleBackToHub}
        />
      )}

      {phase === 'crystal' && filtered[crystalIndex] && (
        <CrystalPage
          crystal={filtered[crystalIndex]}
          index={crystalIndex}
          total={filtered.length}
          onPrev={handlePrev}
          onNext={handleNext}
          onBack={handleBackToList}
        />
      )}
    </>
  )
}

// Inline list page component
interface ListPageProps {
  crystals: Crystal[]
  domain: string
  onSelect: (idx: number) => void
  onBack: () => void
}

function ListPage({ crystals, domain, onSelect, onBack }: ListPageProps) {
  const domainColor: Record<string, string> = {
    formule: '#d4af37', science: '#7eb8d4', art: '#c47ab3',
    musique: '#89d4a0', loisir: '#d4a07e', all: '#e8dcc8', default: '#e8dcc8',
  }
  const color = domainColor[domain] ?? domainColor['default']

  return (
    <div style={{
      position: 'relative', zIndex: 5,
      minHeight: '100vh',
      padding: '5rem 2rem 3rem',
      maxWidth: 900,
      margin: '0 auto',
    }}>
      <button
        onClick={onBack}
        style={{
          position: 'fixed', top: 24, left: 28, zIndex: 20,
          background: 'none', border: '1px solid #d4af3733',
          borderRadius: 4, padding: '0.4rem 1rem',
          color: '#d4af37', cursor: 'pointer',
          fontFamily: 'Cormorant Garamond, serif',
          letterSpacing: '0.15em', fontSize: '0.85rem',
        }}
      >← Portails</button>

      <h2 style={{
        fontFamily: 'Cormorant Garamond, serif',
        color,
        fontSize: '2rem',
        fontWeight: 300,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginBottom: '2.5rem',
        textAlign: 'center',
      }}>
        {domain === 'all' ? 'Tous les Cristaux' : domain.charAt(0).toUpperCase() + domain.slice(1)}
        <span style={{ color: '#60504a', fontSize: '0.9rem', marginLeft: '1rem' }}>
          ({crystals.length})
        </span>
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1rem',
      }}>
        {crystals.map((c, i) => (
          <button
            key={c.id}
            onClick={() => onSelect(i)}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${color}33`,
              borderRadius: 8,
              padding: '1.2rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = `${color}77`
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = `${color}33`
            }}
          >
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#e8dcc8',
              fontSize: '1rem',
              fontWeight: 500,
              marginBottom: '0.3rem',
            }}>{c.title}</p>
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#7a6a5a',
              fontSize: '0.78rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>{c.category}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
