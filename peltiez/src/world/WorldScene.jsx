import { useRef, useMemo, useCallback, useLayoutEffect, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Sky, Sparkles, Environment, Text, Html } from "@react-three/drei";
import * as THREE from "three";
import { WORLD_REALMS } from "./realms";
import { terrainHeight, createTerrainGeometry } from "./terrain";
import { maybePersistPlayer } from "@/lib/worldPersistence";
import { useWakeLock } from "@/hooks/useWakeLock";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const EYE_GROUND = 0.96;
const WALK_SPEED = 15;
const SPRINT_MULT = 1.95;
const WORLD_LIMIT = 58;
const PROXIMITY_RAD = 5.8;
const CAM_DIST = 9.2;
const CAM_HEIGHT = 3.65;
const GRAVITY = 28;
const JUMP_IMPULSE = 11;
const GLIDE_GRAV_MULT = 0.42;

function TerrainMesh() {
  const geo = useMemo(() => createTerrainGeometry(140, 112), []);
  return (
    <mesh geometry={geo} receiveShadow>
      <meshStandardMaterial
        color="#0a1428"
        metalness={0.55}
        roughness={0.42}
        envMapIntensity={1}
        flatShading={false}
      />
    </mesh>
  );
}

function RealmPortal({ realm }) {
  const group = useRef(null);
  const inner = useRef(null);
  const baseY = terrainHeight(realm.pos[0], realm.pos[2]) + 2.55;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) group.current.rotation.y = t * 0.35;
    if (inner.current) inner.current.rotation.y = -t * 0.55;
  });

  const col = useMemo(() => new THREE.Color(realm.color), [realm.color]);

  return (
    <group position={[realm.pos[0], baseY, realm.pos[2]]}>
      <mesh ref={group}>
        <torusGeometry args={[2.1, 0.28, 48, 96]} />
        <meshPhysicalMaterial
          color={col}
          emissive={col}
          emissiveIntensity={0.85}
          metalness={0.92}
          roughness={0.18}
          clearcoat={1}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[1.25, 3]} />
        <meshPhysicalMaterial
          color={col}
          emissive={col}
          emissiveIntensity={0.22}
          metalness={0.2}
          roughness={0.08}
          transmission={0.88}
          thickness={1.35}
          ior={1.45}
          transparent
          opacity={0.96}
        />
      </mesh>
      <pointLight position={[0, 0.5, 0]} intensity={3.5} distance={18} color={realm.color} />
      <Text
        position={[0, 3.4, 0]}
        fontSize={0.42}
        maxWidth={8}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {realm.label}
      </Text>
      <Html position={[0, 1.15, 0]} center distanceFactor={11} style={{ pointerEvents: "none" }}>
        <div
          className="rounded-xl border border-white/15 bg-black/65 px-3 py-2 text-center shadow-xl backdrop-blur-md max-w-[220px]"
          style={{ boxShadow: "0 0 24px rgba(52,211,153,0.15)" }}
        >
          <p className="text-[11px] leading-snug text-white/92 font-medium">{realm.shortHook}</p>
        </div>
      </Html>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -baseY + 0.08, 0]}>
        <ringGeometry args={[2.8, 4.2, 64]} />
        <meshBasicMaterial color={realm.color} transparent opacity={0.35} depthWrite={false} />
      </mesh>
    </group>
  );
}

function ProximityWatcher({ playerPosRef, onProximityChange }) {
  const lastSlug = useRef(null);

  useFrame(() => {
    const p = playerPosRef.current;
    let best = null;
    let bestD = Infinity;
    for (const r of WORLD_REALMS) {
      const px = r.pos[0];
      const pz = r.pos[2];
      const py = terrainHeight(px, pz) + 2.55;
      const dx = p.x - px;
      const dy = p.y - py;
      const dz = p.z - pz;
      const d = Math.sqrt(dx * dx + dy * dy * 0.35 + dz * dz);
      if (d < PROXIMITY_RAD && d < bestD) {
        best = r;
        bestD = d;
      }
    }
    const slug = best?.slug ?? null;
    if (slug !== lastSlug.current) {
      lastSlug.current = slug;
      onProximityChange(best);
    }
  });
  return null;
}

function PlayerAvatar({ playerPosRef }) {
  const mesh = useRef(null);
  useFrame(() => {
    if (!mesh.current) return;
    mesh.current.position.copy(playerPosRef.current);
    mesh.current.position.y -= EYE_GROUND * 0.35;
  });
  return (
    <mesh ref={mesh} castShadow>
      <capsuleGeometry args={[0.38, 1.05, 6, 12]} />
      <meshStandardMaterial color="#34d399" metalness={0.35} roughness={0.45} emissive="#064e3b" emissiveIntensity={0.25} />
    </mesh>
  );
}

