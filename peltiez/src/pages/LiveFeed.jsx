import { useState } from "react";
import { igor } from "@/api/igorClient";
import SEOMeta from "@/components/SEOMeta";
import DynamicNewsStream from "@/components/DynamicNewsStream";
import { Zap, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LiveFeed() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    // Trigger sync function
    try {
      await igor.functions.invoke("syncDynamicFeed", {});
    } catch (err) {
      console.error("Manual refresh error:", err);
    }
    setIsRefreshing(false);
  };

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Flux d'Actualités en Temps Réel — Egor69",
    "description": "Synchronicités, dons, découvertes mystiques et fil d’énergie communautaire en direct"
  };

  return (
    <div className="pb-20 space-y-8 max-w-6xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Flux en Temps Réel — Synchronicités & Dons | Egor69"
        description="Les échos du radar en direct : dons, synchronicités et mystique mesurée — sans métriques d’audience inventées."
        keywords="actualités, flux temps réel, dons, synchronicités, mystique, communauté, engagement"
        canonicalUrl="https://egor69.ca/live-feed"
        schemaData={seoSchema}
      />

      {/* Hero */}
      <div className="rounded-3xl p-10 text-center bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-blue-200/20">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
          </div>
          <span className="text-xs font-bold text-cyan-600 uppercase tracking-wide">EN DIRECT</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground">Flux de la Communauté</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Synchronicités, nouveaux dons et découvertes mystiques · Mises à jour en temps réel
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[
          { label: "Fil d’énergie", value: "Temps réel", emoji: "📰" },
          { label: "Dons & offres", value: "À votre rythme", emoji: "🎁" },
          { label: "Communauté", value: "Ouverte", emoji: "👥" },
          { label: "Synchronicités", value: "Curatées", emoji: "✨" }
        ].map(stat => (
          <div key={stat.label} className="bg-card rounded-xl border border-border p-4 text-center">
            <div className="text-2xl mb-1">{stat.emoji}</div>
            <p className="text-2xl font-black text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Refresh Controls */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Zap className="h-4 w-4 text-cyan-500" />
          <span>Mise à jour automatique toutes les 10 secondes</span>
        </div>
        <Button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="rounded-xl gap-2 bg-cyan-600 hover:bg-cyan-700 text-white border-0">
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Actualiser maintenant
        </Button>
      </div>

      {/* Dynamic Feed */}
      <DynamicNewsStream limit={24} showFilters={true} />

      {/* Engagement CTA */}
      <div className="rounded-2xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-purple-200/20 p-8 text-center space-y-3">
        <p className="font-display text-2xl font-bold text-foreground">
          Reste connecté à la magie
        </p>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Le flux reflète l’activité réelle du réseau — aucun chiffre d’audience affiché tant qu’il n’est pas vérifiable publiquement.
          Chaque geste ajoute une onde dans la conscience collective.
        </p>
      </div>
    </div>
  );
}