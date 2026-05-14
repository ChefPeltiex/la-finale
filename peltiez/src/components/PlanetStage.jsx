import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2 } from "lucide-react";

function useSpatialDrone() {
  const ctxRef = useRef(null);
  const nodesRef = useRef(null);

  const start = async () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") await ctx.resume();
    if (nodesRef.current) return true;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    osc1.type = "sine";
    osc2.type = "triangle";
    osc1.frequency.value = 55; // A1
    osc2.frequency.value = 110; // A2
    gain.gain.value = 0.018; // subtle, not annoying

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 0.07; // slow movement
    lfoGain.gain.value = 0.25;
    lfo.connect(lfoGain);
    if (pan) lfoGain.connect(pan.pan);

    osc1.connect(gain);
    osc2.connect(gain);
    if (pan) {
      gain.connect(pan);
      pan.connect(ctx.destination);
    } else {
      gain.connect(ctx.destination);
    }

    osc1.start();
    osc2.start();
    lfo.start();

    nodesRef.current = { osc1, osc2, lfo, gain, pan };
    return true;
  };

  const stop = () => {
    const n = nodesRef.current;
    if (!n) return;
    try { n.osc1.stop(); } catch {}
    try { n.osc2.stop(); } catch {}
    try { n.lfo.stop(); } catch {}
    nodesRef.current = null;
  };

  useEffect(() => stop, []);
  return { start, stop };
}

export default function PlanetStage() {
  const mountRef = useRef(null);
  const { start, stop } = useSpatialDrone();
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x04060f, 2.5, 12);

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    el.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(5, 3, 6);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x88aaff, 0.25));

    const geo = new THREE.SphereGeometry(1.55, 64, 64);
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0ea5e9"),
      roughness: 0.55,
      metalness: 0.12,
      emissive: new THREE.Color("#05203a"),
      emissiveIntensity: 0.55,
    });
    const planet = new THREE.Mesh(geo, mat);
    scene.add(planet);

    // Atmosphere glow
    const atmGeo = new THREE.SphereGeometry(1.62, 64, 64);
    const atmMat = new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.10 });
    const atm = new THREE.Mesh(atmGeo, atmMat);
    scene.add(atm);

    // Stars (cheap)
    const stars = new THREE.Points(
      new THREE.BufferGeometry(),
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.012, transparent: true, opacity: 0.7 })
    );
    const starCount = 600;
    const arr = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = -Math.random() * 18;
    }
    stars.geometry.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    scene.add(stars);

    let raf = 0;
    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const tick = () => {
      planet.rotation.y += 0.0024;
      planet.rotation.x = Math.sin(performance.now() / 6000) * 0.06;
      atm.rotation.y += 0.0012;
      stars.rotation.y += 0.00025;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      atmGeo.dispose();
      atmMat.dispose();
      stars.geometry.dispose();
      stars.material.dispose();
      try { el.removeChild(renderer.domElement); } catch {}
    };
  }, []);

  const toggleSound = async () => {
    if (!soundOn) {
      const ok = await start();
      if (ok) setSoundOn(true);
    } else {
      stop();
      setSoundOn(false);
    }
  };

  return (
    <div className="rounded-3xl border border-border overflow-hidden relative noise"
      style={{ background: "linear-gradient(135deg, rgba(5,10,25,0.92), rgba(5,20,12,0.88))" }}>
      <div className="absolute inset-0 aurora opacity-40 pointer-events-none" />

      <div className="relative z-10 p-8 sm:p-10">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black border-0 font-black px-4 py-1">
              Egor69 — PLANÈTE EN PREMIER
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white">
              La vérité doit nourrir.
              <br />
              <span className="text-white/70">Le soin doit circuler.</span>
            </h2>
            <p className="text-white/60 max-w-2xl">
              Visuel 3D temps réel + son spatial (opt‑in). Aucun morceau protégé. Tout souverain.
            </p>
          </div>

          <Button variant={soundOn ? "default" : "outline"} className="gap-2" onClick={toggleSound}>
            <Volume2 className="h-4 w-4" /> {soundOn ? "Son ON" : "Activer le son"}
          </Button>
        </div>

        <div className="mt-8 h-[320px] sm:h-[420px] rounded-3xl border border-white/10 overflow-hidden"
          style={{ background: "radial-gradient(800px 300px at 20% 20%, rgba(16,185,129,0.20), transparent 55%), rgba(0,0,0,0.25)" }}>
          <div ref={mountRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}

