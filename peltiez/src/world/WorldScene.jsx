import { useRef, useMemo, useCallback, useLayoutEffect, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Sky, Sparkles, Environment, Text, Html } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { WORLD_REALMS } from "./realms";
import { terrainHeight, createTerrainGeometry } from "./terrain";
import { maybePersistPlayer } from "@/lib/worldPersistence";
import { useWakeLock } from "@/hooks/useWakeLock";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { COSMIC_NAV_V2, COSMIC_WALK_SPEED, COSMIC_SPRINT_MULT, VERSE_STYLE } from "@/config/cosmicNav";
import {
  PlayerAvatar,
  usePointerLockLook,
  movementVectorsFromYaw,
  collectMoveInput,
} from "@/components/world/CosmicNavControls";
import { TAU, PI, QUARTER_TURN } from "@/lib/circleConstants";

const EYE_GROUND = 0.96;
const WALK_SPEED = COSMIC_WALK_SPEED;
const SPRINT_MULT = COSMIC_SPRINT_MULT;
const WORLD_LIMIT = 58;
const PROXIMITY_RAD = 5.8;
const CAM_DIST = 9.2;
const CAM_HEIGHT = 3.65;
const GRAVITY = 28;
const JUMP_IMPULSE = 11;
const GLIDE_GRAV_MULT = 0.42;

/** Nuage de points en bras spiraux — galaxie lointaine (cinéma nature / espace). */
function buildSpiralGalaxyPoints(count, armOffset = 0) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const gold = new THREE.Color(VERSE_STYLE.sparkleGold);
  const violet = new THREE.Color(VERSE_STYLE.sparkleViolet);
  const core = new THREE.Color(VERSE_STYLE.rimGold);
  const arms = 2;
  for (let i = 0; i < count; i++) {
    const t = Math.pow(Math.random(), 0.52);
    const arm = i % arms;
    const theta =
      t * PI * 7.2 + (arm * TAU) / arms + armOffset + (Math.random() - 0.5) * 0.55;
    const r = 0.35 + t * 30;
    const scatter = (1 - t) * 1.65;
    positions[i * 3] = Math.cos(theta) * r + (Math.random() - 0.5) * scatter;
    positions[i * 3 + 1] = (Math.random() - 0.5) * scatter * 0.32;
    positions[i * 3 + 2] = Math.sin(theta) * r + (Math.random() - 0.5) * scatter;
    const mix = 0.22 + t * 0.5 + Math.random() * 0.18;
    const c = core.clone().lerp(gold, mix * 0.48).lerp(violet, t * 0.68);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  return { positions, colors };
}

function galaxyPointsGeometry(count, armOffset) {
  const { positions, colors } = buildSpiralGalaxyPoints(count, armOffset);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

function buildGalaxyCorePoints(count) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const white = new THREE.Color("#fff7ed");
  const gold = new THREE.Color(VERSE_STYLE.sparkleGold);
  const violet = new THREE.Color(VERSE_STYLE.sparkleViolet);
  for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 2.4) * 3.8;
    const theta = Math.random() * TAU;
    positions[i * 3] = Math.cos(theta) * r;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.45;
    positions[i * 3 + 2] = Math.sin(theta) * r;
    const t = r / 3.8;
    const c = white.clone().lerp(gold, t * 0.55).lerp(violet, t * 0.35);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  return { positions, colors };
}

