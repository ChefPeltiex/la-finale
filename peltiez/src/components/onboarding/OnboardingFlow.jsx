import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { X, ArrowRight, CheckCircle2, SkipForward, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  saveOnboarding,
  shouldShowOnboarding,
  ONBOARDING_KEY,
} from "@/lib/onboarding";
import { BRIDGE_TAGLINE } from "@/lib/geminiBridge";

const ROLES = [
  { id: "citoyen", label: "Citoyen·ne", desc: "Donner, échanger, découvrir le réseau." },
  { id: "artisan", label: "Artisan·e", desc: "Réparer, publier, servir la communauté." },
  { id: "explorateur", label: "Explorateur·rice", desc: "Atlas, savoirs, Verse 3D." },
];

const ACTIONS = [
  {
    id: "browse",
    title: "Parcourir le marketplace",
    desc: "Voir des annonces actives près de toi ou partout.",
    link: "/marketplace",
    cta: "Ouvrir le marketplace",
  },
  {
    id: "publish",
    title: "Publier ou offrir",
    desc: "Une annonce en ~2 minutes — photo, description, publier.",
    link: "/publier",
    cta: "Aller à Publier",
  },
  {
    id: "atlas",
    title: "Ouvrir l’Atlas",
    desc: "Fiches vivantes : faune, flore, savoirs, encyclopédies.",
    link: "/atlas",
    cta: "Explorer l’Atlas",
  },
];

export function openOnboardingReplay() {
  saveOnboarding({ completed: false, skipped: false, replay: true });
  window.dispatchEvent(new CustomEvent("egor69-onboarding-open"));
}

export default function OnboardingFlow() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState("role");
  const [role, setRole] = useState(null);
  const [doneActions, setDoneActions] = useState(() => new Set());

  const tryOpen = useCallback(() => {
    if (shouldShowOnboarding()) setOpen(true);
  }, []);

  useEffect(() => {
    tryOpen();
    const onOpen = () => {
      setPhase("role");
      setRole(null);
      setDoneActions(new Set());
      setOpen(true);
    };
    const onStorage = (ev) => {
      if (ev.key === ONBOARDING_KEY) tryOpen();
    };
    window.addEventListener("egor69-onboarding-open", onOpen);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("egor69-onboarding-open", onOpen);
      window.removeEventListener("storage", onStorage);
    };
  }, [tryOpen]);

  const finish = (skipped = false) => {
    saveOnboarding({
      completed: !skipped,
      skipped,
      role,
      completedAt: new Date().toISOString(),
      actionsDone: [...doneActions],
    });
    setOpen(false);
  };

  const toggleAction = (id) => {
    setDoneActions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="bg-card rounded-3xl border border-[#D4AF37]/40 max-w-lg w-full overflow-hidden shadow-2xl sovereign-border-glow"
        role="dialog"
        aria-labelledby="onboarding-title"
      >
        <div className="bg-gradient-to-r from-[#1a1200] via-zinc-950 to-[#0d1a0d] px-6 py-5 border-b border-[#D4AF37]/25 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#FFD700]/80 mb-1">
              Parcours initiatique · ~3 min
            </p>
            <p className="text-[11px] text-muted-foreground/90 mb-2 leading-snug">{BRIDGE_TAGLINE}</p>
            <h2 id="onboarding-title" className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#39FF14]" aria-hidden />
              {phase === "role" && "Choisis ton rôle"}
              {phase === "actions" && "Trois gestes simples"}
              {phase === "done" && "Bienvenue dans le réseau"}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => finish(true)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Passer le parcours"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {phase === "role" && (
            <>
              <p className="text-sm text-muted-foreground">
                Personnalise l’expérience — tu pourras tout revoir depuis ton profil.
              </p>
              <div className="space-y-2">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      role === r.id
                        ? "border-[#FFD700] bg-[#FFD700]/10"
                        : "border-border hover:border-[#D4AF37]/50"
                    }`}
                  >
                    <p className="font-semibold text-foreground">{r.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => finish(true)}>
                  <SkipForward className="h-4 w-4 mr-1" /> Passer
                </Button>
                <Button
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-zinc-950 font-bold hover:opacity-90"
                  disabled={!role}
                  onClick={() => setPhase("actions")}
                >
                  Continuer <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </>
          )}

          {phase === "actions" && (
            <>
              <p className="text-sm text-muted-foreground">
                Coche ou ouvre chaque lien — pas besoin de tout faire maintenant.
              </p>
              {ACTIONS.map((a) => (
                <div
                  key={a.id}
                  className={`p-4 rounded-xl border ${
                    doneActions.has(a.id) ? "border-[#39FF14]/50 bg-[#39FF14]/5" : "border-border"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggleAction(a.id)}
                      className={`mt-0.5 h-5 w-5 rounded border flex items-center justify-center shrink-0 ${
                        doneActions.has(a.id)
                          ? "bg-[#39FF14] border-[#39FF14] text-zinc-950"
                          : "border-muted-foreground/40"
                      }`}
                      aria-pressed={doneActions.has(a.id)}
                    >
                      {doneActions.has(a.id) ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">{a.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
                      <Button asChild variant="link" size="sm" className="h-auto p-0 mt-1 text-[#39FF14]">
                        <Link to={a.link} onClick={() => toggleAction(a.id)}>
                          {a.cta}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setPhase("role")}>
                  Retour
                </Button>
                <Button className="flex-1 rounded-xl sovereign-cta" onClick={() => setPhase("done")}>
                  Terminer le parcours
                </Button>
              </div>
            </>
          )}

          {phase === "done" && (
            <>
              <p className="text-sm text-foreground/90">
                {role === "artisan" && "Ton atelier est prêt — publie ta première réparation quand tu veux."}
                {role === "explorateur" && "L’Atlas et le Verse t’attendent — explore à ton rythme."}
                {(role === "citoyen" || !role) && "Tu fais partie du réseau vivant. Chaque geste compte."}
              </p>
              <Button className="w-full rounded-xl sovereign-cta" onClick={() => finish(false)}>
                Entrer sur Egor69 <CheckCircle2 className="h-4 w-4 ml-2" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
