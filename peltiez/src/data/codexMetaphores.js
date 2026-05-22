/**
 * Codex · images métaphoriques — synthèse Canvas + résonances applicables CirculAI / Egor69.
 * CirculAI = terrain (C) · Egor69 = culture encyclopédie (E) — jamais l'un écrasant l'autre.
 */

export const CODEX_HEADER = {
  quete: { label: "Quête", tag: "Chasse au trésor — pas mission" },
  editeur: { label: "Éditeur", tag: "Papier → vital → vie" },
  unDoigt: { label: "1 doigt", tag: "Écouter d'abord" },
};

/** @type {Array<{ id: string, title: string, subtitle: string, circulai?: string, egor?: string, symbol: string }>} */
export const CODEX_GALERIE = [
  {
    id: "jumeaux",
    title: "Deux jumeaux",
    subtitle: "CirculAI territoire · Egor69 culture — jamais l'un sur l'autre",
    symbol: "CE",
    circulai: "Pilote municipal, marché local, preuves terrain.",
    egor: "Encyclopédie, Verse, pont Unreal — le rêve illustré.",
  },
  {
    id: "oeil",
    title: "Œil · nerf · orbite",
    subtitle: "Contemplation puis action — une preuve vérifiable à la fois",
    symbol: "◎",
    circulai: "Trois preuves en 90 jours, pas vingt promesses.",
    egor: "Une planche, une fiche maillage, un export honnête.",
  },
  {
    id: "pont",
    title: "Pont + / −",
    subtitle: "Perception = neutralité · pas un pôle jusqu'à la démence",
    symbol: "±",
    circulai: "Économie et écologie ensemble, sans sermon ni greenwashing.",
    egor: "Divertissement et sérieux séparés sur les slides institutionnelles.",
  },
  {
    id: "algorythme",
    title: "algoRYTHME",
    subtitle: "Vas à ton rythme — pilote 90 j, cycles honnêtes",
    symbol: "▮▮▯",
    circulai: "J0–J7 · J8–J45 · J46–J90 — voir /circulai/equation-pilote.",
    egor: "Courbes Peano, Rössler, polaire — pont création, pas KPI municipal.",
  },
];

/** Résonances « maths » utiles au discours (sans cours magistral) */
export const CODEX_RESONANCES_MATH = [
  {
    id: "integration",
    title: "Problème lourd → réponse simple",
    body: "Comme une intégrale qui finit par un chiffre clair : la seconde main simplifie « budget serré + conscience écologique ».",
  },
  {
    id: "connexion",
    title: "Log et arctan — deux chemins, même vérité",
    body: "Deux façons de voir la même chose : acheter d'occasion peut être à la fois malin et responsable.",
  },
  {
    id: "solide",
    title: "Plus on en a, plus solide",
    body: "Chaque annonce locale est un « disque » de plus : le volume communautaire devient fiable, pas du vent.",
  },
  {
    id: "phi",
    title: "φ ≈ 1,618 — l'équilibre",
    body: "Style, économie, écoresponsabilité : le Nouveau Chic tient quand aucun pôle n'écrase les autres.",
  },
  {
    id: "binaire",
    title: "0 et 1 (Leibniz)",
    body: "Rien ne circule, ou l'objet repart — pas de troisième case « placard éternel ».",
  },
  {
    id: "dowsing",
    title: "La perle, vite",
    body: "Comme une baguette qui répond : filtres quartier, annonces proches, réponse en minutes pas en semaines.",
  },
];

export const CODEX_MEMO = "Nous nous souviendrons — ça torche, non : une image qui reste, pas un PDF de 60 Mo sans âme.";

/** Planches illustrées (fichiers dans public/codex-metaphores/planches/) */
export const CODEX_PLANCHES_HERO = [
  {
    id: "triptyque",
    file: "triptyque-jumeaux-perception-devise.png",
    title: "Triptyque — jumeaux · perception · devise",
    caption: "CirculAI territoire · Egor69 culture",
  },
  {
    id: "jumeaux-img",
    file: "jumeaux-pont-harmonie.png",
    title: "Jumeaux & pont",
    caption: "Jamais l'un sur l'autre · harmonie + / −",
    galerieId: "jumeaux",
  },
  {
    id: "oeil-img",
    file: "perception-orbite-nerf.png",
    title: "Œil · orbite · nerf",
    caption: "Contemplation puis action",
    galerieId: "oeil",
  },
  {
    id: "pont-img",
    file: "perception-pont-algorythme.png",
    title: "Pont & algoRYTHME",
    caption: "90 j · cycles honnêtes",
    galerieId: "pont",
  },
  {
    id: "perception-full",
    file: "perception-neutralite-oeil.png",
    title: "Perception = neutralité",
    caption: "Vérité > preuve > partage",
  },
  {
    id: "torche",
    file: "devise-torche-phare.png",
    title: "Devise · torche",
    caption: "Écouter d'abord · une preuve à la fois",
  },
];

export function codexPlancheUrl(file) {
  return `/codex-metaphores/planches/${file}`;
}

/** Panneaux texte issus des planches (encyclopédie vivante) */
export const CODEX_PANNEAUX = [
  {
    id: "murs",
    title: "Murs nommés",
    body: "Physique · pare-feu · tabou — nommer pour traverser, pas pour bloquer.",
  },
  {
    id: "extra-intra",
    title: "Extra → intra",
    body: "Quand tu sors du lot, tu rentres en dedans — dehors vu dedans.",
  },
  {
    id: "carnet",
    title: "Carnet → projet",
    body: "Tes carnets = matière première. Le projet = preuve. Métaphore, sens, ancrage.",
  },
  {
    id: "couches",
    title: "Couches philo / public",
    body: "Privé : carnets, codes, joual. Public : un speech, kit CirculAI, preuves — pas le grimoire entier ce soir.",
  },
  {
    id: "lien",
    title: "Un lien public · codex privé",
    body: "Partager le chemin, protéger la source. Diffuser la lumière, pas tout le grimoire.",
  },
];
