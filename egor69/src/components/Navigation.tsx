import { useState } from 'react'
import type { Crystal } from '../data/crystals'

interface Props {
  crystals: Crystal[]
  onSelect: (idx: number) => void
  onBack: () => void
}

type Mode = 'discipline' | 'source' | 'search' | 'random'

export default function Navigation({ crystals, onSelect, onBack }: Props) {
  const [mode, setMode] = useState<Mode>('discipline')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  // group by discipline
  const byDiscipline = crystals.reduce<Record<string, number[]>>((acc, c, i) => {
    const key = c.discipline || 'Autre';
    (acc[key] = acc[key] || []).push(i)
    return acc
  }, {})

  // group by source
  const bySource = crystals.reduce<Record<string, number[]>>((acc, c, i) => {
    (acc[c.source] = acc[c.source] || []).push(i)
    return acc
  }, {})

  const sourceLabel: Record<string, string> = {
    equations: 'Équations', culturel: 'Arts & Culture',
    musique: 'Musique', discipline: 'Disciplines',
  }

  const filtered = query.length >= 2
    ? crystals.reduce<{ c: Crystal; i: number }[]>((acc, c, i) => {
        const q = query.toLowerCase()
        if (c.titre.toLowerCase().includes(q) || c.definition.toLowerCase().includes(q))
          acc.push({ c, i })
        return acc
      }, []).slice(0, 60)
    : []

  const groupMap = mode === 'discipline' ? byDiscipline : bySource
  const groupLabel = mode === 'source' ? sourceLabel : undefined

  return (
    <div style={{
      position: 'relative', zIndex: 5,
      minHeight: '100vh',
      padding: '5rem 1.5rem 3rem',
      maxWidth: 920, margin: '0 auto',
    }}>
      {/* Back */}
      <button onClick={onBack} style={{
        position: 'fixed', top: 24, left: 28, zIndex: 20,
        background: 'none', border: '1px solid #d4a84340',
        borderRadius: 4, padding: '0.4rem 1rem',
        color: '#d4a843', cursor: 'pointer',
        fontFamily: 'Cormorant Garamond, serif',
        letterSpacing: '0.15em', fontSize: '0.85rem',
      }}>← Portails</button>

      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {(['discipline', 'source', 'search', 'random'] as Mode[]).map(m => (
          <button key={m} onClick={() => { setMode(m); setSelected(null); setQuery('') }} style={{
            background: mode === m ? '#d4a84322' : 'transparent',
            border: `1px solid ${mode === m ? '#d4a843' : '#d4a84340'}`,
            borderRadius: 4, padding: '0.35rem 0.9rem',
            color: mode === m ? '#d4a843' : '#8892a4',
            cursor: 'pointer',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '0.85rem', letterSpacing: '0.12em',
          }}>
            {{ discipline: 'Discipline', source: 'Corpus', search: 'Recherche', random: 'Aléatoire' }[m]}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', color: '#3a3040', fontFamily: 'Cormorant Garamond, serif', fontSize: '0.78rem', alignSelf: 'center' }}>
          {crystals.length} cristaux
        </span>
      </div>

      {/* RANDOM */}
      {mode === 'random' && (
        <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', color: '#8892a4', marginBottom: '2rem', fontSize: '1rem' }}>
            Ouvre un cristal au hasard.
          </p>
          <button onClick={() => onSelect(Math.floor(Math.random() * crystals.length))} style={{
            background: '#d4a84318', border: '1px solid #d4a84360',
            borderRadius: 8, padding: '1rem 2.5rem',
            color: '#d4a843', cursor: 'pointer',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.1rem', letterSpacing: '0.15em',
          }}>Cristal aléatoire →</button>
        </div>
      )}

      {/* SEARCH */}
      {mode === 'search' && (
        <div>
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un cristal…"
            style={{
              width: '100%', background: 'rgba(5,10,26,0.8)',
              border: '1px solid #d4a84340', borderRadius: 6,
              padding: '0.75rem 1rem', color: '#f0f0f0',
              fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem',
              marginBottom: '1.5rem', outline: 'none',
            }}
          />
          {query.length >= 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '0.75rem' }}>
              {filtered.map(({ c, i }) => (
                <CrystalCard key={c.id} crystal={c} onClick={() => onSelect(i)} />
              ))}
              {filtered.length === 0 && (
                <p style={{ color: '#3a3040', fontFamily: 'Cormorant Garamond, serif' }}>Aucun résultat.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* GROUPED (discipline or source) */}
      {(mode === 'discipline' || mode === 'source') && (
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {/* Left: group list */}
          <div style={{ width: 200, flexShrink: 0 }}>
            {Object.keys(groupMap).sort().map(key => (
              <button key={key} onClick={() => setSelected(key)} style={{
                display: 'block', width: '100%', textAlign: 'left',
                background: selected === key ? '#d4a84318' : 'transparent',
                border: 'none', borderLeft: `2px solid ${selected === key ? '#d4a843' : 'transparent'}`,
                padding: '0.35rem 0.75rem',
                color: selected === key ? '#d4a843' : '#8892a4',
                cursor: 'pointer',
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '0.82rem', letterSpacing: '0.08em',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {groupLabel?.[key] ?? key}
                <span style={{ color: '#3a3040', fontSize: '0.7rem', marginLeft: '0.4rem' }}>
                  ({groupMap[key].length})
                </span>
              </button>
            ))}
          </div>
          {/* Right: crystals in selected group */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '0.75rem', alignContent: 'start' }}>
            {selected && groupMap[selected]?.map(i => (
              <CrystalCard key={crystals[i].id} crystal={crystals[i]} onClick={() => onSelect(i)} />
            ))}
            {!selected && (
              <p style={{ color: '#3a3040', fontFamily: 'Cormorant Garamond, serif', fontSize: '0.9rem', gridColumn: '1/-1' }}>
                ← Sélectionne une catégorie
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function CrystalCard({ crystal, onClick }: { crystal: Crystal; onClick: () => void }) {
  const sourceColor: Record<string, string> = {
    equations: '#d4a843', culturel: '#c47ab3',
    musique: '#89d4a0', discipline: '#7eb8d4',
  }
  const color = sourceColor[crystal.source] ?? '#e8dcc8'
  return (
    <button onClick={onClick} style={{
      background: 'rgba(255,255,255,0.025)',
      border: `1px solid ${color}30`,
      borderRadius: 8, padding: '0.9rem',
      cursor: 'pointer', textAlign: 'left',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)' }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)' }}
    >
      <p style={{ fontFamily: 'Cormorant Garamond, serif', color: '#f0f0f0', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.25rem' }}>
        {crystal.titre}
      </p>
      <p style={{ fontFamily: 'Cormorant Garamond, serif', color, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        {crystal.discipline}
      </p>
    </button>
  )
}
