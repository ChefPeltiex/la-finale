import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

function GoldMaterial({ emissiveIntensity = 0.12 }) {
  return (
    <meshStandardMaterial
      color="#8b6914"
      metalness={0.85}
      roughness={0.22}
      emissive="#c9a84c"
      emissiveIntensity={emissiveIntensity}
    />
  )
}

export default function GrimoireBook({ onClick }) {
  const groupRef = useRef()
  const coverRef = useRef()
  const pagesRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.22
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.18
    }
    if (coverRef.current) {
      coverRef.current.rotation.x = Math.sin(t * 0.2) * 0.04
    }
  })

  return (
    <group ref={groupRef} onClick={onClick} style={{ cursor: 'pointer' }}>
      {/* Pages block */}
      <mesh ref={pagesRef} position={[0, 0, 0]}>
        <boxGeometry args={[2.8, 3.8, 0.55]} />
        <meshStandardMaterial color="#f5ead6" roughness={0.95} metalness={0} />
      </mesh>

      {/* Front cover */}
      <mesh ref={coverRef} position={[0, 0, 0.32]}>
        <boxGeometry args={[3.0, 4.0, 0.07]} />
        <GoldMaterial emissiveIntensity={0.15} />
      </mesh>

      {/* Back cover */}
      <mesh position={[0, 0, -0.32]}>
        <boxGeometry args={[3.0, 4.0, 0.07]} />
        <GoldMaterial emissiveIntensity={0.1} />
      </mesh>

      {/* Spine */}
      <mesh position={[-1.53, 0, 0]}>
        <boxGeometry args={[0.1, 4.0, 0.72]} />
        <GoldMaterial emissiveIntensity={0.2} />
      </mesh>

      {/* Spine decorative band top */}
      <mesh position={[-1.53, 1.5, 0]}>
        <boxGeometry args={[0.12, 0.12, 0.74]} />
        <meshStandardMaterial color="#c9a84c" metalness={0.9} roughness={0.1} emissive="#c9a84c" emissiveIntensity={0.4} />
      </mesh>

      {/* Spine decorative band bottom */}
      <mesh position={[-1.53, -1.5, 0]}>
        <boxGeometry args={[0.12, 0.12, 0.74]} />
        <meshStandardMaterial color="#c9a84c" metalness={0.9} roughness={0.1} emissive="#c9a84c" emissiveIntensity={0.4} />
      </mesh>

      {/* Cover center emblem (golden disc) */}
      <mesh position={[0, 0, 0.37]}>
        <cylinderGeometry args={[0.6, 0.6, 0.04, 32]} />
        <meshStandardMaterial color="#c9a84c" metalness={0.95} roughness={0.08} emissive="#c9a84c" emissiveIntensity={0.35} />
      </mesh>

      {/* Inner ring */}
      <mesh position={[0, 0, 0.39]}>
        <torusGeometry args={[0.45, 0.025, 8, 32]} />
        <meshStandardMaterial color="#e8d08a" metalness={0.9} roughness={0.05} emissive="#e8d08a" emissiveIntensity={0.5} />
      </mesh>

      {/* Outer ring */}
      <mesh position={[0, 0, 0.37]}>
        <torusGeometry args={[0.85, 0.02, 8, 48]} />
        <meshStandardMaterial color="#c9a84c" metalness={0.88} roughness={0.1} emissive="#c9a84c" emissiveIntensity={0.3} />
      </mesh>

      {/* Ambient glow light */}
      <pointLight position={[0, 0, 1.5]} color="#e8d08a" intensity={1.2} distance={6} />
    </group>
  )
}
