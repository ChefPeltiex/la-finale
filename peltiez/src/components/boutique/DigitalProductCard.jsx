import { Link } from "react-router-dom";
import { CheckCircle, ExternalLink, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  buildProductLeadPath,
  buildProductMailto,
  getProductStripePriceId,
} from "@/data/digitalProducts";
import { createStripeCheckout } from "@/payments/checkout";
import { toast } from "sonner";

export default function DigitalProductCard({
  product,
  checkoutReady,
  loadingId,
  onLoadingChange,
  highlighted,
}) {
  const stripePriceId = getProductStripePriceId(product);
  const canStripe =
    checkoutReady &&
    !!stripePriceId &&
    product.type === "digital" &&
    product.availableToday;
  const canStripeSub =
    checkoutReady &&
    !!stripePriceId &&
    product.type === "subscription" &&
    product.availableToday;
  const isLoading = loadingId === product.id;

  const handleStripe = async () => {
    if (!stripePriceId) return;
    onLoadingChange?.(product.id);
    const res = await createStripeCheckout({
      priceId: stripePriceId,
      mode: product.stripeMode || "payment",
      metadata: { productId: product.id },
    });
    onLoadingChange?.(null);
    if (res?.url) {
      window.location.href = res.url;
      return;
    }
    toast.error(res?.error || "Checkout indisponible — configurez Stripe côté serveur.");
  };

  const ctaLabel = () => {
    if (!product.availableToday) return "Liste d’attente";
    if (product.priceCad === 0) return product.ctaExternal ? "Télécharger l’aperçu" : "Lire gratuitement";
    if (product.type === "lead") return "Demander le pilote";
    if (product.type === "subscription") return canStripeSub ? "S’abonner" : "Voir l’abonnement";
    if (canStripe) return "Acheter";
    if (product.type === "digital") return "Commander par courriel";
    return "En savoir plus";
  };

  const renderCta = () => {
    if (!product.availableToday) {
      return (
        <Button asChild variant="outline" className="w-full rounded-xl" size="lg">
          <a href={buildProductMailto(product)}>
            <Mail className="h-4 w-4 mr-2" />
            {ctaLabel()}
          </a>
        </Button>
      );
    }

    if (product.priceCad === 0 && product.ctaExternal) {
      return (
        <Button asChild className="w-full rounded-xl font-bold" size="lg">
          <a
            href={product.ctaPath}
            {...(product.ctaDownload ? { download: "encyclopedie.pdf" } : {})}
            target="_blank"
            rel="noopener noreferrer"
          >
            {ctaLabel()}
            <ExternalLink className="h-4 w-4 ml-2" />
          </a>
        </Button>
      );
    }

    if (product.priceCad === 0 && !product.ctaExternal) {
      return (
        <Button asChild className="w-full rounded-xl font-bold" size="lg" variant="secondary">
          <Link to={product.ctaPath}>{ctaLabel()}</Link>
        </Button>
      );
    }

    if (canStripe || canStripeSub) {
      return (
        <Button
          type="button"
          className="w-full rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
          size="lg"
          disabled={isLoading}
          onClick={handleStripe}
        >
          {isLoading ? "Redirection Stripe…" : ctaLabel()}
        </Button>
      );
    }

    if (product.type === "lead") {
      return (
        <Button asChild className="w-full rounded-xl font-bold" size="lg" variant="secondary">
          <Link to={buildProductLeadPath(product)}>{ctaLabel()}</Link>
        </Button>
      );
    }

    if (product.type === "subscription") {
      return (
        <Button asChild className="w-full rounded-xl font-bold" size="lg">
          <Link to={product.ctaPath}>{ctaLabel()}</Link>
        </Button>
      );
    }

    if (product.type === "digital" && !stripePriceId) {
      return (
        <Button asChild variant="outline" className="w-full rounded-xl" size="lg">
          <a href={buildProductMailto(product)}>
            <Mail className="h-4 w-4 mr-2" />
            {ctaLabel()}
          </a>
        </Button>
      );
    }

    return (
      <Button asChild className="w-full rounded-xl font-bold" size="lg">
        <Link to={product.ctaPath}>En savoir plus</Link>
      </Button>
    );
  };

  return (
    <article
      id={`produit-${product.id}`}
      className={cn(
        "flex flex-col rounded-2xl border bg-zinc-950/85 p-5 sm:p-6 backdrop-blur-sm transition-shadow",
        highlighted
          ? "border-emerald-400/50 ring-2 ring-emerald-500/20 shadow-[0_0_32px_rgba(16,185,129,0.15)]"
          : "border-white/10 hover:border-emerald-500/30 hover:shadow-[0_0_24px_rgba(16,185,129,0.08)]",
        product.featured && !highlighted && "border-amber-500/35",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
          <ProductCardHeader product={product} />
        <p className="font-display text-xl sm:text-2xl font-black text-emerald-300 shrink-0 tabular-nums">
          {product.priceLabel}
        </p>
      </div>

      <p className="text-sm text-white/65 leading-relaxed flex-1 mt-3">{product.descriptionFr}</p>

      <ul className="mt-4 space-y-2 text-left">
        {product.included.slice(0, 4).map((line) => (
          <li key={line.slice(0, 40)} className="flex items-start gap-2 text-xs text-white/75">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>{line}</span>
          </li>
        ))}
      </ul>

      {!product.availableToday && product.availabilityNote ? (
        <p className="mt-3 text-[11px] text-amber-200/90 leading-snug">{product.availabilityNote}</p>
      ) : null}

      {product.type === "digital" && product.availableToday && !stripePriceId && product.priceCad > 0 ? (
        <p className="mt-3 text-[11px] text-amber-300/90">
          Paiement Stripe : ajoutez <code className="text-[10px]">{product.stripeEnvKey}</code> au build.
        </p>
      ) : null}

      <div className="mt-5">{renderCta()}</div>
    </article>
  );
}

function ProductCardHeader({ product }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2 mb-1">
        {product.badge ? (
          <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
            {product.badge}
          </Badge>
        ) : null}
        {!product.availableToday ? (
          <Badge className="text-[10px] bg-zinc-800 text-zinc-300">Projection</Badge>
        ) : (
          <Badge className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/30">
            Disponible aujourd’hui
          </Badge>
        )}
      </div>
      <h3 className="font-display font-bold text-lg text-white leading-snug">{product.titleFr}</h3>
    </div>
  );
}
