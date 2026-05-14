import { useMemo, useRef, useState, useEffect, lazy, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";

const WorldScene = lazy(() => import("@/world/WorldScene"));
import SEOMeta from "@/components/SEOMeta";
import { Sparkles, MousePointer2, DoorOpen, ChevronLeft, Trophy, Gem, CircleHelp, BookOpen } from "lucide-react";
import { loadCheckpoint, recordRealmVisit, getVisitedRealmCount } from "@/lib/worldPersistence";
import { REALM_COUNT } from "@/world/realms";
import { SITE_ORIGIN, WORLD_ETHOS } from "@/lib/site";
import WorldMinimap from "@/components/world/WorldMinimap";
import WorldLorePanel from "@/components/world/WorldLorePanel";
import VerseGrimoire from "@/components/world/VerseGrimoire";
import { loadUniversePreferences } from "@/lib/universePreferences";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function WorldHub() {
  const keysRef = useRef({});
  const playerTelemetryRef = useRef({ x: 0, z: 0, y: 0, yaw: 0 });
  const [nearRealm, setNearRealm] = useState(null);
  const [checkpoint] = useState(() => loadCheckpoint());
  const [visitedCount, setVisitedCount] = useState(() => getVisitedRealmCount());
  const [universePrefs, setUniversePrefs] = useState(loadUniversePreferences);
  const [helpOpen, setHelpOpen] = useState(false);
  const [grimoireOpen, setGrimoireOpen] = useState(false);
  const navigate = useNavigate();

  const controls = useMemo(
    () => [
      { k: "Clic", d: "capturer la souris pour regarder autour" },
      { k: "W A S D", d: "déplacement" },
      { k: "Shift", d: "sprint" },
      { k: "Espace", d: "saut ; maintenir = glisse" },
      { k: "E / Entrée", d: "traverser un portail quand vous êtes proche" },
      { k: "Interface 2D", d: "retour à la navigation classique" },
    ],
    []
  );

  useEffect(() => {
    const down = (e) => {
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
  }, []);

  useEffect(() => {
    const refreshProgress = () => setVisitedCount(getVisitedRealmCount());
    window.addEventListener("focus", refreshProgress);
    return () => window.removeEventListener("focus", refreshProgress);
  }, []);

  useEffect(() => {
    const onCustom = (ev) => {
      if (ev?.detail) setUniversePrefs(ev.detail);
      else setUniversePrefs(loadUniversePreferences());
    };
    const onStorage = (ev) => {
      if (ev.key === "igor:universe:v2") setUniversePrefs(loadUniversePreferences());
    };
    window.addEventListener("igor-universe-change", onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("igor-universe-change", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    const onPortalKey = (e) => {
      if ((e.code === "Enter" || e.code === "KeyE") && nearRealm) {
        e.preventDefault();
        recordRealmVisit(nearRealm.slug);
        setVisitedCount(getVisitedRealmCount());
        navigate(nearRealm.path);
      }
    };
    window.addEventListener("keydown", onPortalKey);
    return () => window.removeEventListener("keydown", onPortalKey);
  }, [nearRealm, navigate]);

  return (
    <div className="fixed inset-0 z-[200] bg-black text-white">
      <SEOMeta
        title="Verse Egor69 — open world WebGL, portails narratifs & progression honnête"
        description="Explore un continent numérique : relief procédural, sprint, saut et glisse, radar façon GTA, douze salles reliées au marketplace, atlas, encyclopédie biblique, cosmos, ésotérisme, génome et alliances — chaque portail expose lore, rites suggérés et engagements vérifiables, sans métriques fictives."
        keywords="igor verse, monde 3d web, exploration immersive, hub narratif, open world navigateur, radar jeu, portails interactifs, atlas vivant, encyclopédie, cosmologie, ésotérisme contextualisé, économie circulaire, souveraineté utilisateur"
        canonicalUrl={`${SITE_ORIGIN}/world`}
      />

      <div className="absolute inset-0 z-0">
        <Suspense
          fallback={
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-black text-white/75">
              <div className="h-9 w-9 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
              <p className="text-sm font-medium tracking-wide">Chargement 3D…</p>
            </div>
          }
        >
          <WorldScene
            keysRef={keysRef}
            onProximityChange={setNearRealm}
            initialCheckpoint={checkpoint}
            playerTelemetryRef={playerTelemetryRef}
          />
        </Suspense>
      </div>

      <WorldMinimap telemetryRef={playerTelemetryRef} />

      {/* HUD — pas un overlay 8-bit : typographie nette, glass UI */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
        <div className="pointer-events-auto flex flex-wrap items-start justify-between gap-3">
          <div
            className="rounded-2xl border border-white/10 px-4 py-3 backdrop-blur-xl max-w-md"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(99,102,241,0.08))",
            }}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300/90">
              <Sparkles className="h-4 w-4" />
              Verse spatial Egor69
            </div>
            {universePrefs.gameplayUniverse?.name?.trim() ? (
              <div className="mt-2 rounded-xl border border-emerald-400/30 bg-black/30 px-3 py-2">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-fuchsia-200/80">
                  <Gem className="h-3 w-3" /> Univers personnel
                </p>
                <p className="text-base font-black tracking-tight text-white">
                  {universePrefs.gameplayUniverse.name.trim()}
                </p>
                {universePrefs.gameplayUniverse.tagline?.trim() ? (
                  <p className="mt-0.5 text-xs italic text-white/70 leading-snug">
                    {universePrefs.gameplayUniverse.tagline.trim()}
                  </p>
                ) : null}
              </div>
            ) : null}
            <p className="mt-2 text-sm text-white/80 leading-snug">
              Open world · clic canvas pour la souris · <span className="text-white font-semibold">W A S D</span> ·{" "}
              <span className="text-emerald-300">Shift</span> sprint · <span className="text-sky-300">Espace</span> saut /
              maintien en l’air (glisse) · <span className="text-amber-300">E</span> portail
            </p>
            <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-cyan-300/90">
              <Trophy className="h-3.5 w-3.5 shrink-0" />
              Progression : {visitedCount} / {REALM_COUNT} salles ouvertes · pose sauvegardée en session
            </p>
            <ul className="mt-3 space-y-1.5 text-[10px] leading-snug text-white/55 border-t border-white/10 pt-3">
              {WORLD_ETHOS.charter.slice(0, 3).map((line) => (
                <li key={line.slice(0, 24)} className="flex gap-2">
                  <span className="text-emerald-500/90 shrink-0">◆</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            to="/"
            className="pointer-events-auto inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/50 px-4 py-2.5 text-sm font-semibold text-white/90 backdrop-blur-md hover:bg-white/10 hover:border-emerald-400/40 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Interface 2D
          </Link>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="pointer-events-auto border-amber-600/40 bg-gradient-to-br from-amber-950/80 to-black/70 text-amber-100 backdrop-blur-md hover:border-amber-400/60 hover:bg-amber-950/90 font-serif"
            onClick={() => setGrimoireOpen(true)}
          >
            <BookOpen className="h-4 w-4" />
            Codex du Verse
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="pointer-events-auto border-white/15 bg-black/50 text-white/90 backdrop-blur-md hover:bg-white/10 hover:border-emerald-400/40"
            onClick={() => setHelpOpen(true)}
          >
            <CircleHelp className="h-4 w-4" />
            Aide
          </Button>
        </div>

        <div className="pointer-events-none flex justify-center pb-4 px-2">
          <div
            className={`rounded-2xl border px-4 sm:px-6 py-4 backdrop-blur-xl transition-all duration-300 max-h-[52vh] overflow-y-auto ${
              nearRealm
                ? "border-emerald-400/50 shadow-[0_0_40px_rgba(52,211,153,0.25)] scale-[1.02]"
                : "border-white/10 opacity-80"
            }`}
            style={{
              background: nearRealm
                ? "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(59,130,246,0.12))"
                : "linear-gradient(135deg, rgba(0,0,0,0.55), rgba(15,23,42,0.5))",
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 w-full max-w-4xl mx-auto">
              <MousePointer2 className={`h-6 w-6 shrink-0 mt-1 ${nearRealm ? "text-emerald-400" : "text-white/40"}`} />
              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Portail & narration</p>
                  <p className="text-lg font-black tracking-tight">
                    {nearRealm ? nearRealm.label : "Anneaux du Verse — approche pour déplier la chambre"}
                  </p>
                  {nearRealm && (
                    <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-emerald-200/90">
                      <DoorOpen className="h-4 w-4 shrink-0" />
                      <span>
                        <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">E</kbd> ou{" "}
                        <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">Entrée</kbd> — passage vers l’interface ciblée
                      </span>
                    </p>
                  )}
                </div>
                <WorldLorePanel realm={nearRealm} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <VerseGrimoire open={grimoireOpen} onOpenChange={setGrimoireOpen} highlightSlug={nearRealm?.slug ?? null} />

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="max-w-lg border-emerald-500/20 bg-zinc-950 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-200">
              <CircleHelp className="h-5 w-5" />
              Verse 3D — contrôles & progression
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Rappel rapide. Le manuel complet est disponible dans l’app via <code className="rounded bg-zinc-900 px-1">/manuel</code>.
              Ouvre le <span className="text-emerald-300/90">Codex du Verse</span> (bouton grimoire) pour les cartes-portails style TGC.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Contrôles</p>
              <ul className="mt-3 space-y-2 text-sm">
                {controls.map((c) => (
                  <li key={c.k} className="flex items-start justify-between gap-3">
                    <span className="shrink-0 rounded bg-white/10 px-2 py-0.5 font-mono text-xs text-white/90">{c.k}</span>
                    <span className="text-white/80">{c.d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Progression</p>
              <p className="mt-2 text-sm text-white/80">
                Visites enregistrées : <span className="font-semibold text-emerald-200">{visitedCount}</span> /{" "}
                <span className="font-semibold">{REALM_COUNT}</span>. La position est sauvegardée en session.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
