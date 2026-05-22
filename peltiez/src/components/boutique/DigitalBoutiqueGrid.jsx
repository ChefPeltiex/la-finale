import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { DIGITAL_PRODUCTS } from "@/data/digitalProducts";
import DigitalProductCard from "@/components/boutique/DigitalProductCard";
import { Button } from "@/components/ui/button";

export default function DigitalBoutiqueGrid({
  compact = false,
  highlightProductId = null,
  showHeader = true,
  className = "",
  products: productsProp = null,
  excludeFeatured = false,
}) {
  const [loadingId, setLoadingId] = useState(null);
  const checkoutReady = !!import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT;

  const products = useMemo(() => {
    let list = productsProp?.length ? productsProp : null;
    if (!list) {
      list = compact
        ? DIGITAL_PRODUCTS.filter((p) => p.availableToday).slice(0, 4)
        : DIGITAL_PRODUCTS;
    }
    if (excludeFeatured) {
      list = list.filter((p) => !p.featured);
    }
    return list;
  }, [compact, productsProp, excludeFeatured]);

  return (
    <section className={className} id="boutique-numerique">
      {showHeader ? (
        <div className="mb-8 text-center max-w-2xl mx-auto px-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-400/90 mb-2">
            Offres numériques · Québec
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
            {compact ? "Boutique en un coup d’œil" : "Boutique numérique CirculAI"}
          </h2>
          <p className="text-sm text-white/60 mt-2 leading-relaxed">
            Des produits tirés des vrais actifs du site — encyclopédie, Codex, Nature QC, Verse. Pas de promesse miracle :
            ce qui est payant ou gratuit est indiqué clairement.
          </p>
          {compact ? (
            <Button asChild variant="link" className="mt-3 text-emerald-300 font-semibold">
              <Link to="/boutique">
                Voir toute la boutique <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          ) : null}
        </div>
      ) : null}

      <div
        className={
          compact
            ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
        }
      >
        {products.map((product) => (
          <DigitalProductCard
            key={product.id}
            product={product}
            checkoutReady={checkoutReady}
            loadingId={loadingId}
            onLoadingChange={setLoadingId}
            highlighted={highlightProductId === product.id}
          />
        ))}
      </div>
    </section>
  );
}
