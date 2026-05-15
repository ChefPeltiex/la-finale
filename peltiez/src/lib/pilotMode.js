/** Mode pilote : navigation réduite pour les nouveaux parcours. */
export const PILOT_MODE_KEY = "egor69_pilot_mode";

export function loadPilotMode() {
  try {
    const v = localStorage.getItem(PILOT_MODE_KEY);
    if (v === null) return true;
    return v !== "false";
  } catch {
    return true;
  }
}

export function savePilotMode(enabled) {
  try {
    localStorage.setItem(PILOT_MODE_KEY, enabled ? "true" : "false");
    window.dispatchEvent(new CustomEvent("egor69-pilot-mode", { detail: enabled }));
  } catch {
    /* ignore */
  }
}

export function isPilotModeEnabled() {
  return loadPilotMode();
}
