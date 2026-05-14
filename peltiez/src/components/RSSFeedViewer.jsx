import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { RefreshCw, Loader2, AlertCircle, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRelativeFr } from '@/lib/dateUtils';

export default function RSSFeedViewer() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(null);
  const [error, setError] = useState(null);

  const fetchFeeds = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('syncRSSFeeds', {});
      if (res.data.success) {
        setItems(res.data.items || []);
        setLastSync(new Date(res.data.lastSync));
      } else {
        setError(res.data.error || 'Erreur de synchronisation');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Impossible de récupérer les actualités');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
    const interval = setInterval(fetchFeeds, 6 * 60 * 60 * 1000); // Sync toutes les 6h
    return () => clearInterval(interval);
  }, []);

  const categoryColor = {
    'Environnement': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Économie': 'bg-amber-100 text-amber-700 border-amber-200',
    'Culture': 'bg-purple-100 text-purple-700 border-purple-200',
    'Technologie': 'bg-blue-100 text-blue-700 border-blue-200',
    'Spiritualité': 'bg-violet-100 text-violet-700 border-violet-200',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">📡 Actualités en temps réel</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Mis à jour automatiquement toutes les 6 heures • 
            {lastSync && ` Dernière sync: ${formatRelativeFr(lastSync)}`}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={fetchFeeds}
          disabled={loading}
          className="rounded-lg gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Sync...' : 'Actualiser'}
        </Button>
      </div>

      {error && (
        <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading && items.length === 0 ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Globe className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
          <p>Aucune actualité disponible</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
          {items.map((item, i) => {
            const colorClass = categoryColor[item.source_feed] || 'bg-slate-100 text-slate-700 border-slate-200';
            return (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card rounded-xl border border-border p-4 hover:shadow-md hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-lg">{item.emoji}</span>
                  <Badge variant="outline" className={`text-xs whitespace-nowrap ${colorClass} border`}>
                    {item.source_feed}
                  </Badge>
                </div>
                <h3 className="font-semibold text-foreground text-sm line-clamp-2 hover:text-primary">
                  {item.title}
                </h3>
                {item.summary && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.summary}</p>
                )}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/30">
                  <span className="text-[10px] text-muted-foreground">
                    {formatRelativeFr(item.pubDate)}
                  </span>
                  <span className="text-[10px] text-primary font-medium">Lire →</span>
                </div>
              </a>
            );
          })}
        </div>
      )}

      <div className="text-[10px] text-muted-foreground text-center pt-2">
        ✅ Auto-sync chaque 6h • 20 articles les plus récents • RSS parsé en temps réel
      </div>
    </div>
  );
}