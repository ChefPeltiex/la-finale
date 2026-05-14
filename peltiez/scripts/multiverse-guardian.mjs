#!/usr/bin/env node
/**
 * Gardien du Multivers React — checks locaux avant / après Vite.
 * Auteur : Doum Peltiez — The Master of the Multiverse
 *
 * Usage : node ./scripts/multiverse-guardian.mjs
 *         npm run multiverse:guard
 */
import fs from "fs";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const nm = path.join(root, "node_modules");

const API_PORT = Number(process.env.PORT || process.env.IGOR_API_PORT || 8787);
const API_HOST = process.env.IGOR_API_HOST || "127.0.0.1";

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

/** Tous les dossiers `.../node_modules/react` (racine + imbriqués). */
function collectReactInstallDirs(nodeModulesDir) {
  const found = [];
  function scan(nm) {
    if (!exists(nm)) return;
    const reactHere = path.join(nm, "react", "package.json");
    if (exists(reactHere)) found.push(path.dirname(reactHere));
    let entries;
    try {
      entries = fs.readdirSync(nm, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of entries) {
      if (!ent.isDirectory()) continue;
      const p = path.join(nm, ent.name);
      if (ent.name === "node_modules") {
        scan(p);
      } else {
        const nested = path.join(p, "node_modules");
        if (exists(nested)) scan(nested);
      }
    }
  }
  scan(nodeModulesDir);
  return found;
}

/** Fichiers source avec import() dynamique (hors liste résumée). */
function scanDynamicImports(dir, exts, out = []) {
  if (!exists(dir)) return out;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === "dist") continue;
      scanDynamicImports(full, exts, out);
    } else if (ent.isFile() && exts.some((e) => ent.name.endsWith(e))) {
      const content = fs.readFileSync(full, "utf8");
      const matches = [...content.matchAll(/import\s*\(\s*([^)]+?)\s*\)/gs)];
      if (matches.length) {
        out.push({
          file: path.relative(root, full).split(path.sep).join("/"),
          imports: matches.map((m) => m[1].trim().slice(0, 120)),
        });
      }
    }
  }
  return out;
}

/** Quelques paquets connus pour tirer un second graphe React en dev (heuristique). */
const WATCHLIST = ["react-katex"];

function scanWatchlistedPackages(nodeModulesDir) {
  const hits = [];
  if (!exists(nodeModulesDir)) return hits;
  for (const name of WATCHLIST) {
    const pkg = path.join(nodeModulesDir, name, "package.json");
    if (exists(pkg)) {
      try {
        const j = JSON.parse(fs.readFileSync(pkg, "utf8"));
        hits.push({ name: j.name || name, version: j.version || "?" });
      } catch {
        hits.push({ name, version: "?" });
      }
    }
  }
  return hits;
}

function httpPing(url, timeoutMs = 2500) {
  return new Promise((resolve) => {
    const req = http.get(url, { timeout: timeoutMs }, (res) => {
      res.resume();
      resolve({ ok: true, status: res.statusCode });
    });
    req.on("error", () => resolve({ ok: false }));
    req.on("timeout", () => {
      req.destroy();
      resolve({ ok: false });
    });
  });
}

console.log("Invocation du Gardien du Multivers React...\n");

// 1. React dupliqué (physiquement plusieurs arborescences react/)
const reactPaths = collectReactInstallDirs(nm);
if (reactPaths.length > 1) {
  console.log("Anomalie : plusieurs installations de react sous node_modules :");
  reactPaths.forEach((p) => console.log("   ->", path.relative(root, p)));
  console.log("Piste : peerDependencies, alias Vite `dedupe`, ou paquet CJS qui embarque react.\n");
} else if (reactPaths.length === 1) {
  console.log("Une arborescence `react` principale detectee :", path.relative(root, reactPaths[0]));
} else {
  console.log("Aucun dossier react trouve (node_modules absent ? Lance npm ci).\n");
}

// 2. Watchlist ciblée (pas tout le registre CJS — trop de bruit)
const watch = scanWatchlistedPackages(nm);
console.log("\nPaquets sous surveillance (hooks / double React) :");
if (watch.length) {
  watch.forEach((w) => console.log(`   -> ${w.name}@${w.version} (present — verifier l'integration)`));
} else {
  console.log("   Aucun des paquets watchlist n'est installe :", WATCHLIST.join(", "));
}

// 3. Imports dynamiques dans src/
console.log("\nScan des import() dynamiques (src)...");
const dyn = scanDynamicImports(path.join(root, "src"), [".jsx", ".js", ".tsx", ".ts"]);
const appLazy = dyn.find((d) => d.file === "src/App.jsx" || d.file === "src\\App.jsx");
const others = dyn.filter((d) => d.file !== "src/App.jsx" && d.file !== "src\\App.jsx");
if (appLazy) {
  console.log(`   App.jsx : ${appLazy.imports.length} lazy() de pages (attendu).`);
}
if (others.length) {
  console.log("   Autres fichiers avec import() dynamique :");
  for (const d of others) {
    console.log("   ->", d.file);
    d.imports.forEach((i) => console.log("      *", i));
  }
  console.log("   Verifie chemins / casse / extension .jsx si le chunk echoue au chargement.\n");
} else if (!appLazy) {
  console.log("   Aucun import() dynamique detecte.\n");
} else {
  console.log("   Rien d'autre que les routes lazy — OK.\n");
}

// 4. Backend local (port aligne sur server/index.js + README)
const healthUrl = `http://${API_HOST}:${API_PORT}/api/health`;
console.log("\nSonde API :", healthUrl);
const ping = await httpPing(healthUrl);
if (ping.ok) {
  console.log("Backend joignable (HTTP", ping.status + ").");
} else {
  console.log("Backend injoignable (ECONNREFUSED / timeout).");
  console.log("Lance `npm run dev:api` ou definis PORT / IGOR_API_PORT si le port differe.\n");
}

console.log("\nGardien du Multivers termine.");
