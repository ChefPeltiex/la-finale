import { useState, useMemo, useCallback, useEffect } from 'react'
import StarField from './components/StarField'
import IntroCrawl from './components/IntroCrawl'
import ChooseDestiny from './components/ChooseDestiny'
import CrystalPage from './components/CrystalPage'
import Navigation from './components/Navigation'
import type { Crystal } from './data/crystals'

type Phase = 'crawl' | 'hub' | 'nav' | 'crystal'

export default function App() {
  const [allCrystals, setAllCrystals] = useState<Crystal[]>([])
  const [phase, setPhase] = useState<Phase>('crawl')
  const [filter, setFilter] = useState<string>('all')
  const [crystalIndex, setCrystalIndex] = useState(0)

  // Load crystals.json from public/
  useEffect(() => {
    fetch('/crystals.json')
      .then(r => r.json())
      .then((data: Crystal[]) => setAllCrystals(data))
      .catch(console.error)
  }, [])

  const filtered = useMemo(() => {
    if (filter === 'all') return allCrystals
    return allCrystals.filter(c => c.source === filter)
  }, [allCrystals, filter])

  const handleCrawlFinish = useCallback(() => setPhase('hub'), [])

  const handleDoorSelect = useCallback((id: string) => {
    if (id === 'random') {
      if (!allCrystals.length) return
      setFilter('all')
      setCrystalIndex(Math.floor(Math.random() * allCrystals.length))
      setPhase('crystal')
    } else if (id === 'all') {
      setFilter('all')
      setPhase('nav')
    } else {
      setFilter(id)
      setPhase('nav')
    }
  }, [allCrystals])

  const handleNavSelect = useCallback((idx: number) => {
    setCrystalIndex(idx)
    setPhase('crystal')
  }, [])

  const handlePrev = useCallback(() => {
    setCrystalIndex(i => (i - 1 + filtered.length) % filtered.length)
  }, [filtered.length])

  const handleNext = useCallback(() => {
    setCrystalIndex(i => (i + 1) % filtered.length)
  }, [filtered.length])

  const backToHub = useCallback(() => setPhase('hub'), [])
  const backToNav = useCallback(() => setPhase('nav'), [])

  return (
    <>
      <StarField />

      {phase === 'crawl' && <IntroCrawl onFinish={handleCrawlFinish} />}

      {phase === 'hub' && <ChooseDestiny onSelect={handleDoorSelect} />}

      {phase === 'nav' && (
        <Navigation
          crystals={filter === 'all' ? allCrystals : filtered}
          onSelect={handleNavSelect}
          onBack={backToHub}
        />
      )}

      {phase === 'crystal' && filtered[crystalIndex] && (
        <CrystalPage
          crystal={filtered[crystalIndex]}
          index={crystalIndex}
          total={filtered.length}
          onPrev={handlePrev}
          onNext={handleNext}
          onBack={backToNav}
        />
      )}

      {/* Loading indicator */}
      {allCrystals.length === 0 && phase !== 'crawl' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 30,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#050a1a',
        }}>
          <p style={{
            fontFamily: 'Cormorant Garamond, serif',
            color: '#d4a843', letterSpacing: '0.3em', fontSize: '1rem',
          }}>Chargement du Bréviaire…</p>
        </div>
      )}
    </>
  )
}