function galaxyCoreGeometry(count) {
  const { positions, colors } = buildGalaxyCorePoints(count);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

function createMilkyWayTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const g = ctx.createLinearGradient(0, 128, 512, 128);
  g.addColorStop(0, "rgba(10,8,32,0)");
  g.addColorStop(0.22, "rgba(99,102,241,0.12)");
  g.addColorStop(0.48, "rgba(251,191,36,0.22)");
  g.addColorStop(0.52, "rgba(254,243,199,0.28)");
  g.addColorStop(0.78, "rgba(167,139,250,0.14)");
  g.addColorStop(1, "rgba(10,8,32,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function MilkyWayBand({ reducedMotion }) {
  const tex = useMemo(() => createMilkyWayTexture(), []);
  if (!tex || !COSMIC_NAV_V2) return null;
  return (
    <mesh position={[0, 38, -128]} rotation={[0.08, 0.18, 0.04]}>
      <planeGeometry args={[420, 95]} />
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={reducedMotion ? 0.04 : 0.078}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function DistantGalaxyBackdrop({ reducedMotion }) {
  const groupA = useRef(null);
  const groupB = useRef(null);
  const parallax = useRef(new THREE.Vector3());
  const { camera } = useThree();
  const count = reducedMotion ? VERSE_STYLE.galaxyPointCountReduced : VERSE_STYLE.galaxyPointCount;
  const coreCount = reducedMotion ? VERSE_STYLE.galaxyCoreCountReduced : VERSE_STYLE.galaxyCoreCount;
  const geoA = useMemo(() => galaxyPointsGeometry(count, 0), [count]);
  const geoB = useMemo(() => galaxyPointsGeometry(Math.floor(count * 0.82), 1.35), [count]);
  const coreA = useMemo(() => galaxyCoreGeometry(coreCount), [coreCount]);
  const coreB = useMemo(() => galaxyCoreGeometry(Math.floor(coreCount * 0.88)), [coreCount]);
  const armMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: reducedMotion ? 0.14 : 0.22,
        vertexColors: true,
        transparent: true,
        opacity: 0.82,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [reducedMotion]
  );
  const coreMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: reducedMotion ? 0.2 : 0.34,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [reducedMotion]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.011;
    parallax.current.set(camera.position.x * 0.018, camera.position.y * 0.012, camera.position.z * 0.014);
    if (groupA.current) {
      groupA.current.rotation.y = reducedMotion ? 0 : t;
      groupA.current.position.set(-36 + parallax.current.x, 46 + parallax.current.y * 0.5, -112 + parallax.current.z);
    }
    if (groupB.current) {
      groupB.current.rotation.y = reducedMotion ? 0 : -t * 0.72;
      groupB.current.position.set(48 - parallax.current.x * 0.7, 34 + parallax.current.y * 0.35, -96 + parallax.current.z * 0.8);
    }
  });

  if (!COSMIC_NAV_V2) return null;

  return (
    <>
      <group ref={groupA} rotation={[0.4, 0.62, 0.08]} scale={2.35}>
        <points geometry={geoA} material={armMat} frustumCulled={false} />
        <points geometry={coreA} material={coreMat} frustumCulled={false} />
      </group>
      <group ref={groupB} rotation={[0.26, -0.38, 0.12]} scale={1.9}>
        <points geometry={geoB} material={armMat} frustumCulled={false} />
        <points geometry={coreB} material={coreMat} frustumCulled={false} />
      </group>
    </>
  );
}

