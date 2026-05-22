/**
 * Grands articles — planches héros or & noir (style Larousse illustré / cartes 1–12).
 * Images : public/encyclopedie/codex/ · textes : docs/encyclopedie/planches-texte.json + volumes MD
 */

export const ENCYCLOPEDIE_GRANDS_ARTICLES = [
  {
    id: "racines-changement",
    num: 1,
    title: "Les racines du changement",
    keywords: ["Conscience", "Héritage", "Impact"],
    planche: "codex-encyclopedie-4A-chapitre1-opening.png",
    volumeMd: "/docs/encyclopedie/volume-0/01-origine.md",
    maillage: ["D01-S01", "D03-S07", "ETRE-01"],
  },
  {
    id: "quete-sens",
    num: 2,
    title: "La quête de sens",
    keywords: ["Vérité", "Introspection", "Évolution"],
    planche: "codex-encyclopedie-7A-diagramme-abstract.png",
    volumeMd: "/docs/encyclopedie/volume-0/02-deux-mondes.md",
    maillage: ["D10-S07", "D03-S08", "NAT-reve"],
  },
  {
    id: "economie-circulaire",
    num: 3,
    title: "L'économie circulaire",
    keywords: ["Réparer", "Réutiliser", "Régénérer"],
    planche: "codex-encyclopedie-1C-fractal-circulaire.png",
    volumeMd: "/docs/encyclopedie/volume-0/03-circulai.md",
    maillage: ["D01-S01", "D08-S01", "MONDE-circulai"],
  },
  {
    id: "harmonie-naturelle",
    num: 4,
    title: "Harmonie naturelle",
    keywords: ["Équilibre", "Respect", "Coexistence"],
    planche: "codex-encyclopedie-6A-chapitre3-opening.png",
    volumeMd: "/docs/encyclopedie/volume-1/02-nature-quebec.md",
    maillage: ["D07-S01", "D13-S01", "D14-S01"],
  },
  {
    id: "boussole-interieure",
    num: 5,
    title: "La boussole intérieure",
    keywords: ["Guidance", "Alignement", "Clarté"],
    planche: "codex-encyclopedie-7B-diagramme-reseau.png",
    volumeMd: "/docs/encyclopedie/volume-2/01-intention.md",
    maillage: ["D02-S02", "D11-S08", "COVER-BACK"],
  },
  {
    id: "chemin-avenir",
    num: 6,
    title: "Le chemin vers l'avenir",
    keywords: ["Vision", "Action", "Impact durable"],
    planche: "codex-encyclopedie-7C-diagramme-radial.png",
    volumeMd: "/docs/encyclopedie/volume-1/04-journal-pilote.md",
    maillage: ["D04-S04", "S04", "MONDE-pilote"],
  },
  {
    id: "heritage-positif",
    num: 7,
    title: "Créer un héritage positif",
    keywords: ["Inspirer", "Transmettre", "Laisser une empreinte"],
    planche: "codex-encyclopedie-8A-medallions.png",
    volumeMd: "/docs/encyclopedie/volume-0/06-transmission.md",
    maillage: ["D12-S09", "D06-S06", "NAT-lien"],
  },
  {
    id: "passer-action",
    num: 8,
    title: "Passer à l'action",
    keywords: ["Aujourd'hui", "Ici", "Ensemble"],
    planche: "codex-encyclopedie-5A-chapitre2-opening.png",
    volumeMd: "/docs/encyclopedie/volume-1/03-acteurs-terrain.md",
    maillage: ["D05-S03", "D06-S05", "MONDE-quebec"],
  },
  {
    id: "cultiver-presence",
    num: 9,
    title: "Cultiver la présence",
    keywords: ["Conscience", "Ancrage", "Paix intérieure"],
    planche: "codex-encyclopedie-4C-chapitre1-icons.png",
    volumeMd: "/docs/encyclopedie/volume-2/03-lux.md",
    maillage: ["D03-S07", "NAT-reve", "ETRE-01"],
  },
  {
    id: "nouvelles-portes",
    num: 10,
    title: "Ouvrir de nouvelles portes",
    keywords: ["Opportunités", "Courage", "Transformation"],
    planche: "codex-encyclopedie-1A-couverture.png",
    volumeMd: "/docs/encyclopedie/vous-etes-le-heros.md",
    maillage: ["COVER-FACE", "MONDE-egor", "MONDE-circulai"],
  },
  {
    id: "perseverer-discipline",
    num: 11,
    title: "Persévérer avec discipline",
    keywords: ["Constance", "Focus", "Résultats durables"],
    planche: "codex-encyclopedie-9C-annexes-sceaux.png",
    volumeMd: "/docs/encyclopedie/volume-3/05-temps.md",
    maillage: ["D02-S04", "D11-S03", "MONDE-codex"],
  },
  {
    id: "cycle-reussite",
    num: 12,
    title: "Créer un cycle de réussite",
    keywords: ["Petites actions", "Grands changements", "Vie extraordinaire"],
    planche: "codex-encyclopedie-12A-fermeture-sceau.png",
    volumeMd: "/docs/encyclopedie/generated/chapitres/loisirs-sports.md",
    maillage: ["D13-S05", "D14-S03", "INDEX"],
  },
];

export function plancheImageUrl(file) {
  return `/encyclopedie/codex/${file}`;
}
