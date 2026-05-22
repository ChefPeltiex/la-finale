import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CONCEPTS_CLES, DOMAINES, TOMES } from '../data/tomes.js'
import NavBar from '../components/NavBar.jsx'

export default function IndexPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0 })
    const t = setTimeout(() => setLoaded(true), 80)
    return () => clearTimeout(t)
  }, [])

  const filtered = CONCEPTS_CLES.filter(c =>
    c.terme.toLowerCase().includes(search.toLowerCase()) ||
    c.definition.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--night)' }}>
      <NavBar />

      {/* Header */}
      <div style={{
        paddingTop: '7rem', paddingBottom: '1.5rem', textAlign: 'center',
        opacity: loaded ? 1 : 0, transition: 'opacity 0.8s ease',
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
          Index des Secrets
        </h1>
        <p className="font-garamond" style={{
          color: 'rgba(245,234,214,0.6)', fontSize: '1.05rem', fontStyle: 'italic',
          marginBottom: '2rem',
        }}>
          20 concepts clés extraits des sources authentiques
        </p>

        {/* Search */}
        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 1.5rem' }}>
          <input
            type="text"
            placeholder="Chercher un concept..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(201,168,76,0.04)',
              border: '1px solid rgba(201,168,76,0.25)',
              color: 'var(--parchment)',
              padding: '0.75rem 1.25rem',
              fontSize: '0.9rem',
              fontFamily: "'EB Garamond', serif",
              outline: 'none',
              borderRadius: '2px',
              boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.6)'}
            onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.25)'}
          />
        </div>
      </div>

      <div style={{
        maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem',
        opacity: loaded ? 1 : 0, transition: 'opacity 0.8s ease 0.2s',
      }}>

        {/* Concepts list */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'rgba(245,234,214,0.35)', padding: '3rem', fontFamily: 'Cinzel', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
            Aucun concept trouvé
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1rem' }}>
            {filtered.map((c, i) => (
              <div
                key={c.terme}
                className="card-codex"
                style={{
                  padding: '1.25rem 1.5rem',
                  animationDelay: `${i * 0.04}s`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className="font-cinzel" style={{ color: 'var(--gold)', fontSize: '0.95rem', letterSpacing: '0.04em' }}>
                    {c.terme}
                  </span>
                  <button
                    onClick={() => {
                      const tome = TOMES.find(t => t.roman === c.tome || t.num === c.tome)
                      if (tome) navigate(`/tome/${tome.id}`)
                    }}
                    style={{
                      background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)',
                      color: 'var(--gold)', padding: '0.15rem 0.55rem',
                      fontSize: '0.6rem', fontFamily: 'Cinzel',
                      letterSpacing: '0.1em', cursor: 'pointer',
                      textTransform: 'uppercase', flexShrink: 0,
                    }}
                  >
                    Tome {c.tome}
                  </button>
                </div>
                <p style={{
                  color: 'rgba(245,234,214,0.72)', fontSize: '0.88rem',
                  lineHeight: 1.65, margin: 0,
                }}>
                  {c.definition}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Les 14 Domaines section */}
        <div style={{ marginTop: '4rem' }}>
          <div className="gold-line" style={{ marginBottom: '2rem' }}>
            <h2 className="font-cinzel" style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', letterSpacing: '0.15em',
              color: 'var(--gold)', textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}>
              Les 14 Domaines
            </h2>
          </div>

          <div style={{ overflowX: 'auto', borderRadius: '3px', border: '1px solid rgba(201,168,76,0.15)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
                  {['Code', 'Domaine', 'Monde'].map(h => (
                    <th key={h} style={{
                      padding: '0.75rem 1rem', textAlign: 'left',
                      fontFamily: 'Cinzel', fontSize: '0.65rem', letterSpacing: '0.15em',
                      color: 'var(--gold)', textTransform: 'uppercase',
                      background: 'rgba(201,168,76,0.04)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(DOMAINES).map(([code, name], i) => {
                  const tome = TOMES.find(t => t.domaines?.includes(code))
                  return (
                    <tr
                      key={code}
                      style={{
                        borderBottom: '1px solid rgba(201,168,76,0.07)',
                        background: i % 2 === 0 ? 'transparent' : 'rgba(201,168,76,0.02)',
                        transition: 'background 0.2s',
                        cursor: tome ? 'pointer' : 'default',
                      }}
                      onClick={() => tome && navigate(`/tome/${tome.id}`)}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(201,168,76,0.06)'}
                      onMouseOut={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(201,168,76,0.02)'}
                    >
                      <td style={{ padding: '0.65rem 1rem', fontFamily: 'Cinzel', color: 'var(--gold)', fontSize: '0.78rem' }}>{code}</td>
                      <td style={{ padding: '0.65rem 1rem', color: 'var(--parchment)', fontSize: '0.88rem' }}>{name}</td>
                      <td style={{ padding: '0.65rem 1rem', color: 'rgba(245,234,214,0.45)', fontSize: '0.78rem', fontStyle: 'italic' }}>
                        {tome ? tome.titre : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Formula section */}
        <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
          <div className="gold-line" style={{ marginBottom: '2rem' }}>
            <h2 className="font-cinzel" style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', letterSpacing: '0.15em',
              color: 'var(--gold)', textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}>
              Architecture du Codex
            </h2>
          </div>
          <div className="card-codex" style={{ padding: '2rem', textAlign: 'center' }}>
            <div className="font-cinzel" style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)', color: 'var(--gold-light)', letterSpacing: '0.08em', marginBottom: '1rem' }}>
              1 être · 3 natures · 5 mondes · 14 domaines · 9 sujets
            </div>
            <div className="font-cinzel" style={{ fontSize: 'clamp(1.4rem, 4vw, 2.5rem)', color: 'var(--gold)', marginBottom: '1rem' }}>
              = 126 fiches
            </div>
            <p className="font-garamond" style={{ color: 'rgba(245,234,214,0.55)', fontSize: '0.95rem', fontStyle: 'italic', margin: 0 }}>
              Tous les domaines mènent à ETRE-01 : vous, lecteur souverain.
            </p>
          </div>
        </div>

        {/* Avertissement honnête */}
        <div style={{ marginTop: '3rem', padding: '1.5rem', border: '1px solid rgba(201,168,76,0.15)', background: 'rgba(201,168,76,0.03)' }}>
          <div className="font-cinzel" style={{ fontSize: '0.65rem', letterSpacing: '0.18em', color: 'var(--gold)', opacity: 0.65, marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Avertissement
          </div>
          <p style={{ color: 'rgba(245,234,214,0.55)', fontSize: '0.85rem', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
            Ouvrage de création et de réflexion. Les équations et univers numériques sont des modèles de travail et des métaphores — pas des conseils médicaux, juridiques ou des promesses de résultat. Le pilote territorial CirculAI se valide sur le terrain, pas dans ce livre.
          </p>
        </div>

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: '4rem', paddingBottom: '3rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            className="nav-link"
          >
            ↑ Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  )
}
