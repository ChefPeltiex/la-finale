/**
 * Cercle & angles — π (standard libs) et τ = 2π (un tour complet = 1).
 * Préférer TAU pour les rotations / arcs complets ; garder PI pour les quarts (Three.js, π/2).
 */

export const PI = Math.PI;
export const TAU = Math.PI * 2;
export const HALF_TURN = PI;
export const QUARTER_TURN = PI / 2;

/** Fraction de tour [0, 1] → radians. */
export function turnFractionToRad(t) {
  return t * TAU;
}

/** Degrés → radians (360° = 1 tour = τ). */
export function degToRad(deg) {
  return (deg / 360) * TAU;
}

/** Arc canvas / trig : de 0 à un tour complet. */
export const ARC_FULL = /** @type {const} */ ([0, TAU]);
