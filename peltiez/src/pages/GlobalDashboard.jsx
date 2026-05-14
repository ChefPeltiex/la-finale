import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SEOMeta from "@/components/SEOMeta";
import { Activity, Leaf, Hash, TrendingUp, Zap, Globe, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AnimatedCounter from "@/components/AnimatedCounter";

export default function GlobalDashboard() {
  const [syncAlerts, setSyncAlerts] = useState([]);

  // Récupérer user
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me(), staleTime: Infinity });

  // Récupérer quêtes bien-être
  const { data: quests = [] } = useQuery({
    queryKey: ["wellness-quests-global", user?.email],
    queryFn: async () => {
      if (!user) return [];
      return base44.entities.WellnessQuest.filter({ user_email: user.email }, "-started_at", 100);
    },
    enabled: !!user,
    staleTime: 30_000,
    refetchInterval: 10_000
  });

  // Récupérer profil eco
  const { data: ecoProfile } = useQuery({
    queryKey: ["eco-profile-global", user?.email],
    queryFn: async () => {
      if (!user) return null;
      return base44.entities.EcoProfile.filter({ user_email: user.email }, "-created_date", 1).then(r => r[0]);
    },
    enabled: !!user,
    staleTime: 60_000
  });

  // Récupérer profil numérologie
  const { data: numer } = useQuery({
    queryKey: ["numerology-global", user?.email],
    queryFn: async () => {
      if (!user) return null;
      return base44.entities.NumerologyProfile.filter({ user_email: user.email }, "-created_date", 1).then(r => r[0]);
    },
    enabled: !!user,
    staleTime: 60_000
  });

  // Subscriptions temps réel
  useEffect(() => {
    if (!user) return;

    const unsubQuests = base44.entities.WellnessQuest.subscribe(event => {
      if (event.type === 'update' && event.data?.user_email === user.email && event.data?.status === 'completed') {
        setSyncAlerts(prev => [...prev, {
          id: event.id,
          alert_type: 'energy_peak',
          title: `Quête complétée: ${event.data.title}`,
          description: `Tu as terminé une quête! +${event.data.xp_reward} XP`,
          intensity: 7,
          number: event.data.xp_reward
        }]);
      }
    });

    return () => unsubQuests();
  }, [user]);

  const stats = useMemo(() => ({
    activeQuests: quests.filter(q => q.status === 'active').length,
    completedQuests: quests.filter(q => q.status === 'completed').length,
    totalXp: quests.reduce((s, q) => s + (q.xp_reward || 0), 0),
    co2Saved: ecoProfile?.total_co2_saved || 0,
    level: ecoProfile?.level || 'Graine 🌱'
  }), [quests, ecoProfile]);

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "Dashboard",
    "name": "Tableau de Bord Global — Quêtes, Impact, Synchronicités",
    "description": "Suivi en temps réel de la progression des quêtes bien-être, impacts écologiques et synchronicités numériques."
  };

  return (
    <div className="pb-20 space-y-10 max-w-7xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Tableau de Bord Global — Quêtes, Impact, Synchronicités"
        description="Suivi en temps réel: quêtes bien-être, impact écologique cumulé, synchronicités numérologiques actives."
        keywords="dashboard, quêtes, bien-être, impact écologique, numérologie, synchronicités"
        canonicalUrl="https://egor69.ca/global-dashboard"
        schemaData={seoSchema}
      />

      {/* Hero */}
      <div className="rounded-3xl p-10 text-center bg-gradient-to-br from-primary/10 to-emerald-500/10 border border-primary/20">
        <Globe className="h-12 w-12 text-primary mx-auto mb-3" />
        <h1 className="font-display text-3xl font-black text-foreground">Tableau de Bord Global</h1>
        <p className="text-muted-foreground mt-2">Suivi en temps réel de ta progression cosmique</p>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-5 w-5 text-emerald-500" />
            <span className="text-xs font-bold text-muted-foreground uppercase">Quêtes Actives</span>
          </div>
          <p className="text-4xl font-black text-foreground">{stats.activeQuests}</p>
          <p className="text-xs text-emerald-600 mt-2 font-medium">{stats.completedQuests} complétées</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="h-5 w-5 text-emerald-500" />
            <span className="text-xs font-bold text-muted-foreground uppercase">CO₂ Économisé</span>
          </div>
          <p className="text-4xl font-black text-foreground"><AnimatedCounter target={Math.round(stats.co2Saved)} /></p>
          <p className="text-xs text-emerald-600 mt-2 font-medium">kg d'impact positif</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-5 w-5 text-amber-500" />
            <span className="text-xs font-bold text-muted-foreground uppercase">XP Total</span>
          </div>
          <p className="text-4xl font-black text-foreground"><AnimatedCounter target={stats.totalXp} /></p>
          <p className="text-xs text-amber-600 mt-2 font-medium">Points d'expérience</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-4">
            <Award className="h-5 w-5 text-violet-500" />
            <span className="text-xs font-bold text-muted-foreground uppercase">Niveau</span>
          </div>
          <p className="text-2xl font-black text-foreground">{stats.level}</p>
          <Badge variant="secondary" className="mt-2 text-[10px]">Progression cosmique</Badge>
        </div>
      </div>

      {/* Numéro actif */}
      {numer?.life_path_number && (
        <div className="rounded-2xl border border-border bg-gradient-to-br from-violet-500/5 to-purple-500/5 p-8">
          <div className="flex items-center gap-3 mb-4">
            <Hash className="h-5 w-5 text-violet-500" />
            <h2 className="font-bold text-foreground">Synchronicité Numérique Active</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="text-center p-6 rounded-xl bg-white/5">
              <p className="text-xs text-muted-foreground uppercase font-bold mb-2">Chemin de Vie</p>
              <p className="text-6xl font-black text-violet-500">{numer.life_path_number}</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/5">
              <p className="text-xs text-muted-foreground uppercase font-bold mb-2">Année Personnelle</p>
              <p className="text-6xl font-black text-violet-500">{numer.current_year_number}</p>
            </div>
          </div>
          {numer.lucky_numbers?.length > 0 && (
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Nombres porte-bonheur: <span className="text-violet-600 font-bold">{numer.lucky_numbers.join(', ')}</span>
            </p>
          )}
        </div>
      )}

      {/* Quêtes en cours */}
      {quests.filter(q => q.status === 'active').length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" /> Quêtes en Cours
          </h2>
          <div className="space-y-3">
            {quests.filter(q => q.status === 'active').slice(0, 5).map(quest => {
              const progress = (quest.progress / quest.target_days) * 100;
              return (
                <div key={quest.id} className="bg-card rounded-xl border border-border p-4 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm text-foreground">{quest.title}</p>
                    <Badge variant="outline" className="text-xs">{quest.progress}/{quest.target_days}</Badge>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Alertes de synchronicité */}
      {syncAlerts.length > 0 && (
        <div className="rounded-2xl border border-amber-200/30 bg-amber-500/5 p-6">
          <h2 className="font-bold text-foreground flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-amber-500" /> Synchronicités Détectées
          </h2>
          <div className="space-y-2">
            {syncAlerts.slice(-3).map(alert => (
              <div key={alert.id} className="text-xs p-3 rounded-lg bg-white/5 border border-amber-200/20">
                <p className="font-bold text-amber-600">{alert.title}</p>
                <p className="text-muted-foreground mt-1">{alert.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}