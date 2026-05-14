/** Préfixe API souveraine (Atlas / radar batch). Respecte VITE_SOVEREIGN_API_ORIGIN si défini. */
export function sovereignApiAbsolute(path) {
  const origin = import.meta.env.VITE_SOVEREIGN_API_ORIGIN || "";
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!origin) return p;
  return `${String(origin).replace(/\/$/, "")}${p}`;
}

/**
 * Intervalle de refetch pour le compteur Atlas : 1 s quand tout va bien,
 * 20 s après erreur (API locale arrêtée → sinon le proxy Vite spamme des AggregateError ECONNREFUSED).
 */
export function atlasFichesCountRefetchInterval(query) {
  return query.state.error ? 20_000 : 1_000;
}