function OpenWorldController({ keysRef, initialCheckpoint, playerPosRef, playerTelemetryRef }) {
  const { camera, gl } = useThree();
  const velY = useRef(0);
  const playerPos = useRef(
    new THREE.Vector3(
      initialCheckpoint?.x ?? 0,
      terrainHeight(initialCheckpoint?.x ?? 0, initialCheckpoint?.z ?? 14) + EYE_GROUND,
      initialCheckpoint?.z ?? 14
    )
  );
  const yaw = useRef(initialCheckpoint?.rotY ?? 0);
  const pitch = useRef(0.38);

  useLayoutEffect(() => {
    if (!initialCheckpoint) return;
    playerPos.current.set(
      initialCheckpoint.x,
      terrainHeight(initialCheckpoint.x, initialCheckpoint.z) + EYE_GROUND,
      initialCheckpoint.z
    );
    yaw.current = initialCheckpoint.rotY ?? 0;
  }, [initialCheckpoint]);

  useEffect(() => {
    const canvas = gl.domElement;
    const lock = () => canvas.requestPointerLock();
    canvas.addEventListener("click", lock);
    const onMove = (e) => {
      if (document.pointerLockElement !== canvas) return;
      yaw.current -= e.movementX * 0.0021;
      pitch.current -= e.movementY * 0.00165;
      pitch.current = THREE.MathUtils.clamp(pitch.current, 0.14, 1.28);
    };
    document.addEventListener("mousemove", onMove);
    return () => {
      canvas.removeEventListener("click", lock);
      document.removeEventListener("mousemove", onMove);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const k = keysRef.current;
    let speed = WALK_SPEED * (k.ShiftLeft || k.ShiftRight ? SPRINT_MULT : 1);

    const forward = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
    const right = new THREE.Vector3(Math.cos(yaw.current), 0, -Math.sin(yaw.current));
    const move = new THREE.Vector3(0, 0, 0);
    if (k.KeyW || k.ArrowUp) move.add(forward);
    if (k.KeyS || k.ArrowDown) move.sub(forward);
    if (k.KeyD || k.ArrowRight) move.add(right);
    if (k.KeyA || k.ArrowLeft) move.sub(right);

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(speed * delta);
      playerPos.current.x += move.x;
      playerPos.current.z += move.z;
    }

    playerPos.current.x = THREE.MathUtils.clamp(playerPos.current.x, -WORLD_LIMIT, WORLD_LIMIT);
    playerPos.current.z = THREE.MathUtils.clamp(playerPos.current.z, -WORLD_LIMIT, WORLD_LIMIT);

    const ground = terrainHeight(playerPos.current.x, playerPos.current.z) + EYE_GROUND;
    const grounded = playerPos.current.y <= ground + 0.09;

    if (k.Space) {
      if (grounded) velY.current = JUMP_IMPULSE;
      else velY.current -= GRAVITY * GLIDE_GRAV_MULT * delta;
    } else {
      velY.current -= GRAVITY * delta;
    }
    velY.current = THREE.MathUtils.clamp(velY.current, -42, 22);
    playerPos.current.y += velY.current * delta;

    if (playerPos.current.y < ground) {
      playerPos.current.y = ground;
      velY.current = 0;
    }

    const flatDist = Math.cos(pitch.current) * CAM_DIST;
    const camLift = Math.sin(pitch.current) * CAM_DIST + CAM_HEIGHT;
    const ox = -Math.sin(yaw.current) * flatDist;
    const oz = -Math.cos(yaw.current) * flatDist;
    const tx = playerPos.current.x + ox;
    const ty = playerPos.current.y + camLift;
    const tz = playerPos.current.z + oz;

    const smooth = 1 - Math.exp(-11 * delta);
    camera.position.x += (tx - camera.position.x) * smooth;
    camera.position.y += (ty - camera.position.y) * smooth;
    camera.position.z += (tz - camera.position.z) * smooth;
    camera.lookAt(playerPos.current.x, playerPos.current.y + 1.35, playerPos.current.z);

    maybePersistPlayer(playerPos.current.x, playerPos.current.z, yaw.current);

    playerPosRef.current.copy(playerPos.current);

    if (playerTelemetryRef) {
      playerTelemetryRef.current = {
        x: playerPos.current.x,
        z: playerPos.current.z,
        y: playerPos.current.y,
        yaw: yaw.current,
      };
    }
  });

  return null;
}

