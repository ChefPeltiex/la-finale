/**
 * Cartes Codex — anneau mythologique du Verse (même esthétique TGC que verseGrimoire.js).
 * Les realmSlug correspondent aux entrées WORLD_REALMS (slug myth-*).
 */

/** @type {Array<{ id: string, realmSlug: string, name: string, typeLine: string, cost: string[], rulesText: string, flavorText: string, rarity: 'common'|'uncommon'|'rare'|'mythic' }>} */
export const MYTH_GRIMOIRE_CARDS = [
  {
    id: "myth-card-grecque",
    realmSlug: "myth-grecque",
    name: "Couronne de l’Olympe",
    typeLine: "Terrain légendaire — Hellade",
    cost: ["U", "W", "R"],
    rulesText:
      "Les versions mythiques divergent selon cités et auteurs : toute carte « définitive » est suspecte. Privilégier la confrontation des sources (Homère, Hésiode, tragiques).",
    flavorText: "« La foudre juge autant qu’elle illumine. »",
    rarity: "mythic",
  },
  {
    id: "myth-card-egypt",
    realmSlug: "myth-egypt",
    name: "Barque du dieu-Rê",
    typeLine: "Artefact — Nil",
    cost: ["W", "B"],
    rulesText:
      "La nuit du soleil traverse le Duat : cartographier les dangers, pas seulement les « symboles décoratifs ». Hiéroglyphes = système complet, pas emoji mystiques.",
    flavorText: "« Le cœur pesé comme un texte ouvert. »",
    rarity: "rare",
  },
  {
    id: "myth-card-celt",
    realmSlug: "myth-celt",
    name: "Sid des géants",
    typeLine: "Terrain — Brume atlantique",
    cost: ["G", "B", "U"],
    rulesText:
      "Les cycles irlandais et gallois ne sont pas interchangeables. Les druides antiques : sources externes et fragmentaires — signaler l’incertitude.",
    flavorText: "« Le taureau charge à travers les siècles de copistes. »",
    rarity: "rare",
  },
  {
    id: "myth-card-nord",
    realmSlug: "myth-nord",
    name: "Anneau du Midgard",
    typeLine: "Enchantement — Fjord",
    cost: ["U", "C", "R"],
    rulesText:
      "Snorri organise, mais ne fait pas foi absolue. Croiser pierres runiques, poésies, archéologie funéraire. Ragnarök : mythe, pas programme politique.",
    flavorText: "« Le loup attend la strophe suivante. »",
    rarity: "uncommon",
  },
  {
    id: "myth-card-meso",
    realmSlug: "myth-meso",
    name: "Tablette du septuple vent",
    typeLine: "Rituel — Cunéiforme",
    cost: ["B", "B", "U"],
    rulesText:
      "Plusieurs créations, plusieurs déluges : lire les traductions commentées. Pas de « clé ésotérique » sans assyriologie.",
    flavorText: "« Tiamat se fragmente en récits. »",
    rarity: "rare",
  },
  {
    id: "myth-card-india",
    realmSlug: "myth-india",
    name: "Chakra du char d’Arjuna",
    typeLine: "Terrain — Kurukshetra (allégorie)",
    cost: ["W", "G", "R"],
    rulesText:
      "Itihāsa et Purāṇa : traditions vivantes. Éviter l’extractivisme mantra ; citer chercheurs et praticiens du sous-continent.",
    flavorText: "« Le devoir se débat avant de se brandir. »",
    rarity: "mythic",
  },
  {
    id: "myth-card-japan",
    realmSlug: "myth-japan",
    name: "Corde d’Izanagi",
    typeLine: "Rituel instantané — Îles",
    cost: ["U", "W"],
    rulesText:
      "Kojiki / Nihon shoki : genèse impériale et poésie. Shintō ≠ polythéisme grec calqué ; attention aux catégories.",
    flavorText: "« Le sel devient île, l’île devient histoire. »",
    rarity: "uncommon",
  },
  {
    id: "myth-card-china",
    realmSlug: "myth-china",
    name: "Nuage de Nuwa",
    typeLine: "Enchantement — Ciel réparé",
    cost: ["W", "R"],
    rulesText:
      "Syncrétismes tao-bouddhistes et cultes locaux : cartographier les strates. Jade Emperor : formation tardive des panthéons populaires.",
    flavorText: "« Cinq pierres, cinq couleurs de responsabilité. »",
    rarity: "uncommon",
  },
  {
    id: "myth-card-rome",
    realmSlug: "myth-rome",
    name: "Triade du Capitole",
    typeLine: "Terrain — Civitas",
    cost: ["W", "W", "R"],
    rulesText:
      "Religion civique, augures, apothéoses impériales. Interprétatio graeca : traduire, ne pas confondre identités locales.",
    flavorText: "« L’aigle mesure l’empire en augures. »",
    rarity: "rare",
  },
  {
    id: "myth-card-yoruba",
    realmSlug: "myth-yoruba",
    name: "Chaîne d’Ifá",
    typeLine: "Artefact — Divination",
    cost: ["G", "B", "U"],
    rulesText:
      "Òrìṣà et diaspora : respecter initiations et contextualisations. Le commerce global des « Orishas décoratifs » est un risque éthique majeur.",
    flavorText: "« Chaque noix raconte une branche du monde. »",
    rarity: "mythic",
  },
  {
    id: "myth-card-poly",
    realmSlug: "myth-poly",
    name: "Filet de Maui",
    typeLine: "Créature légendaire — Navigation",
    cost: ["U", "G"],
    rulesText:
      "Polynésie = pluralité linguistique et cultuelle ; Maui change d’île et d’humeur. Pas de fusion « tikis + Disney ».",
    flavorText: "« Le soleil ralentit pour les navigateurs. »",
    rarity: "common",
  },
  {
    id: "myth-card-americas",
    realmSlug: "myth-americas",
    name: "Turtle Island (allégorie cartographique)",
    typeLine: "Terrain — Pluralité des nations",
    cost: ["G", "G", "B", "U"],
    rulesText:
      "Aucun panthéon unique : tricksters, créations, traités, revitalisations. Prioriser sources autochtones et historiographies critiques.",
    flavorText: "« Le coyote lit plusieurs versions à voix basse. »",
    rarity: "mythic",
  },
];
