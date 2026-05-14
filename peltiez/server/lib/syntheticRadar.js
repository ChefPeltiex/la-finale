/** Génération déterministe de 3871 scans radar (aucune donnée nominative). */

export const RADAR_SCAN_TARGET = 3871;

function frac01(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

export function syntheticRadarScan(index) {
  const i = index + 1;
  const r = (k) => frac01(index * 17 + k * 93);
  const gestures = ["orbit", "pinch", "pan"];
  const gesture = gestures[Math.floor(r(1) * 3)];

  return {
    id: `radar_scan_${i}`,
    index,
    created_at: new Date(Date.now() - Math.floor(r(2) * 86_400_000 * 120)).toISOString(),
    interaction3d: {
      yaw: r(3) * Math.PI * 2,
      pitch: (r(4) - 0.5) * (Math.PI / 2.2),
      zoom: 0.42 + r(5) * 2.1,
      dwellMs: 180 + Math.floor(r(6) * 9200),
      gesture,
      pointer_pressure: 0.2 + r(7) * 0.8,
    },
    radar_echo_db: -62 + Math.floor(r(8) * 48),
    band: ["L", "S", "C", "X"][Math.floor(r(9) * 4)],
  };
}

export function allSyntheticRadarScans() {
  return Array.from({ length: RADAR_SCAN_TARGET }, (_, idx) => syntheticRadarScan(idx));
}
