/**
 * safeNotification — garde contre les navigateurs in-app (Facebook Messenger,
 * Instagram, LinkedIn, TikTok, WeChat…) qui ne définissent pas window.Notification.
 *
 * Ces WebViews embarquées bloquent ou omettent l'API Notification, ce qui cause
 * des "ReferenceError: Notification is not defined" au chargement du module si
 * on accède à Notification.permission au niveau du module ou dans un useState initial.
 */

/** Vrai seulement si l'API Notification est disponible dans ce contexte. */
export function isNotificationSupported() {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    typeof window.Notification === "function"
  );
}

/**
 * Lit Notification.permission de manière safe.
 * Retourne "denied" (chaîne neutre) quand l'API est absente — le UI traitera
 * cela comme non-supporté et n'affichera pas le bouton d'activation.
 */
export function getNotificationPermission() {
  if (!isNotificationSupported()) return "denied";
  try {
    return window.Notification.permission;
  } catch {
    return "denied";
  }
}

/**
 * Demande la permission de manière safe.
 * Retourne "denied" si l'API est absente ou si la demande échoue.
 */
export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return "denied";
  try {
    return await window.Notification.requestPermission();
  } catch {
    return "denied";
  }
}

/**
 * Crée une notification de manière safe. Ne lance jamais d'exception.
 * Retourne l'instance Notification ou null si non supportée/refusée.
 *
 * @param {string} title
 * @param {NotificationOptions} [options]
 * @returns {Notification|null}
 */
export function safeNewNotification(title, options = {}) {
  if (!isNotificationSupported()) return null;
  try {
    if (window.Notification.permission !== "granted") return null;
    return new window.Notification(title, options);
  } catch {
    return null;
  }
}
