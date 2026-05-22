import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DigitalBoutiqueGrid from "@/components/boutique/DigitalBoutiqueGrid";

export default function HomeBoutiqueTeaser() {
  return (
    <section
      id="accueil-boutique"
      className="scroll-mt-28 lg:scroll-mt-8 max-w-6xl mx-auto px-4 lg:px-8"
    >
      <div className="rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-zinc-950 via-emerald-950/20 to-zinc-900 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-400/90 mb-2 flex items-center gap-2">
              <ShoppingBag className="h-3.5 w-3.5" aria-hidden />
              Offres · accès
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
              Boutique numérique
            </h2>
            <p className="text-sm text-white/60 mt-2 max-w-lg leading-relaxed">
              Encyclopédie, Codex, Nature Québec — des prix accessibles, des actifs réels du projet. L’amour du savoir
              partagé, sans métriques inventées.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="shrink-0 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            <Link to="/boutique" className="inline-flex items-center gap-2">
              Voir la boutique
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <DigitalBoutiqueGrid compact showHeader={false} />
      </div>
    </section>
  );
}
