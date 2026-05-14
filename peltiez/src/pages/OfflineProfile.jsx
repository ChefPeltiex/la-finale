import { useState, useMemo } from 'react';
import { Package, Award, TrendingUp, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import useOfflineCache from '@/hooks/useOfflineCache';
import useOnlineStatus from '@/hooks/useOnlineStatus';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';

export default function OfflineProfile() {
  const isOnline = useOnlineStatus();
  const [user, setUser] = useState(null);

  // Fetch user data with offline fallback
  const { data: listings = [], loading: loadingListings, isStale: staleListings, invalidateCache: clearListingsCache } = useOfflineCache(
    'my_listings',
    async () => {
      const me = await base44.auth.me();
      setUser(me);
      return base44.entities.Listing.filter({ created_by: me.email }, '-created_date', 100);
    }
  );

  const { data: badges = [], isStale: staleBadges } = useOfflineCache(
    'my_badges',
    async () => {
      const me = await base44.auth.me();
      return base44.entities.BadgesDisplay.filter({ user_email: me.email }).then(r => r[0]?.earned_badge_ids || []);
    }
  );

  const { data: ecoProfile = null, isStale: staleEco } = useOfflineCache(
    'eco_profile',
    async () => {
      const me = await base44.auth.me();
      return base44.entities.EcoProfile.filter({ user_email: me.email }, '-created_date', 1).then(r => r[0] || null);
    }
  );

  const stats = useMemo(() => ({
    total: listings.length,
    actif: listings.filter(l => l.status === 'actif').length,
    vendu: listings.filter(l => l.status === 'vendu').length,
    co2: listings.reduce((s, l) => s + (l.co2_saved || 0), 0).toFixed(1),
  }), [listings]);

  const allStale = staleListings || staleBadges || staleEco;

  return (
    <div className="pb-20 space-y-6 max-w-3xl mx-auto px-4 pt-6">
      {/* Offline warning */}
      {!isOnline && (
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900">Mode hors ligne</p>
            <p className="text-sm text-amber-800 mt-0.5">Vous consultez vos données mises en cache. Reconnectez-vous pour les mettre à jour.</p>
          </div>
        </div>
      )}

      {/* Stale data warning */}
      {allStale && isOnline && (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-4 flex items-start gap-3 justify-between">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900">Données anciennes</p>
              <p className="text-sm text-blue-800 mt-0.5">Ces données ont plus de 7 jours. Mettez-les à jour pour voir les infos actuelles.</p>
            </div>
          </div>
          <Button onClick={clearListingsCache} size="sm" variant="outline" className="gap-2 shrink-0">
            <RefreshCw className="h-3 w-3" /> Actualiser
          </Button>
        </div>
      )}

      {/* Loading state */}
      {loadingListings && !listings.length && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {/* Profile card */}
      {user && (
        <div className="bg-card rounded-2xl border border-border overflow-hidden p-6">
          <div className="flex items-end gap-4 mb-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-2xl shadow-md">
              {ecoProfile?.avatar_emoji || '🌱'}
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">{user?.full_name || 'Utilisateur'}</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {ecoProfile && (
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
              {ecoProfile.level || 'Graine 🌱'}
            </Badge>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Annonces', val: stats.total },
              { label: 'Actives', val: stats.actif, cls: 'text-primary' },
              { label: 'Vendues', val: stats.vendu },
              { label: 'kg CO₂', val: stats.co2, cls: 'text-emerald-600' },
            ].map(({ label, val, cls }) => (
              <div key={label} className="text-center p-3 rounded-xl bg-muted">
                <p className={cn('text-lg font-bold', cls || 'text-foreground')}>{val}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Listings section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Package className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-bold text-foreground">Mes annonces</h2>
          <Badge variant="secondary" className="ml-auto">{stats.actif} actives</Badge>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
            <Package className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucune annonce publiée</p>
          </div>
        ) : (
          <div className="space-y-2">
            {listings.slice(0, 10).map(l => (
              <div key={l.id} className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:border-primary/20 transition-all">
                {l.image_url && (
                  <img src={l.image_url} alt={l.title} className="h-12 w-12 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{l.title}</p>
                  <p className="text-xs text-muted-foreground">{l.location || 'Sans localisation'}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge variant="outline" className="text-xs capitalize">{l.type}</Badge>
                  <span className={`text-[10px] ${l.status === 'actif' ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                    {l.status === 'actif' ? '● Actif' : l.status}
                  </span>
                </div>
              </div>
            ))}
            {listings.length > 10 && (
              <p className="text-xs text-muted-foreground text-center py-2">
                +{listings.length - 10} autres annonces (non visibles hors ligne)
              </p>
            )}
          </div>
        )}
      </div>

      {/* Badges section */}
      {badges.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Award className="h-5 w-5 text-amber-500" />
            <h2 className="font-display text-lg font-bold text-foreground">Mes badges</h2>
            <Badge variant="secondary" className="ml-auto">{badges.length}</Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {badges.map((badge, i) => (
              <div key={i} className="p-3 bg-card rounded-xl border border-border text-center">
                <div className="text-2xl mb-1">🏆</div>
                <p className="text-xs font-semibold text-foreground capitalize">{badge.replace(/_/g, ' ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EcoProfile summary */}
      {ecoProfile && (
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 p-6 space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <h2 className="font-display text-lg font-bold text-emerald-900">Impact écologique</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-emerald-700 font-semibold">{ecoProfile.total_co2_saved || 0} kg</p>
              <p className="text-xs text-emerald-600">CO₂ économisé</p>
            </div>
            <div>
              <p className="text-emerald-700 font-semibold">{ecoProfile.total_objects_saved || 0}</p>
              <p className="text-xs text-emerald-600">Objets sauvés</p>
            </div>
          </div>
        </div>
      )}

      {/* Cache info */}
      <div className="text-[11px] text-muted-foreground text-center p-3 rounded-xl bg-muted">
        <p>💾 Données mises en cache localement</p>
        <p>Consultables même sans connexion internet</p>
      </div>
    </div>
  );
}