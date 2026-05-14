import { allSyntheticRadarScans, RADAR_SCAN_TARGET } from "./lib/syntheticRadar.js";
import { composeLivingSheetIgor } from "./igorLivingSheetComposer.js";
import { loadAtlasVivant, saveAtlasVivant } from "./atlasVivantRepository.js";

/**
 * Lit les 3871 scans radar (synthèse déterministe), compose une Fiche vivante par scan,
 * enregistre dans la collection Atlas vivant (fichier `server/data/atlas-vivant.json`).
 *
 * @param {{ offset?: number; limit?: number; reset?: boolean }} opts
 */
export async function convertScansToLiveSheets(opts = {}) {
  const offset = Math.max(0, Number(opts.offset) || 0);
  const limit = opts.limit != null ? Math.max(0, Number(opts.limit)) : RADAR_SCAN_TARGET;
  const reset = !!opts.reset;

  let store = loadAtlasVivant();
  if (reset) {
    store = {
      version: 1,
      updatedAt: null,
      sheetsByScanId: {},
      sheetIds: [],
      fiches_vivantes_count: 0,
    };
  }

  const all = allSyntheticRadarScans();
  const scans = all.slice(offset, offset + limit);

  for (let i = 0; i < scans.length; i++) {
    const scan = scans[i];
    const globalIndex = offset + i;
    const sheet = composeLivingSheetIgor(scan, globalIndex);
    store.sheetsByScanId[scan.id] = sheet;
  }

  store.sheetIds = Object.keys(store.sheetsByScanId).map((k) => store.sheetsByScanId[k].id);
  saveAtlasVivant(store);

  return {
    processed: scans.length,
    totalTarget: RADAR_SCAN_TARGET,
    offset,
    limit: scans.length,
    fiches_vivantes_count: store.fiches_vivantes_count,
  };
}
