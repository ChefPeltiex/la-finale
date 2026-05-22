import { Link } from "react-router-dom";
import { ArrowRight, Building2, Recycle, ScrollText, Sparkles } from "lucide-react";
import { CIRCULAI_BRAND } from "@/lib/site";

const TILES = [
  {
    title: CIRCULAI_BRAND,
    desc: "Kit · pilote 90 j · preuves",
    to: "/circulai",
    accent: "border-emerald-500/40 bg-emerald-950/30 text-emerald-100",
    icon: Recycle,
    iconClass: "text-emerald-400",
  },
  {
    title: "Kit municipal",
    desc: "Plan, lettre, partenaires",
    to: "/docs/circulai-kit-regional",
    accent: "border-sky-500/40 bg-sky-950/25 text-sky-100",
    icon: ScrollText,
    iconClass: "text-sky-400",
  },
  {
    title: "Équations → produit",
    desc: "Carte système nerveux",
    to: "/docs/circulai/equations-systeme",
    accent: "border-amber-500/35 bg-amber-950/20 text-amber-100",
    icon: Building2,
    iconClass: "text-amber-300",
  },
  {
    title: "Egor69 · Verse",
    desc: "Divertissement · univers 3D",
    to: "/world",
    accent: "border-violet-500/40 bg-violet-950/25 text-violet-100",
    icon: Sparkles,
    iconClass: "text-violet-300",
  },
];

export default function HomeQuickPath() {
  return (
    <section
      id="accueil-parcours-rapide"
      className="scroll-mt-28 lg:scroll-mt-8 max-w-6xl mx-auto px-4 lg:px-8"
      aria-labelledby="accueil-parcours-rapide-title"
    >
      <h2 id="accueil-parcours-rapide-title" className="sr-only">
        Parcours rapide
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {TILES.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.to}
              to={tile.to}
              className={`group rounded-2xl border p-4 sm:p-5 min-h-[88px] transition-all hover:-translate-y-0.5 active:scale-[0.98] ${tile.accent}`}
            >
              <Icon className={`h-5 w-5 mb-2 ${tile.iconClass}`} aria-hidden />
              <p className="font-display font-bold text-sm">{tile.title}</p>
              <p className="text-[11px] opacity-75 mt-1 leading-snug">{tile.desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold opacity-90">
                Ouvrir <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
