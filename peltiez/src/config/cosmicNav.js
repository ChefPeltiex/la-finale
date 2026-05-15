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
  fog: "#1e1b4b",
  fogNear: 28,
  fogFar: 172,
  rimGold: "#fef3c7",
  fillViolet: "#c4b5fd",
  nebula: "#6366f1",
  groundRing: "#a78bfa",
  starFactor: 4.6,
  starCount: 15200,
  /** Dérive contemplative (PRIMARY + milieu session #25 @ 1:02:25). */
  starSpeed: 0.44,
  sparkleSpeed: 0.26,
  sparkleGoldSpeed: 0.16,
  sparkleGold: "#fbbf24",
  sparkleViolet: "#a78bfa",
  cameraFov: 62,
  portalFocusMs: 4200,
};
