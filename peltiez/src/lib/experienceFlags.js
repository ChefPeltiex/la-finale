import { isDevNavLite } from "@/lib/devPerformance";

export const EXPERIENCE_FLAGS = Object.freeze({
  /** Accueil épuré (deux portes, confiance) — sections « spectacle » en repli. */
  platformCleanHome: true,
  /** Sidebar + contenu clairs sur routes CirculAI / marché. */
  platformProShell: true,
  // Popups / overlays / distracting layers
  launchIntro: false,
  globalLaunchAlert: false,
  /** Bandeau fixe bas d’écran — désactivé pour crédibilité (réactiver si campagne). */
  strategicConversionStrip: false,
  deploymentCountdown: false,
  /** Particules — off sur shell pro ; home culture peut garder léger. */
  layoutCanvasEffects: false,
  /** Orbe concierge flottant */
  conciergeOrb: !isDevNavLite,
  /** Portée d’accueil obligatoire + son au premier geste (voir public/audio/README.txt) */
  firstVisitWelcomeGate: false,
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
  contextualLinksPanel: false,
  /** Lien « Changer de monde » → /entrer (CirculAI concret vs Egor fantaisiste). */
  worldRealmSwitcher: true,
  /** Harpon / onboarding flottants — lourd en dev sur OneDrive */
  scorpionHarpoon: false,
  onboardingFlow: false,
  guideAgent: false,
  /** Sections legacy accueil (planète, matrix, témoignages globaux…) */
  homeLegacySections: false,
});

