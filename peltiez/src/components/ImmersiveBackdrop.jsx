import { useEffect, useRef } from "react";
import * as THREE from "three";

function prefersReducedMotion() {
  try {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

export default function ImmersiveBackdrop() {
  const hostRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (prefersReducedMotion()) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 80);
    camera.position.set(0, 0, 9.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    // Lights
    const key = new THREE.DirectionalLight(0xffffff, 0.65);
    key.position.set(2.5, 2.0, 3.0);
    scene.add(key);
    const fill = new THREE.PointLight(0x10b981, 1.25, 50);
    fill.position.set(-3.2, 1.2, 4.5);
    scene.add(fill);
    const rim = new THREE.PointLight(0xfbbf24, 0.85, 40);
    rim.position.set(3.6, -1.6, 6.0);
    scene.add(rim);

    // Geometry: torus knot “signature” + star dust
    const knotGeo = new THREE.TorusKnotGeometry(2.15, 0.45, 220, 24, 2, 3);
    const knotMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#0b1224"),
      metalness: 0.75,
      roughness: 0.22,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      transmission: 0.25,
      thickness: 0.6,
      envMapIntensity: 1.1,
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    knot.position.set(0.2, 0.0, 0.0);
    scene.add(knot);

    const ringGeo = new THREE.TorusGeometry(2.8, 0.07, 24, 240);
    const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color("#10b981"), transparent: true, opacity: 0.12 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.3;
    ring.rotation.y = Math.PI / 8;
    scene.add(ring);

    const glowGeo = new THREE.SphereGeometry(3.2, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({ color: new THREE.Color("#10b981"), transparent: true, opacity: 0.05 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);

    const starCount = 1400;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const c1 = new THREE.Color("#10b981");
    const c2 = new THREE.Color("#fbbf24");
    const c3 = new THREE.Color("#60a5fa");
    for (let i = 0; i < starCount; i++) {
      const r = 18 * Math.pow(Math.random(), 0.65);
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(p) * Math.cos(t);
      const y = r * Math.sin(p) * Math.sin(t);
      const z = -Math.abs(r * Math.cos(p)) - 1.5;
      positions[i * 3 + 0] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      const cc = (i % 11 === 0) ? c2 : (i % 7 === 0) ? c3 : c1;
      colors[i * 3 + 0] = cc.r;
      colors[i * 3 + 1] = cc.g;
      colors[i * 3 + 2] = cc.b;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.03, vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Sizing
    const resize = () => {
      const w = host.clientWidth || window.innerWidth;
      const h = host.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // Motion (mouse parallax)
    let mx = 0, my = 0;
    const onMove = (e) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      const nx = (e.clientX / w) * 2 - 1;
      const ny = (e.clientY / h) * 2 - 1;
      mx = nx;
      my = ny;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const start = performance.now();
    const tick = (now) => {
      const t = (now - start) * 0.001;

      knot.rotation.x = t * 0.22 + my * 0.08;
      knot.rotation.y = t * 0.34 + mx * 0.12;
      knot.rotation.z = t * 0.08;
      ring.rotation.z = t * 0.12;
      stars.rotation.y = t * 0.02;
      stars.rotation.x = t * 0.01;

      // camera drift
      camera.position.x = mx * 0.45;
      camera.position.y = -my * 0.35;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      rafRef.current = window.requestAnimationFrame(tick);
    };
    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      window.cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      knotGeo.dispose();
      knotMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      try {
        host.removeChild(renderer.domElement);
      } catch {}
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        opacity: 0.72,
        mixBlendMode: "screen",
        filter: "saturate(1.25) contrast(1.05)",
      }}
    />
  );
}

