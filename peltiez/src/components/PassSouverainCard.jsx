import { Map, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PASS_SOUVERAIN_ANCHOR_ID } from "@/lib/passSouverain";

const DEFAULT_AMOUNT_LABEL = "~44 $ CA — tarif indicatif (montant réel = Stripe / tableau de bord)";

export default function PassSouverainCard({
  amountLabel,
  loading,
  onBuy,
  disabled,
  checkoutReady,
}) {
  const label = amountLabel?.trim() || DEFAULT_AMOUNT_LABEL;

  return (
    <div
      id={PASS_SOUVERAIN_ANCHOR_ID}
      className={cn(
        "rounded-3xl border border-violet-500/25 bg-gradient-to-br from-violet-950/40 via-card to-cyan-950/20",
        "p-6 md:p-7 max-w-xl mx-auto scroll-mt-24",
      )}
    >
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 shrink-0 rounded-2xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
          <Map className="h-6 w-6 text-violet-200" aria-hidden />
        </div>
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display font-bold text-lg text-foreground">Pass Souverain — Atlas</h2>
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
              Paiement unique
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Débloquer la mise en avant de la première fiche Atlas sur cet appareil (stockage navigateur après retour paiement Stripe).
          </p>
          <p className="font-semibold text-foreground text-sm">{label}</p>
          <div className="flex items-start gap-2 rounded-xl bg-background/60 border border-border/60 px-3 py-2 text-xs text-muted-foreground">
            <Shield className="h-4 w-4 shrink-0 mt-0.5 text-violet-400" aria-hidden />
            <span>
              Le paiement passe par Stripe. Le montant affiché ici peut différer ; le tarif facturé suit la configuration de ton Price ID Stripe.
            </span>
          </div>
          <Button
            type="button"
            size="lg"
            className="w-full sm:w-auto rounded-xl font-bold mt-3"
            disabled={disabled || loading || !checkoutReady}
            onClick={onBuy}
          >
            {loading ? "Redirection…" : "Pass Souverain — payer"}
          </Button>
          {!checkoutReady ? (
            <p className="text-xs text-amber-600 font-medium">
              Backend Stripe requis (<code className="text-[11px]">VITE_PASS_SOUVERAIN_PRICE_ID</code> + checkout).
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
