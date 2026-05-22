import { Link } from "react-router-dom";
import { BookOpen, ShoppingBag, ArrowRight } from "lucide-react";

/** Bannière compacte Verse → boutique & encyclopédie (sans métriques fictives). */
export default function WorldHubBoutiqueBanner({ className = "" }) {
  return (
    <div
      className={`rounded-xl border border-amber-400/30 bg-black/55 px-3 py-2.5 backdrop-blur-md shadow-[0_0_24px_rgba(251,191,36,0.08)] ${className}`}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-amber-200/80 mb-2">
        Savoirs · hors du Verse
      </p>
      <div className="flex flex-wrap gap-2">
        <Link
          to="/boutique"
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/50 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-100 hover:bg-emerald-900/40 transition-colors"
        >
          <ShoppingBag className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Boutique
          <ArrowRight className="h-3 w-3 opacity-70" aria-hidden />
        </Link>
        <a
          href="/encyclopedie.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/35 bg-amber-950/40 px-2.5 py-1.5 text-[11px] font-semibold text-amber-100 hover:bg-amber-900/30 transition-colors"
        >
          <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Aperçu PDF
        </a>
        <Link
          to="/#accueil-encyclopedies"
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-white/65 hover:text-white transition-colors"
        >
          Encyclopédies accueil
        </Link>
      </div>
    </div>
  );
}
