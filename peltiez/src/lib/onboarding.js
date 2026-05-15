export const ONBOARDING_KEY = "egor69_onboarding_v1";

export function loadOnboarding() {
  try {
    const raw = localStorage.getItem(ONBOARDING_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveOnboarding(data) {
  try {
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("egor69-onboarding-change", { detail: data }));
  } catch {
    /* ignore */
  }
}

export function shouldShowOnboarding() {
  const data = loadOnboarding();
  return !data?.completed && !data?.skipped;
}

export function resetOnboardingForReplay() {
  saveOnboarding({ completed: false, skipped: false, replay: true });
}
