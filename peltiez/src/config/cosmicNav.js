/**
 * Verse 3D — navigation cosmique (P0).
 * Désactiver : VITE_COSMIC_NAV_V2=false dans .env.local
 */
export const COSMIC_NAV_V2 = import.meta.env.VITE_COSMIC_NAV_V2 !== "false";

/** Vitesses alignées sur WorldScene (m/s équivalent frame). Légèrement calmes pour mood contemplatif (cf. docs/VERSE-INSPIRATION-YOUTUBE.md). */
export const COSMIC_WALK_SPEED = 13.5;
export const COSMIC_SPRINT_MULT = 1.85;
