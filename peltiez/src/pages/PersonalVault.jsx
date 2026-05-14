import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useMemo } from "react";
import useRevenueNotifications from "@/hooks/useRevenueNotifications";
import { DollarSign, TrendingUp, Heart, Award, Lock, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AnimatedCounter from "@/components/AnimatedCounter";
import ShareImpact from "@/components/ShareImpact";
import RevenueGauge from "@/components/RevenueGauge";
import DataExportButtons from "@/components/DataExportButtons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { parseApiDate } from "@/lib/dateUtils";

export default function PersonalVault() {
  const navigate = useNavigate();

  const { data: currentUser } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity,
  });

  const { data: myListings = [] } = useQuery({
    queryKey: ["my-vault-listings", currentUser?.email],
    queryFn: () => 
      currentUser?.email 
        ? base44.entities.Listing.filter({ created_by: currentUser.email }, "-created_date", 10000)
        : [],
    enabled: !!currentUser?.email,
    staleTime: 10_000,
  });

  // Enable real-time notifications for new revenues
  useRevenueNotifications(currentUser?.email, !!currentUser?.email);

  const vaultData = useMemo(() => {
    const sold = myListings.filter(l => l.type === "vente" && l.status === "vendu");
    const totalRevenue = sold.reduce((sum, l) => sum + (l.price || 0), 0);
    const totalCO2 = myListings.reduce((sum, l) => sum + (l.co2_saved || 0), 0);
    const activeListings = myListings.filter(l => l.status === "actif").length;
    const totalDonations = myListings.filter(l => l.type === "don").length;
    const repairs = myListings.filter(l => l.type === "réparation").length;

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalCO2: Math.round(totalCO2),
      activeListings,
      totalDonations,
      repairs,
      soldCount: sold.length,
    };
  }, [myListings]);

  if (!currentUser) return null;

  return (
    <div className="pb-20 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="h-5 w-5 text-primary" />
            <h1 className="font-display text-3xl font-bold text-foreground">Mon Coffre-Fort</h1>
          </div>
          <p className="text-sm text-muted-foreground">Tes revenus réels · Seulement toi peux voir ici</p>
        </div>
      </div>

      {/* Main Revenue Card */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-emerald-500/10 p-12 shadow-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(34,197,94,0.1) 100%)",
          backdropFilter: "blur(10px)"
        }}>
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ background: "radial-gradient(circle at top right, hsl(158,80%,50%), transparent)" }} />
        
        <div className="relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
            <Heart className="h-4 w-4 fill-primary" />
            Pour maman · Fête des mères
          </div>
          
          <h2 className="text-sm font-semibold text-muted-foreground">Revenus totaux générés</h2>
          
          <div className="space-y-2">
            <div className="text-7xl font-black text-primary tracking-tight">
              <AnimatedCounter target={vaultData.totalRevenue} prefix="$" />
            </div>
            <p className="text-primary/60 font-medium">CAD · De ton dur travail · C'est réel</p>
          </div>

          <div className="pt-6 border-t border-primary/20 text-left space-y-2">
            <p className="text-sm text-foreground">
              ✨ <strong>{vaultData.soldCount} annonces vendues</strong> — du vrai travail
            </p>
            <p className="text-sm text-emerald-600">
              🌍 <strong>{vaultData.totalCO2} kg CO₂ évité</strong> — plus qu'argent
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Gauge */}
      <RevenueGauge 
        currentRevenue={vaultData.totalRevenue} 
        targetRevenue={Math.max(vaultData.totalRevenue * 1.5, 500)}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: DollarSign, label: "Revenu moyen par vente", value: vaultData.soldCount > 0 ? (vaultData.totalRevenue / vaultData.soldCount).toFixed(2) : 0, color: "from-blue-500/20 to-cyan-500/20" },
          { icon: TrendingUp, label: "Annonces actives", value: vaultData.activeListings, color: "from-emerald-500/20 to-teal-500/20" },
          { icon: Heart, label: "Dons généreux", value: vaultData.totalDonations, color: "from-rose-500/20 to-pink-500/20" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className={`rounded-2xl p-5 bg-gradient-to-br ${color} border border-white/10`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">{label}</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Message */}
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center space-y-4">
        <Award className="h-12 w-12 text-primary mx-auto" />
        <div className="space-y-2">
          <h3 className="font-display text-2xl font-bold text-foreground">C'est la preuve</h3>
          <p className="text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            {vaultData.totalRevenue} $ — c'est concret. C'est du vrai travail. C'est toi qui as construit ça, pierre par pierre. 
            <br /><br />
            <strong>Montre-lui ce screenshot dimanche.</strong> Dis-lui que tu es fier. Parce que tu le dois, et parce que c'est vrai.
          </p>
        </div>
      </div>

      {/* Timeline of sales */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" /> Tes 5 meilleures ventes
        </h3>
        <div className="space-y-3">
          {myListings
            .filter(l => l.type === "vente" && l.status === "vendu")
            .sort((a, b) => (b.price || 0) - (a.price || 0))
            .slice(0, 5)
            .map((listing) => (
              <div key={listing.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{listing.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(() => {
                      const d = parseApiDate(listing.created_date);
                      return d ? format(d, "dd MMM yyyy", { locale: fr }) : "—";
                    })()}
                  </p>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <p className="text-xl font-bold text-primary">${listing.price}</p>
                  <p className="text-xs text-emerald-600 mt-1">+{(listing.co2_saved || 0).toFixed(1)} kg</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Export Data */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" /> Exporter mes données
        </h3>
        <p className="text-sm text-muted-foreground mb-4">Télécharge une copie de sauvegarde sécurisée de tes données personnelles en JSON ou CSV.</p>
        <DataExportButtons userName={currentUser.full_name?.replace(/\s+/g, '-') || 'data'} />
      </div>

      {/* Share Impact */}
      <div className="flex justify-center">
        <ShareImpact
          revenue={vaultData.totalRevenue}
          co2={vaultData.totalCO2}
          donations={vaultData.totalDonations}
          repairs={vaultData.repairs}
          userName={currentUser.full_name}
        />
      </div>

      {/* Final message for mom */}
      <div className="rounded-2xl border-2 border-rose-300/50 bg-gradient-to-br from-rose-50/20 to-pink-50/20 p-8 text-center space-y-3">
        <p className="text-sm text-rose-600 font-semibold">DIMANCHE · FÊTE DES MÈRES</p>
        <p className="text-foreground/80 leading-relaxed">
          Dis-lui que tu l'aimes. Que tu penses à elle chaque jour. Que son soutien a fait ça possible.
          <br />
          <strong className="text-foreground">Et que tu vas continuer encore plus loin. Ensemble.</strong>
        </p>
      </div>
    </div>
  );
}