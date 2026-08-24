import { useEffect, useRef, useState } from 'react'
import type { LieuTerrain } from '../../engine/types'

const CLE = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined

/**
 * Carte du terrain.
 *
 * Google Maps est optionnel : sans clé, l'application reste entière et affiche
 * un relevé dessiné. Aucune fonctionnalité essentielle ne dépend d'un service
 * externe.
 */
export default function CarteTerrain({
  lieux,
  centre,
}: {
  lieux: readonly LieuTerrain[]
  centre: { lat: number; lon: number }
}) {
  const conteneur = useRef<HTMLDivElement>(null)
  const [echec, setEchec] = useState(false)

  useEffect(() => {
    if (!CLE || !conteneur.current) return
    let annule = false

    import('@googlemaps/js-api-loader')
      .then(({ setOptions, importLibrary }) => {
        setOptions({ key: CLE, v: 'weekly' })
        return importLibrary('maps')
      })
      .then(({ Map, Circle }) => {
        if (annule || !conteneur.current) return
        const carte = new Map(conteneur.current, {
          center: { lat: centre.lat, lng: centre.lon },
          zoom: 15,
          disableDefaultUI: true,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#14110c' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#8d8579' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0907' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#221d15' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d1418' }] },
            { featureType: 'poi', stylers: [{ visibility: 'off' }] },
          ],
        })
        for (const l of lieux) {
          new Circle({
            map: carte,
            center: { lat: l.lat, lng: l.lon },
            radius: 28,
            strokeColor: '#d9bd6b',
            strokeOpacity: 0.9,
            strokeWeight: 1,
            fillColor: '#d9bd6b',
            fillOpacity: 0.45,
          })
        }
      })
      .catch(() => setEchec(true))

    return () => {
      annule = true
    }
  }, [lieux, centre])

  if (!CLE || echec) return <ReleveDessine lieux={lieux} />

  return <div ref={conteneur} className="h-[26rem] w-full rounded-lg hairline" />
}

/** Relevé de repli : sobre, lisible, et honnête sur ce qu'il n'est pas. */
function ReleveDessine({ lieux }: { lieux: readonly LieuTerrain[] }) {
  return (
    <div className="chalk relative h-[26rem] w-full overflow-hidden rounded-lg hairline bg-forest-deep">
      <svg
        aria-hidden="true"
        viewBox="0 0 800 420"
        className="absolute inset-0 size-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="grille" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="#c9a961" strokeOpacity="0.07" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="800" height="420" fill="url(#grille)" />
        {[90, 170, 250, 330].map((r) => (
          <circle
            key={r}
            cx="400"
            cy="210"
            r={r}
            fill="none"
            stroke="#c9a961"
            strokeOpacity="0.1"
            strokeWidth="1"
          />
        ))}
      </svg>

      <div className="relative flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
        {lieux.length === 0 ? (
          <>
            <span className="breathe size-2 rounded-full bg-gold/60" />
            <p className="max-w-sm text-[0.88rem] leading-relaxed text-parchment/40">
              Aucun point. Le premier s’allumera là où tu seras réellement allé, avec ses
              coordonnées.
            </p>
          </>
        ) : (
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
            {lieux.map((l) => (
              <li key={l.id} className="flex flex-col items-center gap-2">
                <span className="breathe size-2.5 rounded-full bg-gold" />
                <span className="font-display text-[0.95rem] text-parchment/80">{l.nom}</span>
                <span className="data-line text-parchment/30">
                  {l.lat.toFixed(4)} · {l.lon.toFixed(4)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="absolute bottom-3 right-4 data-line text-parchment/22">
        Relevé dessiné · carte externe non branchée
      </p>
    </div>
  )
}
