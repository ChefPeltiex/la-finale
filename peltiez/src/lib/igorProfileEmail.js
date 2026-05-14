/** Placeholder `user_email` when forging without a cloud session — sovereign-local persistence only on-device via Egor69 entities. */
export const AVATAR_LOCAL_PROFILE_EMAIL = '__igor_local__';

/** Rows tied to a real inbox (excludes local explorer placeholder and non-email keys). */
export function isCloudBackedUserEmail(email) {
  if (email == null || typeof email !== 'string') return false;
  const t = email.trim();
  if (!t || t === AVATAR_LOCAL_PROFILE_EMAIL) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}
