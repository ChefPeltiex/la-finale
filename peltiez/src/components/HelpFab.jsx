/**
 * HelpFab — icône '?' persistante en bas-droite.
 * Redirige vers /aide ou ouvre un mini-panneau contextuel.
 */
import { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { HelpCircle, X, ArrowRight, LayoutDashboard, BookOpen, ShoppingBag, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

const QUICK_LINKS = [
  { label: "Hub municipal",  to: "/circulai/hub",           icon: LayoutDashboard },
  { label: "Encyclopédie",   to: "/encyclopedie",           icon: BookOpen },
  { label: "Boutique",       to: "/boutique",               icon: ShoppingBag },
  { label: "Nature Québec",  to: "/portail/nature-quebec",  icon: Leaf },
];

/** Routes où le FAB ne s'affiche pas (full-bleed / trop chargé). */
const HIDDEN_ROUTES = new Set([
  "/intro", "/welcome", "/underworld", "/etherealm",
  "/netherealm", "/outworld", "/world", "/entrer",
  "/arene-virtuelle", "/pantheon-3d",
]);

export default function HelpFab() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  if (HIDDEN_ROUTES.has(location.pathname)) return null;

  return (
    <>
      {/* Mini-panneau contextuel */}
      {open && (
        <>
          {/* Overlay transparent pour fermer au clic extérieur */}
          <div
            className="fixed inset-0 z-40"
            aria-hidden
            onClick={close}
          />
          <div
            className={cn(
              "fixed bottom-20 right-4 z-50 w-64 rounded-2xl bg-white border border-border shadow-xl p-4",
              "animate-in slide-in-from-bottom-2 fade-in duration-150"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-foreground">Aide rapide</p>
              <button
                type="button"
                onClick={close}
                aria-label="Fermer"
                className="h-6 w-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Où voulez-vous aller ?
            </p>

            <ul className="space-y-1.5 mb-3">
              {QUICK_LINKS.map(({ label, to, icon: Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={close}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              to="/aide"
              onClick={close}
              className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              Manuel complet
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </>
      )}

      {/* Bouton FAB */}
      <button
        type="button"
        onClick={toggle}
        aria-label={open ? "Fermer l'aide" : "Ouvrir l'aide"}
        aria-expanded={open}
        className={cn(
          "fixed bottom-4 right-4 z-50 h-11 w-11 rounded-full shadow-lg border flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2",
          open
            ? "bg-emerald-700 border-emerald-800 text-white"
            : "bg-white border-border text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
        )}
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden />
        ) : (
          <HelpCircle className="h-5 w-5" aria-hidden />
        )}
      </button>
    </>
  );
}
