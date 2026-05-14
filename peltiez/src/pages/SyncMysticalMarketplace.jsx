import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Loader2, CheckCircle2, AlertCircle, Zap, BarChart3, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SyncMysticalMarketplace() {
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me(), staleTime: Infinity });
  
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSync = async () => {
    if (!user || user.role !== 'admin') {
      setError('Admin access required');
      return;
    }

    setSyncing(true);
    setError(null);
    setResult(null);

    try {
      const res = await base44.functions.invoke('syncMysticalMarketplaceLinks', {});
      setResult(res.data);
    } catch (err) {
      setError(err.message || 'Sync failed');
      console.error('Sync error:', err);
    } finally {
      setSyncing(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
        <p className="text-muted-foreground font-medium">Admin access required</p>
      </div>
    );
  }

  return (
    <div className="pb-20 space-y-8 max-w-2xl mx-auto px-4 pt-6">
      {/* Hero */}
      <div className="rounded-3xl p-10 text-center bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-purple-200/20">
        <Link2 className="h-12 w-12 text-purple-500 mx-auto mb-3" />
        <h1 className="font-display text-3xl font-black text-foreground">Synchronisation Mystique</h1>
        <p className="text-muted-foreground mt-2">Lie automatiquement articles mystiques aux produits marketplace</p>
      </div>

      {/* Controls */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <div className="space-y-2">
          <h2 className="font-bold text-foreground flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" /> Lance la synchronisation
          </h2>
          <p className="text-sm text-muted-foreground">
            Cette opération analysera tous les articles mystiques, fiches pédagogiques et contenus bien-être 
            pour les lier automatiquement aux produits correspondants dans la marketplace.
          </p>
        </div>

        <Button
          onClick={handleSync}
          disabled={syncing}
          className="w-full rounded-xl h-11 font-bold text-base bg-purple-600 hover:bg-purple-700 text-white border-0">
          {syncing
            ? <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Synchronisation en cours...</>
            : <><Zap className="h-5 w-5 mr-2" /> Démarrer la synchronisation</>
          }
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-900">Erreur</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-900">Synchronisation réussie!</p>
              <p className="text-sm text-emerald-700 mt-1">{result.message}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-3xl font-black text-violet-500">{result.stats?.total_content || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Articles/Fiches</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-3xl font-black text-emerald-600">{result.stats?.linked || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Liés</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-3xl font-black text-blue-500">{result.stats?.total_listings || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Produits</p>
            </div>
          </div>

          {/* Timestamp */}
          <div className="text-center text-xs text-muted-foreground">
            Dernière synchro: {new Date(result.stats?.timestamp).toLocaleString('fr-CA')}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground space-y-2">
        <p className="font-semibold text-foreground flex items-center gap-2">
          <BarChart3 className="h-4 w-4" /> Fonctionnement
        </p>
        <ul className="space-y-1 text-xs list-disc list-inside">
          <li>Analyse tous les articles mystiques, fiches et contenus</li>
          <li>Utilise l'IA pour identifier les produits correspondants</li>
          <li>Crée des liens automatiques bidirectionnels</li>
          <li>Enrichit l'expérience utilisateur avec des suggestions</li>
        </ul>
      </div>
    </div>
  );
}