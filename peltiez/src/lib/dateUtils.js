import { isValid, parseISO, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Parse les dates renvoyées par l’API (ISO) ou des chaînes tolérées par `Date` (ex. flux RSS).
 * @param {string|number|Date|null|undefined} value
 * @returns {Date|null}
 */
export function parseApiDate(value) {
  if (value == null || value === "") return null;
  if (value instanceof Date) return isValid(value) ? value : null;
  if (typeof value === "string") {
    const iso = parseISO(value);
    if (isValid(iso)) return iso;
  }
  const d = new Date(value);
  return isValid(d) ? d : null;
}

/** Texte relatif en français (ex. « il y a 3 jours »). */
export function formatRelativeFr(value, empty = "—") {
  const d = parseApiDate(value);
  return d ? formatDistanceToNow(d, { addSuffix: true, locale: fr }) : empty;
}
