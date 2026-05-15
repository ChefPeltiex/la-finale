/** Mode simple vs profond — masque le copy cosmique lourd (nav, hero). */
export const DISPLAY_MODE_KEY = "egor69_display_mode";

export function loadDisplayMode() {
  try {
    const v = localStorage.getItem(DISPLAY_MODE_KEY);
    return v === "simple" ? "simple" : "deep";
  } catch {
    return "deep";
  }
}

export function saveDisplayMode(mode) {
  try {
    localStorage.setItem(DISPLAY_MODE_KEY, mode === "simple" ? "simple" : "deep");
    window.dispatchEvent(new CustomEvent("egor69-display-mode", { detail: mode }));
  } catch {
    /* ignore */
  }
}

export function isSimpleMode() {
  return loadDisplayMode() === "simple";
}
