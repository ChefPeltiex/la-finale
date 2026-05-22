import { useNavigate } from 'react-router-dom'
import { TOMES } from '../data/tomes.js'

export default function NavBar() {
  const navigate = useNavigate()

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'linear-gradient(to bottom, rgba(10,6,8,0.97) 0%, rgba(10,6,8,0.0) 100%)',
      padding: '0.75rem 2rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      backdropFilter: 'blur(4px)',
    }}>
      <button
        onClick={() => navigate('/')}
        className="nav-link"
        style={{ fontFamily: "'Cinzel', serif", fontSize: '0.78rem', letterSpacing: '0.14em', color: 'var(--gold)', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        Codex Magique
      </button>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <button onClick={() => navigate('/')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          Accueil
        </button>
        <button onClick={() => navigate('/galerie')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          Galerie
        </button>
        <button onClick={() => navigate('/index-secrets')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          Index
        </button>
        <span style={{ color: 'rgba(201,168,76,0.25)', fontSize: '0.6rem' }}>·</span>
        {TOMES.slice(0, 4).map(t => (
          <button
            key={t.id}
            onClick={() => navigate(`/tome/${t.id}`)}
            className="nav-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {t.roman}
          </button>
        ))}
      </div>
    </nav>
  )
}
