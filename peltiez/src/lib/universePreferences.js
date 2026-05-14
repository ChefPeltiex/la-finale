import { THEME_PRESETS, MUSIC_MOODS, HUD_PRESETS } from "@/data/universeCatalog";

const STORAGE_KEY = "igor:universe:v2";

/** Navigation réduite : chemins conservés par mode (ordre = ordre dans Layout `NAV_ITEMS`). */
const NAV_CORE_PATHS = new Set([
  "/",
  "/world",
  "/marketplace",
  "/profil",
  "/avatar-creator",
  "/mon-univers",
  "/alerts",
  "/atlas",
  "/manuel",
  "/outils-integration",
  "/carte-site",
  "/hub-fondations",
  "/hub-souverain",
  "/pricing",
  "/soutien",
  "/publier",
  "/actualite",
  "/feed",
  "/vault",
  "/jeu",
  "/authenticity",
  "/fact-check",
  "/sanctuary",
  "/cosmic-portal",
]);

const NAV_MINIMAL_PATHS = new Set(["/", "/world", "/marketplace", "/mon-univers", "/profil"]);

const defaultGameplayUniverse = () => ({
  name: "",
  tagline: "",
  playstyle: "explorer",
  personalityTag: "",
  notes: "",
  focusRealmSlugs: [],
});

const defaultState = () => ({
  themeId: "quantum_forest",
  musicMoodId: "silent",
  hudId: "navigator",
  density: "comfortable",
  ambientIntensity: 0.85,
  showConcierge: true,
  reducedParticles: false,
  unlockedPropIds: [],
  equippedPropIds: [],
  equippedCostumeId: null,
  /** Taille de base du texte (rem) sur `html`. */
  uiScale: "md",
  /** full | core | minimal — filtre les entrées de la sidebar / menu mobile. */
  navMode: "full",
  gameplayUniverse: defaultGameplayUniverse(),
});

export function loadUniversePreferences() {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const base = defaultState();
    const merged = { ...base, ...parsed };
    if (parsed.gameplayUniverse && typeof parsed.gameplayUniverse === "object") {
      merged.gameplayUniverse = { ...base.gameplayUniverse, ...parsed.gameplayUniverse };
    }
    return merged;
  } catch {
    return defaultState();
  }
}

export function saveUniversePreferences(next) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    applyUniversePreferencesToDocument(next);
    window.dispatchEvent(new CustomEvent("igor-universe-change", { detail: next }));
  } catch {
    /* quota */
  }
}

/** Applique variables CSS + classe utilitaire densité. */
export function applyUniversePreferencesToDocument(prefs) {
  const theme = THEME_PRESETS.find((t) => t.id === prefs.themeId) || THEME_PRESETS[0];
  const root = document.documentElement;
  root.style.setProperty("--igor-accent", theme.accent);
  root.style.setProperty("--igor-ambient-intensity", String(prefs.ambientIntensity ?? 0.85));

  document.body.dataset.peltDensity = prefs.density || theme.density || "comfortable";
  document.body.dataset.peltHud = prefs.hudId || "navigator";

  if (prefs.reducedParticles) root.classList.add("pelt-reduced-particles");
  else root.classList.remove("pelt-reduced-particles");

  /* Vitesse animations MagicLayout */
  const speed = prefs.density === "airy" ? 0.85 : prefs.density === "compact" ? 1.15 : 1;
  root.style.setProperty("--igor-speed", String(speed));

  root.dataset.igorUiScale = prefs.uiScale === "sm" || prefs.uiScale === "lg" ? prefs.uiScale : "md";
  root.dataset.igorNavMode =
    prefs.navMode === "core" || prefs.navMode === "minimal" ? prefs.navMode : "full";
}

/** Filtre la liste de navigation selon `navMode` (préserve l’ordre des items source). */
export function filterNavItemsForPreferences(navItems, prefs) {
  const mode = prefs.navMode === "core" || prefs.navMode === "minimal" ? prefs.navMode : "full";
  if (mode === "full") return navItems;
  const allowed = mode === "minimal" ? NAV_MINIMAL_PATHS : NAV_CORE_PATHS;
  return navItems.filter((i) => allowed.has(i.path));
}

export function mergeUniversePreferences(patch) {
  const cur = loadUniversePreferences();
  const next = { ...cur, ...patch };
  saveUniversePreferences(next);
  return next;
}

export function getMusicMoodMeta(id) {
  return MUSIC_MOODS.find((m) => m.id === id) || MUSIC_MOODS[0];
}

export function getHudMeta(id) {
  return HUD_PRESETS.find((h) => h.id === id) || HUD_PRESETS[0];
}
