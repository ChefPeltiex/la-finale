/** Nombre d'or φ — proportions, spirales, recherche sans dérivée (1D). */

export const PHI = (1 + Math.sqrt(5)) / 2;
export const INV_PHI = 1 / PHI;
export const INV_PHI_SQ = INV_PHI * INV_PHI;

/**
 * Recherche par section dorée : minimum d'une fonction unimodale sur [a, b].
 * @param {(x: number) => number} f
 * @returns {number} argmin approximatif
 */
export function goldenSectionSearch(f, a, b, tol = 1e-6, maxIter = 100) {
  let c = b - (b - a) * INV_PHI;
  let d = a + (b - a) * INV_PHI;
  let fc = f(c);
  let fd = f(d);
  for (let i = 0; i < maxIter; i++) {
    if (Math.abs(b - a) < tol) break;
    if (fc < fd) {
      b = d;
      d = c;
      fd = fc;
      c = b - (b - a) * INV_PHI;
      fc = f(c);
    } else {
      a = c;
      c = d;
      fc = fd;
      d = a + (b - a) * INV_PHI;
      fd = f(d);
    }
  }
  return (a + b) / 2;
}

/** Points spirale logarithmique liée à φ (θ en radians). */
export function goldenSpiralPoint(theta, r0 = 2) {
  const k = (2 * Math.log(PHI)) / Math.PI;
  const r = r0 * Math.exp(k * theta);
  return { x: r * Math.cos(theta), y: r * Math.sin(theta) };
}

/**
 * Attribut `d` SVG pour une spirale (repère centré).
 * @param {{ steps?: number, thetaStep?: number, r0?: number, cx?: number, cy?: number }} opts
 */
export function buildGoldenSpiralPathD(opts = {}) {
  const steps = opts.steps ?? 420;
  const thetaStep = opts.thetaStep ?? 0.028;
  const r0 = opts.r0 ?? 2;
  const cx = opts.cx ?? 0;
  const cy = opts.cy ?? 0;
  const parts = [];
  for (let i = 0; i < steps; i++) {
    const theta = i * thetaStep;
    const { x, y } = goldenSpiralPoint(theta, r0);
    const px = cx + x;
    const py = cy + y;
    parts.push(`${i === 0 ? "M" : "L"}${px.toFixed(2)},${py.toFixed(2)}`);
  }
  return parts.join(" ");
}
