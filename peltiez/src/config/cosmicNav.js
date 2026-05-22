/**
 * Verse 3D — navigation cosmique (P0).
 * Désactiver : VITE_COSMIC_NAV_V2=false dans .env.local
 * Visuel maître : PRIMARY Planet Earth II OST (hL-BvWLPseE).
 * Mood session longue / palette lotus : BrHMdqe0vzM @ 1:02:25 (audio, visuel statique) — docs/VERSE-INSPIRATION-YOUTUBE.md
 */
export const COSMIC_NAV_V2 = import.meta.env.VITE_COSMIC_NAV_V2 !== "false";

/** Vitesses calmes — dérive contemplative (bande son nature épique, pas course). */
export const COSMIC_WALK_SPEED = 12.8;
export const COSMIC_SPRINT_MULT = 1.72;

/** Style visuel Verse (twilight cinéma · or / indigo / violet). */
export const VERSE_STYLE = {
  bg: "#01040f",
  fog: "#1a1638",
  fogNear: 22,
  fogFar: 188,
  rimGold: "#fef3c7",
  fillViolet: "#c4b5fd",
  nebula: "#6366f1",
  groundRing: "#a78bfa",
  starFactor: 5.05,
  starCount: 17200,
  /** Couche lointaine — profondeur cinéma sans surcharge GPU. */
  starDepthCount: 3000,
  starDepthFactor: 2.28,
  starDepthSpeed: 0.14,
  /** Spirales galactiques (points additifs, horizon Verse). */
  galaxyPointCount: 1520,
  galaxyPointCountReduced: 480,
  galaxyCoreCount: 320,
  galaxyCoreCountReduced: 120,
  /** Dérive contemplative (PRIMARY + milieu session #25 @ 1:02:25). */
  starSpeed: 0.38,
  sparkleSpeed: 0.24,
  sparkleGoldSpeed: 0.14,
  sparkleGold: "#fbbf24",
  sparkleViolet: "#a78bfa",
  cameraFov: 61,
  portalFocusMs: 4200,
  portalTraverseMs: 800,
  contemplationIdleMs: 8000,
  /** Bloom conservateur — demi-résolution via EffectComposer (RTX 3060 12 Go). */
  bloomIntensity: 0.42,
  bloomThreshold: 0.68,
  bloomResolutionScale: 0.5,
};
