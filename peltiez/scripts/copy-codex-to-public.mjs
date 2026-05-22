/** Copie les planches PNG vers public/encyclopedie/codex pour l'UI illustrée */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const src = join(root, "..", "assets", "codex-encyclopedie");
const dest = join(root, "public", "encyclopedie", "codex");

if (!existsSync(src)) {
  console.log("Source absente — lancez: npm run encyclopedie:planches");
  process.exit(0);
}
mkdirSync(dest, { recursive: true });
let n = 0;
for (const f of readdirSync(src)) {
  if (f.endsWith(".png")) {
    copyFileSync(join(src, f), join(dest, f));
    n += 1;
  }
}
console.log(`OK ${n} planches → public/encyclopedie/codex/`);
