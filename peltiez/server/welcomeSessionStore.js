import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const SENT_FILE = path.join(DATA_DIR, "welcome-sent-sessions.ndjson");

function ensureDataDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readSentIds() {
  try {
    const raw = fs.readFileSync(SENT_FILE, "utf8");
    const ids = new Set();
    for (const line of raw.split("\n")) {
      const id = line.trim();
      if (id) ids.add(id);
    }
    return ids;
  } catch {
    return new Set();
  }
}

export function hasWelcomeBeenSent(sessionId) {
  if (!sessionId) return false;
  return readSentIds().has(String(sessionId));
}

export function markWelcomeSent(sessionId) {
  if (!sessionId) return;
  const id = String(sessionId);
  if (hasWelcomeBeenSent(id)) return;
  ensureDataDir();
  fs.appendFileSync(SENT_FILE, `${id}\n`, "utf8");
}
