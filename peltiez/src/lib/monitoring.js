/**
 * Monitoring (optionnel).
 *
 * Actif uniquement si `VITE_SENTRY_DSN` est défini.
 * Objectif: capturer les erreurs front en prod sans casser le dev.
 */

let _sentry = null;
let _enabled = false;

export async function initMonitoring() {
  if (_enabled) return;
  const dsn = String(import.meta.env.VITE_SENTRY_DSN || "").trim();
  if (!dsn) return;

  try {
    // Import dynamique: n’impacte pas le dev si non configuré.
    const Sentry = await import("@sentry/react");
    Sentry.init({
      dsn,
      environment: String(import.meta.env.VITE_SENTRY_ENV || import.meta.env.MODE || "development"),
      // Échantillonnage prudent par défaut; ajuster selon besoins.
      tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || 0),
    });

    _sentry = Sentry;
    _enabled = true;
  } catch {
    // Monitoring doit rester non-bloquant.
  }
}

export function captureException(error, context) {
  try {
    if (_sentry?.captureException) {
      _sentry.captureException(error, { extra: context || undefined });
    }
  } catch {
    /* ignore */
  }
}

