// Type aligné sur crystals.json (généré par scripts/build-corpus.mjs)
export interface Crystal {
  id: number
  titre: string
  definition: string
  formule?: string
  source: 'equations' | 'culturel' | 'musique' | 'discipline'
  discipline: string
  url: string
  maitre?: string
}
