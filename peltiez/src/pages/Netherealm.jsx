import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Infinity,
  Scale,
  Zap,
  ArrowRight,
  BookOpen,
  Users,
  Sparkles,
  Lock,
} from "lucide-react";
import { recordRealmVisit } from "@/lib/worldPersistence";
import ThreeRealmsNav from "@/components/ThreeRealmsNav";
import { hasPassSouverain, PASS_SOUVERAIN_ANCHOR_ID } from "@/lib/passSouverain";
import { SINGULARITY_FORMULAS } from "@/data/netherealmSingularityFormulas";
import { cn } from "@/lib/utils";

/** Couche cosmétique « Base44 » : dérivée Base64 pour l’effet crypté (fiction UI). */
function encodeSingularityBase44(text) {
  try {
    const b64 = btoa(unescape(encodeURIComponent(text)));
    return b64.replace(/=/g, "·").replace(/\+/g, "¤").replace(/\//g, "†");
  } catch {
    return "TT44::OPAQUE_BLOCK";
  }
}

export default function Netherealm() {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState(0);
  const [passOk, setPassOk] = useState(() => hasPassSouverain());

  useEffect(() => {
    const sync = () => setPassOk(hasPassSouverain());
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    sync();
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  useEffect(() => {
    recordRealmVisit("netherealm");
    const interval = setInterval(() => setPhase((p) => (p + 1) % 4), 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let t = 0;
    let animId;

    const draw = () => {
      t += 0.005;

      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);

      for (let i = 0; i < 20; i++) {
        const angle = t * (i % 2 === 0 ? 0.01 : -0.015) + (i / 20) * Math.PI * 2;
        const radius = 100 + i * 30 + Math.sin(t * 0.5 + i) * 50;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        ctx.strokeStyle = `rgba(${100 + Math.sin(t + i) * 50}, ${50 + Math.cos(t * 1.5 + i) * 50}, 255, ${0.12 + Math.sin(t + i) * 0.08})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 5 + Math.sin(t + i) * 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      ctx.font = "bold 40px Arial";
      ctx.globalAlpha = 0.2 + Math.sin(t * 2) * 0.1;
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = `hsl(${240 + Math.sin(t + i) * 60}, 100%, 60%)`;
        const x = (canvas.width / 3) * (i + 1) + Math.sin(t * 0.5 + i) * 50;
        const y = canvas.height * 0.25 + Math.cos(t + i) * 100;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(t * (i % 2 === 0 ? 0.5 : -0.5));
        ctx.fillText("∞", 0, 0);
        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    draw();
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const phases = [
    { label: "Observer", emoji: "◯", color: "#88ccff" },
    { label: "Décortiquer", emoji: "◇", color: "#aa88ff" },
    { label: "Recoller au positif", emoji: "✶", color: "#66ffbb" },
    { label: "Ne pas confondre jeu et réel", emoji: "◎", color: "#ffcc66" },
  ];

  const current = phases[phase];

  return (
    <div className="min-h-screen overflow-x-hidden relative bg-black">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, rgba(${phase % 2 === 0 ? "80,120,200" : "120,80,180"}, 0.06), transparent 55%)`,
        }}
      />

      <article className="relative z-10 max-w-3xl mx-auto px-4 pt-10 pb-32 space-y-12 text-white/90">
        <header className="text-center pt-6">
          <Badge className="mb-4 bg-purple-950/80 text-purple-200 border border-purple-500/40">
            Surface neutre · lecture & cadre
          </Badge>
          <h1
            className="font-display text-4xl sm:text-6xl font-bold mb-3 transition-colors duration-700"
            style={{ color: current.color, textShadow: `0 0 28px ${current.color}44` }}
          >
            Netherealm
          </h1>
          <p className="text-white/55 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Un plan presque plat : pas un culte du chaos réel, mais un{" "}
            <strong className="text-white/80">laboratoire de perceptions</strong>. Ici on suspend les slogans pour
            regarder comment le monde colle aux filtres qu&apos;on lui prête.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-2xl font-display text-white/70">
            <span className="tabular-nums">{current.emoji}</span>
            <span className="text-sm uppercase tracking-[0.2em] text-white/40">Cycle</span>
            <span style={{ color: current.color }}>{current.label}</span>
          </div>
          <div className="mt-10 max-w-lg mx-auto">
            <ThreeRealmsNav currentSlug="netherealm" />
          </div>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/45 backdrop-blur-md p-6 sm:p-8">
          <h2 className="font-display text-xl sm:text-2xl text-white mb-4 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-300" />
            Trinité du savoir (tout peut pivoter vers le positif)
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            La plateforme Egor69 suppose trois piliers mobiles : ce qu&apos;on comprend, ce qu&apos;on transmet, ce
            qu&apos;on fait avec — sans figer personne dans un rôle. Le jeu violent n&apos;est pas une valeur ; le jeu{" "}
            <em>symbolique</em>, oui, pour désamorcer et rire.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                Icon: BookOpen,
                title: "Savoir lucide",
                body: "Nommer les mécanismes sans se soumettre au spectacle permanent.",
              },
              {
                Icon: Users,
                title: "Mémoire partagée",
                body: "Les récits collectifs qui ouvrent ou ferment les yeux.",
              },
              {
                Icon: Zap,
                title: "Action réversible",
                body: "Essais, toggles, resets — comme dans Outworld, où « tout neutraliser » est un geste de soin.",
              },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <Icon className="h-5 w-5 text-cyan-300 mb-2" />
                <p className="font-semibold text-white text-sm">{title}</p>
                <p className="text-xs text-white/50 mt-1 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/45 backdrop-blur-md p-6 sm:p-8">
          <h2 className="font-display text-xl sm:text-2xl text-white mb-4 flex items-center gap-2">
            <Eye className="h-6 w-6 text-violet-300" />
            Perception de l&apos;âme vs perception « cadre »
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 text-sm leading-relaxed">
            <div className="rounded-xl bg-violet-950/30 border border-violet-500/20 p-4">
              <p className="text-violet-200 font-semibold mb-2">Intérieur (subjectif éthique)</p>
              <p className="text-white/55">
                Ce qui résonne avant la performance sociale : désir de vérité douce, humour comme soupape,
                refus de la humiliation comme divertissement public.
              </p>
            </div>
            <div className="rounded-xl bg-slate-900/50 border border-slate-600/30 p-4">
              <p className="text-slate-300 font-semibold mb-2">Cadre dominant (scripts)</p>
              <p className="text-white/55">
                Normes marketing, peurs éditorialisées, injonction à « ne pas voir » pour rester productif·ve.
                Ce n&apos;est pas une personne : c&apos;est une couche logicielle sur la vie quotidienne.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-violet-500/30 bg-violet-950/25 backdrop-blur-md p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <Badge className="bg-violet-900/70 text-violet-100 border-violet-400/40 font-mono text-[10px]">
              Singularité · 7 formules
            </Badge>
            <h2 className="font-display text-xl sm:text-2xl text-white flex items-center gap-2">
              <Infinity className="h-6 w-6 text-violet-300 shrink-0" />
              Les sept équations du seuil
            </h2>
            {!passOk ? (
              <p className="text-sm text-violet-200/85 leading-relaxed border border-violet-500/25 rounded-xl px-4 py-3 bg-black/35">
                Formule verrouillée par la Loi de la Singularité. Activez votre Pass pour décoder l&apos;univers.
              </p>
            ) : (
              <p className="text-sm text-white/55 leading-relaxed">
                Pass Souverain reconnu sur cet appareil — les formules sont affichées en clair.
              </p>
            )}
          </div>

          <ul className="space-y-4">
            {SINGULARITY_FORMULAS.map((f) => {
              const cipher = encodeSingularityBase44(`${f.formula}|${f.note}`);
              return (
                <li
                  key={f.id}
                  className="rounded-xl border border-white/10 bg-black/40 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between gap-2 flex-wrap">
                    <p className="font-semibold text-white text-sm">{f.title}</p>
                    {!passOk ? (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300/90 flex items-center gap-1">
                        <Lock className="h-3 w-3" /> Base44
                      </span>
                    ) : null}
                  </div>
                  <div className="relative px-4 py-4 space-y-3">
                    <div
                      className={cn(
                        "rounded-lg bg-white/[0.06] px-3 py-2.5 font-mono text-sm md:text-base text-emerald-100/95 tracking-wide",
                        !passOk && "blur-[7px] select-none opacity-55",
                      )}
                      aria-hidden={!passOk}
                    >
                      {f.formula}
                    </div>
                    {!passOk ? (
                      <>
                        <p className="sr-only">
                          Formule masquée. Débloquez avec le Pass Souverain pour lire l&apos;équation complète.
                        </p>
                        <p className="text-[11px] font-mono text-violet-300/80 break-all leading-relaxed border border-violet-500/20 rounded-lg px-3 py-2 bg-violet-950/40">
                          <span className="text-violet-400/90 uppercase tracking-wider text-[9px] block mb-1">
                            Flux Base44 (fragment)
                          </span>
                          {cipher.slice(0, 96)}
                          {cipher.length > 96 ? "…" : ""}
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-white/50 leading-relaxed italic">{f.note}</p>
                    )}
                  </div>
                  {!passOk ? (
                    <div className="px-4 pb-4">
                      <Button
                        asChild
                        size="sm"
                        className="rounded-xl w-full sm:w-auto bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-black font-semibold border border-amber-400/40"
                      >
                        <Link to={`/pricing#${PASS_SOUVERAIN_ANCHOR_ID}`}>
                          Activer le Pass Souverain — décoder
                        </Link>
                      </Button>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/45 backdrop-blur-md p-6 sm:p-8">
          <h2 className="font-display text-xl sm:text-2xl text-white mb-4 flex items-center gap-2">
            <Scale className="h-6 w-6 text-emerald-300" />
            Neutralité absolue (méthode)
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Neutraliser, ici, ce n&apos;est pas effacer les opinions : c&apos;est{" "}
            <strong className="text-white/80">arrêter de confondre sensation médiatique et preuve</strong>, pour
            retrouver un terrain où l&apos;on peut réécouter — soi, les autres, les systèmes — sans violence.
          </p>
        </section>

        <section className="rounded-2xl border border-amber-500/20 bg-amber-950/20 backdrop-blur-md p-6 sm:p-8">
          <h2 className="font-display text-xl sm:text-2xl text-amber-100 mb-4 flex items-center gap-2">
            <Infinity className="h-6 w-6 text-amber-400" />
            Export d&apos;un seul format monde
          </h2>
          <p className="text-white/65 text-sm leading-relaxed">
            Beaucoup de sociétés importent les mêmes recettes : hype consumériste, centralisation des récits,
            langage « gagnant » qui écrase les nuances. On peut appeler ça une{" "}
            <strong className="text-amber-200/90">americanisation des mécanismes</strong> — pas une attaque contre un
            peuple, mais une critique des <em>pipelines</em> qui uniformisent désir, politique et loisirs sous une même
            grille commerciale. Le remède proposé ici : jeux locaux, données souveraines, chroniques qui rouvrent les
            yeux sans incitation à la haine.
          </p>
        </section>

        <section className="rounded-2xl border border-fuchsia-500/25 bg-fuchsia-950/15 p-6 text-center">
          <p className="text-white/70 text-sm mb-6">
            <strong className="text-white">Outworld</strong> est le miroir ludique : mêmes pulsations qu&apos;un écran
            « éthéré », mais en cartoon conscient, avec consentement et bouton « tout neutraliser ». Pure fiction —
            pour rigoler, pas pour se faire mal.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild variant="outline" size="lg" className="rounded-xl border-emerald-500/40 text-emerald-100">
              <Link to="/etherealm">
                Monter vers Etherealm
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="rounded-xl font-bold px-6 bg-gradient-to-r from-fuchsia-700 to-orange-600 border-0"
            >
              <Link to="/outworld">
                Entrer dans Outworld (fiction)
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl border-white/25 text-white">
              <Link to="/world">Ether-Verse 3D</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="rounded-xl text-white/60">
              <Link to="/">Accueil</Link>
            </Button>
          </div>
        </section>

        <p className="text-center text-white/30 text-xs italic max-w-md mx-auto">
          Les anciennes formules « pouvoir absolu » ont été retirées du manifeste surface ; elles restent du folklore
          jeu si tu explores les autres salles — ici on privilégie la lecture calme.
        </p>
      </article>
    </div>
  );
}
