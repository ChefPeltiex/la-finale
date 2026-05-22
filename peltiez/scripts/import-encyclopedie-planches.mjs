/**
 * Importe les images déposées par Dominic → assets/codex-encyclopedie/
 * Puis copie vers public via encyclopedie:public (à lancer après).
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const repoRoot = join(root, "..");

const incoming = join(repoRoot, "assets", "codex-encyclopedie-incoming");
const dest = join(repoRoot, "assets", "codex-encyclopedie");
const mappingPath = join(root, "docs", "encyclopedie", "planches-mapping.json");

mkdirSync(incoming, { recursive: true });
mkdirSync(dest, { recursive: true });

const exts = [".png", ".jpg", ".jpeg", ".webp"];
let copied = 0;

/** @param {string} src @param {string} targetName */
function copyOne(src, targetName) {
  const out = join(dest, targetName);
  copyFileSync(src, out);
  copied += 1;
  console.log(`  → ${targetName}`);
}

if (existsSync(mappingPath)) {
  const map = JSON.parse(readFileSync(mappingPath, "utf8"));
  for (const { source, target } of map.mappings ?? []) {
    const src = join(incoming, source);
    if (!existsSync(src)) {
      console.warn(`[skip] mapping manquant: ${source}`);
      continue;
    }
    copyOne(src, target);
  }
}

if (existsSync(incoming)) {
  for (const f of readdirSync(incoming)) {
    const lower = f.toLowerCase();
    if (!exts.some((e) => lower.endsWith(e))) continue;
    if (f.startsWith("codex-encyclopedie-")) {
      copyOne(join(incoming, f), f.replace(/\.jpe?g$/i, ".png").replace(/\.webp$/i, ".png"));
    }
  }
}

console.log(`\n[import] ${copied} fichier(s) → assets/codex-encyclopedie/`);
console.log("Ensuite : npm run encyclopedie:public");
