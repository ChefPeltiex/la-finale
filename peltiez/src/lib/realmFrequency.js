/**
 * Clés vibratoires symboliques par realm — dérivées du Codex, non médicales.
 */

import { FREQUENCY_PROFILES, getRealmFrequencyProfile, getFrequencyProfile } from "@/lib/verseAudio";

function capitalizePole(pole) {
  if (!pole) return "Verse";
  return pole.charAt(0).toUpperCase() + pole.slice(1);
}

/** Ligne du Maître pour un portail — métaphore, pas promesse. */
export function buildRealmMaitreLine(realm, profile) {
  const label = realm?.label ?? "Anneau";
  const hz = profile.label;
  const slug = realm?.slug ?? "";

  if (slug.startsWith("myth-")) {
    return `Mythe « ${label} » — clé ${hz} (${profile.pole}) : lecture critique, pas d’oracle.`;
  }
  if (slug.startsWith("well-")) {
    return `Bien-être « ${label} » — clé ${hz} : cadre prudent, sans promesse de guérison.`;
  }
  if (slug.startsWith("div-")) {
    return `Seuil divinatoire « ${label} » — clé ${hz} : jeu symbolique, pas sentence.`;
  }
  if (slug === "accueil") {
    return `Sanctuaire — clé ${hz} : intention honnête avant le voyage.`;
  }
  if (slug === "cosmic") {
    return `Cosmos « ${label} » — clé ${hz} : humilité des chiffres, mystère mesuré.`;
  }
  return `« ${label} » — clé ${hz} · ${capitalizePole(profile.pole)} : ${profile.hint}`;
}

/** Métadonnées Hz pour un realm (objet realm ou slug + label). */
export function getRealmFrequencyMeta(realm) {
  const key = realm?.frequencyKey ?? getRealmFrequencyProfile(realm);
  const profile = getFrequencyProfile(key);
  const label = realm?.label ?? profile.pole;
  return {
    frequencyKey: key,
    frequencyHz: realm?.frequencyHz ?? profile.hz,
    frequencyLabel: realm?.frequencyLabel ?? capitalizePole(profile.pole),
    frequencyProfileLabel: profile.label,
    maitreLine: realm?.maitreLine ?? buildRealmMaitreLine({ label, slug: realm?.slug }, profile),
    profile,
  };
}

/** Badge HUD compact : « 432 · Matière » */
export function formatRealmFrequencyBadge(realm) {
  if (!realm) return null;
  const meta = getRealmFrequencyMeta(realm);
  const hz =
    meta.frequencyHz % 1 !== 0
      ? meta.frequencyHz.toFixed(2).replace(".", ",")
      : String(meta.frequencyHz);
  return `${hz} · ${meta.frequencyLabel}`;
}

/** Injecte frequencyKey, frequencyHz, frequencyLabel, maitreLine sur chaque realm. */
export function applyRealmFrequencyFields(realms) {
  if (!Array.isArray(realms)) return realms;
  for (const realm of realms) {
    const key = getRealmFrequencyProfile(realm);
    const profile = getFrequencyProfile(key);
    realm.frequencyKey = key;
    realm.frequencyHz = profile.hz;
    realm.frequencyLabel = capitalizePole(profile.pole);
    realm.maitreLine = buildRealmMaitreLine(realm, profile);
  }
  return realms;
}

export { FREQUENCY_PROFILES, getRealmFrequencyProfile, getFrequencyProfile };
