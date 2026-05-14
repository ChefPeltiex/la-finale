const SPEED_KEY = "igor:godmode:speed";

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function setGodModeSpeed(speed) {
  const v = clamp(Number(speed) || 1, 0.7, 2.2);
  try {
    localStorage.setItem(SPEED_KEY, String(v));
  } catch {}
  try {
    document.documentElement.style.setProperty("--igor-speed", String(v));
  } catch {}
  return v;
}

export function getGodModeSpeed() {
  try {
    const raw = localStorage.getItem(SPEED_KEY);
    const v = raw ? Number(raw) : 1;
    return clamp(Number.isFinite(v) ? v : 1, 0.7, 2.2);
  } catch {
    return 1;
  }
}

export function initGodModeSpeed() {
  return setGodModeSpeed(getGodModeSpeed());
}

// ── Stardust event bus (lightweight, no deps) ───────────────────────────────
const EVT = "igor:stardust";

export function emitStardust({ x, y, power = 1 } = {}) {
  try {
    window.dispatchEvent(
      new CustomEvent(EVT, {
        detail: {
          x: Number(x) || window.innerWidth / 2,
          y: Number(y) || window.innerHeight / 2,
          power: clamp(Number(power) || 1, 0.2, 3),
          t: performance.now(),
        },
      })
    );
  } catch {}
}

export function onStardust(handler) {
  const fn = e => handler?.(e?.detail);
  window.addEventListener(EVT, fn);
  return () => window.removeEventListener(EVT, fn);
}

