/**
 * Pont symbolique Gemini — calendrier et métaphore des deux chemins.
 * Aucune astrologie déterministe, aucune promesse LoA / miracle.
 */

export const BRIDGE_TAGLINE =
  "Architecte du pont — deux chemins, une preuve à la fois";

export const PILOT_START_KEY = "egor69_pilot_start";
export const PILOT_BIRTHDAY_RITUAL_KEY = "egor69_pilot_birthday_ritual";

const CONTEMPLATION_EXACT = new Set([
  "atlas",
  "bible",
  "pantheon",
  "cosmic",
  "numerology",
  "esoteric",
  "magic",
  "feed",
  "reporters",
  "fact-check",
  "sentinelle",
]);

const ACTION_EXACT = new Set([
  "accueil",
  "market",
  "genome",
  "pricing",
  "repair",
  "jeu",
  "publier",
]);

export const TWIN_VOICE_LINES = {
  contemplation: "Ici on observe avant d'agir — une lecture à la fois.",
  action: "Ici on passe à l'acte — une preuve concrète.",
};

/** Jours jusqu'au prochain 21 mai (calendrier civil, fuseau local). */
export function daysUntilNextMay21(from = new Date()) {
  const today = stripToNoon(from);
  let year = today.getFullYear();
  let target = new Date(year, 4, 21, 12, 0, 0, 0);
  if (today.getTime() > target.getTime()) {
    year += 1;
    target = new Date(year, 4, 21, 12, 0, 0, 0);
  }
  const diff = target.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

/** Jours depuis le dernier 21 mai. */
export function daysSinceLastMay21(from = new Date()) {
  const today = stripToNoon(from);
  let year = today.getFullYear();
  let target = new Date(year, 4, 21, 12, 0, 0, 0);
  if (today.getTime() < target.getTime()) {
    year -= 1;
    target = new Date(year, 4, 21, 12, 0, 0, 0);
  }
  const diff = today.getTime() - target.getTime();
  return Math.max(0, Math.floor(diff / 86_400_000));
}

export function getMay21CalendarState(from = new Date()) {
  const daysUntil = daysUntilNextMay21(from);
  const daysSince = daysSinceLastMay21(from);
  const isToday = daysUntil === 0 && daysSince === 0;
  const isNear = isToday || daysUntil <= 14 || daysSince <= 7;
  return { daysUntil, daysSince, isToday, isNear };
}

function stripToNoon(d) {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  return x;
}

/** Voix jumelle : contemplation ou action selon realm / profil Hz. */
export function getRealmTwinVoice(slug, profileId) {
  const s = slug ?? "";
  if (s.startsWith("myth-")) return "contemplation";
  if (s.startsWith("div-")) return "contemplation";
  if (s.startsWith("well-")) return "action";
  if (CONTEMPLATION_EXACT.has(s)) return "contemplation";
  if (ACTION_EXACT.has(s)) return "action";
  if (profileId === "matter" || profileId === "sens") return "action";
  if (profileId === "myth" || profileId === "heart" || profileId === "verse") return "contemplation";
  const hash = s.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return hash % 2 === 0 ? "contemplation" : "action";
}

export function getTwinPathLine(slug, profileId) {
  const voice = getRealmTwinVoice(slug, profileId);
  return TWIN_VOICE_LINES[voice];
}

export function appendTwinPathToMaitreLine(baseLine, slug, profileId) {
  const twin = getTwinPathLine(slug, profileId);
  if (!baseLine) return twin;
  if (baseLine.includes(twin)) return baseLine;
  return `${baseLine} ${twin}`;
}

export function loadPilotStartDate() {
  try {
    const raw = localStorage.getItem(PILOT_START_KEY);
    if (!raw) return null;
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

export function ensurePilotStartDate() {
  const existing = loadPilotStartDate();
  if (existing) return existing;
  const start = new Date();
  try {
    localStorage.setItem(PILOT_START_KEY, start.toISOString());
  } catch {
    /* ignore */
  }
  return start;
}

export function getPilot90Progress(startDate = loadPilotStartDate()) {
  if (!startDate) {
    return { day: 0, total: 90, ratio: 0, complete: false, started: false };
  }
  const start = stripToNoon(startDate);
  const now = stripToNoon(new Date());
  const elapsed = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  const day = Math.min(90, Math.max(1, elapsed + 1));
  return {
    day,
    total: 90,
    ratio: Math.min(1, day / 90),
    complete: day >= 90,
    started: true,
  };
}

const DEFAULT_RITUAL = {
  proofs: false,
  engagements: false,
  testimonials: false,
};

export function loadBirthdayRitual() {
  try {
    const raw = localStorage.getItem(PILOT_BIRTHDAY_RITUAL_KEY);
    if (!raw) return { ...DEFAULT_RITUAL };
    return { ...DEFAULT_RITUAL, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_RITUAL };
  }
}

export function saveBirthdayRitual(patch) {
  const next = { ...loadBirthdayRitual(), ...patch };
  try {
    localStorage.setItem(PILOT_BIRTHDAY_RITUAL_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("egor69-pilot-birthday-ritual", { detail: next }));
  } catch {
    /* ignore */
  }
  return next;
}

export function formatMay21PilotNote() {
  const { daysUntil, isToday, isNear } = getMay21CalendarState();
  if (isToday) {
    return "Jalon anniversaire · 21 mai — rituel de revue du pilote (preuves, pas horoscope).";
  }
  if (isNear && daysUntil <= 14) {
    return `Jalon anniversaire dans ${daysUntil} jour${daysUntil > 1 ? "s" : ""} · 21 mai — calendrier civil, pas transit astrologique.`;
  }
  return `Prochain jalon anniversaire · 21 mai dans ${daysUntil} jours — une revue honnête du pilote 90 jours.`;
}

const RITUAL_KEYS = ["proofs", "engagements", "testimonials"];

function countRitualDone(ritual) {
  return RITUAL_KEYS.filter((k) => ritual?.[k]).length;
}

/**
 * Métaphore Leidenfrost : beaucoup de « chaleur » (temps qui passe) sans transfert (preuves).
 * @param {ReturnType<typeof getPilot90Progress>} progress
 * @param {ReturnType<typeof loadBirthdayRitual>} ritual
 */
export function getPilotLeidenfrostHint(progress, ritual) {
  if (!progress?.started) return null;
  const done = countRitualDone(ritual);
  if (progress.day >= 21 && done === 0) {
    return {
      level: "warn",
      title: "Alerte « mode Lédenfrost »",
      body:
        "Le pilote avance dans le temps mais aucune preuve n’est cochée. Risque d’activité sans transfert réel — comme une goutte qui lévite sans évacuer la chaleur. Documentez au moins une preuve cette semaine.",
    };
  }
  if (progress.day >= 14 && done <= 1) {
    return {
      level: "info",
      title: "Transfert thermique faible",
      body:
        "Peu de preuves cochées pour le jour " +
        progress.day +
        ". Vérifiez marketplace, témoignages ou /docs/preuves avant d’ajouter de nouvelles promesses.",
    };
  }
  return null;
}
