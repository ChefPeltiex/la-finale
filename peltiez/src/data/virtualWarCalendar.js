/**
 * Calendrier campagne **100 % virtuel** + tactiques abstraites pour raids coop.
 * Les entrées « mémoire » sont des repères historiques factuels (enseignement),
 * sans gloire ni simulation de violence réelle.
 */

/** Saisons fictives — noms originaux, timeline jeu uniquement */
export const VIRTUAL_CAMPAIGN_SEASONS = [
  {
    id: "s1-rift",
    name: "Saison · Rift du popcorn",
    window: "Mai–juin 2026 (fiction)",
    pitch: "Escarmouches PvE contre bots « paperasse cosmique » ; squads de 4 ; aucune carte géopolitique réelle.",
    squadGoal: "Empiler des boucliers communautaires jusqu’au boss « Fax du destin ».",
  },
  {
    id: "s2-eclipse",
    name: "Saison · Éclipse des pings",
    window: "Juil.–août 2026 (fiction)",
    pitch: "Mode défense : protéger un noyau narratif contre des vagues de memes mal compressés.",
    squadGoal: "Coordonner attaques feintées + contre-offensives burlesques.",
  },
  {
    id: "s3-nebula",
    name: "Saison · Nébuleuse potluck",
    window: "Sept.–oct. 2026 (fiction)",
    pitch: "Guilde mixte Ordre/Chaos ; récompenses cosmétiques locales uniquement.",
    squadGoal: "Créer une « armée » partagée : listes de rôles, pas de hiérarchie réelle.",
  },
  {
    id: "s4-archive",
    name: "Saison · Archive vivante",
    window: "Nov.–déc. 2026 (fiction)",
    pitch: "Tournois narratifs : replay, analyse de stratégie, rires consentis.",
    squadGoal: "Exporter un highlights reel PG pour la communauté.",
  },
];

/** Tactiques abstraites — jargon jeu, pas doctrine militaire réelle */
export const VIRTUAL_TACTICS = [
  {
    id: "atk-feint-laugh",
    side: "attaque",
    name: "Feinte hilarante",
    effect: "+ coordination si tout le monde envoie le même emoji ping.",
  },
  {
    id: "atk-focus-tag",
    side: "attaque",
    name: "Focus étiqueté",
    effect: "Prioriser une cible IA sans vocabulaire violent ; bonus lore.",
  },
  {
    id: "atk-time-box",
    side: "attaque",
    name: "Blitz minute vert",
    effect: "Burst limité à 60 s puis repos café obligatoire (anti-burnout).",
  },
  {
    id: "def-shield-rotate",
    side: "défense",
    name: "Mur rotatif",
    effect: "Les joueurs alternent un bouclier fictif ; enseigne la charge mentale partagée.",
  },
  {
    id: "def-anchor-tree",
    side: "défense",
    name: "Ancrage racine",
    effect: "Réduit les déplacements ennemis scriptés ; métaphore stabilité groupe.",
  },
  {
    id: "def-truce-button",
    side: "défense",
    name: "Bouton trêve",
    effect: "Pause globale ; privilégie la discussion debrief — zéro gloire de guerre.",
  },
];

/**
 * Repères historiques (faits publics, simplifiés) — hors gameplay.
 * Objectif : mémoire collective et pacification du discours, pas simulation de combat.
 */
export const HISTORICAL_MEMORY_ANCHORS = [
  {
    label: "Première Guerre mondiale",
    span: "1914–1918",
    note: "Conflit majeur impliquant plusieurs continents ; enseignements sur alliances et diplomatie (sources : manuels d’histoire générale).",
  },
  {
    label: "Seconde Guerre mondiale",
    span: "1939–1945",
    note: "Guerre globale aux conséquences massives ; mémoire et prévention restent des devoirs civiques.",
  },
  {
    label: "Guerre froide",
    span: "≈ 1947–1991",
    note: "Tension géopolitique et courses aux armements ; utile pour comprendre les médias d’époque (étude historique).",
  },
];
