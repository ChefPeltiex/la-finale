import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import type { IdSourceContexte, MemoireJoueur, SourceContexte } from '../engine/types'
import { assemblerContexte } from '../engine/context'
import { compositeurDeterministe, type ResultatComposition } from '../engine/composition'
import { CATALOGUE } from '../content/operations'
import {
  chargerMemoire,
  chargerRayon,
  chargerSources,
  sauverMemoire,
  sauverRayon,
  sauverSources,
  toutEffacer,
} from './storage'
import { MEMOIRE_VIDE } from '../engine/memory'

interface ValeurJeu {
  readonly memoire: MemoireJoueur
  readonly majMemoire: (f: (m: MemoireJoueur) => MemoireJoueur) => void
  readonly sources: readonly SourceContexte[]
  readonly basculerSource: (id: IdSourceContexte) => void
  readonly rayon: number | null
  readonly definirRayon: (r: number | null) => void
  readonly positionAutorisee: boolean
  readonly demanderPosition: () => void
  readonly refuserPosition: () => void
  readonly contexte: ReturnType<typeof assemblerContexte>
  readonly composition: ResultatComposition
  readonly compositeur: string
  readonly effacerTout: () => void
}

const ContexteJeu = createContext<ValeurJeu | null>(null)

export function FournisseurJeu({ children }: { children: ReactNode }) {
  const [memoire, setMemoire] = useState<MemoireJoueur>(() => chargerMemoire())
  const [sources, setSources] = useState<readonly SourceContexte[]>(() => chargerSources())
  const [rayon, setRayon] = useState<number | null>(() => chargerRayon())
  const [position, setPosition] = useState<{ lat: number; lon: number } | null>(null)
  const [positionAutorisee, setPositionAutorisee] = useState(false)
  const [maintenant, setMaintenant] = useState(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setMaintenant(new Date()), 60_000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => sauverMemoire(memoire), [memoire])
  useEffect(() => sauverSources(sources), [sources])
  useEffect(() => sauverRayon(rayon), [rayon])

  const majMemoire = useCallback((f: (m: MemoireJoueur) => MemoireJoueur) => {
    setMemoire((m) => f(m))
  }, [])

  const basculerSource = useCallback((id: IdSourceContexte) => {
    setSources((s) => s.map((src) => (src.id === id ? { ...src, active: !src.active } : src)))
  }, [])

  const demanderPosition = useCallback(() => {
    if (!('geolocation' in navigator)) return
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPosition({ lat: p.coords.latitude, lon: p.coords.longitude })
        setPositionAutorisee(true)
      },
      () => setPositionAutorisee(false),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300_000 },
    )
  }, [])

  const refuserPosition = useCallback(() => {
    setPosition(null)
    setPositionAutorisee(false)
  }, [])

  const contexte = useMemo(
    () =>
      assemblerContexte({
        maintenant,
        position,
        positionAutorisee,
        rayonDeclareMetres: rayon,
        sources,
      }),
    [maintenant, position, positionAutorisee, rayon, sources],
  )

  const composition = useMemo(
    () => compositeurDeterministe.composer({ contexte, memoire, catalogue: CATALOGUE }),
    [contexte, memoire],
  )

  const effacerToutLocal = useCallback(() => {
    toutEffacer()
    setMemoire(MEMOIRE_VIDE)
    setSources(chargerSources())
    setRayon(chargerRayon())
    setPosition(null)
    setPositionAutorisee(false)
  }, [])

  const valeur = useMemo<ValeurJeu>(
    () => ({
      memoire,
      majMemoire,
      sources,
      basculerSource,
      rayon,
      definirRayon: setRayon,
      positionAutorisee,
      demanderPosition,
      refuserPosition,
      contexte,
      composition,
      compositeur: compositeurDeterministe.nom,
      effacerTout: effacerToutLocal,
    }),
    [
      memoire,
      majMemoire,
      sources,
      basculerSource,
      rayon,
      positionAutorisee,
      demanderPosition,
      refuserPosition,
      contexte,
      composition,
      effacerToutLocal,
    ],
  )

  return <ContexteJeu value={valeur}>{children}</ContexteJeu>
}

export function useJeu(): ValeurJeu {
  const v = useContext(ContexteJeu)
  if (v === null) throw new Error('useJeu doit être utilisé dans FournisseurJeu.')
  return v
}
