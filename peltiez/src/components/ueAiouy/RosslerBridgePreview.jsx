import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  ROSSLER_DEFAULT_PARAMS,
  integrateRossler,
  normalizeRosslerPoints,
} from "@/lib/rosslerAttractor";

function RosslerCurve({ points }) {
  const group = useRef(null);
  const linePoints = useMemo(
    () => points.map(([x, y, z]) => new THREE.Vector3(x, z, -y)),
    [points],
  );

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.08;
  });

  if (linePoints.length < 2) return null;

  return (
    <group ref={group}>
      <Line
        points={linePoints}
        color="#ff6b35"
        lineWidth={1.5}
        transparent
        opacity={0.92}
      />
      <mesh position={linePoints[linePoints.length - 1]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#FFD700" emissive="#b8860b" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

/**
 * Prévisualisation attracteur de Rössler (pont symbolique web → Unreal).
 */
export default function RosslerBridgePreview({ steps, scale }) {
  const params = useMemo(
    () => ({
      ...ROSSLER_DEFAULT_PARAMS,
      steps: steps ?? ROSSLER_DEFAULT_PARAMS.steps,
    }),
    [steps],
  );

  const points = useMemo(() => {
    const raw = integrateRossler(params);
    return normalizeRosslerPoints(raw, scale ?? 0.12);
  }, [params, scale]);

  return (
    <div className="h-[min(420px,50vh)] w-full overflow-hidden rounded-xl border border-[#D4AF37]/30 bg-black">
      <Canvas
        camera={{ position: [2.8, 1.6, 2.8], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: "low-power" }}
      >
        <color attach="background" args={["#050508"]} />
        <ambientLight intensity={0.25} />
        <pointLight position={[4, 6, 4]} intensity={1.2} color="#ffaa66" />
        <pointLight position={[-3, 2, -2]} intensity={0.4} color="#D4AF37" />
        <RosslerCurve points={points} />
        <OrbitControls makeDefault autoRotate autoRotateSpeed={0.35} />
      </Canvas>
      <p className="border-t border-[#D4AF37]/20 bg-zinc-950/90 px-3 py-2 text-[11px] text-[#F5F0E6]/60">
        Spirale + saut (chaos) — métaphore CirculAI ↔ Egor. Exportez le JSON pour recréer la même courbe en spline UE.
      </p>
    </div>
  );
}

export { integrateRossler, normalizeRosslerPoints, ROSSLER_DEFAULT_PARAMS };
