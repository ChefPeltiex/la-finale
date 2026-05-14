import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ATLAS_VIVANT_PATH = path.join(__dirname, "data", "atlas-vivant.json");

function emptyStore() {
  return {
    version: 1,
    updatedAt: null,
    sheetsByScanId: {},
    sheetIds: [],
    fiches_vivantes_count: 0,
  };
}

export function loadAtlasVivant() {
  try {
    const raw = fs.readFileSync(ATLAS_VIVANT_PATH, "utf8");
    const data = JSON.parse(raw);
    if (!data.sheetsByScanId || typeof data.sheetsByScanId !== "object") return emptyStore();
    return {
      ...emptyStore(),
      ...data,
      sheetsByScanId: data.sheetsByScanId,
      sheetIds: Array.isArray(data.sheetIds) ? data.sheetIds : Object.keys(data.sheetsByScanId || {}),
      fiches_vivantes_count: typeof data.fiches_vivantes_count === "number"
        ? data.fiches_vivantes_count
        : Object.keys(data.sheetsByScanId || {}).length,
    };
  } catch {
    return emptyStore();
  }
}

export function saveAtlasVivant(store) {
  fs.mkdirSync(path.dirname(ATLAS_VIVANT_PATH), { recursive: true });
  store.updatedAt = new Date().toISOString();
  store.fiches_vivantes_count = Object.keys(store.sheetsByScanId || {}).length;
  fs.writeFileSync(ATLAS_VIVANT_PATH, JSON.stringify(store, null, 2), "utf8");
}

export function upsertLivingSheet(sheet) {
  const store = loadAtlasVivant();
  const sid = sheet.scan_id;
  store.sheetsByScanId[sid] = sheet;
  store.sheetIds = Object.keys(store.sheetsByScanId).map((k) => store.sheetsByScanId[k].id);
  saveAtlasVivant(store);
  return { total: store.fiches_vivantes_count };
}

export function getFichesVivantesCount() {
  const s = loadAtlasVivant();
  return s.fiches_vivantes_count ?? Object.keys(s.sheetsByScanId || {}).length;
}

/** Aperçu léger pour l’Atlas (limite bornée côté serveur). */
export function getFichesVivantesPreview(limit = 24) {
  const store = loadAtlasVivant();
  const sheets = Object.values(store.sheetsByScanId || {});
  const sorted = [...sheets].sort((a, b) =>
    String(b.compose_at || "").localeCompare(String(a.compose_at || "")),
  );
  const n = Math.min(Math.max(1, Number(limit) || 24), 100);
  return sorted.slice(0, n).map((s) => ({
    id: s.id,
    scan_id: s.scan_id,
    titre: s.titre,
    excerpt: String(s.sensation || "").slice(0, 200),
    compose_at: s.compose_at || null,
    formule_math_titre: s.formule_math_titre || null,
  }));
}

export function getLivingSheetByScanId(scanId) {
  const store = loadAtlasVivant();
  return store.sheetsByScanId?.[String(scanId)] || null;
}
