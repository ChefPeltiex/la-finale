import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { POLAR_ROSE_DEFAULT, polarRosePoints } from "@/lib/math/polarCurve";

function PolarRose({ points }) {
  const group = useRef(null);
  const linePoints = useMemo(
    () => points.map(([x, y]) => new THREE.Vector3(x, y, 0)),
    [points],
  );

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * 0.05;
  });

  return (
    <group ref={group}>
      <Line points={linePoints} color="#5eead4" lineWidth={1.2} transparent opacity={0.9} />
    </group>
  );
}

export default function PolarBridgePreview() {
  const points = useMemo(() => polarRosePoints(POLAR_ROSE_DEFAULT), []);

  return (
    <div className="h-[min(360px,45vh)] w-full overflow-hidden rounded-xl border border-teal-500/30 bg-black">
      <Canvas camera={{ position: [0, 0, 2.2], fov: 50 }} dpr={[1, 1.5]}>
        <color attach="background" args={["#050508"]} />
        <ambientLight intensity={0.4} />
        <PolarRose points={points} />
        <OrbitControls makeDefault enablePan={false} />
      </Canvas>
      <p className="border-t border-teal-500/20 px-3 py-2 text-[11px] text-muted-foreground">
        r = a·cos(b·θ) · a=3, b=0.95 — mandala qui ne se referme pas exactement
      </p>
    </div>
  );
}
