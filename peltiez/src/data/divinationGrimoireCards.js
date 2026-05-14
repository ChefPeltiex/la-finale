/**
 * Cartes Codex — anneau divinatoire du Verse (realmSlug div-*).
 */

/** @type {Array<{ id: string, realmSlug: string, name: string, typeLine: string, cost: string[], rulesText: string, flavorText: string, rarity: 'common'|'uncommon'|'rare'|'mythic' }>} */
export const DIVINATION_GRIMOIRE_CARDS = [
  {
    id: "div-card-tarot",
    realmSlug: "div-tarot",
    name: "Arc mineur du recadrage",
    typeLine: "Rituel — Tarot",
    cost: ["B", "U", "W"],
    rulesText:
      "Sort Verse (fiction) : spread comme théâtre. Règle : aucune carte ne vire une personne ; décisions majeures = dehors du jeu.",
    flavorText: "« Le mat ouvre une porte, pas une prison. »",
    rarity: "common",
  },
  {
    id: "div-card-astro-nat",
    realmSlug: "div-astro-nat",
    name: "Globe du natal honnête",
    typeLine: "Terrain — Astrologie",
    cost: ["U", "W", "R"],
    rulesText:
      "Enchantement Sceau du natal (fiction). Règle : éphémérides OK, fatalisme interdit ; signe seul ≠ science des traits.",
    flavorText: "« Les maisons sont des questions, pas des juges. »",
    rarity: "uncommon",
  },
  {
    id: "div-card-astro-cn",
    realmSlug: "div-astro-cn",
    name: "Roue des quatre piliers",
    typeLine: "Terrain — Calendrier",
    cost: ["R", "G", "W"],
    rulesText:
      "Sort Boucle du cycle (fiction). Règle : respect des contextes culturels ; pas d’investissement sur « jour seul ».",
    flavorText: "« Le sexagénaire tourne ; la prudence reste. »",
    rarity: "rare",
  },
  {
    id: "div-card-yijing",
    realmSlug: "div-yijing",
    name: "Tige des mutations",
    typeLine: "Rituel — Zhouyi",
    cost: ["G", "B", "C"],
    rulesText:
      "Potion RNG honnête ou achillée (fiction). Règle : texte classique, pas oracle judiciaire ; pas de peur vendue.",
    flavorText: "« L’hexagramme est une strophe, pas une loi. »",
    rarity: "mythic",
  },
  {
    id: "div-card-runes",
    realmSlug: "div-runes",
    name: "Lots du futhark prudents",
    typeLine: "Artefact — Runes",
    cost: ["C", "R"],
    rulesText:
      "Sort Jeter les bois gravés (fiction). Règle : philologie vs commerce viking ; signaler usages idéologiques abusifs.",
    flavorText: "« La pierre parle archive, pas sang. »",
    rarity: "uncommon",
  },
  {
    id: "div-card-geom",
    realmSlug: "div-geom",
    name: "Sable des douze maisons",
    typeLine: "Terrain — Géomancie",
    cost: ["G", "B", "U"],
    rulesText:
      "Rituel quatre points (fiction). Règle : figures = langage, pas capteur ; pas d’extractivisme « mystique ».",
    flavorText: "« Le juge est une case, pas un tribunal humain. »",
    rarity: "rare",
  },
  {
    id: "div-card-carto",
    realmSlug: "div-carto",
    name: "Jeu de 32 à voix basse",
    typeLine: "Rituel — Cartomancie",
    cost: ["W", "C"],
    rulesText:
      "Enchantement tap vert (fiction). Règle : durée, prix, mineurs ; pas de malédiction à payer pour lever.",
    flavorText: "« Le valet rit quand on lui demande la vérité absolue. »",
    rarity: "common",
  },
  {
    id: "div-card-oniro",
    realmSlug: "div-oniro",
    name: "Carnet de lucarne",
    typeLine: "Enchantement — Rêves",
    cost: ["U", "B", "W"],
    rulesText:
      "Sort Ouvrir la lucarne (fiction). Règle : journal ≠ preuve judiciaire ; cauchemars répétés = orientation spécialisée.",
    flavorText: "« L’encre séchée avant l’interprétation hâtive. »",
    rarity: "uncommon",
  },
];
