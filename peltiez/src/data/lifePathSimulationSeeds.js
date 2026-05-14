/**
 * Graines de simulation de vie — thèmes alignés sur la littérature ouverte
 * (durabilité, santé publique, équité) sans importer ni copier des bases propriétaires.
 * Chaque entrée est une **invite narrative** pour échange / don / réparation dans Egor69.
 */

export const LIFE_PATH_SIMULATION_SEEDS = [
  {
    id: "circular-quarter",
    title: "Trimestre circulaire",
    themes: ["économie circulaire", "réparation", "don d’objets"],
    prompt:
      "Tu planifies trois mois où chaque achat est pondéré par réparation possible ou seconde vie — scoring honnête local uniquement.",
    outward:
      "Relier au marketplace : publier un don, documenter une réparation, inviter un voisin réel (avec consentement).",
  },
  {
    id: "nutrition-literacy",
    title: "Alphabétisation culinaire douce",
    themes: ["nutrition", "prévention", "accès alimentaire"],
    prompt:
      "Simulation de menus à budget contraint — données génériques, pas de diagnostics médicaux.",
    outward: "Pointer vers des ressources publiques (guides officiels santé) si l’utilisateur veut approfondir.",
  },
  {
    id: "mobility-shift",
    title: "Mobilité sans mascarade CO₂",
    themes: ["transport actif", "covoiturage", "planification"],
    prompt:
      "Semaines fictives où tu remplaces des trajets courts ; estimer des gains en temps et stress plutôt qu’en « badges verts » fake.",
    outward: "Cartographier des trajets réels optionnels — opt-in, anonymisation locale.",
  },
  {
    id: "care-network",
    title: "Réseau de soin léger",
    themes: ["entraide", "limites personnelles", "signalement responsable"],
    prompt:
      "Rôle-play messages de soutien ; si détresse sérieuse, redirection vers lignes d’écoute professionnelles.",
    outward: "Rappel charte : pas de conseil médico-légal improvisé.",
  },
  {
    id: "school-of-trade",
    title: "École du troc équitable",
    themes: ["confiance", "contrats simples", "traçabilité locale"],
    prompt:
      "Simuler des échanges à valeur équivalente avec clauses lisibles ; rien de financier non régulé.",
    outward: "Smart-contrats Egor69 comme aide à la formulation, pas substitut juridique.",
  },
  {
    id: "climate-story",
    title: "Récits climat sans spectacle",
    themes: ["adaptation", "biodiversité", "justesse des métriques"],
    prompt:
      "Choisis des actions vérifiables (réduction gaspillage, habitat) plutôt que compensation vague.",
    outward: "Lier encyclopédies / atlas vivants pour contextualiser les espèces locales.",
  },
];
