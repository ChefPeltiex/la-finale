import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SEOMeta from "@/components/SEOMeta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SITE_ORIGIN } from "@/lib/site";
import { Activity, Leaf, Shield, Sparkles, ArrowRight, RefreshCw } from "lucide-react";

/**
 * Interface Éco-Sujette — tableau de bord honnête : santé API locale,
 * liens charte/sécurité, principes d’éco-conception sans promesse carbone magique.
 */
export default function SovereignEcoHub() {
  const [health, setHealth] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  const ping = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/health", { headers: { Accept: "application/json" } });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setHealth(json);
    } catch (e) {
      setHealth(null);
      setErr(e?.message || "indisponible");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ping();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 pb-24 pt-10 space-y-10">
      <SEOMeta
        title="Noyau souverain · interface éco-sujette"
        description="Pilotage lucide : état du noyau API, principes d’éco-conception logicielle et souveraineté des données — sans certification automatique."
        canonicalUrl={`${SITE_ORIGIN}/hub-souverain`}
      />

      <header className="space-y-4">
        <Badge variant="outline" className="border-emerald-500/40 text-emerald-700 dark:text-emerald-300">
          Interface Éco-Sujette
        </Badge>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-foreground">
          Cathédrale · tableau du noyau
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Le « Grand Frère » ici, c&apos;est la <strong className="text-foreground">visibilité technique honnête</strong> :
          ce qui répond, ce qui reste à configurer, et où trouver la charte. Aucune promesse juridique ou climatique
          automatique — objectifs à valider humainement (
          <Link to="/charte" className="text-primary underline-offset-4 hover:underline">
            charte
          </Link>
          ,{" "}
          <Link to="/security" className="text-primary underline-offset-4 hover:underline">
            sécurité
          </Link>
          ).
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-emerald-600" />
            <h2 className="font-display text-xl font-bold text-foreground">Noyau API (localhost)</h2>
          </div>
          <Button type="button" variant="outline" size="sm" className="gap-2" onClick={ping} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Rafraîchir
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          En dev, lance <code className="text-xs bg-muted px-1 rounded">npm run dev:api</code> puis{" "}
          <code className="text-xs bg-muted px-1 rounded">npm run dev</code> — le proxy Vite envoie{" "}
          <code className="text-xs bg-muted px-1 rounded">/api</code> vers le port{" "}
          <code className="text-xs bg-muted px-1 rounded">8787</code>.
        </p>
        {err ? (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
            <strong>Noyau injoignable</strong> — {err}. Démarre l&apos;API ou vérifie le proxy.
          </div>
        ) : null}
        {!err && health ? (
          <pre className="text-xs bg-muted/60 rounded-xl p-4 overflow-x-auto text-foreground">
            {JSON.stringify(health, null, 2)}
          </pre>
        ) : null}
        {!err && !health && !loading ? (
          <p className="text-sm text-muted-foreground">Aucune réponse.</p>
        ) : null}
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-emerald-600" />
            <h3 className="font-semibold text-foreground">Éco-sujétion logicielle</h3>
          </div>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
            <li>Boucles lourdes : envisager <code className="text-xs">acPulseRegulator</code> (yield / idle).</li>
            <li>Pas de métrique CO₂ inventée dans l&apos;UI sans mesure réelle.</li>
            <li>Données utilisateur : préférer local / minimisation — voir Mon univers.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-violet-500/25 bg-violet-500/5 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-violet-600" />
            <h3 className="font-semibold text-foreground">Souveraineté (réelle)</h3>
          </div>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
            <li>Secrets hors bundle ; CORS explicite en production.</li>
            <li>Checkout Stripe : erreurs génériques côté client, détails côté serveur uniquement.</li>
            <li>CRM lead : stub documenté — persistance à brancher.</li>
          </ul>
        </div>
      </section>

      <section className="flex flex-wrap gap-3">
        <Button asChild className="rounded-xl gap-2">
          <Link to="/hub-fondations">
            <Sparkles className="h-4 w-4" />
            Fondations données
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl">
          <Link to="/partenaires">Entreprises</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl">
          <Link to="/">Accueil</Link>
        </Button>
      </section>
    </div>
  );
}
