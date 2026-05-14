/**
 * Poutre maîtresse — catalogue central unique pour simulations métiers + volet éducatif.
 * Réalité technique : données statiques versionnées avec le dépôt Git ; pas de mystique,
 * pas de surveillance psychique — la « vigie » = pipelines CI, revue de code et chiffrement en prod.
 */

export const MASTER_BEAM_META = {
  key: "poutre-maitresse-donnees",
  title: "Poutre maîtresse des fondations",
  subtitle: "Point commun unique pour les grilles métiers & scolaires (aperçu)",
  technicalTruth:
    "Une seule source dans le code évite les copies contradictoires : PR + lint + build = garde-fous automatiques. Les secrets restent dans les variables d’environnement serveur, jamais dans cette table.",
  loreMetaphor:
    "Narration maison : la « Tour étoilée » est une image pour dire que les données sensibles montent vers des couches protégées — pas une structure physique. Les clés ? elles tournent avec les bonnes pratiques OPS (rotation), même quand on rit d’avoir égaré la clé USB.",
  constants: {
    piEcho: "3.1416171819…",
    towerHeightKmLore: "500_000_000_000",
  },
};

/** Simulations de métiers (virtuelles, pédagogiques) — entreprises & métiers variés */
export const CAREER_SIMULATIONS = [
  {
    id: "sim-atelier-reparation",
    sector: "Économie circulaire",
    role: "Technicien·ne réparation express",
    durationMin: 25,
    skills: "Diagnostic, soudure douce, relation donneur",
    eduMatieres: "Sciences · maths pratiques · français consigne",
    enterpriseType: "PME repair café / coop",
  },
  {
    id: "sim-logistique-don",
    sector: "Logistique solidaire",
    role: "Coordinateur·rice dernier kilomètre",
    durationMin: 40,
    skills: "Planification, carte, négociation légère",
    eduMatieres: "Géo · résolution problème · éthique",
    enterpriseType: "Association / hub urbain",
  },
  {
    id: "sim-data-steward",
    sector: "Données & conformité",
    role: "Steward vie privée junior",
    durationMin: 35,
    skills: "Cartographie flux, DPIA simplifié, vocabulaire légal",
    eduMatieres: "Éducation civique · techno · anglais doc",
    enterpriseType: "Scale-up / institution",
  },
  {
    id: "sim-artisan-marche",
    sector: "Artisanat & marché",
    role: "Artisan·e vendeur·euse weekend",
    durationMin: 30,
    skills: "Stand, histoire produit, paiement éthique",
    eduMatieres: "Maths commerce · arts · communication",
    enterpriseType: "Micro-entreprise / marché public",
  },
  {
    id: "sim-agro-perma",
    sector: "Agroécologie",
    role: "Animateur·rice pépinière coopérative",
    durationMin: 45,
    skills: "Rotation cultures, irrigation, facilitation groupe",
    eduMatieres: "SVT · chimie douce · biologie",
    enterpriseType: "Coop agricole / OBNL",
  },
  {
    id: "sim-mediation-numerique",
    sector: "Inclusion numérique",
    role: "Médiateur·rice fablab",
    durationMin: 30,
    skills: "Pédagogie adultes, impression 3D intro, sécurité",
    eduMatieres: "Français · physics léger · arts numériques",
    enterpriseType: "Fablab municipal / entreprise ESS",
  },
];

/** Matières & axes éducatifs croisés */
export const SCHOOL_SUBJECT_STRANDS = [
  { id: "math", label: "Mathématiques", focus: "Proportion, stats honnêtes, budgets", linkedCareers: ["sim-logistique-don", "sim-artisan-marche"] },
  { id: "fr", label: "Français / communication", focus: "Consignes claires, pitch éthique", linkedCareers: ["sim-atelier-reparation", "sim-mediation-numerique"] },
  { id: "sciences", label: "Sciences & tech", focus: "Matériaux, énergie, cycles", linkedCareers: ["sim-atelier-reparation", "sim-agro-perma"] },
  { id: "geo", label: "Univers social / géo", focus: "Territoires, justice spatiale", linkedCareers: ["sim-logistique-don", "sim-agro-perma"] },
  { id: "civic", label: "Éthique & civique", focus: "Consentement, charte, loi 25 / RGPD sensibilisation", linkedCareers: ["sim-data-steward", "sim-mediation-numerique"] },
  { id: "arts", label: "Arts & design", focus: "Identité visuelle locale, accessibilité", linkedCareers: ["sim-artisan-marche", "sim-mediation-numerique"] },
];

export function careerById(id) {
  return CAREER_SIMULATIONS.find((c) => c.id === id);
}
