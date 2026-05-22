import { useMemo, useRef, useState, useEffect, lazy, Suspense } from "react";
import useTouchDevice from "@/hooks/useTouchDevice";
import { buildVerseControlsHelp } from "@/lib/verseControlsHelp";
import { useNavigate, Link } from "react-router-dom";

const WorldScene = lazy(() => import("@/world/WorldScene"));
import SEOMeta from "@/components/SEOMeta";
import { Sparkles, MousePointer2, DoorOpen, ChevronLeft, Trophy, Gem, CircleHelp, BookOpen, Compass } from "lucide-react";
import { loadCheckpoint, recordRealmVisit, getVisitedRealmCount, getVisitedRealmSlugs } from "@/lib/worldPersistence";
import { REALM_COUNT } from "@/world/realms";
import { SITE_ORIGIN, WORLD_ETHOS } from "@/lib/site";
import WorldMinimap from "@/components/world/WorldMinimap";
import WorldLorePanel from "@/components/world/WorldLorePanel";
import VerseGrimoire from "@/components/world/VerseGrimoire";
import { loadUniversePreferences } from "@/lib/universePreferences";
import { useWorldKeyboard } from "@/components/world/CosmicNavControls";
import { COSMIC_NAV_V2, VERSE_STYLE } from "@/config/cosmicNav";
import { findNearestUnvisitedRealm, getArcSegmentProgress } from "@/lib/verseHud";
import {
  getVerseAudioEngine,
  getRealmFrequencyProfile,
  isVerseAudioEnabled,
  setVerseAudioEnabled,
} from "@/lib/verseAudio";
import { formatRealmFrequencyBadge } from "@/lib/realmFrequency";
import VerseMaitre from "@/components/world/VerseMaitre";
import WorldHubBoutiqueBanner from "@/components/world/WorldHubBoutiqueBanner";
import SymbolicDisclaimer from "@/components/ui/SymbolicDisclaimer";
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
  const [portalFocus, setPortalFocus] = useState(false);
  const [hudTick, setHudTick] = useState(0);
  const [audioOn, setAudioOn] = useState(() => isVerseAudioEnabled());
  const [profileId, setProfileId] = useState("earth");
  const [maitrePulse, setMaitrePulse] = useState(false);
  const [traversePulse, setTraversePulse] = useState(null);
  const lastNearSlugRef = useRef(null);
  const navigate = useNavigate();

  const visitedSlugs = useMemo(() => getVisitedRealmSlugs(), [visitedCount, hudTick]);
  const arc = useMemo(() => getArcSegmentProgress(visitedCount, REALM_COUNT), [visitedCount]);
  const nextRing = useMemo(() => {
    const t = playerTelemetryRef.current;
    return findNearestUnvisitedRealm(t?.x, t?.z, visitedSlugs);
  }, [visitedSlugs, nearRealm, hudTick]);

  const touchDevice = useTouchDevice();
  const controls = useMemo(() => buildVerseControlsHelp(touchDevice), [touchDevice]);

  useWorldKeyboard(keysRef);

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
    const id = window.setInterval(() => setHudTick((n) => n + 1), 900);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onAudioChange = (ev) => setAudioOn(!!ev.detail?.enabled);
    window.addEventListener("egor69-verse-audio-change", onAudioChange);
    return () => window.removeEventListener("egor69-verse-audio-change", onAudioChange);
  }, []);

  useEffect(() => {
    return () => {
      getVerseAudioEngine().stop();
    };
  }, []);

  useEffect(() => {
    if (!audioOn) return;
    const pid = getRealmFrequencyProfile(nearRealm);
    setProfileId(pid);
    const engine = getVerseAudioEngine();
    void engine.crossfadeTo(pid);
  }, [nearRealm?.slug, audioOn]);

  useEffect(() => {
    const slug = nearRealm?.slug ?? null;
    if (slug === lastNearSlugRef.current) return;
    lastNearSlugRef.current = slug;
    if (!slug) return;
    setPortalFocus(true);
    setMaitrePulse(true);
    if (audioOn) void getVerseAudioEngine().playPortalChime(getRealmFrequencyProfile(nearRealm));
    const tFocus = window.setTimeout(() => setPortalFocus(false), VERSE_STYLE.portalFocusMs);
    const tMaitre = window.setTimeout(() => setMaitrePulse(false), VERSE_STYLE.portalFocusMs);
    return () => {
      window.clearTimeout(tFocus);
      window.clearTimeout(tMaitre);
    };
  }, [nearRealm?.slug, audioOn]);

  const toggleVerseAudio = async () => {
    const next = !audioOn;
    setVerseAudioEnabled(next);
    setAudioOn(next);
    const engine = getVerseAudioEngine();
    if (next) {
      const pid = getRealmFrequencyProfile(nearRealm);
      setProfileId(pid);
      await engine.start(pid);
    } else {
      engine.stop();
    }
  };

  useEffect(() => {
    const onPortalKey = (e) => {
      if ((e.code === "Enter" || e.code === "KeyE") && nearRealm) {
        e.preventDefault();
        setTraversePulse({ slug: nearRealm.slug, at: performance.now() });
        recordRealmVisit(nearRealm.slug);
        setVisitedCount(getVisitedRealmCount());
        window.setTimeout(() => navigate(nearRealm.path), VERSE_STYLE.portalTraverseMs * 0.55);
      }
    };
    window.addEventListener("keydown", onPortalKey);
    return () => window.removeEventListener("keydown", onPortalKey);
  }, [nearRealm, navigate]);

  const hudAccent = COSMIC_NAV_V2 ? "text-amber-200/90" : "text-emerald-300/90";
  const nearAccent = COSMIC_NAV_V2
    ? "border-amber-400/45 shadow-[0_0_40px_rgba(251,191,36,0.2)]"
    : "border-emerald-400/50 shadow-[0_0_40px_rgba(52,211,153,0.25)]";

  return (
    <div className="fixed inset-0 z-[200] bg-[#01040f] text-white pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
      {COSMIC_NAV_V2 ? (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[210] h-[5vh] min-h-[28px] bg-gradient-to-b from-black/85 to-transparent" aria-hidden />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[210] h-[6vh] min-h-[32px] bg-gradient-to-t from-black/80 to-transparent" aria-hidden />
        </>
      ) : null}
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
              <div className="h-9 w-9 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
              <p className="text-sm font-medium tracking-wide">Chargement 3D…</p>
            </div>
          }
        >
          <WorldScene
            keysRef={keysRef}
            onProximityChange={setNearRealm}
            initialCheckpoint={checkpoint}
            playerTelemetryRef={playerTelemetryRef}
            traversePulse={traversePulse}
          />
        </Suspense>
      </div>

      <div className={`transition-opacity duration-500 ${portalFocus ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <WorldMinimap telemetryRef={playerTelemetryRef} visitedSlugs={visitedSlugs} nearRealm={nearRealm} />
      </div>

      {nearRealm && COSMIC_NAV_V2 ? (
        <p
          className="pointer-events-none absolute bottom-[18%] left-1/2 z-[215] -translate-x-1/2 rounded-full border border-amber-400/35 bg-black/55 px-4 py-1.5 text-xs font-semibold tracking-wide text-amber-100/90 backdrop-blur-md"
          aria-live="polite"
        >
          <kbd className="font-mono text-amber-300">E</kbd> · franchir le portail
        </p>
      ) : null}

      <div
        className={`absolute left-2 sm:left-4 bottom-[max(6rem,18%)] z-[220] transition-opacity duration-500 sm:bottom-6 max-w-[min(100%,20rem)] ${
          portalFocus ? "opacity-90" : "opacity-100"
        }`}
      >
        <VerseMaitre
          nearRealm={nearRealm}
          nextRing={nextRing}
          profileId={profileId}
          audioEnabled={audioOn}
          onToggleAudio={toggleVerseAudio}
          portalPulse={maitrePulse}
        />
        <SymbolicDisclaimer variant="frequency" compact className="mt-2 max-w-[20rem]" />
      </div>

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 sm:p-6">
        <div
          className={`pointer-events-auto flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-start justify-between gap-2 sm:gap-3 transition-opacity duration-500 max-h-[42vh] sm:max-h-none overflow-y-auto sm:overflow-visible overscroll-contain ${
            portalFocus ? "opacity-0" : "opacity-100"
          }`}
        >
          <div
            className={`rounded-2xl border px-3 sm:px-4 py-3 backdrop-blur-xl w-full sm:max-w-md shrink-0 ${
              COSMIC_NAV_V2 ? "border-indigo-400/20" : "border-white/10"
            }`}
            style={{
              background: COSMIC_NAV_V2
                ? "linear-gradient(135deg, rgba(251,191,36,0.1), rgba(99,102,241,0.12))"
                : "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(99,102,241,0.08))",
            }}
          >
            <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] ${hudAccent}`}>
              <Sparkles className="h-4 w-4" />
              {COSMIC_NAV_V2 ? "Verse · voyage cinéma" : "Verse spatial Egor69"}
            </div>

            {COSMIC_NAV_V2 && nextRing ? (
              <div className="mt-2 rounded-xl border border-amber-400/35 bg-black/40 px-3 py-2">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-violet-200/80">
                  <Compass className="h-3 w-3 shrink-0" /> Prochain anneau
                </p>
                <p className="text-sm font-semibold text-white leading-snug">{nextRing.label}</p>
                {nextRing.ritualHint ? (
                  <p className="mt-1 text-[11px] text-white/65 italic leading-snug">{nextRing.ritualHint}</p>
                ) : null}
              </div>
            ) : null}

            {COSMIC_NAV_V2 ? (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                <span className="rounded-full border border-indigo-400/40 bg-indigo-950/50 px-2.5 py-0.5 text-violet-200">
                  Anneau {arc.segment}/{arc.segments}
                </span>
                <span className="text-white/55">
                  {visitedCount}/{REALM_COUNT} salles
                </span>
              </div>
            ) : null}

            {universePrefs.gameplayUniverse?.name?.trim() ? (
              <div className="mt-2 rounded-xl border border-violet-400/30 bg-black/30 px-3 py-2">
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

            <WorldHubBoutiqueBanner className="mt-3 max-w-md" />

            <p className="mt-2 text-sm text-white/80 leading-snug">
              {COSMIC_NAV_V2
                ? "Dérive lente · anneaux du Verse · regard vers l’horizon avant chaque seuil · "
                : "Open world · "}
              clic canvas · <span className="text-white font-semibold">W A S D</span> ·{" "}
              <span className={COSMIC_NAV_V2 ? "text-amber-300" : "text-emerald-300"}>Shift</span> sprint ·{" "}
              <span className="text-sky-300">Espace</span> saut / glisse ·{" "}
              <span className="text-amber-300">E</span> portail
            </p>
            <p className={`mt-2 flex items-center gap-2 text-xs font-semibold ${COSMIC_NAV_V2 ? "text-violet-200/90" : "text-cyan-300/90"}`}>
              <Trophy className="h-3.5 w-3.5 shrink-0" />
              Progression : {visitedCount} / {REALM_COUNT} salles · localStorage par portail
            </p>
            {!COSMIC_NAV_V2 ? (
              <ul className="mt-3 space-y-1.5 text-[10px] leading-snug text-white/55 border-t border-white/10 pt-3">
                {WORLD_ETHOS.charter.slice(0, 3).map((line) => (
                  <li key={line.slice(0, 24)} className="flex gap-2">
                    <span className="text-emerald-500/90 shrink-0">◆</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {COSMIC_NAV_V2 ? (
              <Link
                to="/boutique?product=pass-explorateur-verse"
                className="mt-2 block rounded-xl border border-emerald-500/35 bg-emerald-950/40 px-3 py-2 text-[11px] font-semibold text-emerald-200/95 hover:bg-emerald-900/50 transition-colors pointer-events-auto"
              >
                Soutenir le Verse · boutique & passes →
              </Link>
            ) : null}
          </div>

          <Link
            to="/boutique"
            className={`pointer-events-auto inline-flex items-center gap-2 rounded-xl border border-emerald-500/35 bg-emerald-950/60 px-4 py-2.5 text-sm font-semibold text-emerald-100 backdrop-blur-md hover:bg-emerald-900/50 transition-colors ${
              COSMIC_NAV_V2 ? "hover:border-amber-400/40" : "hover:border-emerald-400/60"
            }`}
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            Soutenir le Verse
          </Link>

          <Link
            to="/"
            className={`pointer-events-auto inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/50 px-4 py-2.5 text-sm font-semibold text-white/90 backdrop-blur-md hover:bg-white/10 transition-colors ${
              COSMIC_NAV_V2 ? "hover:border-amber-400/40" : "hover:border-emerald-400/40"
            }`}
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
            className={`pointer-events-auto border-white/15 bg-black/50 text-white/90 backdrop-blur-md hover:bg-white/10 ${
              COSMIC_NAV_V2 ? "hover:border-amber-400/40" : "hover:border-emerald-400/40"
            }`}
            onClick={() => setHelpOpen(true)}
          >
            <CircleHelp className="h-4 w-4" />
            Aide
          </Button>
        </div>

        <div className="pointer-events-none flex justify-center pb-4 px-2">
          <div
            className={`rounded-2xl border px-4 sm:px-6 py-4 backdrop-blur-xl transition-all duration-300 max-h-[52vh] overflow-y-auto ${
              nearRealm ? `${nearAccent} scale-[1.02]` : "border-white/10 opacity-80"
            }`}
            style={{
              background: nearRealm
                ? COSMIC_NAV_V2
                  ? "linear-gradient(135deg, rgba(251,191,36,0.18), rgba(99,102,241,0.14))"
                  : "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(59,130,246,0.12))"
                : "linear-gradient(135deg, rgba(0,0,0,0.55), rgba(15,23,42,0.5))",
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 w-full max-w-4xl mx-auto">
              <MousePointer2
                className={`h-6 w-6 shrink-0 mt-1 ${nearRealm ? (COSMIC_NAV_V2 ? "text-amber-400" : "text-emerald-400") : "text-white/40"}`}
              />
              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                    {portalFocus ? "Focus portail" : "Portail & narration"}
                  </p>
                  {nearRealm && formatRealmFrequencyBadge(nearRealm) ? (
                    <p
                      className={`mt-1 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${
                        COSMIC_NAV_V2
                          ? "border-amber-400/50 bg-amber-950/40 text-amber-100"
                          : "border-emerald-400/45 bg-emerald-950/35 text-emerald-100"
                      }`}
                    >
                      {formatRealmFrequencyBadge(nearRealm)}
                    </p>
                  ) : null}
                  <p className="text-lg font-black tracking-tight">
                    {nearRealm ? nearRealm.label : "Anneaux du Verse — approche pour déplier la chambre"}
                  </p>
                  {nearRealm?.ritualHint ? (
                    <p className="mt-2 text-sm text-amber-100/85 italic leading-snug">{nearRealm.ritualHint}</p>
                  ) : null}
                  {nearRealm && (
                    <p className={`mt-2 flex flex-wrap items-center gap-2 text-sm ${COSMIC_NAV_V2 ? "text-amber-200/90" : "text-emerald-200/90"}`}>
                      <DoorOpen className="h-4 w-4 shrink-0" />
                      <span>
                        <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">E</kbd> ou{" "}
                        <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">Entrée</kbd> — passage vers l’interface ciblée
                      </span>
                    </p>
                  )}
                </div>
                {!portalFocus ? <WorldLorePanel realm={nearRealm} /> : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <VerseGrimoire open={grimoireOpen} onOpenChange={setGrimoireOpen} highlightSlug={nearRealm?.slug ?? null} />

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className={`max-w-lg bg-zinc-950 text-zinc-100 ${COSMIC_NAV_V2 ? "border-amber-500/25" : "border-emerald-500/20"}`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${COSMIC_NAV_V2 ? "text-amber-200" : "text-emerald-200"}`}>
              <CircleHelp className="h-5 w-5" />
              Verse 3D — contrôles & progression
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Rappel rapide. Le manuel complet est disponible dans l’app via <code className="rounded bg-zinc-900 px-1">/manuel</code>.
              Ouvre le <span className={COSMIC_NAV_V2 ? "text-amber-300/90" : "text-emerald-300/90"}>Codex du Verse</span> pour les cartes-portails.
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
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Ambiance</p>
              <p className="mt-2 text-sm text-white/80">
                Son procédural : icône volume sur le Maître (coin bas-gauche). Préférence{" "}
                <code className="rounded bg-zinc-900 px-1">egor69_verse_audio</code> dans localStorage.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Progression</p>
              <p className="mt-2 text-sm text-white/80">
                Visites (localStorage) :{" "}
                <span className={`font-semibold ${COSMIC_NAV_V2 ? "text-amber-200" : "text-emerald-200"}`}>{visitedCount}</span> /{" "}
                <span className="font-semibold">{REALM_COUNT}</span>
                {COSMIC_NAV_V2 ? (
                  <>
                    {" "}
                    · arc <span className="font-semibold text-violet-200">Anneau {arc.segment}/{arc.segments}</span>
                  </>
                ) : null}
                . Position sauvegardée en session.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
