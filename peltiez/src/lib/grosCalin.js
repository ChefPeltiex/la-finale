import { EXPERIENCE_FLAGS } from "@/lib/experienceFlags";

const KEY = "igor:gros-calin:unlocked";

export function isGrosCalinUnlocked() {
  if (EXPERIENCE_FLAGS.grosCalinUnlocked) return true;
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function unlockGrosCalin() {
  try {
    localStorage.setItem(KEY, "1");
  } catch {}
}

export function lockGrosCalin() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

