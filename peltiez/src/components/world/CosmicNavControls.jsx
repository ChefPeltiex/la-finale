import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COSMIC_NAV_V2 } from "@/config/cosmicNav";

export const NAV_LOOK_SENSITIVITY = { yaw: 0.0021, pitch: 0.00165 };
export const NAV_PITCH_LIMITS = { min: 0.14, max: 1.28 };

const BLOCKED_NAV_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"]);

/**
 * Vecteurs de déplacement alignés sur la caméra third-person :
 * W / ↑ = s'éloigner de la caméra (avancer dans le champ de vision).
 */
export function movementVectorsFromYaw(yaw) {
  const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
  const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
  return { forward, right };
}

export function collectMoveInput(keys, forward, right) {
  const move = new THREE.Vector3(0, 0, 0);
  if (keys.KeyW || keys.ArrowUp) move.add(forward);
  if (keys.KeyS || keys.ArrowDown) move.sub(forward);
  if (keys.KeyD || keys.ArrowRight) move.add(right);
  if (keys.KeyA || keys.ArrowLeft) move.sub(right);
  return move;
}

/** Écoute clavier globale pour le hub Verse (WASD + flèches, sans scroll parasite). */
export function useWorldKeyboard(keysRef) {
  useEffect(() => {
    const down = (e) => {
      if (BLOCKED_NAV_KEYS.has(e.code)) e.preventDefault();
      keysRef.current[e.code] = true;
    };
    const up = (e) => {
      keysRef.current[e.code] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [keysRef]);
}

/** Clic canvas → pointer lock ; souris → yaw / pitch. */
export function usePointerLockLook(gl, yawRef, pitchRef) {
  useEffect(() => {
    const canvas = gl.domElement;
    const lock = () => canvas.requestPointerLock();
    canvas.addEventListener("click", lock);
    const onMove = (e) => {
      if (document.pointerLockElement !== canvas) return;
      yawRef.current -= e.movementX * NAV_LOOK_SENSITIVITY.yaw;
      pitchRef.current -= e.movementY * NAV_LOOK_SENSITIVITY.pitch;
      pitchRef.current = THREE.MathUtils.clamp(
        pitchRef.current,
        NAV_PITCH_LIMITS.min,
        NAV_PITCH_LIMITS.max
      );
    };
    document.addEventListener("mousemove", onMove);
    return () => {
      canvas.removeEventListener("click", lock);
      document.removeEventListener("mousemove", onMove);
    };
  }, [gl, yawRef, pitchRef]);
}

const EYE_OFFSET = 0.96 * 0.35;

/** Vaisseau / noyau lumineux — remplace le pawn vert capsule quand COSMIC_NAV_V2. */
export function CosmicTravelerAvatar({ playerPosRef }) {
  const group = useRef(null);
  const ring = useRef(null);
  const core = useRef(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.position.copy(playerPosRef.current);
    group.current.position.y -= EYE_OFFSET;
    const t = state.clock.elapsedTime;
    if (ring.current) {
      ring.current.rotation.x = t * 0.9;
      ring.current.rotation.z = t * 0.55;
    }
    if (core.current) core.current.rotation.y = t * 1.2;
  });

  return (
    <group ref={group}>
      <mesh ref={core} castShadow>
        <icosahedronGeometry args={[0.32, 1]} />
        <meshStandardMaterial
          color="#c4b5fd"
          emissive="#6366f1"
          emissiveIntensity={0.85}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.06, 16, 48]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={0.55}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>
      <pointLight intensity={2.2} distance={6} color="#a5f3fc" position={[0, 0.4, 0]} />
      <SparklesTrail />
    </group>
  );
}

function SparklesTrail() {
  if (!COSMIC_NAV_V2) return null;
  return (
    <mesh>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial color="#67e8f9" transparent opacity={0.35} />
    </mesh>
  );
}

/** Pawn legacy (capsule verte) — repli si COSMIC_NAV_V2=false. */
export function LegacyPawnAvatar({ playerPosRef }) {
  const mesh = useRef(null);
  useFrame(() => {
    if (!mesh.current) return;
    mesh.current.position.copy(playerPosRef.current);
    mesh.current.position.y -= EYE_OFFSET;
  });
  return (
    <mesh ref={mesh} castShadow>
      <capsuleGeometry args={[0.38, 1.05, 6, 12]} />
      <meshStandardMaterial
        color="#34d399"
        metalness={0.35}
        roughness={0.45}
        emissive="#064e3b"
        emissiveIntensity={0.25}
      />
    </mesh>
  );
}

export function PlayerAvatar({ playerPosRef }) {
  return COSMIC_NAV_V2 ? (
    <CosmicTravelerAvatar playerPosRef={playerPosRef} />
  ) : (
    <LegacyPawnAvatar playerPosRef={playerPosRef} />
  );
}
