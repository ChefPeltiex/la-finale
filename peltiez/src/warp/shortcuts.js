export const WARP_SHORTCUTS = Object.freeze([
  { keys: ["ctrl", "k"], action: "commandPalette" },
  { keys: ["ctrl", "shift", "a"], action: "atlas" },
  { keys: ["ctrl", "shift", "g"], action: "genome" },
  { keys: ["ctrl", "shift", "z"], action: "zeldaTower" },
]);

export function matchShortcut(e, keys) {
  const want = new Set(keys);
  const got = new Set();
  if (e.ctrlKey) got.add("ctrl");
  if (e.shiftKey) got.add("shift");
  if (e.altKey) got.add("alt");
  const k = String(e.key || "").toLowerCase();
  if (k && k.length === 1) got.add(k);

  if (want.size !== got.size) return false;
  for (const w of want) if (!got.has(w)) return false;
  return true;
}

