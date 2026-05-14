import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Fichier JSON local — pas de PII exposée via l’API publique (agrégats seulement). */
export const LEDGER_PATH = path.join(__dirname, "data", "subscription-ledger.json");

export function loadLedger() {
  try {
    const raw = fs.readFileSync(LEDGER_PATH, "utf8");
    const data = JSON.parse(raw);
    if (!data.byEmail || typeof data.byEmail !== "object") return { byEmail: {}, meta: {} };
    return data;
  } catch {
    return { byEmail: {}, meta: {} };
  }
}

export function saveLedger(data) {
  fs.mkdirSync(path.dirname(LEDGER_PATH), { recursive: true });
  fs.writeFileSync(LEDGER_PATH, JSON.stringify(data, null, 2), "utf8");
}

export function upsertByEmail(email, patch) {
  if (!email || typeof email !== "string") return;
  const key = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)) return;
  const ledger = loadLedger();
  const prev = ledger.byEmail[key] || {};
  ledger.byEmail[key] = {
    ...prev,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  ledger.meta = ledger.meta || {};
  ledger.meta.updatedAt = new Date().toISOString();
  saveLedger(ledger);
}

const ACTIVE = new Set(["active", "trialing"]);

export function countActiveStripeSubscriptions() {
  const { byEmail } = loadLedger();
  return Object.values(byEmail).filter((row) => ACTIVE.has(row.status)).length;
}

export function getLedgerMeta() {
  return loadLedger().meta || {};
}
