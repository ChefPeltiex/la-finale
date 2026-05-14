import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skull, Sparkles, RotateCcw, AlertTriangle } from "lucide-react";
import { recordRealmVisit } from "@/lib/worldPersistence";
import ThreeRealmsNav from "@/components/ThreeRealmsNav";

const CONSENT_KEY = "egor69:outworld:fictionConsent:v1";

const VILLAIN_VENTS = [
  "Ça va, c'était juste une cascade CSS et trois sprites nerveux.",
  "Le Chaos™, déposé comme une marque de yaourt cosmique.",
  "Je joue au tyran pixel parce que dehors je trie mes biodéchetés.",
  "Personne n'a été blessé — même mes shaders ont signé une charte.",
  "C'est le miroir d'un Ether ludique : même BPM, autre punchline.",
  "Mon ambition mondiale s'arrête au rayon popcorn du salon.",
];

const PHASES = [
  { label: "Farce primordiale", emoji: "🎭", hue: 320 },
  { label: "Crescendo carton", emoji: "📦", hue: 280 },
  { label: "Réconciliation forcée", emoji: "🤝", hue: 40 },
  { label: "Rappel à la réalité douce", emoji: "☕", hue: 200 },
];

/**
 * Zone ludique fictive : spectacle intense uniquement à l’écran.
 * Pas d’incitation à la violence, aux dangers réels ni aux extrémismes.
 */
