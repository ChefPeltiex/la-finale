/**
 * GlobalNavCirculai
 * Barre de navigation horizontale persistante, sobre et municipale.
 * Apparaît sur toutes les routes principales CirculAI.
 * S'ajoute AU-DESSUS du contenu dans Layout, seulement quand proShell=true
 * (routes circulai, encyclopedie, boutique, nature-quebec).
 *
 * Refonte "plateforme vivante" :
 * - 4 liens par PROFIL (J'agis / Je contribue / Je décide / Je comprends)
 * - Egor69 en boussole discrète (pas un onglet — lien externe subtil)
 * - Ton URLs : aucune URL existante cassée
 */
import { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Recycle, HelpCircle, ArrowRight, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── 4 portes par profil (desktop) ────────────────────── */
const NAV_PROFILES = [
  { label: "J'agis",        to: "/seconde-main",           title: "Citoyen · Bénévole" },
  { label: "Je contribue",  to: "/boutique",               title: "OBNL · Artisan · Producteur" },
  { label: "Je décide",     to: "/circulai/hub",           title: "Élu · Fonctionnaire · Institution" },
  { label: "Je comprends",  to: "/encyclopedie",           title: "Curieux · Chercheur · Étudiant" },
];

/* ── Liens secondaires (utilitaires) ──────────────────── */
const NAV_UTILS = [
  { label: "Hub",     to: "/circulai/hub" },
  { label: "Nature",  to: "/portail/nature-quebec" },
  { label: "Aide",    to: "/aide" },
];

function isActive(linkTo, pathname) {
  if (linkTo === "/") return pathname === "/";
  return pathname === linkTo || pathname.startsWith(linkTo + "/");
}

export default function GlobalNavCirculai() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <nav
      aria-label="Navigation CirculAI"
      className="sticky top-0 z-30 bg-white/95 border-b border-border backdrop-blur-md shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">

          {/* Logo */}
          <Link
            to="/"
            onClick={close}
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-md"
          >
            <span className="h-7 w-7 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0">
              <Recycle className="h-4 w-4 text-white" aria-hidden />
            </span>
            <span className="font-bold text-sm text-foreground group-hover:text-emerald-700 transition-colors">
              CirculAI
            </span>
          </Link>

          {/* Desktop — 4 profils */}
          <ul className="hidden lg:flex items-center gap-0.5" role="list">
            {NAV_PROFILES.map(({ label, to, title }) => (
              <li key={to}>
                <Link
                  to={to}
                  title={title}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600",
                    isActive(to, location.pathname)
                      ? "bg-emerald-50 text-emerald-800 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                  aria-current={isActive(to, location.pathname) ? "page" : undefined}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop — Utilitaires + Egor69 boussole + démo CTA */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Liens utilitaires discrets */}
            {NAV_UTILS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600",
                  isActive(to, location.pathname)
                    ? "text-emerald-800 font-semibold"
                    : "text-muted-foreground/70 hover:text-muted-foreground hover:bg-muted/40"
                )}
              >
                {label}
              </Link>
            ))}

            {/* Séparateur */}
            <span className="h-4 w-px bg-border mx-1" aria-hidden />

            {/* Boussole Egor69 — discrète, externe */}
            <a
              href="https://egor69.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              title="Egor69 — boussole contemplative"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-muted-foreground/60 hover:text-stone-600 hover:bg-stone-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
            >
              <Compass className="h-3 w-3" aria-hidden />
              <span>Boussole</span>
            </a>

            {/* Séparateur */}
            <span className="h-4 w-px bg-border mx-1" aria-hidden />

            {/* CTA démo */}
            <Link
              to="/circulai/equation-pilote"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              Démo
              <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          </div>

          {/* Tablette (md) — liens condensés + aide + burger */}
          <div className="hidden md:flex lg:hidden items-center gap-1">
            <Link
              to="/circulai/hub"
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              Hub
            </Link>
            <Link
              to="/encyclopedie"
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              Encyclopédie
            </Link>
            <Link
              to="/circulai/equation-pilote"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
            >
              Démo <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          </div>

          {/* Aide + Mobile burger */}
          <div className="flex items-center gap-1 md:gap-2">
            <Link
              to="/aide"
              aria-label="Aide"
              className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              <HelpCircle className="h-4 w-4" aria-hidden />
            </Link>
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              className="lg:hidden h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / tablette dropdown ─────────────────────── */}
      {open && (
        <div className="lg:hidden border-t border-border bg-white shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {/* Section profils */}
            <p className="px-3 pb-1 pt-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Par profil
            </p>
            {NAV_PROFILES.map(({ label, to, title }) => (
              <Link
                key={to}
                to={to}
                onClick={close}
                title={title}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600",
                  isActive(to, location.pathname)
                    ? "bg-emerald-50 text-emerald-800 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
                aria-current={isActive(to, location.pathname) ? "page" : undefined}
              >
                {label}
                <span className="ml-2 text-[10px] text-muted-foreground/50 font-normal">{title}</span>
              </Link>
            ))}

            {/* Séparateur */}
            <div className="py-1">
              <div className="h-px bg-border" />
            </div>

            {/* Liens utilitaires */}
            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Explorer
            </p>
            {NAV_UTILS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                onClick={close}
                className="flex items-center px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                {label}
              </Link>
            ))}

            {/* Boussole Egor69 */}
            <a
              href="https://egor69.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground/60 hover:text-stone-600 hover:bg-stone-50 transition-colors"
            >
              <Compass className="h-3.5 w-3.5" aria-hidden />
              Boussole contemplative (Egor69) ↗
            </a>

            {/* CTA démo */}
            <div className="pt-1">
              <Link
                to="/circulai/equation-pilote"
                onClick={close}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors"
              >
                Démo 2 min <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
