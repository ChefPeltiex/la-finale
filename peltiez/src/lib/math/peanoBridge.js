import {
  assignHilbertLayout,
  hilbertLayoutToPoints,
  hilbertOrderForCount,
} from "./hilbertCurve.js";

export { assignHilbertLayout, hilbertLayoutToPoints, hilbertOrderForCount };

/** Trie les fiches D01-S01 … D14-S09 */
export function sortMaillageIds(ids) {
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

export function buildPeanoMaillageExport(layout, meta = {}) {
  const points = hilbertLayoutToPoints(layout, 10);
  return {
    version: 1,
    kind: "peano-hilbert-maillage-bridge",
    project: "UEAIOUY",
    description:
      "Ordre de parcours des fiches encyclopédie (126) — courbe de remplissage Hilbert (famille Peano)",
    grid: {
      order: layout[0]?.order ?? 4,
      gridSize: layout[0]?.gridSize ?? 16,
      ficheCount: layout.length,
    },
    fiches: layout,
    splinePoints: points,
    unreal: {
      recommended_engine_version: "5.4+",
      import_paths: [
        "splinePoints → SplineComponent",
        "fiches[].u/v → placement POI sur plan atlas",
        "Labels : id + title depuis encyclopédie",
      ],
    },
    ...meta,
  };
}

export function downloadPeanoMaillageJson(layout, filename = "peano-maillage-bridge.json") {
  const blob = new Blob([JSON.stringify(buildPeanoMaillageExport(layout), null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
