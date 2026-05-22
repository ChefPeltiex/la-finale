/**
 * Attracteur de Rössler — simulation RK4 pour pont web (Three.js) → Unreal (spline / Niagara).
 * dx/dt = -y - z ; dy/dt = x + ay ; dz/dt = b + z(x - c)
 */

export const ROSSLER_DEFAULT_PARAMS = {
  a: 0.2,
  b: 0.2,
  c: 5.7,
  dt: 0.01,
  steps: 6000,
  skip: 500,
};

/** @param {[number, number, number]} state */
function rosslerDeriv(state, { a, b, c }) {
  const [x, y, z] = state;
  return [-y - z, x + a * y, b + z * (x - c)];
}

/** @param {[number, number, number]} state */
function rk4Step(state, params, dt) {
  const scale = (v, k) => [v[0] + k[0] * dt, v[1] + k[1] * dt, v[2] + k[2] * dt];
  const k1 = rosslerDeriv(state, params);
  const k2 = rosslerDeriv(scale(state, k1, 0.5), params);
  const k3 = rosslerDeriv(scale(state, k2, 0.5), params);
  const k4 = rosslerDeriv(scale(state, k3, 1), params);
  return [
    state[0] + (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
    state[1] + (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
    state[2] + (dt / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]),
  ];
}

/**
 * Intègre la trajectoire chaotique.
 * @returns {Array<[number, number, number]>}
 */
export function integrateRossler(overrides = {}) {
  const p = { ...ROSSLER_DEFAULT_PARAMS, ...overrides };
  let state = [0.1, 0, 0];
  const points = [];
  for (let i = 0; i < p.steps; i += 1) {
    state = rk4Step(state, p, p.dt);
    if (i >= p.skip) points.push([state[0], state[1], state[2]]);
  }
  return points;
}

/** Centre et met à l'échelle pour affichage web / export UE (unités ~mètres). */
export function normalizeRosslerPoints(points, scale = 0.12) {
  if (!points.length) return [];
  let cx = 0;
  let cy = 0;
  let cz = 0;
  for (const [x, y, z] of points) {
    cx += x;
    cy += y;
    cz += z;
  }
  const n = points.length;
  cx /= n;
  cy /= n;
  cz /= n;
  return points.map(([x, y, z]) => [(x - cx) * scale, (y - cy) * scale, (z - cz) * scale]);
}

/** Payload JSON pour import Blueprint / Niagara / spline UE. */
export function buildRosslerBridgeExport(points, params = ROSSLER_DEFAULT_PARAMS) {
  return {
    version: 1,
    kind: "rossler-attractor-bridge",
    project: "UEAIOUY",
    description: "Trajectoire chaotique — pont Verse (Three.js) vers spline / Niagara Unreal",
    equations: {
      dx: "-y - z",
      dy: "x + a*y",
      dz: "b + z*(x - c)",
    },
    params: {
      a: params.a,
      b: params.b,
      c: params.c,
      dt: params.dt,
      steps: params.steps,
      skip: params.skip,
    },
    scale_hint: 0.12,
    pointCount: points.length,
    points: points.map(([x, y, z], i) => ({ i, x, y, z })),
    unreal: {
      recommended_engine_version: "5.4+",
      import_paths: [
        "JSON → DataTable ou Array de FVector (Blueprint)",
        "Spline Component : AddSplinePoint pour chaque point (sous-échantillonner si > 2000)",
        "Niagara : Ribbon / Beam le long de la spline, couleur selon Z ou vitesse",
      ],
      notes:
        "Ce fichier ne lance pas UE. Généré depuis /ue-aiouy — onglet Attracteur. Même trajectoire = même « fil » narratif web ↔ Outworld.",
    },
  };
}

export function downloadRosslerBridgeJson(points, params, filename = "rossler-bridge.json") {
  const payload = buildRosslerBridgeExport(points, params);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

