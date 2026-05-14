import * as THREE from "three";

/**
 * Relief procédural du Verse — trois composantes fréquentielles décorrélées pour éviter répétition mécanique.
 * Interprétation « biomes » : zones basses (plaines de convergence), crêtes sinueuses (arêtes de lecture),
 * micro-relief (texture de pas). Ce n’est pas une simulation géologique ; c’est une chorégraphie marchable.
 *
 * @param {number} x coordonnée monde est
 * @param {number} z coordonnée monde nord
 * @returns {number} altitude locale (unités Three.js cohérentes avec l’échelle du joueur)
 */
export function terrainHeight(x, z) {
  return (
    Math.sin(x * 0.048) * 1.45 +
    Math.cos(z * 0.052) * 1.35 +
    Math.sin((x + z * 0.72) * 0.036) * 0.95 +
    Math.cos(x * 0.105 + z * 0.088) * 0.55
  );
}

export function createTerrainGeometry(width = 140, segments = 112) {
  const verts = [];
  const indices = [];
  const half = width / 2;
  const seg = segments;
  for (let i = 0; i <= seg; i++) {
    for (let j = 0; j <= seg; j++) {
      const x = (i / seg) * width - half;
      const z = (j / seg) * width - half;
      verts.push(x, terrainHeight(x, z), z);
    }
  }
  for (let i = 0; i < seg; i++) {
    for (let j = 0; j < seg; j++) {
      const a = i * (seg + 1) + j;
      const b = a + 1;
      const c = a + seg + 1;
      const d = c + 1;
      indices.push(a, b, d, a, d, c);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(verts), 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}
