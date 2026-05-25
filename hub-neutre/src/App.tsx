import './index.css'

const portes = [
  { label: 'CirculAI', href: 'https://circulai-demo.vercel.app' },
  { label: 'Egor69', href: 'https://egor69.vercel.app' },
  { label: 'EgorAI69', href: '#' },
]

const btnStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '0.75rem 2rem',
  border: '1px solid #999',
  color: '#2A2A2A',
  textDecoration: 'none',
  fontSize: '1rem',
  transition: 'border-color 200ms, color 200ms',
}

function hover(el: HTMLAnchorElement, on: boolean) {
  el.style.borderColor = on ? '#2A2A2A' : '#999'
  el.style.color = on ? '#000' : '#2A2A2A'
}

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FAF8F5', color: '#2A2A2A', fontFamily: "system-ui,'Inter',sans-serif", padding: '2rem' }}>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', width: '100%' }}>
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 400, letterSpacing: '-0.02em', margin: 0 }}>
          Tout est nature.
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#666', margin: 0 }}>Trois portes.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
          {portes.map((p) => (
            <a
              key={p.label}
              href={p.href}
              target={p.href !== '#' ? '_blank' : undefined}
              rel={p.href !== '#' ? 'noopener noreferrer' : undefined}
              style={{ ...btnStyle, opacity: p.href === '#' ? 0.5 : 1, cursor: p.href === '#' ? 'default' : 'pointer' }}
              onMouseEnter={(e) => p.href !== '#' && hover(e.currentTarget, true)}
              onMouseLeave={(e) => hover(e.currentTarget, false)}
            >
              {p.label}
            </a>
          ))}
        </div>
      </main>
      <footer style={{ fontSize: '0.875rem', color: '#999', padding: '1.5rem 0 1rem' }}>
        Dominic Pelletier &mdash; Quebec, 2026
      </footer>
    </div>
  )
}
