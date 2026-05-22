import { motion } from 'framer-motion'

interface Props { onSelect: (domain: string) => void }

const DOORS = [
  { id: 'equations',  label: 'Équations',        subtitle: '110 formules',      glyph: 'Σ', color: '#d4a843' },
  { id: 'discipline', label: 'Disciplines',      subtitle: '150 sciences',      glyph: '⚛', color: '#7eb8d4' },
  { id: 'culturel',   label: 'Arts & Culture',   subtitle: '220+ entrées',      glyph: '◈', color: '#c47ab3' },
  { id: 'musique',    label: 'Musique',          subtitle: '130 articles',      glyph: '♫', color: '#89d4a0' },
  { id: 'all',        label: 'Tout le Bréviaire','subtitle': '638 cristaux',    glyph: '∞', color: '#f0f0f0' },
  { id: 'random',     label: 'Cristal aléatoire','subtitle': 'contemplation',   glyph: '?', color: '#9a9aff' },
]

export default function ChooseDestiny({ onSelect }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      style={{
        position: 'relative', zIndex: 5,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <motion.h1
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        style={{
          fontFamily: 'Cormorant Garamond, serif',
          color: '#d4af37',
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 300,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginBottom: '0.5rem',
          textShadow: '0 0 60px #d4af3755',
        }}
      >
        EGOR69
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        style={{
          fontFamily: 'Cormorant Garamond, serif',
          color: '#c9b07a',
          fontSize: '1rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          marginBottom: '3.5rem',
        }}
      >
        Le Bréviaire Universel
      </motion.p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '1.25rem',
        maxWidth: 900,
        width: '100%',
      }}>
        {DOORS.map((door, i) => (
          <motion.button
            key={door.id}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
            whileHover={{ scale: 1.06, boxShadow: `0 0 30px ${door.color}55` }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(door.id)}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${door.color}55`,
              borderRadius: 8,
              padding: '1.8rem 1rem',
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '0.6rem',
              transition: 'border-color 0.3s',
            }}
          >
            <span style={{ fontSize: '2rem', color: door.color }}>{door.glyph}</span>
            <span style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#e8dcc8',
              fontSize: '1.05rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
            }}>{door.label}</span>
            <span style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#a09080',
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
            }}>{door.subtitle}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
