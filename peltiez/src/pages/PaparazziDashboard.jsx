import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SEOMeta from "@/components/SEOMeta";
import {
  Loader2, AlertCircle,
  Flame, Crown, Rocket, Newspaper
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PaparazziDashboard() {
  const queryClient = useQueryClient();
  const [scanning, setScanning] = useState(false);
  const [showGloryBoard, setShowGloryBoard] = useState(true);

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity
  });

  const { data: scoops = [] } = useQuery({
    queryKey: ["competitive-scoops"],
    queryFn: () =>
      base44.entities.CompetitiveScoops.filter({}, "-discovered_at", 50),
    staleTime: 30_000
  });

  const { data: gloryBoard = [] } = useQuery({
    queryKey: ["tracker-glory"],
    queryFn: () =>
      base44.entities.TrackerGlory.filter({}, "-glory_points", 10),
    staleTime: 60_000
  });

  const scanMutation = useMutation({
    mutationFn: async () => {
      setScanning(true);
      const res = await base44.functions.invoke('paparazziTracker', {});
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["competitive-scoops"]);
      queryClient.invalidateQueries(["tracker-glory"]);
      setScanning(false);
    },
    onError: () => setScanning(false)
  });

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
        <p className="text-muted-foreground font-medium">Admin access required</p>
      </div>
    );
  }

  const exclusiveScoops = scoops.filter(s => s.status === 'exclusive');
  const topScoop = exclusiveScoops[0];

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "Dashboard",
    "name": "Tableau de bord Paparazzi — Courses de scoops",
    "description": "Courses de scoops compétitifs en temps réel. Suivez les dernières news, gagnez des points de gloire, dominez le classement."
  };

  return (
    <div className="pb-20 space-y-8 max-w-6xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Tableau de bord Paparazzi — Course aux scoops | CirculAI"
        description="Chassez les dernières news, rivalise avec les autres, gagne la gloire. Suivi des scoops en temps réel avec classement de vitesse et Hall of Fame."
        keywords="paparazzi, dernières news, suivi compétitif, course aux scoops, intelligence"
        canonicalUrl="https://egor69.ca/paparazzi"
        schemaData={seoSchema}
      />

      {/* Hero - Paparazzi Mode */}
      <div className="rounded-3xl p-10 text-center bg-gradient-to-br from-red-500/15 via-orange-500/15 to-purple-500/15 border-2 border-orange-400">
        <Flame className="h-14 w-14 text-orange-600 mx-auto mb-3 animate-pulse" />
        <h1 className="font-display text-5xl font-black text-foreground animate-pulse">
          🎬 MODE PAPARAZZI
        </h1>
        <p className="text-lg font-bold text-orange-700 mt-2">
          COURRIR POUR LE SCOOP. REMPORTER LA GLOIRE. FAIRE LES GROS TITRES.
        </p>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Renseignement compétitif accéléré. Brisez les news avant tous les autres. Accumulez des points de gloire et grimpez au Hall of Fame.
        </p>
      </div>

      {/* Breaking News Alert */}
      {topScoop && (
        <div className="rounded-2xl border-3 border-red-500 bg-gradient-to-r from-red-50 to-orange-50 p-6 flex items-start gap-4 animate-pulse">
          <Rocket className="h-8 w-8 text-red-600 flex-shrink-0 mt-1 animate-bounce" />
          <div className="flex-1">
            <p className="font-black text-lg text-red-800">🚨 BREAKING NEWS - EXCLUSIVE SCOOP</p>
            <p className="text-base font-bold text-red-700 mt-1">{topScoop.headline_impact}</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              <Badge className="bg-red-500 text-white border-0">⚡ BREAKING</Badge>
              <Badge className="bg-amber-500 text-white border-0">⭐ {topScoop.glory_points} GLORY</Badge>
              <Badge className="bg-purple-500 text-white border-0">{topScoop.competitor}</Badge>
            </div>
          </div>
        </div>
      )}

      {/* Hunt Control */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border-2 border-red-300 p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-black text-xl text-red-900 flex items-center gap-2">
              <Newspaper className="h-6 w-6" /> Hunt for Exclusive Scoops
            </h2>
            <p className="text-sm text-red-800 mt-1">
              Race to find breaking news first. Speed = Glory Points.
            </p>
          </div>
          <Button
            onClick={() => scanMutation.mutate()}
            disabled={scanning || scanMutation.isPending}
            className="rounded-xl font-black text-lg gap-2 bg-red-600 hover:bg-red-700 text-white border-0 px-6 py-3 animate-pulse">
            {scanning || scanMutation.isPending ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> 🔥 CHASSE EN COURS...</>
            ) : (
              <><Rocket className="h-5 w-5" /> 🎬 DÉMARRER LA CHASSE</>
            )}
          </Button>
        </div>
      </div>

      {/* Hall of Fame */}
      {gloryBoard.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-400 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-2xl text-amber-900 flex items-center gap-2">
              <Crown className="h-7 w-7" /> Hall of Fame
            </h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowGloryBoard(!showGloryBoard)}>
              {showGloryBoard ? 'Masquer' : 'Afficher'}
            </Button>
          </div>

          {showGloryBoard && (
            <div className="space-y-2">
              {gloryBoard.map((tracker, i) => {
                const medal =
                  i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;

                return (
                  <div
                    key={tracker.id}
                    className={`rounded-xl p-4 border-2 flex items-center justify-between transition-all ${
                      i === 0
                        ? 'bg-yellow-100 border-yellow-400 shadow-lg scale-105'
                        : 'bg-white border-amber-200'
                    }`}>
                    <div className="flex items-center gap-4">
                      <span className="text-4xl font-black">{medal}</span>
                      <div>
                        <p className="font-black text-lg text-foreground">
                          {tracker.tracker_name}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {tracker.reporter_badge}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-amber-600">
                        {tracker.glory_points}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tracker.breaking_exclusives} 🚨
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Exclusive Scoops Grid */}
      {scoops.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-black text-2xl text-foreground flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-600" /> Derniers scoops
            <Badge className="bg-orange-100 text-orange-800 border-0">
              {exclusiveScoops.length} exclusif
            </Badge>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scoops.slice(0, 12).map((scoop) => (
              <div
                key={scoop.id}
                className={`rounded-2xl border-2 p-5 space-y-3 transition-all hover:shadow-lg hover:-translate-y-1 ${
                  scoop.status === 'exclusive'
                    ? 'border-orange-400 bg-gradient-to-br from-orange-50 to-red-50'
                    : 'border-border bg-card'
                }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-black text-sm leading-snug text-foreground">
                      {scoop.headline}
                    </p>
                  </div>
                  {scoop.status === 'exclusive' && (
                    <Badge className="bg-red-500 text-white border-0 whitespace-nowrap text-xs font-black animate-pulse">
                      🚨 EXCLUSIVE
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">
                  {scoop.competitor}
                </p>

                <div className="space-y-2 pt-2 border-t border-current/10">
                  {/* Importance */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Impact
                    </span>
                    <div className="flex gap-1">
                      {Array.from({ length: scoop.importance_level }).map((_, i) => (
                        <span key={i} className="text-xs">⭐</span>
                      ))}
                    </div>
                  </div>

                  {/* Glory Points */}
                  <div className="flex items-center justify-between bg-white/50 rounded px-2 py-1">
                    <span className="text-[10px] font-bold text-amber-700">GLORY</span>
                    <span className="font-black text-amber-700">
                      +{scoop.glory_points || 0}
                    </span>
                  </div>

                  {/* Action Priority */}
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        scoop.action_priority === 'urgent'
                          ? 'bg-red-100 text-red-800 border-0'
                          : scoop.action_priority === 'critical'
                            ? 'bg-orange-100 text-orange-800 border-0'
                            : 'bg-yellow-100 text-yellow-800 border-0'
                      }>
                      {scoop.action_priority.toUpperCase()}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(scoop.discovered_at).toLocaleTimeString('en-CA', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {scoops.length === 0 && !scanning && (
        <div className="text-center py-16 bg-card rounded-2xl border-2 border-dashed border-border">
          <Newspaper className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-bold">Aucun scoop encore</p>
          <p className="text-sm text-muted-foreground mt-1">
           Commencez à chasser les dernières news et les histoires exclusives
          </p>
        </div>
      )}

      {/* Stats */}
      {scoops.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-200 p-4 text-center">
            <p className="text-3xl font-black text-red-600">{scoops.length}</p>
            <p className="text-xs text-red-700 mt-1 font-bold">Scoops totaux</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border-2 border-orange-200 p-4 text-center">
            <p className="text-3xl font-black text-orange-600">{exclusiveScoops.length}</p>
            <p className="text-xs text-orange-700 mt-1 font-bold">Exclusifs</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200 p-4 text-center">
            <p className="text-3xl font-black text-amber-600">
              {scoops.reduce((sum, s) => sum + (s.glory_points || 0), 0)}
            </p>
            <p className="text-xs text-amber-700 mt-1 font-bold">Gloire totale</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border-2 border-cyan-200 p-4 text-center">
            <p className="text-3xl font-black text-cyan-600">
              {scoops.filter(s => s.action_priority === 'urgent').length}
            </p>
            <p className="text-xs text-cyan-700 mt-1 font-bold">Actions urgentes</p>
          </div>
        </div>
      )}
    </div>
  );
}