const WORLD_CANVAS_MAX_DPR = 2;
const WORLD_CANVAS_MAX_DPR_ECO = 1.25;

function ImmersiveSleepMitigations({ maxDpr }) {
  const { gl } = useThree();
  const invalidate = useThree((s) => s.invalidate);
  const setFrameloop = useThree((s) => s.setFrameloop);

  useWakeLock(gl.domElement);

  useEffect(() => {
    const sync = () => {
      if (document.hidden) {
        // Stop the render loop when tab is hidden (battery / CPU / GPU).
        setFrameloop("never");
        return;
      }

      // Restore render loop + pixel ratio on return.
      setFrameloop("always");
      gl.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
      invalidate();
    };

    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [gl, invalidate, setFrameloop, maxDpr]);

  return null;
}

function SceneContent({
  keysRef,
  onProximityChange,
  initialCheckpoint,
  playerPosRef,
  playerTelemetryRef,
  reducedMotion,
  maxCanvasDpr,
}) {
  return (
    <>
      <ImmersiveSleepMitigations maxDpr={maxCanvasDpr} />
      <color attach="background" args={["#030712"]} />
      <fog attach="fog" args={["#030712", 35, 120]} />

      <ambientLight intensity={0.28} />
      <directionalLight position={[50, 70, 28]} intensity={1.45} color="#fefce8" />
      <directionalLight position={[-40, 28, -32]} intensity={0.5} color="#c4b5fd" />

      <Sky
        distance={450000}
        sunPosition={[140, 48, 200]}
        inclination={0.48}
        azimuth={0.38}
        mieCoefficient={0.0035}
        mieDirectionalG={0.88}
        turbidity={7}
        rayleigh={1.25}
      />
      <Stars radius={320} depth={85} count={reducedMotion ? 3200 : 11000} factor={3.8} saturation={0.12} fade speed={0.55} />
      <Sparkles count={reducedMotion ? 140 : 520} scale={[100, 28, 100]} size={3.2} speed={0.38} opacity={0.5} color="#a7f3d0" />

      <Environment preset="night" environmentIntensity={0.88} />

      <TerrainMesh />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[8, 145, 128]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.06} depthWrite={false} />
      </mesh>

      {WORLD_REALMS.map((realm) => (
        <RealmPortal key={realm.slug} realm={realm} />
      ))}

      <PlayerAvatar playerPosRef={playerPosRef} />

      <OpenWorldController
        keysRef={keysRef}
        initialCheckpoint={initialCheckpoint}
        playerPosRef={playerPosRef}
        playerTelemetryRef={playerTelemetryRef}
      />
      <ProximityWatcher playerPosRef={playerPosRef} onProximityChange={onProximityChange} />
    </>
  );
}

export default function WorldScene({ keysRef, onProximityChange, initialCheckpoint, playerTelemetryRef }) {
  const reducedMotion = usePrefersReducedMotion();
  const maxCanvasDpr = reducedMotion ? WORLD_CANVAS_MAX_DPR_ECO : WORLD_CANVAS_MAX_DPR;

  const onProx = useCallback(
    (r) => {
      onProximityChange(r);
    },
    [onProximityChange]
  );

  const playerPosRef = useRef(new THREE.Vector3());

  const camStart = useMemo(() => {
    const x = initialCheckpoint?.x ?? 0;
    const z = initialCheckpoint?.z ?? 14;
    const y = terrainHeight(x, z) + EYE_GROUND;
    const yaw = initialCheckpoint?.rotY ?? 0;
    const flatDist = Math.cos(0.38) * CAM_DIST;
    const camLift = Math.sin(0.38) * CAM_DIST + CAM_HEIGHT;
    const ox = -Math.sin(yaw) * flatDist;
    const oz = -Math.cos(yaw) * flatDist;
    return [x + ox, y + camLift, z + oz];
  }, [initialCheckpoint]);

  return (
    <Canvas
      dpr={[1, maxCanvasDpr]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "low-power",
      }}
      camera={{ fov: 68, near: 0.08, far: 620, position: camStart }}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <SceneContent
        keysRef={keysRef}
        onProximityChange={onProx}
        initialCheckpoint={initialCheckpoint}
        playerPosRef={playerPosRef}
        playerTelemetryRef={playerTelemetryRef}
        reducedMotion={reducedMotion}
        maxCanvasDpr={maxCanvasDpr}
      />
    </Canvas>
  );
}
