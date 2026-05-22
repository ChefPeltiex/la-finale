import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { PageSEOWrapper } from "@/components/PageSEOWrapper";
import DigitalBoutiqueGrid from "@/components/boutique/DigitalBoutiqueGrid";
import DigitalProductCard from "@/components/boutique/DigitalProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BOUTIQUE_FILTER_CHIPS,
  filterDigitalProducts,
  getDigitalProductById,
  getFeaturedDigitalProduct,
} from "@/data/digitalProducts";
import { CIRCULAI_BRAND } from "@/lib/site";

export default function Boutique() {
  const [params, setParams] = useSearchParams();
  const productId = params.get("product") || "";
  const filterFromUrl = params.get("filter") || "all";
  const [filter, setFilter] = useState(
    BOUTIQUE_FILTER_CHIPS.some((c) => c.id === filterFromUrl) ? filterFromUrl : "all",
  );
  const [loadingId, setLoadingId] = useState(null);
  const checkoutReady = !!import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT;

  const highlight = useMemo(() => getDigitalProductById(productId)?.id ?? null, [productId]);
  const featured = useMemo(() => getFeaturedDigitalProduct(), []);
  const filtered = useMemo(() => filterDigitalProducts(filter), [filter]);

  useEffect(() => {
    if (!highlight) return;
    const el = document.getElementById(`produit-${highlight}`);
    if (el) {
      window.setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 120);
    }
  }, [highlight]);

  const selectFilter = (id) => {
    setFilter(id);
    const next = new URLSearchParams(params);
    if (id === "all") next.delete("filter");
    else next.set("filter", id);
    setParams(next, { replace: true });
  };

  return (
    <PageSEOWrapper pageType="boutique">
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 pt-8 space-y-10"
        style={{
          background:
            "radial-gradient(900px 400px at 50% 0%, rgba(16,185,129,0.12), transparent 55%), hsl(222 47% 4%)",
        }}
      >
        <header className="text-center space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-400/90">
            {CIRCULAI_BRAND} · accès & savoirs
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white">Boutique numérique</h1>
          <p className="text-white/65 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Des offres tirées des vrais actifs du projet : accès clair, prix affichés, zéro hype. Vous soutenez la
            circulation des savoirs — l’éclat vient du soin, pas des promesses vides.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <Button asChild variant="outline" className="rounded-xl border-white/20">
              <Link to="/pricing">Passes & abonnements</Link>
            </Button>
            <Button asChild variant="ghost" className="rounded-xl text-amber-200">
              <a href="/encyclopedie.pdf" target="_blank" rel="noopener noreferrer">
                Aperçu PDF gratuit
              </a>
            </Button>
            <Button asChild variant="ghost" className="rounded-xl text-violet-200">
              <Link to="/docs/promesses">Charpente · 8 promesses</Link>
            </Button>
          </div>
        </header>

        {featured ? (
          <section
            aria-labelledby="boutique-vedette"
            className="relative overflow-hidden rounded-3xl border border-amber-500/35 bg-gradient-to-br from-zinc-950 via-amber-950/15 to-emerald-950/20 p-6 sm:p-8"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              aria-hidden
              style={{
                background:
                  "radial-gradient(ellipse at 20% 30%, rgba(255,215,0,0.14), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(16,185,129,0.1), transparent 50%)",
              }}
            />
            <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr,minmax(280px,360px)] lg:items-center">
              <div className="space-y-3 text-left">
                <p
                  id="boutique-vedette"
                  className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300/95"
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  Coup de cœur fondateur
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight">
                  {featured.titleFr}
                </h2>
                <p className="text-sm text-white/65 leading-relaxed max-w-xl">{featured.descriptionFr}</p>
                <p className="text-xs text-emerald-300/90 leading-relaxed">
                  Le PDF public reste un aperçu gratuit — l’édition complète finance la suite du hub sans métriques
                  inventées.
                </p>
                <Button asChild variant="link" className="px-0 text-amber-200 font-semibold h-auto">
                  <Link to="/#accueil-encyclopedies" className="inline-flex items-center gap-1">
                    Voir aussi les encyclopédies sur l’accueil
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <DigitalProductCard
                product={featured}
                checkoutReady={checkoutReady}
                loadingId={loadingId}
                onLoadingChange={setLoadingId}
                highlighted
              />
            </div>
          </section>
        ) : null}

        <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filtrer la boutique">
          {BOUTIQUE_FILTER_CHIPS.map((chip) => (
            <button
              key={chip.id}
              type="button"
              role="tab"
              aria-selected={filter === chip.id}
              onClick={() => selectFilter(chip.id)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold border transition-colors",
                filter === chip.id
                  ? "bg-emerald-600 border-emerald-400 text-white shadow-[0_0_16px_rgba(16,185,129,0.25)]"
                  : "border-white/15 text-white/70 hover:border-emerald-500/40 hover:text-white",
              )}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {highlight ? (
          <p className="text-center text-xs text-emerald-300/90 font-medium">
            Produit sélectionné depuis le lien — faites défiler si besoin.
          </p>
        ) : null}

        {filtered.length === 0 ? (
          <p className="text-center text-sm text-white/55">Aucun produit dans cette catégorie pour l’instant.</p>
        ) : (
          <DigitalBoutiqueGrid
            products={filtered}
            excludeFeatured={!!featured}
            highlightProductId={highlight}
            showHeader={false}
          />
        )}

        <aside className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 text-sm text-white/65 leading-relaxed max-w-3xl mx-auto">
          <p className="font-semibold text-white mb-2">Configuration Stripe (fondateur)</p>
          <p>
            Pour activer l’achat en ligne : <code className="text-[11px]">VITE_STRIPE_CHECKOUT_ENDPOINT</code>, clé
            secrète serveur, allowlist des Price IDs (<code className="text-[11px]">STRIPE_ALLOWED_PRICE_IDS</code>),
            puis les variables <code className="text-[11px]">VITE_STRIPE_PRICE_ENCYCLOPEDIE</code>, etc. Sans cela, les
            boutons proposent un courriel ou le pilote — jamais un faux paiement.
          </p>
        </aside>
      </div>
    </PageSEOWrapper>
  );
}
