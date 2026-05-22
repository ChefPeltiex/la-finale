import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { assignHilbertLayout, hilbertLayoutToPoints } from "@/lib/math/peanoBridge";

function PeanoPath({ layout }) {
  const group = useRef(null);
  const linePoints = useMemo(() => {
    const pts = hilbertLayoutToPoints(layout, 6);
    return pts.map((p) => new THREE.Vector3(p.x, p.z, -p.y));
  }, [layout]);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.06;
  });

  return (
    <group ref={group}>
      <Line points={linePoints} color="#FFD700" lineWidth={1.8} />
      {linePoints.map((v, i) =>
        i % 12 === 0 ? (
          <mesh key={i} position={v}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#D4AF37" emissive="#664400" />
          </mesh>
        ) : null,
      )}
    </group>
  );
}

/** Aperçu avec 126 indices fictifs D01-S01… */
export default function PeanoBridgePreview({ layout }) {
  const demoLayout = useMemo(() => {
    if (layout?.length) return layout;
    const ids = [];
    for (let d = 1; d <= 14; d += 1) {
      for (let s = 1; s <= 9; s += 1) {
        ids.push(`D${String(d).padStart(2, "0")}-S${String(s).padStart(2, "0")}`);
      }
    }
    return assignHilbertLayout(ids);
  }, [layout]);

  return (
    <div className="h-[min(360px,45vh)] w-full overflow-hidden rounded-xl border border-[#D4AF37]/30 bg-black">
      <Canvas camera={{ position: [0, 5, 8], fov: 42 }} dpr={[1, 1.5]}>
        <color attach="background" args={["#050508"]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 8, 5]} intensity={1} />
        <PeanoPath layout={demoLayout} />
        <OrbitControls makeDefault />
      </Canvas>
      <p className="border-t border-[#D4AF37]/20 px-3 py-2 text-[11px] text-muted-foreground">
        Parcours Hilbert · {demoLayout.length} fiches · voisins proches sur la carte
      </p>
    </div>
  );
}
