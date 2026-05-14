/**
 * Cartes du Codex du Verse — esthétique inspirée des jeux de cartes à collectionner (cadre, coût, rareté).
 * Contenu pédagogique Egor69 ; aucune affiliation à des marques tierces.
 */

export const MANA_COLORS = {
  G: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]", // Atlas / vivant
  U: "bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.55)]", // Savoir / ciel
  R: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]", // Passion / création
  B: "bg-violet-600 shadow-[0_0_8px_rgba(124,58,237,0.55)]", // Mystère / nuit
  W: "bg-amber-200 text-amber-950 shadow-[0_0_8px_rgba(253,230,138,0.7)]", // Lumière / charte
  C: "bg-zinc-400 shadow-inner", // Neutre
};

/** @type {Array<{ id: string, realmSlug: string, name: string, typeLine: string, cost: string[], rulesText: string, flavorText: string, rarity: 'common'|'uncommon'|'rare'|'mythic' }>} */
export const VERSE_GRIMOIRE_CARDS = [
  {
    id: "accueil",
    realmSlug: "accueil",
    name: "Sanctuaire d’accueil",
    typeLine: "Terrain légendaire — Portail",
    cost: ["G", "W"],
    rulesText:
      "Tant que tu contrôles ce terrain, les métriques affichées doivent être vérifiables ou qualifiées comme projection — aucune invention d’audience.",
    flavorText: "« Là où le spectacle s’efface et le pacte commence. »",
    rarity: "rare",
  },
  {
    id: "market",
    realmSlug: "market",
    name: "Grand Marché",
    typeLine: "Terrain — Place",
    cost: ["U", "C"],
    rulesText:
      "Les échanges suivent les règles publiées. Les prix sont des consentements autant que des nombres — pas de piège tarifaire dans le récit.",
    flavorText: "« Bruine turquoise sur métal brossé. »",
    rarity: "uncommon",
  },
  {
    id: "atlas",
    realmSlug: "atlas",
    name: "Atlas vivant",
    typeLine: "Rituel — Archivage",
    cost: ["G", "U", "B"],
    rulesText:
      "Révèle une fiche au hasard volontaire : lis-la, puis ajoute une nuance personnelle. Les contributions citoyennes ne remplacent pas la validation expert.",
    flavorText: "« Pollen numérique sur parchemin tiède. »",
    rarity: "rare",
  },
  {
    id: "bible",
    realmSlug: "bible",
    name: "Encyclopédie biblique",
    typeLine: "Enchantement — Scriptorium",
    cost: ["W", "W", "U"],
    rulesText:
      "Les lacunes du texte attesté restent marquées ouvertement. La foi et la critique cohabitent lorsque la précision prime.",
    flavorText: "« Or liquide sur pierre froide. »",
    rarity: "mythic",
  },
  {
    id: "pantheon",
    realmSlug: "pantheon",
    name: "Panthéon 3D",
    typeLine: "Artefact — Rotonde",
    cost: ["R", "W"],
    rulesText:
      "Les figures portent une étiquette de contexte. La beauté invite à la lecture ; elle ne substitue pas à la pensée.",
    flavorText: "« Ombre portée sur buste translucide. »",
    rarity: "uncommon",
  },
  {
    id: "cosmic",
    realmSlug: "cosmic",
    name: "Portail cosmique",
    typeLine: "Terrain — Horizon",
    cost: ["U", "B"],
    rulesText:
      "Les ordres de grandeur suivent le consensus scientifique actuel ; la carte n’est pas le territoire sidéral.",
    flavorText: "« Vertige doux, silence amplifié. »",
    rarity: "rare",
  },
  {
    id: "esoteric",
    realmSlug: "esoteric",
    name: "Spires ésotériques",
    typeLine: "Créature — Citadelle",
    cost: ["U", "B", "B"],
    rulesText:
      "0/4 — défenseur du contexte : aucune garantie surnaturelle ; sensibilité culturelle et disclaimers clairs.",
    flavorText: "« Flèches qui dansent sans vent. »",
    rarity: "uncommon",
  },
  {
    id: "magic",
    realmSlug: "magic",
    name: "Arène de magie",
    typeLine: "Rituel instantané — Illusion",
    cost: ["R", "U"],
    rulesText:
      "Le spectateur sait qu’il observe un artifice. Après le tour, énonce ce que tu ignores encore volontairement.",
    flavorText: "« Riflements de cartes, cire tiède. »",
    rarity: "common",
  },
  {
    id: "genome",
    realmSlug: "genome",
    name: "Spirale du génome",
    typeLine: "Terrain — Laboratoire",
    cost: ["G", "G", "U"],
    rulesText:
      "Aucun diagnostic médical n’est délivré par l’interface ; orientation vers des professionnels réels uniquement.",
    flavorText: "« Tubes luminescents, racines digitales. »",
    rarity: "rare",
  },
  {
    id: "pricing",
    realmSlug: "pricing",
    name: "Hall des alliances",
    typeLine: "Enchantement — Pacte",
    cost: ["W", "R"],
    rulesText:
      "Paiement via processeur reconnu ; liturgie contractuelle visible — paliers, inclusions, exclusions.",
    flavorText: "« Sceau sur cire sans chantage émotionnel. »",
    rarity: "uncommon",
  },
];

export const RARITY_STYLES = {
  common: "border-zinc-500/60 ring-1 ring-zinc-600/40",
  uncommon: "border-sky-400/50 ring-1 ring-sky-500/30",
  rare: "border-amber-400/70 ring-2 ring-amber-500/40 shadow-[0_0_20px_rgba(251,191,36,0.15)]",
  mythic: "border-fuchsia-500/60 ring-2 ring-orange-400/50 shadow-[0_0_28px_rgba(217,70,239,0.2)]",
};