export default function OutworldChaos() {
  const canvasRef = useRef(null);
  const [accepted, setAccepted] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(CONSENT_KEY) === "1";
  });
  const [chaos, setChaos] = useState(12);
  const [ventIndex, setVentIndex] = useState(0);
  const [mirror, setMirror] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!accepted) return;
    recordRealmVisit("outworld");
    const id = setInterval(() => setPhase((p) => (p + 1) % PHASES.length), 4000);
    return () => clearInterval(id);
  }, [accepted]);

  useEffect(() => {
    if (!accepted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const draw = () => {
      t += mirror ? -0.014 : 0.018;
      const w = canvas.width;
      const h = canvas.height;
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h));
      const pulse = 0.35 + Math.sin(t * 2.2) * 0.08;
      g.addColorStop(0, `rgba(${120 + chaos}, ${20 + chaos / 3}, ${60 + chaos}, ${pulse})`);
      g.addColorStop(1, "rgba(8, 0, 18, 0.94)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 7; i++) {
        const x = (w / 8) * (i + 1) + Math.sin(t + i * 1.7) * 40 * (chaos / 100);
        const y = h * 0.35 + Math.cos(t * 0.8 + i) * (80 + chaos * 0.6);
        ctx.save();
        ctx.globalAlpha = 0.15 + (chaos / 300);
        ctx.strokeStyle = `hsl(${(PHASES[phase].hue + i * 22) % 360}, 85%, 55%)`;
        ctx.lineWidth = 2 + (chaos % 40) / 25;
        ctx.beginPath();
        ctx.arc(x, y, 20 + Math.sin(t * 3 + i) * 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [accepted, chaos, mirror, phase]);

  const acceptFiction = useCallback(() => {
    sessionStorage.setItem(CONSENT_KEY, "1");
    setAccepted(true);
  }, []);

  const pumpChaos = () => {
    setChaos((c) => Math.min(100, c + 9 + Math.floor(Math.random() * 8)));
    setVentIndex((i) => (i + 1) % VILLAIN_VENTS.length);
  };

  const calmDown = () => {
    setChaos(0);
    setVentIndex(0);
  };

  const cur = PHASES[phase];

  if (!accepted) {
    return (
      <div className="min-h-screen bg-[#0a0214] text-white flex items-center justify-center px-4 py-16">
        <div className="max-w-lg rounded-2xl border border-red-500/30 bg-black/70 backdrop-blur-xl p-8 shadow-[0_0_60px_rgba(220,50,80,0.15)]">
          <div className="flex items-center gap-2 text-amber-400 mb-4">
            <AlertTriangle className="h-6 w-6 shrink-0" />
            <span className="font-display font-bold text-lg">Outworld — cadre fictionnel</span>
          </div>
          <p className="text-white/80 text-sm leading-relaxed mb-4">
            Cette page est un <strong>carnaval numérique</strong> : sensations fortes uniquement à l’écran,
            pour rire, partager le plaisir du jeu et « sortir le méchant » en pixels — dans un esprit
            d&apos;entraide avec soi-même et les autres utilisateurs, sans humiliation réelle.
            Aucune violence concrète, aucune incitation au danger, aucune personne ciblée : tout est symbolique
            et réversible d’un clic ; la lourdeur du jour peut s&apos;y diluer sans nuire à qui que ce soit dehors.
          </p>
          <p className="text-white/55 text-xs mb-6">
            Si vous êtes en détresse psychologique ou en risque pour vous ou autrui, contactez un professionnel
            de santé, les urgences ou une ligne d’écoute — cet espace ludique ne remplace aucun soin ni aucune
            intervention de sécurité.
          </p>
          <Button
            onClick={acceptFiction}
            className="w-full rounded-xl bg-gradient-to-r from-red-700 to-orange-600 font-bold"
          >
            J’ai lu — entrer dans la zone chaos (fiction)
          </Button>
          <Button asChild variant="ghost" className="w-full mt-2 text-white/60">
            <Link to="/netherealm">← Retour au plan neutre (Netherealm)</Link>
          </Button>
          <div className="mt-6">
            <ThreeRealmsNav currentSlug="outworld" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden relative text-white">
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

      <div
        className="fixed top-0 left-0 right-0 z-30 px-3 py-2 text-[11px] sm:text-xs text-center bg-black/75 border-b border-white/10 backdrop-blur-md"
        role="note"
      >
        <strong>Fiction</strong> · chaos virtuel · réinitialisable · pas de harm IRL ·{" "}
        <Link to="/charte" className="underline text-cyan-300/90">
          charte
        </Link>
      </div>

      <div className="relative z-10 min-h-screen pt-14 pb-16 px-4 flex flex-col items-center justify-center">
        <Badge className="mb-4 bg-red-950/90 text-red-200 border border-red-500/40 font-mono tracking-wider">
          OUTWORLD · miroir ludique
        </Badge>

        <h1
          className="font-display text-5xl sm:text-7xl font-black mb-2 text-center drop-shadow-[0_0_24px_rgba(255,80,120,0.5)]"
          style={{
            transform: mirror ? "scaleX(-1)" : "none",
            filter: `hue-rotate(${chaos * 1.2}deg)`,
          }}
        >
          Chaos maîtrisé
        </h1>
        <p className="text-white/50 text-sm max-w-md text-center mb-8">
          Copie conforme du <em>rythme</em> d’un royaume éthéré — mais en farce. Tu montes le spectacle, tu descends le drama,
          tu transformes la tension en couleur pour revenir au don, à l&apos;échange et au sourire.
        </p>

        <div className="flex items-center gap-3 mb-10">
          <span className="text-5xl animate-pulse">{cur.emoji}</span>
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest">Phase spectacle</p>
            <p className="font-display text-xl" style={{ color: `hsl(${cur.hue},90%,65%)` }}>
              {cur.label}
            </p>
          </div>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-white/15 bg-black/50 backdrop-blur-md p-6 mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-white/50 flex items-center gap-1">
              <Skull className="h-4 w-4" /> Chaos pixel (0–100)
            </span>
            <span className="font-mono text-red-300">{chaos}</span>
          </div>
          <div className="h-3 rounded-full bg-black/60 overflow-hidden border border-white/10">
            <div
              className="h-full rounded-full transition-[width] duration-300 bg-gradient-to-r from-orange-600 via-red-500 to-fuchsia-600"
              style={{ width: `${chaos}%` }}
            />
          </div>
          <p className="mt-4 text-sm text-white/70 italic min-h-[3.5rem]">
            « {VILLAIN_VENTS[ventIndex]} »
          </p>

          <div className="flex flex-wrap gap-2 mt-6">
            <Button
              type="button"
              onClick={pumpChaos}
              className="rounded-xl flex-1 min-w-[140px] bg-gradient-to-br from-red-600 to-purple-700 font-bold"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Ventriloque du méchant
            </Button>
            <Button type="button" variant="outline" onClick={calmDown} className="rounded-xl border-emerald-500/40 text-emerald-200">
              <RotateCcw className="h-4 w-4 mr-2" />
              Tout neutraliser
            </Button>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => setMirror((m) => !m)} className="w-full mt-3 text-white/50">
            Miroir inversé : {mirror ? "activé" : "off"}
          </Button>
        </div>

        <div className="w-full max-w-xl mx-auto mb-8">
          <ThreeRealmsNav currentSlug="outworld" />
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Button asChild variant="outline" className="rounded-xl border-emerald-500/35 text-emerald-100">
            <Link to="/etherealm">Plan lumineux · Etherealm</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl border-cyan-500/40 text-cyan-100">
            <Link to="/netherealm">Plan neutre · Netherealm</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl border-white/20">
            <Link to="/world">Ether-Verse (3D)</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl border-white/20">
            <Link to="/">Accueil</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
