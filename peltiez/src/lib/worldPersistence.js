/** Persistance locale du Verse 3D (checkpoint session + salles visitées). */

import { awardXp } from "@/lib/peltXpEconomy";

const CK = "igor:world:checkpoint";
const VS = "igor:world:realmsVisited";

export function loadCheckpoint() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CK);
    if (!raw) return null;
    const o = JSON.parse(raw);
    if (typeof o.x !== "number" || typeof o.z !== "number") return null;
    return {
      x: o.x,
      z: o.z,
      rotY: typeof o.rotY === "number" ? o.rotY : 0,
    };
  } catch {
    return null;
  }
}

let lastSaveMs = 0;

/** Sauvegarde pose joueur open-world (session). */
export function maybePersistPlayer(x, z, rotY, intervalMs = 420) {
  if (typeof window === "undefined") return;
  const now = Date.now();
  if (now - lastSaveMs < intervalMs) return;
  lastSaveMs = now;
  try {
    sessionStorage.setItem(CK, JSON.stringify({ x, z, rotY }));
  } catch {
    /* quota / privé */
  }
}

/** @deprecated utiliser maybePersistPlayer pour la caméra troisième personne */
export function maybePersistPose(camera, intervalMs = 420) {
  maybePersistPlayer(camera.position.x, camera.position.z, camera.rotation.y, intervalMs);
}

export function recordRealmVisit(slug) {
  if (typeof window === "undefined" || !slug) return false;
  try {
    const raw = localStorage.getItem(VS);
    const arr = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(arr)) return false;
    if (!arr.includes(slug)) {
      arr.push(slug);
      localStorage.setItem(VS, JSON.stringify(arr));
      awardXp(35, "verse:realm_first_visit", { slug });
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

export function getVisitedRealmSlugs() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VS);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function getVisitedRealmCount() {
  return getVisitedRealmSlugs().length;
}
