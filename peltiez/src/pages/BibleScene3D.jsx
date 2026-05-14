import { useEffect, useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import * as THREE from "three";
import SEOMeta from "@/components/SEOMeta";
import { BIBLE_ENTRIES } from "@/data/bibleEncyclopedia";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Box, Sparkles } from "lucide-react";

function prefersReducedMotion() {
  try {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function scenePalette(scene) {
  switch (scene) {
    case "cosmic-scroll":
      return { a: "#10b981", b: "#60a5fa", c: "#fbbf24" };
    case "desert-crossing":
      return { a: "#f59e0b", b: "#38bdf8", c: "#ef4444" };
    case "seal-chamber":
      return { a: "#fbbf24", b: "#a78bfa", c: "#10b981" };
    case "mountain-revelation":
      return { a: "#60a5fa", b: "#fbbf24", c: "#e5e7eb" };
    case "city-map":
      return { a: "#60a5fa", b: "#10b981", c: "#fbbf24" };
    default:
      return { a: "#10b981", b: "#60a5fa", c: "#a78bfa" };
  }
}

export default function BibleScene3D() {
  const { id } = useParams();
  const mountRef = useRef(null);
  const rafRef = useRef(0);

  const entry = useMemo(() => BIBLE_ENTRIES.find((e) => e.id === id) || null, [id]);
  const palette = useMemo(() => scenePalette(entry?.virtual?.scene), [entry]);

  useEffect(() => {
    const host = mountRef.current;
    if (!host || !entry) return;
    if (prefersReducedMotion()) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 120);
    camera.position.set(0, 0.4, 9.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffffff, 0.85);
    key.position.set(2.4, 2.0, 3.2);
    scene.add(key);
    const pA = new THREE.PointLight(new THREE.Color(palette.a), 1.0, 50);
    pA.position.set(-3.2, 0.6, 4.5);
    scene.add(pA);
    const pB = new THREE.PointLight(new THREE.Color(palette.b), 0.9, 50);
    pB.position.set(3.2, -0.8, 4.8);
    scene.add(pB);
    const pC = new THREE.PointLight(new THREE.Color(palette.c), 0.7, 50);
    pC.position.set(0.0, 2.6, 2.8);
    scene.add(pC);

    // Stage haze
    const hazeGeo = new THREE.SphereGeometry(4.9, 28, 28);
    const hazeMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(palette.a), transparent: true, opacity: 0.05 });
    const haze = new THREE.Mesh(hazeGeo, hazeMat);
    scene.add(haze);

    // “Virtual props” as symbolic geometry (not literal reproductions)
    const objects = [];
    const props = entry.virtual?.props || [];

    const make = (kind) => {
      if (kind === "stars") {
        const n = 900;
        const pos = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) {
          const r = 18 * Math.pow(Math.random(), 0.7);
          const t = Math.random() * Math.PI * 2;
          const p = Math.acos(2 * Math.random() - 1);
          pos[i * 3 + 0] = r * Math.sin(p) * Math.cos(t);
          pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
          pos[i * 3 + 2] = -Math.abs(r * Math.cos(p)) - 3;
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        const m = new THREE.PointsMaterial({ size: 0.03, color: new THREE.Color(palette.b), transparent: true, opacity: 0.65, depthWrite: false });
        const pts = new THREE.Points(g, m);
        scene.add(pts);
        objects.push({ obj: pts, geo: g, mat: m });
        return;
      }

      if (kind === "parchment") {
        const g = new THREE.PlaneGeometry(4.8, 2.8, 12, 12);
        const m = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, metalness: 0.1, roughness: 0.9, transparent: true, opacity: 0.2 });
        const mesh = new THREE.Mesh(g, m);
        mesh.position.set(0, -0.2, 0);
        mesh.rotation.x = -0.28;
        scene.add(mesh);
        objects.push({ obj: mesh, geo: g, mat: m });
        return;
      }

      if (kind === "omega-seal" || kind === "seal") {
        const g = new THREE.TorusKnotGeometry(2.0, 0.42, 220, 24, 2, 3);
        const m = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(palette.c),
          metalness: 0.85,
          roughness: 0.18,
          clearcoat: 0.9,
          clearcoatRoughness: 0.12,
          transmission: 0.15,
          thickness: 0.7,
        });
        const mesh = new THREE.Mesh(g, m);
        mesh.position.set(0, 0.1, 0);
        scene.add(mesh);
        objects.push({ obj: mesh, geo: g, mat: m });
        return;
      }

      if (kind === "tablets" || kind === "map") {
        const g = new THREE.BoxGeometry(3.6, 2.2, 0.2);
        const m = new THREE.MeshStandardMaterial({ color: new THREE.Color(palette.a), metalness: 0.15, roughness: 0.75, transparent: true, opacity: 0.18 });
        const mesh = new THREE.Mesh(g, m);
        mesh.position.set(0, -0.5, -0.2);
        mesh.rotation.x = -0.15;
        mesh.rotation.y = 0.08;
        scene.add(mesh);
        objects.push({ obj: mesh, geo: g, mat: m });
        return;
      }

      if (kind === "fire") {
        const g = new THREE.ConeGeometry(0.9, 1.8, 32);
        const m = new THREE.MeshBasicMaterial({ color: new THREE.Color("#f97316"), transparent: true, opacity: 0.22 });
        const mesh = new THREE.Mesh(g, m);
        mesh.position.set(-2.2, -1.0, 0);
        scene.add(mesh);
        objects.push({ obj: mesh, geo: g, mat: m });
        return;
      }

      if (kind === "water") {
        const g = new THREE.TorusGeometry(1.6, 0.18, 20, 120);
        const m = new THREE.MeshBasicMaterial({ color: new THREE.Color("#38bdf8"), transparent: true, opacity: 0.18 });
        const mesh = new THREE.Mesh(g, m);
        mesh.position.set(2.2, -1.0, 0);
        mesh.rotation.x = Math.PI / 2.6;
        scene.add(mesh);
        objects.push({ obj: mesh, geo: g, mat: m });
        return;
      }

      if (kind === "mountain") {
        const g = new THREE.ConeGeometry(2.4, 3.6, 4);
        const m = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.05, roughness: 0.9, transparent: true, opacity: 0.22 });
        const mesh = new THREE.Mesh(g, m);
        mesh.position.set(0, -1.2, -1.0);
        scene.add(mesh);
        objects.push({ obj: mesh, geo: g, mat: m });
        return;
      }

      if (kind === "cloud") {
        const g = new THREE.SphereGeometry(1.6, 18, 18);
        const m = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.06 });
        const mesh = new THREE.Mesh(g, m);
        mesh.position.set(0, 1.6, -0.4);
        scene.add(mesh);
        objects.push({ obj: mesh, geo: g, mat: m });
        return;
      }

      if (kind === "markers") {
        const group = new THREE.Group();
        for (let i = 0; i < 6; i++) {
          const g = new THREE.SphereGeometry(0.08, 16, 16);
          const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(palette.c), transparent: true, opacity: 0.45 });
          const s = new THREE.Mesh(g, m);
          s.position.set(-1.2 + i * 0.45, -0.35 + Math.sin(i) * 0.12, 0.35);
          group.add(s);
          objects.push({ obj: s, geo: g, mat: m });
        }
        scene.add(group);
        return;
      }

      if (kind === "sand") {
        const g = new THREE.PlaneGeometry(8.5, 5.0, 1, 1);
        const m = new THREE.MeshStandardMaterial({ color: 0xfde68a, metalness: 0.05, roughness: 0.95, transparent: true, opacity: 0.10 });
        const mesh = new THREE.Mesh(g, m);
        mesh.position.set(0, -1.7, -0.8);
        mesh.rotation.x = -Math.PI / 2.2;
        scene.add(mesh);
        objects.push({ obj: mesh, geo: g, mat: m });
        return;
      }
    };

    props.forEach(make);

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let mx = 0, my = 0;
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
      haze.scale.setScalar(1 + Math.sin(t * 0.6) * 0.03);
      for (const o of objects) {
        o.obj.rotation.y += 0.0025;
        o.obj.rotation.x += 0.0015;
      }
      camera.position.x = mx * 0.55;
      camera.position.y = 0.4 - my * 0.35;
      camera.lookAt(0, -0.1, 0);
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      hazeGeo.dispose();
      hazeMat.dispose();
      for (const o of objects) {
        o.geo?.dispose?.();
        o.mat?.dispose?.();
      }
      try {
        host.removeChild(renderer.domElement);
      } catch {}
    };
  }, [entry, palette]);

  if (!entry) {
    return (
      <div className="pb-20 space-y-6">
        <SEOMeta title="Scène 3D — Introuvable | Egor69" canonicalUrl={`/encyclopedie-biblique/scene/${id || ""}`} />
        <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-muted-foreground">Entrée introuvable.</p>
          <Button asChild className="mt-4 rounded-xl" variant="outline">
            <Link to="/encyclopedie-biblique">Retour</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 space-y-10">
      <SEOMeta
        title={`${entry.title} — Scène 3D | Egor69`}
        description={`Scène 3D liée à l’entrée: ${entry.title}.`}
        canonicalUrl={`/encyclopedie-biblique/scene/${entry.id}`}
      />

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Button asChild variant="outline" className="rounded-xl">
          <Link to={`/encyclopedie-biblique/${entry.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour fiche
          </Link>
        </Button>
        <Badge className="bg-black/30 text-white border-white/10">
          <Box className="h-3.5 w-3.5 mr-2" /> SCÈNE 3D
        </Badge>
      </div>

      <div className="rounded-3xl overflow-hidden border border-white/10 bg-card">
        <div className="p-6 border-b border-white/10">
          <p className="text-xs text-white/45 font-mono uppercase tracking-widest">{entry.category}</p>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground">{entry.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{entry.subtitle}</p>
        </div>

        <div className="relative h-[560px] bg-black/20">
          <div ref={mountRef} className="absolute inset-0" style={{ mixBlendMode: "screen" }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 50% 30%, rgba(16,185,129,0.10), rgba(0,0,0,0) 60%)" }}
          />
          <div className="absolute left-6 bottom-6 right-6 pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border border-white/10 bg-black/35 text-white/70 text-xs font-mono">
              <Sparkles className="h-4 w-4" />
              scène: {entry.virtual?.scene || "—"} · props: {(entry.virtual?.props || []).join(", ") || "—"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild className="rounded-xl btn-magic border-0 text-white font-black">
          <Link to="/pantheon-3d">Univers 3D global</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl border-white/15 text-white hover:bg-white/5">
          <Link to="/encyclopedie-biblique/graphe">Graphe (Synergie)</Link>
        </Button>
      </div>
    </div>
  );
}

