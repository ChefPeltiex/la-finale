import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import SEOMeta from "@/components/SEOMeta";
import { PANTHEON_ENTITIES, PANTHEON_REALMS, getPantheonEntityVisual } from "@/data/pantheonEntities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Crown,
  Search,
  ArrowRight,
  Box,
  Sparkles,
  Gem,
  BookOpen,
  Zap,
  Shield,
  Heart,
  Gauge,
} from "lucide-react";

function prefersReducedMotion() {
  try {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

const OMEGA_ARCHON_ID = "omega-archon";
const PANTHEON_CANVAS_MAX_DPR = 2;

function rarityClass(rarity) {
  const r = String(rarity || "").toLowerCase();
  if (r === "legendary") return "bg-amber-500/20 text-amber-200 border-amber-400/40";
  if (r === "epic") return "bg-violet-500/20 text-violet-200 border-violet-400/35";
  if (r === "rare") return "bg-sky-500/15 text-sky-200 border-sky-400/30";
  return "bg-white/10 text-white/70 border-white/15";
}

export default function Pantheon3D() {
  const mountRef = useRef(null);
  const rafRef = useRef(0);
  const pantheonGlRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState(PANTHEON_ENTITIES[0]?.id || null);
  const [q, setQ] = useState("");
  const [realm, setRealm] = useState("Tous");

  useEffect(() => {
    const id = searchParams.get("entity") || searchParams.get("e");
    if (id && PANTHEON_ENTITIES.some((x) => x.id === id)) setSelectedId(id);
  }, [searchParams]);

  const entities = useMemo(() => {
    const query = q.trim().toLowerCase();
    return PANTHEON_ENTITIES.filter((e) => {
      const matchRealm = realm === "Tous" || e.realm === realm;
      const blob = `${e.name} ${e.kind} ${e.realm} ${e.tagline} ${(e.tags || []).join(" ")}`.toLowerCase();
      const matchQ = !query || blob.includes(query);
      return matchRealm && matchQ;
    });
  }, [q, realm]);

  const selected = useMemo(
    () => PANTHEON_ENTITIES.find((e) => e.id === selectedId) || PANTHEON_ENTITIES[0] || null,
    [selectedId]
  );

  const selectEntity = (id) => {
    setSelectedId(id);
    setSearchParams({ entity: id }, { replace: true });
  };

  useEffect(() => {
    if (!mountRef.current) return;
    if (prefersReducedMotion()) return;

    const host = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 90);
    camera.position.set(0, 0.6, 7.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(PANTHEON_CANVAS_MAX_DPR, window.devicePixelRatio || 1));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.shadowMap.enabled = false;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    const envMap = envRT.texture;
    pmrem.dispose();

    const ambient = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xfff7ed, 0.85);
    key.position.set(2.6, 2.4, 3.4);
    key.castShadow = false;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 18;
    key.shadow.camera.left = -7;
    key.shadow.camera.right = 7;
    key.shadow.camera.top = 7;
    key.shadow.camera.bottom = -7;
    key.shadow.bias = -0.0002;
    scene.add(key);

    const hemi = new THREE.HemisphereLight(0xa7f3d0, 0x0f172a, 0);
    scene.add(hemi);

    const emerald = new THREE.PointLight(0x10b981, 1.25, 40);
    emerald.position.set(-3.8, 0.4, 4.5);
    scene.add(emerald);
    const gold = new THREE.PointLight(0xfbbf24, 0.95, 40);
    gold.position.set(3.6, -1.4, 5.2);
    scene.add(gold);

    const floorGeo = new THREE.CircleGeometry(5.2, 96);
    const floorMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#050a19"),
      metalness: 0.25,
      roughness: 0.75,
      emissive: new THREE.Color("#0b1224"),
      emissiveIntensity: 0.55,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.7;
    floor.receiveShadow = false;
    scene.add(floor);

    const knotGeo = new THREE.TorusKnotGeometry(2.1, 0.52, 280, 30, 2, 3);
    const knotMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#0b1224"),
      metalness: 0.78,
      roughness: 0.22,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
      transmission: 0.18,
      thickness: 0.7,
      envMapIntensity: 1.1,
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    knot.position.set(0, -0.1, 0);
    knot.castShadow = false;
    scene.add(knot);

    const ringGeo = new THREE.TorusGeometry(2.95, 0.06, 24, 320);
    const ringMatBasic = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.16 });
    const ringMatArchon = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#34d399"),
      emissive: new THREE.Color("#059669"),
      emissiveIntensity: 0.95,
      metalness: 0.72,
      roughness: 0.22,
      clearcoat: 0.55,
      clearcoatRoughness: 0.18,
      transparent: true,
      opacity: 0.52,
      envMapIntensity: 1.15,
    });
    const ringMatThemed = ringMatArchon.clone();
    const ring = new THREE.Mesh(ringGeo, ringMatBasic);
    ring.rotation.x = Math.PI / 2.4;
    ring.rotation.z = Math.PI / 7;
    ring.position.y = 0.2;
    scene.add(ring);

    const starCount = 1100;
    const pos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 24 * Math.pow(Math.random(), 0.7);
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      pos[i * 3 + 0] = r * Math.sin(p) * Math.cos(t);
      pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      pos[i * 3 + 2] = -Math.abs(r * Math.cos(p)) - 4;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.03, color: 0x60a5fa, transparent: true, opacity: 0.6, depthWrite: false });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    /* ── Garniture : satellites orbitaux ── */
    const satelliteGroup = new THREE.Group();
    const satDispose = [];
    for (let i = 0; i < 9; i++) {
      const g = new THREE.IcosahedronGeometry(0.11 + (i % 3) * 0.035, 1);
      const m = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#34d399"),
        metalness: 0.72,
        roughness: 0.2,
        emissive: new THREE.Color("#052e23"),
        emissiveIntensity: 0.45,
        clearcoat: 0.6,
      });
      const mesh = new THREE.Mesh(g, m);
      const a = (i / 9) * Math.PI * 2;
      const rad = 3.45 + (i % 2) * 0.15;
      mesh.position.set(Math.cos(a) * rad, Math.sin(i * 2.1) * 0.42, Math.sin(a) * rad);
      satelliteGroup.add(mesh);
      satDispose.push({ g, m });
    }
    scene.add(satelliteGroup);

    /* Anneaux de scène au sol */
    const floorDecor = [];
    for (let i = 1; i <= 7; i++) {
      const tg = new THREE.TorusGeometry(0.95 + i * 0.58, 0.014, 10, 160);
      const tm = new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.11 });
      const torus = new THREE.Mesh(tg, tm);
      torus.rotation.x = Math.PI / 2;
      torus.position.y = -1.675;
      scene.add(torus);
      floorDecor.push({ tg, tm, mesh: torus });
    }

    /* Colonnes cristallines */
    const pillarGroup = new THREE.Group();
    const pillarDispose = [];
    for (let i = 0; i < 8; i++) {
      const g = new THREE.CylinderGeometry(0.055, 0.085, 2.55, 20);
      const m = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#0f172a"),
        metalness: 0.88,
        roughness: 0.18,
        transparent: true,
        opacity: 0.88,
        emissive: new THREE.Color("#064e3b"),
        emissiveIntensity: 0.15,
      });
      const mesh = new THREE.Mesh(g, m);
      const a = (i / 8) * Math.PI * 2;
      mesh.position.set(Math.cos(a) * 4.25, -0.62, Math.sin(a) * 4.25);
      pillarGroup.add(mesh);
      pillarDispose.push({ g, m });
    }
    scene.add(pillarGroup);

    /* Poussière dorée additive */
    const dustCount = 480;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const rr = 5 + Math.random() * 8;
      const tt = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      dustPos[i * 3 + 0] = rr * Math.sin(ph) * Math.cos(tt);
      dustPos[i * 3 + 1] = rr * Math.sin(ph) * Math.sin(tt) * 0.35 + 0.5;
      dustPos[i * 3 + 2] = rr * Math.cos(ph) * 0.6 - 2;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.022,
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    const archonToneExposure = 1.12;

    function applyEntityVisuals(entity) {
      const theme = getPantheonEntityVisual(entity);

      const paintSatellites = (hex, emissiveHex, boost = 1) => {
        const c = new THREE.Color(hex);
        const em = new THREE.Color(emissiveHex || hex);
        satelliteGroup.children.forEach((ch, idx) => {
          const mesh = ch;
          const mat = mesh.material;
          mat.color.copy(c);
          mat.emissive.copy(em).multiplyScalar(0.28 * boost);
          mat.emissiveIntensity = 0.35 + (idx % 3) * 0.06;
        });
        floorDecor.forEach((fd, idx) => {
          fd.tm.color.copy(c);
          fd.tm.opacity = 0.08 + (idx % 4) * 0.018;
        });
      };

      if (theme.mode === "archon") {
        scene.environment = envMap;
        scene.fog = new THREE.Fog(0x020617, 7.5, 24);
        renderer.toneMappingExposure = archonToneExposure;
        renderer.shadowMap.enabled = true;
        key.castShadow = true;
        knot.castShadow = true;
        floor.receiveShadow = true;

        hemi.intensity = 0.38;
        ambient.intensity = 0.32;
        key.intensity = 1.05;
        emerald.intensity = 1.45;
        gold.intensity = 1.05;

        knotMat.color.set("#052e23");
        knotMat.metalness = 0.9;
        knotMat.roughness = 0.12;
        knotMat.envMapIntensity = 1.45;
        knotMat.emissive.set("#064e3b");
        knotMat.emissiveIntensity = 0.42;
        knotMat.clearcoat = 1;
        knotMat.clearcoatRoughness = 0.08;
        knotMat.transmission = 0.26;
        knotMat.thickness = 0.95;
        knotMat.ior = 1.52;

        floorMat.metalness = 0.48;
        floorMat.roughness = 0.48;
        floorMat.emissiveIntensity = 0.42;

        ring.material = ringMatArchon;
        starMat.color.set(0x6ee7b7);
        starMat.opacity = 0.72;
        dustMat.opacity = 0.52;
        paintSatellites("#34d399", "#059669", 1.2);
      } else {
        scene.environment = envMap;
        scene.fog = new THREE.Fog(theme.fog, 8.2, 29);
        renderer.toneMappingExposure = 1.03;
        renderer.shadowMap.enabled = false;
        key.castShadow = false;
        knot.castShadow = false;
        floor.receiveShadow = false;

        hemi.intensity = 0.28;
        ambient.intensity = 0.38;
        key.intensity = 0.92;
        emerald.intensity = 1.15;
        gold.intensity = 0.88;
        emerald.color.set(theme.accent);
        gold.color.set(theme.emissive || theme.accent);

        const accent = theme.accent;
        knotMat.color.set(accent);
        knotMat.metalness = 0.82;
        knotMat.roughness = 0.2;
        knotMat.envMapIntensity = 1.25 * theme.ringBoost;
        knotMat.emissive.set(theme.emissive || accent);
        knotMat.emissiveIntensity = 0.38;
        knotMat.clearcoat = 0.92;
        knotMat.clearcoatRoughness = 0.14;
        knotMat.transmission = 0.22;
        knotMat.thickness = 0.75;
        knotMat.ior = 1.5;

        floorMat.metalness = 0.35;
        floorMat.roughness = 0.62;
        floorMat.emissive.set(theme.emissive || "#0b1224");
        floorMat.emissiveIntensity = 0.48;

        ringMatThemed.color.set(accent);
        ringMatThemed.emissive.set(theme.emissive || accent);
        ringMatThemed.emissiveIntensity = 0.75 * theme.ringBoost;
        ringMatThemed.opacity = 0.48;
        ring.material = ringMatThemed;

        starMat.color.set(accent);
        starMat.opacity = 0.58;
        dustMat.color.set(theme.emissive || accent);
        dustMat.opacity = 0.38;

        paintSatellites(accent, theme.emissive, theme.ringBoost);

        pillarDispose.forEach((p) => {
          p.m.emissive.set(theme.emissive || accent);
          p.m.emissiveIntensity = 0.22;
        });
      }

      knotMat.needsUpdate = true;
      floorMat.needsUpdate = true;
      ringMatArchon.needsUpdate = true;
      ringMatThemed.needsUpdate = true;
    }

    pantheonGlRef.current = { applyEntityVisuals };

    applyEntityVisuals(PANTHEON_ENTITIES[0] || {});

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(PANTHEON_CANVAS_MAX_DPR, window.devicePixelRatio || 1));
      renderer.setSize(w, h, false);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let mx = 0,
      my = 0;
    const onMove = (e) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      mx = (e.clientX / w) * 2 - 1;
      my = (e.clientY / h) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const start = performance.now();
    const tick = (now) => {
      const t = (now - start) * 0.001;
      knot.rotation.x = t * 0.18 + my * 0.08;
      knot.rotation.y = t * 0.28 + mx * 0.12;
      ring.rotation.y = t * 0.12;
      satelliteGroup.rotation.y = t * 0.09;
      pillarGroup.rotation.y = t * 0.015;
      stars.rotation.y = t * 0.012;
      dust.rotation.y = -t * 0.035;
      dust.rotation.x = Math.sin(t * 0.08) * 0.05;
      camera.position.x = mx * 0.55;
      camera.position.y = 0.6 - my * 0.35;
      camera.lookAt(0, -0.1, 0);
      renderer.render(scene, camera);
      rafRef.current = window.requestAnimationFrame(tick);
    };
    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      pantheonGlRef.current = null;
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      window.cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      envRT.dispose();
      knotGeo.dispose();
      knotMat.dispose();
      ringGeo.dispose();
      ringMatBasic.dispose();
      ringMatArchon.dispose();
      ringMatThemed.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      satDispose.forEach(({ g, m }) => {
        g.dispose();
        m.dispose();
      });
      floorDecor.forEach(({ tg, tm }) => {
        tg.dispose();
        tm.dispose();
      });
      pillarDispose.forEach(({ g, m }) => {
        g.dispose();
        m.dispose();
      });
      try {
        host.removeChild(renderer.domElement);
      } catch {}
    };
  }, []);

  useEffect(() => {
    pantheonGlRef.current?.applyEntityVisuals(selected);
  }, [selected]);

  const stats = selected?.stats;

  return (
    <div className="pb-20 space-y-10">
      <SEOMeta
        title="Panthéon 3D — Portail immersif | Egor69"
        description="Portail 3D du Panthéon Egor69. Même entités, immersion totale."
        canonicalUrl="/pantheon-3d"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Panthéon 3D — Egor69",
          applicationCategory: "EntertainmentApplication",
        }}
      />

      {/* Hero garniture */}
      <div
        className="relative rounded-3xl overflow-hidden border border-amber-500/20 p-8 sm:p-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(16,185,129,0.08), rgba(99,102,241,0.10))",
        }}
      >
        <div className="absolute inset-0 opacity-40 pointer-events-none aurora" />
        <div className="absolute top-2 left-2 w-16 h-16 border-l-2 border-t-2 border-amber-400/40 rounded-tl-xl pointer-events-none" />
        <div className="absolute top-2 right-2 w-16 h-16 border-r-2 border-t-2 border-emerald-400/35 rounded-tr-xl pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-16 h-16 border-l-2 border-b-2 border-violet-400/30 rounded-bl-xl pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-16 h-16 border-r-2 border-b-2 border-amber-400/25 rounded-br-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <Badge className="bg-black/40 text-white border-white/15 backdrop-blur-sm">
              <Crown className="h-3.5 w-3.5 mr-2 text-amber-300" /> PANTHÉON 3D — sanctuaire WebGL
            </Badge>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
              Reliques vivantes · <span className="text-golden">garniture mythique</span>
            </h1>
            <p className="text-white/75 max-w-xl leading-relaxed">
              Satellites orbitaux, anneaux de summation, colonnes cristallines et poussière d’or — chaque entité teinte le tore central.
              {PANTHEON_ENTITIES.length} entités · même lore que les renders.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="outline" className="border-emerald-400/30 text-emerald-200/90 gap-1">
                <Sparkles className="h-3 w-3" /> IBL global
              </Badge>
              <Badge variant="outline" className="border-amber-400/25 text-amber-200/90 gap-1">
                <Gem className="h-3 w-3" /> Ω Archon cinéma
              </Badge>
              <Badge variant="outline" className="border-violet-400/25 text-violet-200/85 gap-1">
                <BookOpen className="h-3 w-3" /> Lore synchronisé
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button asChild variant="outline" className="rounded-xl border-white/15 text-white hover:bg-white/5">
              <Link to="/pantheon-renders">Galerie Renders</Link>
            </Button>
            <Button asChild className="rounded-xl btn-magic border-0 text-white font-black">
              <Link to="/avatar-creator">
                Studio Avatar <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Badge className="bg-black/30 text-white border-white/10">
          <Gauge className="h-3.5 w-3.5 mr-2" /> Viewer actif
        </Badge>
        <p className="text-xs text-muted-foreground font-mono">
          URL profonde · ?entity=
          {selected?.id || OMEGA_ARCHON_ID}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-white/10 bg-black/25 shadow-[0_0_80px_rgba(16,185,129,0.08)]">
          <div className="p-5 border-b border-white/10 flex items-start justify-between gap-3 flex-wrap bg-gradient-to-r from-black/40 via-transparent to-violet-950/20">
            <div className="min-w-0 space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs text-white/45 font-mono uppercase tracking-widest">Entité sélectionnée</p>
                {selected?.rarity ? (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${rarityClass(selected.rarity)}`}>
                    {String(selected.rarity).toUpperCase()}
                  </span>
                ) : null}
                <Badge variant="secondary" className="text-[10px]">
                  {selected?.realm}
                </Badge>
              </div>
              <p className="font-display text-2xl sm:text-3xl font-black text-foreground leading-tight">{selected?.name || "—"}</p>
              <p className="text-sm text-muted-foreground">{selected?.tagline || ""}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(selected?.tags || []).map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
            <Badge variant="outline" className="text-xs shrink-0">
              <Box className="h-3.5 w-3.5 mr-2" /> WebGL
            </Badge>
          </div>

          <div className="relative h-[460px] sm:h-[560px]">
            <div ref={mountRef} className="absolute inset-0" style={{ opacity: 0.97 }} />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at 50% 28%, rgba(16,185,129,0.14), rgba(245,158,11,0.06) 45%, rgba(0,0,0,0) 65%)" }}
            />
          </div>

          {stats ? (
            <div className="p-5 border-t border-white/10 space-y-4 bg-card/40">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Zap className="h-3.5 w-3.5" /> Signature statistique
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Zap className="h-3 w-3" /> Puissance
                    </span>
                    <span className="font-mono font-bold">{stats.power}/10</span>
                  </div>
                  <Progress value={stats.power * 10} className="h-2 bg-white/10" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <BookOpen className="h-3 w-3" /> Sagesse
                    </span>
                    <span className="font-mono font-bold">{stats.wisdom}/10</span>
                  </div>
                  <Progress value={stats.wisdom * 10} className="h-2 bg-white/10 [&>div]:bg-violet-500" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Shield className="h-3 w-3" /> Chaos
                    </span>
                    <span className="font-mono font-bold">{stats.chaos}/10</span>
                  </div>
                  <Progress value={stats.chaos * 10} className="h-2 bg-white/10 [&>div]:bg-amber-500" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Heart className="h-3 w-3" /> Miséricorde
                    </span>
                    <span className="font-mono font-bold">{stats.mercy}/10</span>
                  </div>
                  <Progress value={stats.mercy * 10} className="h-2 bg-white/10 [&>div]:bg-emerald-500" />
                </div>
              </div>
              <Separator className="bg-white/10" />
              <p className="text-sm text-muted-foreground leading-relaxed">{selected?.description}</p>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline" className="rounded-xl">
                  <Link to={`/pantheon-renders/${selected?.id}`}>Fiche render HD</Link>
                </Button>
                <Button asChild size="sm" variant="secondary" className="rounded-xl">
                  <Link to={`/pricing`}>Renforcer le pacte</Link>
                </Button>
              </div>
            </div>
          ) : null}

          {(selected?.media?.gallery || []).length > 0 ? (
            <div className="p-4 border-t border-white/10 flex gap-2 overflow-x-auto scrollbar-hide bg-black/20">
              {(selected.media.gallery || []).map((src) => (
                <button
                  key={src}
                  type="button"
                  className="shrink-0 w-28 h-16 rounded-lg overflow-hidden border border-white/10 opacity-90 hover:opacity-100 transition-opacity"
                  aria-label="aperçu galerie"
                >
                  <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-white/10 bg-card p-5 space-y-4 shadow-inner">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filtrer entités…" className="pl-10 rounded-xl" />
          </div>
          <div className="flex flex-wrap gap-2">
            {PANTHEON_REALMS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRealm(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  realm === r ? "bg-primary text-primary-foreground border-primary/40 shadow-md" : "bg-muted/40 text-muted-foreground border-border hover:bg-accent"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <Separator />
          <div className="space-y-2 max-h-[560px] overflow-auto pr-1">
            {entities.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => selectEntity(e.id)}
                className={`w-full text-left p-3 rounded-2xl border transition-all ${
                  selectedId === e.id ? "border-primary/60 bg-primary/10 shadow-[0_0_24px_rgba(16,185,129,0.15)]" : "border-border bg-card hover:border-primary/25"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[10px] text-white/45 font-mono uppercase tracking-widest">
                    {e.kind} · {e.realm}
                  </p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border shrink-0 ${rarityClass(e.rarity)}`}>
                    {String(e.rarity || "").slice(0, 3)}
                  </span>
                </div>
                <p className="font-black text-foreground mt-0.5">{e.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{e.tagline}</p>
              </button>
            ))}
            {entities.length === 0 && (
              <div className="text-center py-10 text-muted-foreground text-sm">Aucun résultat.</div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-dashed border-amber-500/35 bg-gradient-to-br from-amber-500/5 via-transparent to-emerald-500/5 p-6 space-y-3">
        <p className="font-display font-black text-lg text-foreground flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" /> Route suivante
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Import GLB par entité, poses avatar liées, et audio spatial léger — la scène est déjà veloutée (IBL + satellites + poussière).
        </p>
      </div>
    </div>
  );
}
