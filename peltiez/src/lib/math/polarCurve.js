/**
 * Rose polaire r = a·cos(b·θ) — mandala qui dérive si b ≠ entier.
 */

export const POLAR_ROSE_DEFAULT = {
  a: 3,
  b: 0.95,
  thetaMax: 40 * Math.PI,
  steps: 1200,
  scale: 0.08,
};

export function polarRosePoints(overrides = {}) {
  const p = { ...POLAR_ROSE_DEFAULT, ...overrides };
  const pts = [];
  for (let i = 0; i <= p.steps; i += 1) {
    const theta = (i / p.steps) * p.thetaMax;
    const r = p.a * Math.cos(p.b * theta);
    pts.push([
      r * Math.cos(theta) * p.scale,
      r * Math.sin(theta) * p.scale,
      0,
    ]);
  }
  return pts;
}

export function buildPolarBridgeExport(points, params = POLAR_ROSE_DEFAULT) {
  return {
    version: 1,
    kind: "polar-rose-bridge",
    project: "UEAIOUY",
    description: "Rose polaire — sigil Verse / matériau UE",
    equation: "r = a·cos(b·θ)",
    params: {
      a: params.a,
      b: params.b,
      thetaMax: params.thetaMax,
      steps: params.steps,
      scale: params.scale,
    },
    pointCount: points.length,
    points: points.map(([x, y, z], i) => ({ i, x, y, z })),
    unreal: {
      recommended_engine_version: "5.4+",
      import_paths: [
        "Spline fermée ou Niagara ribbon",
        "Material : angle → UV spiral (paramètre θ)",
      ],
    },
  };
}

export function downloadPolarBridgeJson(points, params, filename = "polar-rose-bridge.json") {
  const blob = new Blob([JSON.stringify(buildPolarBridgeExport(points, params), null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
