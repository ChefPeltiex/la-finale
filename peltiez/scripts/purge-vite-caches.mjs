/**
 * Supprime les caches Vite / dossiers de build sans toucher à node_modules entier.
 * Utilisé par `npm run purify:caches` (toutes plateformes).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const targets = [".vite", "dist", path.join("node_modules", ".vite"), path.join("node_modules", ".vite-temp")];

for (const rel of targets) {
  const abs = path.join(root, rel);
  try {
    fs.rmSync(abs, { recursive: true, force: true });
    console.log("removed:", rel);
  } catch (e) {
    console.warn("skip:", rel, e?.message || e);
  }
}
