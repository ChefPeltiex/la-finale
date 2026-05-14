import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOMeta from "@/components/SEOMeta";
import LiveMembershipSubscriptionsChart from "@/components/LiveMembershipSubscriptionsChart";

/**
 * Tableau public agrégé — aucune donnée nominative ; compteurs issus du stockage local en mode souverain.
 */
export default function PlatformLiveMetrics() {
  return (
    <div className="min-h-screen pb-24 px-4 max-w-5xl mx-auto pt-8">
      <SEOMeta
        title="Egor69 — Adhésions & abonnements (temps réel)"
        description="Vue agrégée du nombre d'adhésions et d'abonnements — actualisation continue."
        keywords="igor, métriques, adhésions, abonnements, tableau"
      />

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" /> Accueil
          </Link>
        </Button>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Plateforme — temps réel</h1>
      </div>

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 mb-6 text-sm text-foreground/90">
        <strong className="text-amber-700 dark:text-amber-400">Mode souverain :</strong> les totaux reflètent les profils stockés dans ce navigateur (
        <code className="text-xs">EcoProfile</code>). Pour des chiffres globaux, connectez une base serveur et les webhooks Stripe.
      </div>

      <LiveMembershipSubscriptionsChart />
    </div>
  );
}
