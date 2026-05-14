/** Parsing liste d’origines pour CORS — aucune magie juridique, uniquement configuration explicite. */

export function parseCsv(v) {
  return String(v || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * @param {{ isProd: boolean; getAllowedCsv: () => string }} opts
 * @returns {(origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => void}
 */
export function createCorsOriginVerifier(opts) {
  const { isProd, getAllowedCsv } = opts;

  return (origin, cb) => {
    const allow = parseCsv(getAllowedCsv());

    if (!origin) {
      return cb(null, true);
    }

    if (allow.length === 0) {
      if (isProd) {
        return cb(new Error("STRIPE_ALLOWED_ORIGINS or PUBLIC_SITE_URL required in production"), false);
      }
      return cb(null, true);
    }

    if (allow.includes(origin)) {
      return cb(null, true);
    }

    return cb(new Error("Origin not allowed"), false);
  };
}
