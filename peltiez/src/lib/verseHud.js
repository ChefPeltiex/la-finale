/** HUD Verse — prochain anneau, arc X/9, focus portail (P1). */

import { WORLD_REALMS } from "@/world/realms";
import { getVisitedRealmSlugs } from "@/lib/worldPersistence";

export const VERSE_ARC_SEGMENTS = 9;

/** Prochain portail non visité le plus proche du joueur (plan XZ). */
export function findNearestUnvisitedRealm(x, z, visitedSlugs = getVisitedRealmSlugs()) {
  const visited = new Set(visitedSlugs);
  let best = null;
  let bestD = Infinity;
  for (const r of WORLD_REALMS) {
    if (visited.has(r.slug)) continue;
    const dx = r.pos[0] - (x ?? 0);
    const dz = r.pos[2] - (z ?? 0);
    const d = Math.hypot(dx, dz);
    if (d < bestD) {
      best = r;
      bestD = d;
    }
  }
  return best;
}

/** Arc narratif en 9 paliers (inspiré chapitrage long-form, sans Hz). */
export function getArcSegmentProgress(visitedCount, realmTotal) {
  const total = realmTotal > 0 ? realmTotal : 1;
  const ratio = Math.min(1, visitedCount / total);
  const segment = Math.min(
    VERSE_ARC_SEGMENTS,
    Math.max(1, Math.ceil(ratio * VERSE_ARC_SEGMENTS) || (visitedCount > 0 ? 1 : 1))
  );
  return {
    segment,
    segments: VERSE_ARC_SEGMENTS,
    visitedCount,
    realmTotal: total,
    ratio,
  };
}

export function hasVisitedRealm(slug, visitedSlugs = getVisitedRealmSlugs()) {
  return slug ? visitedSlugs.includes(slug) : false;
}
