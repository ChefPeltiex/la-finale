import { useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CosmicProfileWidget from "@/components/CosmicProfileWidget";
import { base44 } from "@/api/base44Client";
import UserImpactDashboard from "@/components/UserImpactDashboard";
import { Leaf, Package, LogOut, Loader2, Heart, Wrench, Gift, RefreshCw, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BadgesDisplay from "@/components/BadgesDisplay";
import { Link } from "react-router-dom";
import ReputationBar from "@/components/ReputationBar";

const TYPE_CONFIG = {
  vente:      { label: "Vente",      color: "bg-blue-100 text-blue-700",    icon: Package },
  don:        { label: "Don",        color: "bg-emerald-100 text-emerald-700", icon: Gift },
  réparation: { label: "Réparation", color: "bg-amber-100 text-amber-700",  icon: Wrench },
  échange:    { label: "Échange",    color: "bg-purple-100 text-purple-700", icon: RefreshCw },
};

const LEVEL_COLORS = {
  "Graine 🌱":   "from-green-400 to-emerald-600",
  "Pousse 🌿":   "from-emerald-400 to-green-600",
  "Arbre 🌳":    "from-teal-400 to-emerald-700",
  "Forêt 🌲":    "from-green-500 to-teal-700",
  "Gardien 🌍":  "from-emerald-500 to-teal-800",
};

export default function Profile() {
  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity,
  });

  const { data: listings = [], isLoading: loadingListings } = useQuery({
    queryKey: ["my-listings", user?.email],
    queryFn: () => base44.entities.Listing.filter({ created_by: user.email }, "-created_date", 50),
    enabled: !!user,
    staleTime: 30_000,
  });

  const { data: ecoProfile } = useQuery({
    queryKey: ["eco-profile", user?.email],
    queryFn: () => base44.entities.EcoProfile.filter({ user_email: user.email }, "-created_date", 1).then(r => r[0] || null),
    enabled: !!user,
    staleTime: 30_000,
  });

  // Auto-update earned badges based on activity
  useEffect(() => {
    if (!ecoProfile || !user) return;
    const BADGE_CRITERIA = {
      "eco-pioneer": () => ecoProfile.total_co2_saved >= 50,
      "planet-guardian": () => ecoProfile.total_co2_saved >= 500,
      "sharer": () => ecoProfile.total_donations >= 10,
      "fixer": () => ecoProfile.total_repairs >= 20,
      "educator": () => ecoProfile.total_tutorials >= 5,
      "socializer": () => ecoProfile.total_objects_saved >= 30,
      "rising-star": () => ecoProfile.level === "Pousse 🌿",
      "legend": () => ecoProfile.level === "Gardien 🌍",
    };
    const newBadges = Object.keys(BADGE_CRITERIA).filter(id => BADGE_CRITERIA[id]());
    const currentBadges = ecoProfile.earned_badge_ids || [];
    const hasNewBadges = newBadges.some(id => !currentBadges.includes(id));
    if (hasNewBadges) {
      const uniqueBadges = [...new Set([...currentBadges, ...newBadges])];
      base44.entities.EcoProfile.update(ecoProfile.id, { earned_badge_ids: uniqueBadges });
    }
  }, [ecoProfile, user]);

  const { data: favoris = [] } = useQuery({
    queryKey: ["favoris", user?.email],
    queryFn: () => base44.entities.Favori.filter({ user_email: user.email }, "-created_date", 50),
    enabled: !!user,
    staleTime: 30_000,
  });

  const stats = useMemo(() => ({
    total: listings.length,
    actif: listings.filter(l => l.status === "actif").length,
    vendu: listings.filter(l => l.status === "vendu").length,
    co2: listings.reduce((s, l) => s + (l.co2_saved || 0), 0).toFixed(1),
  }), [listings]);

  const level = ecoProfile?.level || "Graine 🌱";
  const levelGradient = LEVEL_COLORS[level] || LEVEL_COLORS["Graine 🌱"];

  if (loadingUser) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="pb-20 space-y-6 max-w-3xl mx-auto">
      {/* Impact Dashboard */}
      {ecoProfile && (
        <UserImpactDashboard listings={listings} ecoProfile={ecoProfile} />
      )}

      {/* Profile card */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className={`h-20 bg-gradient-to-r ${levelGradient} opacity-20`} />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-8 mb-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-2xl shadow-md ring-4 ring-card">
              {ecoProfile?.avatar_emoji || "🌱"}
            </div>
            <div className="pb-1">
              <h1 className="font-display text-xl font-bold text-foreground">{user?.full_name || "Utilisateur"}</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-5">
            <Badge className="bg-primary/10 text-primary border-primary/20 font-medium">{level}</Badge>
            {ecoProfile?.city && <span className="text-xs text-muted-foreground">📍 {ecoProfile.city}</span>}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: "Annonces", val: stats.total },
              { label: "Actives", val: stats.actif, cls: "text-primary" },
              { label: "Vendues", val: stats.vendu },
              { label: "kg CO₂", val: stats.co2, cls: "text-emerald-600" },
            ].map(({ label, val, cls }) => (
              <div key={label} className="text-center p-3 rounded-xl bg-muted">
                <p className={`text-lg font-bold ${cls || "text-foreground"}`}>{val}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <Button asChild variant="secondary" className="rounded-xl w-full mb-2">
            <Link to="/mon-univers">
              <Gem className="h-4 w-4 mr-2" /> Mon univers · props & thèmes
            </Link>
          </Button>
          <Button variant="outline" className="rounded-xl w-full" onClick={() => base44.auth.logout()}>
            <LogOut className="h-4 w-4 mr-2" /> Se déconnecter
          </Button>
        </div>
      </div>

      {/* Favoris */}
      {favoris.length > 0 && (
        <div>
          <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" /> Mes favoris
            <Badge variant="secondary" className="ml-auto">{favoris.length}</Badge>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {favoris.slice(0, 4).map(f => (
              <Link key={f.id} to={`/annonce/${f.listing_id}`}
                className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border hover:border-primary/30 transition-all">
                {f.listing_image
                  ? <img src={f.listing_image} alt={f.listing_title} className="h-12 w-12 rounded-lg object-cover flex-shrink-0" />
                  : <div className="h-12 w-12 rounded-lg bg-muted flex-shrink-0" />
                }
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{f.listing_title}</p>
                  <p className="text-xs text-muted-foreground">{f.folder}</p>
                </div>
                {f.listing_price > 0 && (
                  <span className="text-xs font-bold text-primary ml-auto shrink-0">{f.listing_price} $</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Reputation Bar */}
      <ReputationBar listings={listings} />

      {/* Carte du Ciel */}
      <CosmicProfileWidget user={user} />

      {/* Badges */}
      <BadgesDisplay userBadges={user?.badges || []} totalCO2={parseFloat(stats.co2) || 0} />

      {/* My listings */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Package className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-bold text-foreground">Mes annonces</h2>
          <Badge variant="secondary" className="ml-auto">{stats.actif} actives</Badge>
        </div>

        {loadingListings ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
            <Leaf className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucune annonce publiée</p>
            <Button asChild size="sm" className="mt-3 rounded-xl">
              <Link to="/publier">Publier ma première annonce</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {listings.map(l => {
              const cfg = TYPE_CONFIG[l.type] || TYPE_CONFIG.don;
              const Icon = cfg.icon;
              return (
                <Link key={l.id} to={`/annonce/${l.id}`}
                  className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:border-primary/20 hover:shadow-sm transition-all">
                  {l.image_url
                    ? <img src={l.image_url} alt={l.title} className="h-12 w-12 rounded-xl object-cover flex-shrink-0" />
                    : <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{l.title}</p>
                    <p className="text-xs text-muted-foreground">{l.location || "Sans localisation"}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                    <span className={`text-[10px] ${l.status === "actif" ? "text-emerald-600" : "text-muted-foreground"}`}>
                      {l.status === "actif" ? "● Actif" : l.status}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}