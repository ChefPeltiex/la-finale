import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import SEOMeta from "@/components/SEOMeta";
import { BIBLE_ENTRIES } from "@/data/bibleEncyclopedia";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Network, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

function prefersReducedMotion() {
  try {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function colorForCategory(cat) {
  if (cat === "Livres") return 0xfbbf24;
  if (cat === "Personnes") return 0x10b981;
  if (cat === "Lieux") return 0x60a5fa;
  if (cat === "Thèmes") return 0xa78bfa;
  return 0xffffff;
}

export default function BibleGraph() {
  const mountRef = useRef(null);
  const labelsRef = useRef(null);
  const rafRef = useRef(0);
  const [activeId, setActiveId] = useState(BIBLE_ENTRIES[0]?.id || null);
  const [query, setQuery] = useState("");
  const [labelsOn, setLabelsOn] = useState(true);
  const [spotlight, setSpotlight] = useState(true);

  const graph = useMemo(() => {
    const nodes = BIBLE_ENTRIES.map((e) => ({
      id: e.id,
      title: e.title,
      category: e.category,
      color: colorForCategory(e.category),
    }));

    const edges = [];
    const seen = new Set();

    // Explicit refs
    for (const e of BIBLE_ENTRIES) {
      for (const to of e.refs || []) {
        const key = [e.id, to].sort().join("::");
        if (seen.has(key)) continue;
        seen.add(key);
        edges.push({ a: e.id, b: to, kind: "ref" });
      }
    }

    // Tag-based “Synergie” edges (lightweight): connect if share >=2 tags
    const tagsBy = new Map(BIBLE_ENTRIES.map((e) => [e.id, new Set(e.tags || [])]));
    for (let i = 0; i < BIBLE_ENTRIES.length; i++) {
      for (let j = i + 1; j < BIBLE_ENTRIES.length; j++) {
        const a = BIBLE_ENTRIES[i].id;
        const b = BIBLE_ENTRIES[j].id;
        const ta = tagsBy.get(a);
        const tb = tagsBy.get(b);
        let common = 0;
        for (const t of ta) if (tb.has(t)) common++;
        if (common >= 2) {
          const key = [a, b].sort().join("::");
          if (!seen.has(key)) {
            seen.add(key);
            edges.push({ a, b, kind: "tag" });
          }
        }
      }
    }

    return { nodes, edges };
  }, []);

  const active = useMemo(() => BIBLE_ENTRIES.find((e) => e.id === activeId) || null, [activeId]);

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;
    if (prefersReducedMotion()) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 140);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffffff, 0.7);
    key.position.set(2.2, 2.4, 3.0);
    scene.add(key);

    // Build objects
    const nodeGeo = new THREE.SphereGeometry(0.35, 24, 24);
    const nodeObjs = new Map();
    const positions = new Map();

    for (const n of graph.nodes) {
      const mat = new THREE.MeshStandardMaterial({
        color: n.color,
        metalness: 0.25,
        roughness: 0.35,
        emissive: new THREE.Color(n.color),
        emissiveIntensity: 0.12,
      });
      const mesh = new THREE.Mesh(nodeGeo, mat);
      mesh.userData = { id: n.id };
      const x = (Math.random() - 0.5) * 12;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 2;
      mesh.position.set(x, y, z);
      positions.set(n.id, mesh.position);
      nodeObjs.set(n.id, { mesh, mat });
      scene.add(mesh);
    }

    const edgeMatRef = new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.18 });
    const edgeMatTag = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 });
    const edgeLines = [];

    for (const e of graph.edges) {
      const a = positions.get(e.a);
      const b = positions.get(e.b);
      if (!a || !b) continue;
      const geo = new THREE.BufferGeometry().setFromPoints([a, b]);
      const line = new THREE.Line(geo, e.kind === "ref" ? edgeMatRef : edgeMatTag);
      line.userData = { a: e.a, b: e.b, kind: e.kind };
      edgeLines.push({ line, geo });
      scene.add(line);
    }

    // Simple force simulation (tiny, deterministic enough)
    const vel = new Map(graph.nodes.map((n) => [n.id, new THREE.Vector3()]));
    const tmp = new THREE.Vector3();

    const step = () => {
      // Repulsion
      const ids = graph.nodes.map((n) => n.id);
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          const ai = ids[i], bi = ids[j];
          const pa = positions.get(ai), pb = positions.get(bi);
          tmp.subVectors(pa, pb);
          const d2 = Math.max(0.6, tmp.lengthSq());
          const f = 0.22 / d2;
          tmp.normalize().multiplyScalar(f);
          vel.get(ai).add(tmp);
          vel.get(bi).sub(tmp);
        }
      }

      // Springs along edges
      for (const e of graph.edges) {
        const pa = positions.get(e.a), pb = positions.get(e.b);
        tmp.subVectors(pb, pa);
        const dist = Math.max(0.1, tmp.length());
        const rest = e.kind === "ref" ? 4.2 : 5.4;
        const k = e.kind === "ref" ? 0.012 : 0.006;
        const f = (dist - rest) * k;
        tmp.normalize().multiplyScalar(f);
        vel.get(e.a).add(tmp);
        vel.get(e.b).sub(tmp);
      }

      // Damp & integrate
      for (const id of ids) {
        const v = vel.get(id);
        v.multiplyScalar(0.88);
        const p = positions.get(id);
        p.add(v);
        // Contain in soft box
        p.x = THREE.MathUtils.clamp(p.x, -9.5, 9.5);
        p.y = THREE.MathUtils.clamp(p.y, -6.5, 6.5);
        p.z = THREE.MathUtils.clamp(p.z, -4, 4);
      }
    };

    // Interaction (hover/click)
    const ray = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hovered = null;

    const onMove = (ev) => {
      const r = host.getBoundingClientRect();
      mouse.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -(((ev.clientY - r.top) / r.height) * 2 - 1);
    };
    const onClick = () => {
      if (hovered?.userData?.id) setActiveId(hovered.userData.id);
    };
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("click", onClick);

    const projectToScreen = (vec3) => {
      const v = vec3.clone().project(camera);
      const r = host.getBoundingClientRect();
      const x = (v.x * 0.5 + 0.5) * r.width;
      const y = (-v.y * 0.5 + 0.5) * r.height;
      return { x, y, visible: v.z > -1 && v.z < 1 };
    };

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

    const tick = () => {
      step();

      // Update edge geometries
      for (const { geo, line } of edgeLines) {
        const a = positions.get(line.userData.a);
        const b = positions.get(line.userData.b);
        geo.setFromPoints([a, b]);
        geo.computeBoundingSphere();
      }

      // Hover highlight
      ray.setFromCamera(mouse, camera);
      const intersects = ray.intersectObjects(Array.from(nodeObjs.values()).map((o) => o.mesh), false);
      const hit = intersects[0]?.object || null;
      if (hit !== hovered) {
        if (hovered) {
          const id = hovered.userData.id;
          nodeObjs.get(id).mat.emissiveIntensity = 0.12;
          hovered.scale.set(1, 1, 1);
        }
        hovered = hit;
        if (hovered) {
          const id = hovered.userData.id;
          nodeObjs.get(id).mat.emissiveIntensity = 0.35;
          hovered.scale.set(1.18, 1.18, 1.18);
        }
      }

      // Update labels (DOM overlay)
      const labelsHost = labelsRef.current;
      if (labelsHost && labelsOn) {
        const q = query.trim().toLowerCase();
        for (const n of graph.nodes) {
          const el = labelsHost.querySelector(`[data-node-label="${n.id}"]`);
          if (!el) continue;
          const obj = nodeObjs.get(n.id)?.mesh;
          if (!obj) continue;
          const { x, y, visible } = projectToScreen(obj.position);
          const blob = `${n.title} ${n.category}`.toLowerCase();
          const match = !q || blob.includes(q);
          const isActive = activeId === n.id;
          const show = visible && match && (!spotlight || isActive || hovered?.userData?.id === n.id);

          el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -120%)`;
          el.style.opacity = show ? (isActive ? "1" : "0.72") : "0";
          el.style.filter = isActive ? "drop-shadow(0 0 12px rgba(16,185,129,0.45))" : "none";
          el.dataset.active = isActive ? "1" : "0";
        }
      }

      // Spotlight / search highlighting in 3D
      {
        const q = query.trim().toLowerCase();
        for (const n of graph.nodes) {
          const obj = nodeObjs.get(n.id);
          if (!obj) continue;
          const blob = `${n.title} ${n.category}`.toLowerCase();
          const match = !q || blob.includes(q);
          const isActive = activeId === n.id;
          const isHover = hovered?.userData?.id === n.id;
          const keep = spotlight ? (isActive || isHover) : match;
          obj.mesh.scale.setScalar(isActive ? 1.24 : isHover ? 1.18 : 1.0);
          obj.mat.opacity = keep ? 1 : 0.35;
          obj.mat.transparent = !keep;
        }
        edgeMatRef.opacity = spotlight ? 0.22 : 0.18;
        edgeMatTag.opacity = spotlight ? 0.06 : 0.08;
      }

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("click", onClick);
      cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      nodeGeo.dispose();
      edgeMatRef.dispose();
      edgeMatTag.dispose();
      for (const { geo } of edgeLines) geo.dispose();
      for (const { mat } of nodeObjs.values()) mat.dispose();
      try {
        host.removeChild(renderer.domElement);
      } catch {}
    };
  }, [graph, activeId, labelsOn, query, spotlight]);

  return (
    <div className="pb-20 space-y-10">
      <SEOMeta
        title="Graphe — Relations encyclopédiques | Egor69"
        description="Graphe interactif: livres, personnes, thèmes, lieux — relations, synergie, navigation."
        canonicalUrl="/encyclopedie-biblique/graphe"
      />

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Button asChild variant="outline" className="rounded-xl">
          <Link to="/encyclopedie-biblique">
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour
          </Link>
        </Button>
        <Badge className="bg-black/30 text-white border-white/10">
          <Network className="h-3.5 w-3.5 mr-2" /> GRAPHE (SYNERGIE)
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-white/10 bg-black/20">
          <div className="p-5 border-b border-white/10">
            <p className="text-white/70 font-display font-black text-xl">Carte relationnelle</p>
            <p className="text-white/45 text-sm">
              Clique un nœud pour ouvrir la fiche. Les liens “ref” sont plus forts que les liens par tags.
            </p>
          </div>
          <div className="relative h-[560px]">
            <div ref={mountRef} className="absolute inset-0" style={{ mixBlendMode: "screen" }} />
            <div ref={labelsRef} className="absolute inset-0 pointer-events-none">
              {graph.nodes.map((n) => (
                <div
                  key={n.id}
                  data-node-label={n.id}
                  className="absolute px-2 py-1 rounded-full text-[10px] font-black tracking-widest border select-none"
                  style={{
                    background: "rgba(0,0,0,0.35)",
                    borderColor: "rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.85)",
                    opacity: 0,
                    transform: "translate3d(-9999px,-9999px,0)",
                  }}
                >
                  {n.title}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-card p-5 space-y-4">
          <p className="text-xs font-black tracking-[0.25em] uppercase text-white/60">Sélection</p>
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher dans le graphe…"
                className="pl-10 rounded-xl"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setLabelsOn((v) => !v)}
                className={`px-3 py-2 rounded-xl text-xs font-black border transition-all ${
                  labelsOn ? "bg-primary text-primary-foreground border-primary/40" : "bg-muted/40 text-muted-foreground border-border hover:bg-accent"
                }`}
              >
                Labels {labelsOn ? "ON" : "OFF"}
              </button>
              <button
                type="button"
                onClick={() => setSpotlight((v) => !v)}
                className={`px-3 py-2 rounded-xl text-xs font-black border transition-all ${
                  spotlight ? "bg-emerald-500/10 text-emerald-300 border-emerald-400/25" : "bg-muted/40 text-muted-foreground border-border hover:bg-accent"
                }`}
              >
                Spotlight {spotlight ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {active ? (
            <div className="space-y-2">
              <p className="text-xs text-white/45 font-mono uppercase tracking-widest">{active.category}</p>
              <p className="font-display text-2xl font-black text-foreground">{active.title}</p>
              <p className="text-sm text-muted-foreground">{active.subtitle}</p>
              <div className="pt-3 flex flex-col gap-2">
                <Button asChild className="rounded-xl btn-magic border-0 text-white font-black">
                  <Link to={`/encyclopedie-biblique/${active.id}`}>Ouvrir la fiche</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl border-white/15 text-white hover:bg-white/5">
                  <Link to="/pantheon-3d">Univers 3D</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Aucune sélection.</div>
          )}

          <div className="pt-4 border-t border-white/10 text-xs text-white/40">
            <Sparkles className="h-4 w-4 inline mr-2" />
            Prochaine passe: labels 3D + recherche dans le graphe + filtres.
          </div>
        </div>
      </div>
    </div>
  );
}

