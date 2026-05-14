import { mergeUniversePreferences, loadUniversePreferences, saveUniversePreferences } from "@/lib/universePreferences";
import { awardXp } from "@/lib/peltXpEconomy";
import { SOVEREIGN_SINGULARITY_LORE } from "@/lib/sovereignSingularityLore";

const BUFFERS = new Map();

function pushBuffer(key, ch, maxLen = 24) {
  const cur = (BUFFERS.get(key) || "") + ch.toLowerCase();
  const trimmed = cur.slice(-maxLen);
  BUFFERS.set(key, trimmed);
  return trimmed;
}

export const CHEAT_DEFINITIONS = [
  {
    id: "heart_curve_unlock",
    pattern: "coeur",
    label: "Courbe du cœur",
    onActivate: () => {
      mergeUniversePreferences({ themeId: "heart_curve" });
      awardXp(80, "cheat_code:coeur");
    },
  },
  {
    id: "obsidian_unlock",
    pattern: "archive",
    label: "Archive secrète",
    onActivate: () => {
      mergeUniversePreferences({ themeId: "obsidian_archive", reducedParticles: true });
      awardXp(120, "cheat_code:archive");
    },
  },
  {
    id: "quant_grid_prop",
    pattern: "grille",
    label: "Prop grille quantique",
    onActivate: () => {
      const cur = loadUniversePreferences();
      const set = new Set(cur.unlockedPropIds || []);
      set.add("tool_quant_grid");
      saveUniversePreferences({ ...cur, unlockedPropIds: [...set] });
      awardXp(200, "cheat_code:grille");
    },
  },
  {
    id: "sovereign_singularity_echo",
    pattern: "singularite",
    label: "Singularité souveraine · lore unifié",
    toastDescription:
      "Thème « sovereign_alpha » + stabilité narrative π/carbon_offset (fiction). Aucune certification Loi 25 implicite — voir Charte & légal.",
    onActivate: () => {
      SOVEREIGN_SINGULARITY_LORE.activateSovereigntyEcho();
      mergeUniversePreferences({
        themeId: "sovereign_alpha",
        ambientIntensity: Math.min(0.98, Math.max(0.72, 1 / SOVEREIGN_SINGULARITY_LORE.carbon_offset - 0.02)),
      });
      awardXp(256, "cheat_code:singularite");
      if (import.meta.env.DEV && typeof console !== "undefined" && console.info) {
        console.info(
          "[Egor69 lore] Singularité souveraine (fiction)\n",
          SOVEREIGN_SINGULARITY_LORE.applyGovernance().slice(0, 400) + "…",
        );
      }
    },
  },
];

export function feedCheatKeystroke(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return null;
  if (e.key.length !== 1 || !/[a-zA-Z]/.test(e.key)) return null;
  const buf = pushBuffer("main", e.key);

  for (const cheat of CHEAT_DEFINITIONS) {
    if (buf.endsWith(cheat.pattern)) {
      BUFFERS.set("main", "");
      cheat.onActivate();
      return cheat;
    }
  }
  return null;
}
