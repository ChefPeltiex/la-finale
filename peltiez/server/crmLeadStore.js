import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const LEADS_FILE = path.join(DATA_DIR, "crm-leads.ndjson");

function ensureDataDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Ajoute une ligne NDJSON (une entrée = un objet JSON).
 * Fichier ignoré par Git — sauvegarder hors dépôt en production si besoin d’audit.
 */
export function appendCrmLead(record) {
  ensureDataDir();
  const line = `${JSON.stringify(record)}\n`;
  fs.appendFileSync(LEADS_FILE, line, { encoding: "utf8" });
}
