/**
 * Métaphores math pour CirculAI — calibrage pilote 90 j, ton humble municipal.
 */

/** Équation pilote : variation d'impact cumulé */
export const PILOT_IMPACT_EQUATION = {
  latex: String.raw`\frac{dI}{dt} = \mu_{\text{flux}} - \lambda_{\text{fuite}} + \varepsilon_{\text{terrain}}`,
  plain:
    "dI/dt = μ_flux − λ_fuite + ε_terrain (tendance mesurée + pertes + variation normale du terrain)",
};

/** SDE : tendance + bruit */
export const PILOT_SDE = {
  latex: String.raw`dX_t = \mu\,dt + \sigma\,dW_t`,
  plain: "Chaque semaine : direction claire (μ) + imprévu honnête (σ) — pas une promesse de précision absolue.",
};

/** Beta : combiner deux parts positives (ex. don vs réemploi) */
export const PILOT_BETA_NOTE =
  "B(z₁,z₂) = Γ(z₁)Γ(z₂)/Γ(z₁+z₂) — utile pour un ratio composite quand les volumes sont petits (pilote).";

/** Cycles 90 j — 9 sujets × ~10 j / phase */
export const PILOT_RHYTHM = {
  daysTotal: 90,
  phases: [
    { label: "J0–J7", action: "Site · référent · indicateur de base" },
    { label: "J8–J45", action: "Journal des flux — données réelles" },
    { label: "J46–J90", action: "3 preuves : flux · matching · confiance partenaire" },
  ],
  cycleModulo: 4,
  cycleExample: "7^n mod 10 → cycle 4 (ex. 7¹⁰⁰ finit par 1) — rappel : petits pas répétés.",
};

/** Simule trajectoire SDE discrète pour viz (pas Monte-Carlo certifié). */
export function simulatePilotSde({ mu = 0.02, sigma = 0.08, steps = 90, dt = 1, x0 = 0 } = {}) {
  const xs = [x0];
  let x = x0;
  for (let i = 1; i <= steps; i += 1) {
    const dW = (Math.random() + Math.random() + Math.random() + Math.random() - 2) * Math.sqrt(dt);
    x += mu * dt + sigma * dW;
    xs.push(x);
  }
  return xs;
}

/** Intégrale discrète (somme) — impact cumulé */
export function integrateDiscrete(series) {
  let sum = 0;
  return series.map((v) => {
    sum += v;
    return sum;
  });
}
