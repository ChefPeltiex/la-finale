import { Link, useLocation } from "react-router-dom";
import { Map, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EXPERIENCE_FLAGS } from "@/lib/experienceFlags";
import { getContextualLinksForPath } from "@/data/siteGraph";

export default function ContextualLinksPanel() {
  const { pathname } = useLocation();
  if (!EXPERIENCE_FLAGS.contextualLinksPanel) return null;
  const { current, links } = getContextualLinksForPath(pathname);
  if (!links.length) return null;

  return (
    <aside
      className={cn(
        "mt-10 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-zinc-950/80 via-zinc-950/60 to-emerald-950/20 p-4 sm:p-5",
        "shadow-[0_0_0_1px_rgba(16,185,129,0.08)]"
      )}
      aria-label="Liens contextuels"
    >
      <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-200/90">
        <Map className="h-3.5 w-3.5" />
        Suite logique
      </div>
      {current ? (
        <p className="mb-3 text-[11px] leading-relaxed text-white/55">
          Depuis <span className="text-white/80">{current.label}</span> — pistes internes sans cul-de-sac :
        </p>
      ) : (
        <p className="mb-3 text-[11px] text-white/55">Pistes utiles sur la plateforme :</p>
      )}
      <ul className="flex flex-wrap gap-2">
        {links.map((n) => (
          <li key={n.path}>
            <Link
              to={n.path}
              className="group inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/90 transition hover:border-emerald-500/35 hover:bg-emerald-500/10"
            >
              {n.label}
              <ArrowUpRight className="h-3 w-3 opacity-50 transition group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[10px] text-white/35">
        Carte complète : <Link to="/carte-site" className="text-emerald-300/90 underline-offset-2 hover:underline">/carte-site</Link>
      </p>
    </aside>
  );
}
