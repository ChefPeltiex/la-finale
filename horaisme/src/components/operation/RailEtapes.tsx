import type { Etape } from '../../engine/types'

const LIBELLE_BOUCLE: Record<Etape['type'], string> = {
  fragment: 'Observer',
  inventaire: 'Lier',
  sortie: 'Agir',
  terrain: 'Observer le résultat',
  ancrage: 'Ajuster',
}

/**
 * La boucle HORA n'est jamais expliquée au joueur : elle est simplement
 * inscrite en marge, en micro-typographie, comme un repère.
 *
 * Le rail vit dans l'en-tête, qui reste sombre à toutes les étapes — y compris
 * à l'ancrage, où seul le panneau intérieur passe en crème.
 */
export default function RailEtapes({
  etapes,
  index,
}: {
  etapes: readonly Etape[]
  index: number
}) {
  return (
    <ol className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {etapes.map((e, i) => {
        const actif = i === index
        const passe = i < index
        return (
          <li key={e.id} className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className={`h-px transition-all duration-500 ${
                actif ? 'w-6 bg-gold' : passe ? 'w-3 bg-gold/40' : 'w-3 bg-parchment/20'
              }`}
            />
            <span
              className={`data-line transition-colors ${
                actif ? 'text-gold' : passe ? 'text-parchment/45' : 'text-parchment/25'
              }`}
            >
              {LIBELLE_BOUCLE[e.type]}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
