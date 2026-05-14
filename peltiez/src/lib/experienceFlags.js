export const EXPERIENCE_FLAGS = Object.freeze({
  // Popups / overlays / distracting layers
  launchIntro: false,
  globalLaunchAlert: false,
  /** Bandeau fixe bas d’écran : CTA pricing / soutien / alerte CRM (SEO + conversion). */
  strategicConversionStrip: true,
  /** Décompte fixe jusqu’au déploiement (21 mai 8 h Québec) — voir deployLaunch.js */
  deploymentCountdown: true,
  /** Portée d’accueil obligatoire + son au premier geste (voir public/audio/README.txt) */
  firstVisitWelcomeGate: true,
  sovereigntyBanner: false,
  circuliaWidget: false,
  audioControl: false,
  ambientMusic: false,
  /**
   * Fiches vivantes (cartes stratégiques Atlas) : leçon lisible sans Pass local.
   * Désactiver (false) pour rétablir le voile + CTA Pass Souverain uniquement.
   */
  livingCardsLessonsOpen: true,
  /**
   * Filtre Gros Câlin : franchi sans case ni localStorage (Atlas, fiches, Authenticity, Sentinelle, etc.).
   * Passer à false pour réafficher le parvis sur ces routes.
   */
  grosCalinUnlocked: true,
  /** Liens contextuels sous le contenu (données `siteGraph.js`). */
  contextualLinksPanel: true,
});

