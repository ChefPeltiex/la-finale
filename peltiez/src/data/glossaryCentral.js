/**
 * Glossaire central — mêmes définitions à réutiliser dans l’UI et la doc.
 */
export const GLOSSARY_TERMS = [
  {
    term: "Egor69 / IGOR",
    definition:
      "Marque et expérience web : économie circulaire, atlas, Verse 3D navigateur — distinct d’un moteur de jeu Unreal embarqué.",
  },
  {
    term: "Verse 3D",
    definition:
      "Monde spatial **dans le navigateur** (WebGL / Three.js). Ce n’est pas le binaire Unreal Editor ; un parallèle UE est optionnel et hors bundle.",
  },
  {
    term: "Atlas vivant",
    definition:
      "Couche de fiches et de cartes thématiques reliées au radar et aux parcours — métadonnées et contenus, pas une promesse de données temps réel sans API.",
  },
  {
    term: "Pass / paliers",
    definition:
      "Options d’accès documentées côté **Pricing** ; paiement via **Stripe** selon configuration et lois applicables.",
  },
  {
    term: "API souveraine",
    definition:
      "Serveur Express (`server/`) : santé, Stripe, CRM lead, Atlas — proxifié en dev par Vite vers le port 8787.",
  },
  {
    term: "CRM lead",
    definition:
      "Endpoint `/api/crm/lead` : enregistrement NDJSON local en dev (`crm-leads.ndjson`) — base légale et conservation à définir pour la prod.",
  },
  {
    term: "Référencement interne",
    definition:
      "Liens et contenus **sur la plateforme** ; pas de réseau publicitaire tiers dans le bundle livré.",
  },
  {
    term: "Zero Trust (objectif)",
    definition:
      "Principe d’architecture : MFA, segmentation, moindre privilège — à déployer progressivement ; aucun système n’est « parfait » sans exploitation continue.",
  },
];
