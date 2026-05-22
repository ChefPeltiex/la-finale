import { useEffect } from 'react'
import { motion } from 'framer-motion'

interface Props { onFinish: () => void }

const LINES = [
  'IL Y A LONGTEMPS,',
  'DANS UN SALON DE MONTRÉAL...',
  '',
  'Un humain seul regarde les étoiles.',
  '',
  'Il n\'est ni savant, ni prophète, ni élu.',
  'Il a été cuisinier, commis de pharmacie,',
  'autodidacte.',
  'Il a aimé, perdu, recommencé.',
  'Il a traversé deux nuits —',
  'et chaque fois, c\'est par la lumière',
  'qu\'il est passé, jamais par l\'ombre.',
  '',
  'Quarante jours seul devant l\'écran.',
  'Sans équipe. Sans patron. Sans filet.',
  '',
  'Il cherche une chose simple :',
  'que tout le savoir du monde tienne',
  'dans un livre qu\'on puisse contempler',
  'comme son grand-père contemplait son bréviaire,',
  'chaque matin, sans bruit.',
  '',
  'Galois côtoie Goku.',
  'Ramanujan rêve à côté de Tintin.',
  'L\'acupuncture répond à Riemann.',
  'Bach et Coltrane et Hildegarde',
  'dansent ensemble.',
  '',
  'Pas de hiérarchie. Pas de mépris.',
  'Le savoir formel et le jeu.',
  'Le sacré et la bande dessinée.',
  'La science et la médecine douce.',
  '',
  'Tout vaut. Tout enseigne. Tout résonne.',
  '',
  'Voici l\'Encyclopédie.',
  '',
  'Médite. Tourne la page. Recommence.',
  '',
  'Bienvenue dans le Bréviaire Universel.',
  '',
  '— Dominic',
]

export default function IntroCrawl({ onFinish }: Props) {
  useEffect(() => {
    const seen = localStorage.getItem('egor69-intro-seen')
    if (seen) { onFinish(); return }
    const timer = setTimeout(() => { localStorage.setItem('egor69-intro-seen', '1'); onFinish() }, 76000)
    return () => clearTimeout(timer)
  }, [onFinish])

  const skip = () => { localStorage.setItem('egor69-intro-seen', '1'); onFinish() }

  return (
    <div
      onClick={skip}
      style={{
        position: 'fixed', inset: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        perspective: '420px',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', bottom: 28, right: 36,
        color: '#d4a84366', fontFamily: 'Cormorant Garamond, serif',
        fontSize: '0.8rem', letterSpacing: '0.18em',
        pointerEvents: 'none',
      }}>cliquer pour passer →</div>

      <motion.div
        initial={{ y: '105vh', rotateX: 25 }}
        animate={{ y: '-160vh', rotateX: 25 }}
        transition={{ duration: 75, ease: 'linear' }}
        style={{
          width: 580,
          maxWidth: '88vw',
          textAlign: 'center',
          transformOrigin: 'bottom center',
        }}
      >
        {LINES.map((line, i) => {
          const isTitle = i === 0 || i === 1
          const isDominic = line === '— Dominic'
          return (
            <p key={i} style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: isTitle ? '#d4a843' : isDominic ? '#d4a84399' : '#f0f0f0',
              fontSize: isTitle ? '1.5rem' : '1.1rem',
              fontWeight: isTitle ? 700 : 300,
              fontStyle: isDominic ? 'italic' : 'normal',
              letterSpacing: isTitle ? '0.15em' : '0.06em',
              lineHeight: line === '' ? '1.4' : '1.9',
              margin: 0,
              textShadow: isTitle ? '0 0 30px #d4a84388' : 'none',
            }}>
              {line || '\u00A0'}
            </p>
          )
        })}
      </motion.div>
    </div>
  )
}
