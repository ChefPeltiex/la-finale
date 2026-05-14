/**
 * Cartes Codex — anneau bien-être du Verse (realmSlug well-*).
 */

/** @type {Array<{ id: string, realmSlug: string, name: string, typeLine: string, cost: string[], rulesText: string, flavorText: string, rarity: 'common'|'uncommon'|'rare'|'mythic' }>} */
export const WELLNESS_GRIMOIRE_CARDS = [
  {
    id: "well-card-herbe",
    realmSlug: "well-herbe",
    name: "Mortier du pharmacien rustique",
    typeLine: "Artefact — Phytothérapie",
    cost: ["G", "G"],
    rulesText:
      "Sort Verse (mise en scène) : Sept Racines-Noms. Règle de table : titres, interactions, identifications avant toute prise interne. « Naturel = innocent » est faux.",
    flavorText: "« La dose fait le poison, dit l’enseigne — et l’herbier. »",
    rarity: "rare",
  },
  {
    id: "well-card-naturo",
    realmSlug: "well-naturo",
    name: "Boussole du terrain",
    typeLine: "Enchantement — Hygiènes de vie",
    cost: ["G", "W"],
    rulesText:
      "Enchantement narratif : Toile du terrain. Règle : séparer sommeil, mouvement, alimentation validés du discours institutionnel variable. Pas de retard diagnostique.",
    flavorText: "« Le corps parle en données et en silences. »",
    rarity: "uncommon",
  },
  {
    id: "well-card-massage",
    realmSlug: "well-massage",
    name: "Huile du consentement",
    typeLine: "Rituel — Bien-être manuel",
    cost: ["W", "U"],
    rulesText:
      "Rituel de table : Huile du consentement. Puissance réelle = toucher négocié ; règle : spa ≠ kiné ; contre-indications vasculaires et oncologiques strictes.",
    flavorText: "« Les mains posent une question, pas une sentence. »",
    rarity: "common",
  },
  {
    id: "well-card-aroma",
    realmSlug: "well-aroma",
    name: "Alambic des neuf lunes",
    typeLine: "Artefact — HE",
    cost: ["G", "R"],
    rulesText:
      "Potion (fiction) : Brume des neuf gouttes. Règle : diffusion courte, dilution, prudence pédiatrique/grossesse ; ingestion amateur = toxico, pas prestige.",
    flavorText: "« Une goutte de forêt, un pacte de prudence. »",
    rarity: "uncommon",
  },
  {
    id: "well-card-sophro",
    realmSlug: "well-sophro",
    name: "Séquence des sept vagues",
    typeLine: "Rituel — Relaxation structurée",
    cost: ["U", "W", "C"],
    rulesText:
      "Sort Strophe des sept vagues (fiction). Règle : activation / respiration utiles au stress léger ; orientation psychiatrique si instability.",
    flavorText: "« Le souffle range les meubles de l’esprit. »",
    rarity: "common",
  },
  {
    id: "well-card-homeo",
    realmSlug: "well-homeo",
    name: "Flacon de dilution infinie",
    typeLine: "Terrain controversé — Homéopathie",
    cost: ["C", "C", "W"],
    rulesText:
      "Artefact Granule du miroir dilué (fiction). Règle : transparence sur preuves, placebo, contexte ; interdiction de substitution aux soins efficaces.",
    flavorText: "« L’étiquette raconte une histoire ; la biologie en lit une autre. »",
    rarity: "rare",
  },
  {
    id: "well-card-holistique",
    realmSlug: "well-holistique",
    name: "Toile biopsychosociale",
    typeLine: "Terrain — Cadre intégratif",
    cost: ["W", "U", "B"],
    rulesText:
      "Enchantement Anneau biopsychosocial (fiction). Règle : holistique = posture, pas baguette ; pas de culpabilisation ni négation des urgences.",
    flavorText: "« Le contexte est un organe. »",
    rarity: "mythic",
  },
  {
    id: "well-card-nutri",
    realmSlug: "well-nutri",
    name: "Pilulier du laborantin prudent",
    typeLine: "Artefact — Micronutrition",
    cost: ["G", "W", "R"],
    rulesText:
      "Potion Pilulier du laborantin (fiction). Règle : carence documentée vs cocktail marketing ; thyroïde, anticoagulants, chimiothérapies.",
    flavorText: "« Mesurer avant d’empiler les symboles chimiques. »",
    rarity: "uncommon",
  },
  {
    id: "well-card-hydro",
    realmSlug: "well-hydro",
    name: "Bain des deux mondes",
    typeLine: "Terrain — Thermal & nordique",
    cost: ["U", "R"],
    rulesText:
      "Sort Danse du chaud et du froid (fiction). Règle : spa ≠ cure agréée ; cœur, pression, chronomètre ; hydratation.",
    flavorText: "« La vapeur cache parfois le pouls. »",
    rarity: "common",
  },
  {
    id: "well-card-psychocorp",
    realmSlug: "well-psychocorp",
    name: "Corde du trauma-informed",
    typeLine: "Enchantement — Corps & émotion",
    cost: ["B", "G", "U"],
    rulesText:
      "Corde du seuil (fiction) : consentement, lenteur, supervision. Règle : psychothérapie encadrée ≠ coaching flou.",
    flavorText: "« La peau a une mémoire — et des limites. »",
    rarity: "rare",
  },
  {
    id: "well-card-acu",
    realmSlug: "well-acu",
    name: "Carte des méridiens annotée",
    typeLine: "Rituel — MTC / acupuncture",
    cost: ["R", "G"],
    rulesText:
      "Sort Plantation des douze étoiles (fiction). Règle : classique vs neuro, cadre légal, aiguilles stériles.",
    flavorText: "« L’aiguille pose une question au système nerveux. »",
    rarity: "uncommon",
  },
  {
    id: "well-card-ayur",
    realmSlug: "well-ayur",
    name: "Balance des trois humeurs",
    typeLine: "Terrain — Ayurveda",
    cost: ["G", "B", "W"],
    rulesText:
      "Enchantement Réveil des trois doshas (fiction). Règle : institutions vs import ; qualité, toxico, interactions.",
    flavorText: "« Le dosha change avec le siècle et le laboratoire. »",
    rarity: "mythic",
  },
];
