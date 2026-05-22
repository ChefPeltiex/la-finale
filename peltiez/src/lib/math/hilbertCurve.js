/**
 * Courbe de Hilbert (remplissage d'espace) — index 1D → grille 2D.
 * Usage : ordonner les 126 fiches maillage tout en gardant les voisins proches.
 */

/** @returns {[number, number]} */
function rot(n, x, y, rx, ry) {
  let nx = x;
  let ny = y;
  if (ry === 0) {
    if (rx === 1) {
      nx = n - 1 - nx;
      ny = n - 1 - ny;
    }
    return [ny, nx];
  }
  return [nx, ny];
}

/** Distance d le long de la courbe → coordonnées (x, y) sur une grille n×n (n = 2^order). */
export function hilbertD2XY(d, order) {
  const n = 2 ** order;
  let x = 0;
  let y = 0;
  let t = d;
  for (let s = 1; s < n; s *= 2) {
    const rx = 1 & Math.floor(t / 2);
    const ry = 1 & (t ^ rx);
    [x, y] = rot(s, x, y, rx, ry);
    x += s * rx;
    y += s * ry;
    t = Math.floor(t / 4);
  }
  return [x, y];
}

/** Ordre minimal pour couvrir au moins `count` cellules. */
export function hilbertOrderForCount(count) {
  let order = 1;
  while (2 ** (2 * order) < count) order += 1;
  return Math.min(order, 8);
}

/**
 * Assigne à chaque id une position Hilbert (0..count-1).
 * @param {string[]} sortedIds
 */
export function assignHilbertLayout(sortedIds) {
  const count = sortedIds.length;
  const order = hilbertOrderForCount(count);
  const gridSize = 2 ** order;
  return sortedIds.map((id, index) => {
    const [gx, gy] = hilbertD2XY(index, order);
    return {
      id,
      peanoIndex: index,
      gridX: gx,
      gridY: gy,
      gridSize,
      order,
      /** Normalisé 0–1 pour export UE / canvas */
      u: gx / (gridSize - 1 || 1),
      v: gy / (gridSize - 1 || 1),
    };
  });
}

/** Points 3D légers pour spline UE (plan z=0). */
export function hilbertLayoutToPoints(layout, scale = 8) {
  return layout.map(({ u, v, peanoIndex }) => ({
    i: peanoIndex,
    x: (u - 0.5) * scale,
    y: (v - 0.5) * scale,
    z: 0,
  }));
}