/** Voile nébuleux horizontal — brume indigo sans masquer les étoiles. */
function NebulaHorizonVeil() {
  if (!COSMIC_NAV_V2) return null;
  return (
    <>
      <mesh position={[0, 6, -118]} rotation={[-0.12, 0, 0]}>
        <planeGeometry args={[300, 150, 1, 1]} />
        <meshBasicMaterial
          color={VERSE_STYLE.nebula}
          transparent
          opacity={0.058}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[12, 14, -105]} rotation={[-0.2, 0.14, 0]}>
        <planeGeometry args={[220, 88, 1, 1]} />
        <meshBasicMaterial
          color={VERSE_STYLE.fillViolet}
          transparent
          opacity={0.032}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function VersePostProcessing({ reducedMotion }) {
  if (!COSMIC_NAV_V2 || reducedMotion) return null;
  return (
    <EffectComposer multisampling={0} resolutionScale={VERSE_STYLE.bloomResolutionScale}>
      <Bloom
        intensity={VERSE_STYLE.bloomIntensity}
        luminanceThreshold={VERSE_STYLE.bloomThreshold}
        luminanceSmoothing={0.38}
        mipmapBlur
      />
    </EffectComposer>
  );
}

/** P2-INS-9 : pluie d’étoiles discrète après ~8 s d’immobilité. */
function ContemplationStarShower({ playerPosRef, reducedMotion }) {
  const group = useRef(null);
  const lastPos = useRef(new THREE.Vector3());
  const lastMoveAt = useRef(typeof performance !== "undefined" ? performance.now() : 0);
  const nextBurstAt = useRef(0);
  const [active, setActive] = useState(false);

  useFrame(() => {
    if (reducedMotion || !COSMIC_NAV_V2) return;
    const p = playerPosRef.current;
    const now = performance.now();
    if (p.distanceToSquared(lastPos.current) > 0.006) {
      lastMoveAt.current = now;
      lastPos.current.copy(p);
      if (active) setActive(false);
    }
    if (group.current) group.current.position.copy(p).add(new THREE.Vector3(0, 2.2, 0));
    if (!active && now - lastMoveAt.current > VERSE_STYLE.contemplationIdleMs && now > nextBurstAt.current) {
      setActive(true);
      nextBurstAt.current = now + 14000;
      window.setTimeout(() => setActive(false), 2400);
    }
  });

  if (!active || reducedMotion) return null;
  return (
    <group ref={group}>
      <Sparkles count={160} scale={[14, 10, 14]} size={2.8} speed={0.55} opacity={0.38} color={VERSE_STYLE.sparkleGold} />
    </group>
  );
}

function TerrainMesh() {
  const geo = useMemo(() => createTerrainGeometry(140, 112), []);
  return (
    <mesh geometry={geo} receiveShadow>
      <meshStandardMaterial
        color={COSMIC_NAV_V2 ? "#0c1222" : "#0a1428"}
        metalness={0.55}
        roughness={0.42}
        envMapIntensity={1}
        flatShading={false}
      />
    </mesh>
  );
}

function RealmPortal({ realm, traversePulse }) {
  const group = useRef(null);
  const inner = useRef(null);
  const outerMat = useRef(null);
  const portalRoot = useRef(null);
  const pulseStart = useRef(0);
  const baseY = terrainHeight(realm.pos[0], realm.pos[2]) + 2.55;

  useEffect(() => {
    if (traversePulse?.slug === realm.slug) pulseStart.current = traversePulse.at;
  }, [traversePulse, realm.slug]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) group.current.rotation.y = t * 0.28;
    if (inner.current) inner.current.rotation.y = -t * 0.42;
    let emissive = COSMIC_NAV_V2 ? 0.72 + Math.sin(t * 1.15) * 0.22 : 0.85;
    let scale = 1;
    if (pulseStart.current > 0) {
      const elapsed = (performance.now() - pulseStart.current) / VERSE_STYLE.portalTraverseMs;
      if (elapsed >= 1) {
        pulseStart.current = 0;
      } else {
        const wave = Math.sin(elapsed * Math.PI);
        emissive += wave * 1.85;
        scale = 1 + wave * 0.14;
      }
    }
    if (outerMat.current) outerMat.current.emissiveIntensity = emissive;
    if (portalRoot.current) portalRoot.current.scale.setScalar(scale);
  });

  const col = useMemo(() => new THREE.Color(realm.color), [realm.color]);
  const rim = useMemo(() => new THREE.Color(VERSE_STYLE.sparkleGold), []);

  return (
    <group ref={portalRoot} position={[realm.pos[0], baseY, realm.pos[2]]}>
      <mesh ref={group}>
        <torusGeometry args={[2.1, 0.28, 48, 96]} />
        <meshPhysicalMaterial
          ref={outerMat}
          color={col}
          emissive={COSMIC_NAV_V2 ? rim : col}
          emissiveIntensity={COSMIC_NAV_V2 ? 0.88 : 0.85}
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
      <pointLight position={[0, 0.5, 0]} intensity={3.2} distance={18} color={realm.color} />
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
          style={{
            boxShadow: COSMIC_NAV_V2
              ? "0 0 28px rgba(251,191,36,0.18), 0 0 48px rgba(99,102,241,0.12)"
              : "0 0 24px rgba(52,211,153,0.15)",
          }}
        >
          <p className="text-[11px] leading-snug text-white/92 font-medium">{realm.shortHook}</p>
        </div>
      </Html>
      <mesh rotation={[-QUARTER_TURN, 0, 0]} position={[0, -baseY + 0.08, 0]}>
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

  usePointerLockLook(gl, yaw, pitch);

  useFrame((_, delta) => {
    const k = keysRef.current;
    let speed = WALK_SPEED * (k.ShiftLeft || k.ShiftRight ? SPRINT_MULT : 1);

    const { forward, right } = movementVectorsFromYaw(yaw.current);
    const move = collectMoveInput(k, forward, right);

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
        setFrameloop("never");
        return;
      }
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
  traversePulse,
}) {
  return (
    <>
      <ImmersiveSleepMitigations maxDpr={maxCanvasDpr} />
      <color attach="background" args={[COSMIC_NAV_V2 ? VERSE_STYLE.bg : "#030712"]} />
      <fog
        attach="fog"
        args={[
          COSMIC_NAV_V2 ? VERSE_STYLE.fog : "#030712",
          COSMIC_NAV_V2 ? VERSE_STYLE.fogNear : 32,
          COSMIC_NAV_V2 ? VERSE_STYLE.fogFar : 120,
        ]}
      />

      <ambientLight intensity={COSMIC_NAV_V2 ? 0.22 : 0.28} />
      <directionalLight
        position={[50, 70, 28]}
        intensity={COSMIC_NAV_V2 ? 1.28 : 1.45}
        color={COSMIC_NAV_V2 ? VERSE_STYLE.rimGold : "#fefce8"}
      />
      <directionalLight
        position={[-40, 28, -32]}
        intensity={COSMIC_NAV_V2 ? 0.62 : 0.5}
        color={VERSE_STYLE.fillViolet}
      />
      {COSMIC_NAV_V2 ? (
        <directionalLight position={[0, 12, -60]} intensity={0.35} color={VERSE_STYLE.nebula} />
      ) : null}

      <Sky
        distance={450000}
        sunPosition={COSMIC_NAV_V2 ? [108, 18, 175] : [140, 48, 200]}
        inclination={COSMIC_NAV_V2 ? 0.58 : 0.48}
        azimuth={COSMIC_NAV_V2 ? 0.24 : 0.38}
        mieCoefficient={COSMIC_NAV_V2 ? 0.0052 : 0.0035}
        mieDirectionalG={0.9}
        turbidity={COSMIC_NAV_V2 ? 10 : 7}
        rayleigh={COSMIC_NAV_V2 ? 1.62 : 1.25}
      />
      <Stars
        radius={COSMIC_NAV_V2 ? 400 : 320}
        depth={85}
        count={reducedMotion ? 3200 : COSMIC_NAV_V2 ? VERSE_STYLE.starCount : 11000}
        factor={COSMIC_NAV_V2 ? VERSE_STYLE.starFactor : 3.8}
        saturation={COSMIC_NAV_V2 ? 0.18 : 0.12}
        fade
        speed={COSMIC_NAV_V2 ? VERSE_STYLE.starSpeed : 0.55}
      />
      {COSMIC_NAV_V2 && !reducedMotion ? (
        <Stars
          radius={520}
          depth={62}
          count={VERSE_STYLE.starDepthCount}
          factor={VERSE_STYLE.starDepthFactor}
          saturation={0.07}
          fade
          speed={VERSE_STYLE.starDepthSpeed}
        />
      ) : null}
      <DistantGalaxyBackdrop reducedMotion={reducedMotion} />
      <MilkyWayBand reducedMotion={reducedMotion} />
      <NebulaHorizonVeil />
      <Sparkles
        count={reducedMotion ? 140 : COSMIC_NAV_V2 ? 720 : 520}
        scale={[100, 28, 100]}
        size={COSMIC_NAV_V2 ? 3.4 : 3.2}
        speed={COSMIC_NAV_V2 ? VERSE_STYLE.sparkleSpeed : 0.38}
        opacity={COSMIC_NAV_V2 ? 0.44 : 0.5}
        color={COSMIC_NAV_V2 ? VERSE_STYLE.sparkleViolet : "#a7f3d0"}
      />
      {COSMIC_NAV_V2 && !reducedMotion ? (
        <Sparkles
          count={220}
          scale={[90, 18, 90]}
          size={2.2}
          speed={VERSE_STYLE.sparkleGoldSpeed}
          opacity={0.28}
          color={VERSE_STYLE.sparkleGold}
        />
      ) : null}
      {COSMIC_NAV_V2 && !reducedMotion ? (
        <Sparkles
          count={96}
          scale={[140, 48, 140]}
          position={[0, 38, 0]}
          size={1.35}
          speed={1.15}
          opacity={0.32}
          color="#fef9c3"
        />
      ) : null}

      <Environment preset="night" environmentIntensity={COSMIC_NAV_V2 ? 0.82 : 0.88} />

      <TerrainMesh />

      <mesh rotation={[-QUARTER_TURN, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[8, 145, 128]} />
        <meshBasicMaterial
          color={COSMIC_NAV_V2 ? VERSE_STYLE.groundRing : "#10b981"}
          transparent
          opacity={COSMIC_NAV_V2 ? 0.11 : 0.06}
          depthWrite={false}
        />
      </mesh>

      {WORLD_REALMS.map((realm) => (
        <RealmPortal
          key={realm.slug}
          realm={realm}
          reducedMotion={reducedMotion}
          traversePulse={traversePulse}
        />
      ))}

      <ContemplationStarShower playerPosRef={playerPosRef} reducedMotion={reducedMotion} />

      <PlayerAvatar playerPosRef={playerPosRef} />

      <VersePostProcessing reducedMotion={reducedMotion} />

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

export default function WorldScene({
  keysRef,
  onProximityChange,
  initialCheckpoint,
  playerTelemetryRef,
  traversePulse,
}) {
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
      camera={{
        fov: COSMIC_NAV_V2 ? VERSE_STYLE.cameraFov : 68,
        near: 0.08,
        far: 620,
        position: camStart,
      }}
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
        traversePulse={traversePulse}
      />
    </Canvas>
  );
}
