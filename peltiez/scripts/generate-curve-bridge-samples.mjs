/** Génère les échantillons JSON des 3 courbes → public/ue-aiouy/ */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dest = join(root, "public", "ue-aiouy");
mkdirSync(dest, { recursive: true });

import { assignHilbertLayout, hilbertLayoutToPoints } from "../src/lib/math/hilbertCurve.js";

function sortMaillageIds(ids) {
  return [...ids].sort((a, b) => {
    const parse = (id) => {
      const m = /^D(\d+)-S(\d+)$/i.exec(id);
      return m ? [Number(m[1]), Number(m[2])] : [99, 99];
    };
    const [d1, s1] = parse(a);
    const [d2, s2] = parse(b);
    return d1 - d2 || s1 - s2;
  });
}

function buildPeanoMaillageExport(layout) {
  return {
    version: 1,
    kind: "peano-hilbert-maillage-bridge",
    project: "UEAIOUY",
    ficheCount: layout.length,
    fiches: layout,
    splinePoints: hilbertLayoutToPoints(layout, 10),
  };
}
const { polarRosePoints, buildPolarBridgeExport, POLAR_ROSE_DEFAULT } = await import(
  "../src/lib/math/polarCurve.js"
);
const {
  integrateRossler,
  normalizeRosslerPoints,
  buildRosslerBridgeExport,
  ROSSLER_DEFAULT_PARAMS,
} = await import("../src/lib/rosslerAttractor.js");

const manifest = JSON.parse(
  readFileSync(join(root, "docs/encyclopedie/generated/ensemble-manifest.json"), "utf8"),
);
const fiches = manifest.spine.filter((x) => x.type === "fiche-maillage");
const ids = sortMaillageIds(fiches.map((f) => f.id));
const layout = assignHilbertLayout(ids).map((cell) => {
  const meta = fiches.find((f) => f.id === cell.id);
  return { ...cell, title: meta?.title ?? cell.id };
});

writeFileSync(
  join(dest, "peano-maillage-bridge.sample.json"),
  JSON.stringify(buildPeanoMaillageExport(layout), null, 2),
);

const polar = polarRosePoints(POLAR_ROSE_DEFAULT).filter((_, i) => i % 3 === 0);
writeFileSync(
  join(dest, "polar-rose-bridge.sample.json"),
  JSON.stringify(buildPolarBridgeExport(polar), null, 2),
);

const rossler = normalizeRosslerPoints(integrateRossler({ steps: 2000, skip: 300 }));
const rossEvery5 = rossler.filter((_, i) => i % 5 === 0);
writeFileSync(
  join(dest, "rossler-bridge.sample.json"),
  JSON.stringify(buildRosslerBridgeExport(rossEvery5), null, 2),
);

console.log("OK curve samples → public/ue-aiouy/");
