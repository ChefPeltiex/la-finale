import { useEffect } from 'react'
import { motion } from 'framer-motion'

interface Props { onFinish: () => void }

const LINES = [
  'EGOR69',
  '',
  'LE BRÉVIAIRE UNIVERSEL',
  '',
  'En un temps où l\'information prolifère',
  'sans jamais s\'approfondir,',
  '',
  'où la vitesse remplace la sagesse,',
  '',
  'naît ici un outil pour voir plus clair.',
  '',
  '488 cristaux de savoir contemplatif.',
  '',
  'Des formules qui gouvernent l\'univers.',
  'Des disciplines qui façonnent l\'esprit.',
  'Des arts qui éveillent l\'âme.',
  '',
  'Pas une religion — un bréviaire.',
  '',
  'Un outil pour penser,',
  'pas pour croire.',
  '',
  'Choisis ta porte.',
  'Entre dans le cristal.',
  '',
  '— EGOR, l\'architecte du savoir —',
]

export default function IntroCrawl({ onFinish }: Props) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 72000)
    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <div
      onClick={onFinish}
      style={{
        position: 'fixed', inset: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        perspective: '400px',
        cursor: 'pointer',
        background: 'transparent',
      }}
    >
      {/* Skip hint */}
      <div style={{
        position: 'absolute', bottom: 32, right: 40,
        color: '#d4af3788', fontFamily: 'Cormorant Garamond, serif',
        fontSize: '0.85rem', letterSpacing: '0.15em',
      }}>
        Cliquer pour passer →
      </div>

      <motion.div
        initial={{ y: '100vh', rotateX: 25 }}
        animate={{ y: '-150vh', rotateX: 25 }}
        transition={{ duration: 70, ease: 'linear' }}
        style={{
          width: 600,
          maxWidth: '90vw',
          textAlign: 'center',
          transformOrigin: 'bottom center',
        }}
      >
        {LINES.map((line, i) => (
          <p
            key={i}
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: line === 'EGOR69' ? '#d4af37' : line === 'LE BRÉVIAIRE UNIVERSEL' ? '#c9b07a' : '#e8dcc8',
              fontSize: line === 'EGOR69' ? '2.5rem' : line === 'LE BRÉVIAIRE UNIVERSEL' ? '1.4rem' : '1.1rem',
              fontWeight: line === 'EGOR69' || line === 'LE BRÉVIAIRE UNIVERSEL' ? 700 : 300,
              fontStyle: line.startsWith('—') ? 'italic' : 'normal',
              letterSpacing: '0.08em',
              lineHeight: line === '' ? '1.8' : '2',
              margin: 0,
              textShadow: line === 'EGOR69' ? '0 0 40px #d4af37aa' : 'none',
            }}
          >
            {line || '\u00A0'}
          </p>
        ))}
      </motion.div>
    </div>
  )
}
