/* eslint-disable react/no-unknown-property -- @react-three/fiber étend le JSX (primitive, lights, etc.) */
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage } from "@react-three/drei";

function Model({ url, useDraco }) {
  const gltf = useGLTF(url, useDraco);
  return <primitive object={gltf.scene} />;
}

/**
 * Prévisualisation glTF/glb (URL HTTPS avec CORS compatible navigateur).
 */
export default function GltfPreview({ url, useDraco }) {
  if (!url || !/^https?:\/\//i.test(url)) {
    return (
      <div className="rounded-xl border border-dashed border-muted-foreground/40 bg-muted/30 p-8 text-center text-sm text-muted-foreground">
        Entrez une URL <code className="rounded bg-muted px-1">http(s)</code> vers un fichier{" "}
        <code className="rounded bg-muted px-1">.gltf</code> ou <code className="rounded bg-muted px-1">.glb</code>{" "}
        avec en-têtes CORS autorisant ce site.
      </div>
    );
  }

  return (
    <div className="h-[min(420px,50vh)] w-full overflow-hidden rounded-xl border border-border bg-black/80">
      <Canvas
        camera={{ position: [2.2, 1.4, 2.2], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      >
        <color attach="background" args={["#0a0a12"]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 8, 6]} intensity={1.1} />
        <Suspense
          fallback={
            <mesh>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#34d399" emissive="#064e3b" />
            </mesh>
          }
        >
          <Stage intensity={0.4} adjustCamera={1.1}>
            <Model url={url} useDraco={useDraco} />
          </Stage>
        </Suspense>
        <OrbitControls makeDefault />
      </Canvas>
      <p className="border-t border-border bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground">
        Si rien ne s’affiche : vérifiez CORS, la taille du fichier et que l’URL sert bien un glTF valide.
      </p>
    </div>
  );
}
