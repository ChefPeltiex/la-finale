import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Download, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import DigitalProductCard from "@/components/boutique/DigitalProductCard";
import { DIGITAL_PRODUCTS } from "@/data/digitalProducts";
import { cn } from "@/lib/utils";

const FEATURED_IDS = ["encyclopedie-complete", "bundle-codex-investisseur-preuves", "kit-nature-quebec"];

export default function HomeOffresSavoirsSection() {
  const featured = FEATURED_IDS.map((id) => DIGITAL_PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  const checkoutReady = !!(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY &&
    import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT
  );

  return (
    <section
      id="accueil-offres-savoirs"
      className="scroll-mt-28 lg:scroll-mt-8 max-w-6xl mx-auto px-4 lg:px-8"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border border-emerald-500/30 p-6 sm:p-8",
          "bg-gradient-to-br from-emerald-950/55 via-zinc-950 to-violet-950/35",
          "shadow-[0_0_48px_rgba(16,185,129,0.1)]",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse at 10% 0%, rgba(16,185,129,0.2), transparent 50%), radial-gradient(ellipse at 90% 100%, rgba(167,139,250,0.12), transparent 45%)",
          }}
        />

        <div className="relative z-10 space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-300/90 mb-2 flex items-center gap-2">
                <Store className="h-3.5 w-3.5" />
                Offres & savoirs
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                Soutenir la circulation — un achat à la fois
              </h2>
              <p className="text-sm text-white/60 mt-2 max-w-xl leading-relaxed">
                PDF, Codex et kits numériques ancrés dans le dépôt réel. Pas de miracles LoA : des outils
                pour lire, explorer et partager avec transparence.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="shrink-0 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white"
            >
              <Link to="/boutique" className="inline-flex items-center gap-2">
                Boutique complète <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-black/40 p-5 sm:p-6 flex flex-col lg:flex-row gap-6 items-stretch">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 text-amber-200/90">
                <BookOpen className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Encyclopédie hybride</span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                Commencez par l’aperçu gratuit — même charte visuelle, volume réduit. L’édition complète
                finance la suite du hub sans promesse de résultat garanti.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm" className="rounded-lg border-white/20">
                  <a href="/encyclopedie.pdf" download="encyclopedie.pdf" target="_blank" rel="noopener noreferrer">
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Aperçu gratuit
                  </a>
                </Button>
                <Button asChild size="sm" className="rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-bold">
                  <Link to="/boutique#produit-encyclopedie-complete">Édition complète · 19 $</Link>
                </Button>
              </div>
            </div>
            <div className="lg:w-48 flex items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-950/30 px-4 py-6 text-center">
              <div>
                <p className="text-3xl font-black text-emerald-300 font-display">19 $</p>
                <p className="text-[11px] text-white/50 mt-1">CAD · achat unique</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featured.map((product) => (
              <DigitalProductCard
                key={product.id}
                product={product}
                checkoutReady={checkoutReady}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
