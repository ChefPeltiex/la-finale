/**
 * Cœur structurel de la plateforme — invariants, cartographie légère et jalons qualité.
 * Données déclaratives (pas de « contrôle comportemental » runtime) : lisibles dans le Manuel et réutilisables ailleurs.
 */

/** Règles non négociables alignées sur WORLD_ETHOS / charte réelle du produit. */
export const PLATFORM_INVARIANTS = Object.freeze([
  "Cohérence absolue : priorité primordiale — UX, textes, routes, données, Verse 3D, API et mentions légales alignés ; tout écart (démo, bêta, fiction) doit être nommé explicitement.",
  "Transparence : métrique publique = sourçable ou étiquetée comme fiction / démo.",
  "Sécurité : secrets hors bundle (`server/`, jamais de clés sensibles en `VITE_*`).",
  "Accessibilité : préférence `prefers-reduced-motion` respectée ; typo scalable (`data-igor-ui-scale`).",
  "Consentement : parcours immersifs et ludiques ne remplacent pas les obligations légales (paiement, données, mineurs).",
  "Sobriété numérique : privilégier lazy routes, caches raisonnables, charge utile documentée.",
]);

/**
 * Les trois « couches d’expérience » déjà routées — vision / intérieur / matériel & pont réel.
 * @type {ReadonlyArray<{ id: string, path: string, label: string, intent: string }>}
 */
export const THREE_EXPERIENCE_REALMS = Object.freeze([
  {
    id: "etherealm",
    path: "/etherealm",
    label: "Etherealm",
    intent: "Vision, création, abstraction lumineuse — espace d’idées et de prototypes.",
  },
  {
    id: "netherealm",
    path: "/netherealm",
    label: "Netherealm",
    intent: "Rythme intérieur : progression, réflexion, quêtes de sens — sans cible humaine.",
  },
  {
    id: "outworld",
    path: "/outworld",
    label: "Outworld",
    intent: "Pont vers le concret : commerce, impact, territoires — même filet de transparence que le reste.",
  },
]);

/** Encadré « finition » — rappel anti-raccourcis (réf. culturelle parodique, morale : discipline > illusion). Exporté pour le manuel plateforme. */
export const FINISHING_GRIMOIRE = Object.freeze({
  title: "Finition — éviter le coup de menhir sur la ligne d’arrivée",
  lines: [
    "Une finition honnête, ce n’est pas un douzième travail improvisé : enchaîner les raccourcis (tests ignorés, dette non assumée, démo présentée comme mesure réelle) produit le même vertige qu’un mauvais plan séquence — on croit tout voir en panoramique alors que la base bouge encore.",
    "Une « assurance tout risques » documentaire ne remplace pas l’architecture, les revues et `npm run verify` : elle couvre des clauses, pas la confiance des usagers ni la stabilité du code.",
    "Le petit chien de garde du parcours — veille, alertes, garde-fous CI — vaut mieux quand il aboie tôt : moins on le nourrit de dette, moins on le traîne en prod.",
    "Référence culturelle libre (bande dessinée humoristique gauloise) ; morale interne : sobriété, transparence, pas de miracle de dernière minute.",
  ],
});

/** Jalons qualité reproductibles (scripts npm du dépôt). */
export const QUALITY_GATES = Object.freeze([
  { command: "npm run verify", detail: "Lint (quiet) + TypeScript + build production." },
  { command: "npm run verify:deep", detail: "ESLint complet + typecheck + build + audit + gardien multivers." },
  { command: "npx eslint .", detail: "Analyse exhaustive hors CI rapide — idéal avant release." },
]);

const LEGAL_PREFIXES = ["/legal", "/charte"];
const NARRATIVE_EXACT = new Set([
  "/etherealm",
  "/netherealm",
  "/outworld",
  "/intro",
  "/underworld",
  "/cosmic-portal",
  "/infinite-legions",
  "/pantheon-3d",
  "/world",
  "/arene-virtuelle",
]);
const HYBRID_PREFIXES = ["/hub-souverain", "/vault", "/mon-univers", "/encyclopedie-biblique", "/arts-divinatoires-lexique"];

/**
 * Indicatif éditorial / UX : utile pour styliser ou filtrer (pas une permission serveur).
 * @param {string} pathname
 * @returns {"legal" | "narrative" | "hybrid" | "service"}
 */
export function getExperienceLayer(pathname) {
  if (!pathname || typeof pathname !== "string") return "service";
  const p = pathname.split("?")[0].toLowerCase();

  if (LEGAL_PREFIXES.some((pre) => p === pre || p.startsWith(`${pre}/`))) return "legal";
  if (NARRATIVE_EXACT.has(p)) return "narrative";
  if (HYBRID_PREFIXES.some((pre) => p === pre || p.startsWith(`${pre}/`))) return "hybrid";

  if (
    p.startsWith("/pantheon") ||
    p.startsWith("/ultimatum") ||
    p.startsWith("/playtime") ||
    p.startsWith("/clay")
  ) {
    return "narrative";
  }

  return "service";
}
