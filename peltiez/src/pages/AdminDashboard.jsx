import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useMemo } from "react";
import { BarChart3, TrendingUp, Users, Package, DollarSign, Leaf, ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import AnimatedCounter from "@/components/AnimatedCounter";
import LiveMembershipSubscriptionsChart from "@/components/LiveMembershipSubscriptionsChart";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { data: currentUser } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity,
  });

  const { data: listings = [] } = useQuery({
    queryKey: ["listings-all"],
    queryFn: () => base44.entities.Listing.list("-created_date", 10000),
    staleTime: 30_000,
  });

  const { data: ecoProfiles = [] } = useQuery({
    queryKey: ["eco-profiles-all"],
    queryFn: () => base44.entities.EcoProfile.list("-created_date", 10000),
    staleTime: 60_000,
  });

  // Hooks MUST be called unconditionally
  const stats = useMemo(() => {
    const activeListings = listings.filter((l) => l.status === "actif").length;
    const totalCO2 = listings.reduce((sum, l) => sum + (l.co2_saved || 0), 0);
    const totalRevenue = listings.filter((l) => l.type === "vente").reduce((sum, l) => sum + (l.price || 0), 0);
    const typeBreakdown = {
      don: listings.filter((l) => l.type === "don").length,
      vente: listings.filter((l) => l.type === "vente").length,
      réparation: listings.filter((l) => l.type === "réparation").length,
      échange: listings.filter((l) => l.type === "échange").length,
    };

    return { activeListings, totalCO2: Math.round(totalCO2), totalRevenue: Math.round(totalRevenue), typeBreakdown };
  }, [listings]);

  const growth = useMemo(() => {
    const thisMonth = listings.filter((l) => {
      const d = new Date(l.created_date);
      return d.getMonth() === new Date().getMonth();
    }).length;

    return thisMonth;
  }, [listings]);

  const cityStats = useMemo(() => {
    const cities = {};
    ecoProfiles.forEach((profile) => {
      if (profile.city) {
        cities[profile.city] = (cities[profile.city] || 0) + 1;
      }
    });
    return Object.entries(cities)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [ecoProfiles]);

  const newUsersThisMonth = useMemo(() => {
    return ecoProfiles.filter((p) => {
      const d = new Date(p.created_date);
      return d.getMonth() === new Date().getMonth();
    }).length;
  }, [ecoProfiles]);

  // Check admin AFTER hooks
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Accès admin requis</p>
          <Button onClick={() => navigate("/")} variant="outline" className="rounded-xl">
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 space-y-6">
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
        <h1 className="font-display text-3xl font-bold text-foreground">Tableau de bord Admin</h1>
        <Button variant="outline" size="sm" className="ml-auto rounded-xl" asChild>
          <Link to="/plateforme/temps-reel">Vue plein écran temps réel</Link>
        </Button>
      </div>

      <LiveMembershipSubscriptionsChart className="mb-6" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Package, label: "Annonces actives", value: stats.activeListings, color: "from-blue-500/20 to-cyan-500/20" },
          { icon: Users, label: "Utilisateurs", value: ecoProfiles.length, color: "from-purple-500/20 to-pink-500/20" },
          { icon: Leaf, label: "CO₂ Évité (kg)", value: stats.totalCO2, color: "from-emerald-500/20 to-teal-500/20" },
          { icon: TrendingUp, label: "Cette semaine", value: growth, color: "from-amber-500/20 to-orange-500/20" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className={`rounded-xl p-4 bg-gradient-to-br ${color} border border-white/10`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{label}</p>
                <p className="text-3xl font-bold text-foreground">
                  <AnimatedCounter target={value} />
                </p>
              </div>
              <Icon className="h-8 w-8 text-muted-foreground/40" />
            </div>
          </div>
        ))}
      </div>

      {/* Growth & Cities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl p-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Nouveaux inscrits ce mois</p>
              <p className="text-3xl font-bold text-foreground">
                <AnimatedCounter target={newUsersThisMonth} />
              </p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground/40" />
          </div>
        </div>
        <div className="rounded-xl p-4 bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Objets ce mois</p>
              <p className="text-3xl font-bold text-foreground">
                <AnimatedCounter target={growth} />
              </p>
            </div>
            <Package className="h-8 w-8 text-muted-foreground/40" />
          </div>
        </div>
      </div>

      {/* Type breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> Répartition par type
          </h2>
          <div className="space-y-2">
            {Object.entries(stats.typeBreakdown).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground capitalize">{type}</span>
                <div className="flex items-center gap-3">
                  <div className="h-2 bg-muted rounded-full flex-1 w-40">
                    <div
                      className="h-2 bg-primary rounded-full"
                      style={{ width: `${(count / listings.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-foreground">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5" /> Revenus (ventes)
          </h2>
          <div className="space-y-3">
            <p className="text-3xl font-bold text-primary">
              <AnimatedCounter target={stats.totalRevenue} />$ CAD
            </p>
            <p className="text-xs text-muted-foreground">{stats.typeBreakdown.vente} transactions</p>
          </div>
        </div>
      </div>

      {/* Cities Breakdown */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" /> Croissance par ville
        </h2>
        <div className="space-y-3">
          {cityStats.length > 0 ? (
            cityStats.map(({ city, count }, i) => (
              <div key={city} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">#{i + 1} {city}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 bg-muted rounded-full w-32">
                    <div
                      className="h-2 bg-primary rounded-full"
                      style={{ width: `${(count / Math.max(...cityStats.map(s => s.count), 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-primary text-right w-12">{count}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Aucune donnée de ville</p>
          )}
        </div>
      </div>

      {/* Top performers */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold text-foreground mb-4">Top Contributeurs</h2>
        <div className="space-y-3">
          {ecoProfiles
            .sort((a, b) => (b.total_co2_saved || 0) - (a.total_co2_saved || 0))
            .slice(0, 5)
            .map((profile, i) => (
              <div key={profile.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-foreground">
                  #{i + 1} {profile.display_name}
                </span>
                <span className="text-sm font-bold text-primary">+{(profile.total_co2_saved || 0).toFixed(1)} kg</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}