import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SEOMeta from "@/components/SEOMeta";
import { AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AnimatedCounter from "@/components/AnimatedCounter";

function NumerologyCard({ numer }) {
  if (!numer) return null;

  return (
    <div className="rounded-2xl border border-violet-200/30 bg-gradient-to-br from-violet-500/5 to-purple-500/5 p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <span className="text-2xl">🔢</span> Profil Numérologique
        </h3>
        <Badge className="bg-violet-100 text-violet-700 border-violet-200">Actif</Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="text-center p-3 rounded-lg bg-white/5">
          <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Chemin de Vie</p>
          <p className="text-3xl font-black text-violet-500">{numer.life_path_number}</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-white/5">
          <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Destin</p>
          <p className="text-3xl font-black text-purple-500">{numer.destiny_number}</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-white/5">
          <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Année</p>
          <p className="text-3xl font-black text-indigo-500">{numer.current_year_number}</p>
        </div>
      </div>

      {numer.lucky_numbers?.length > 0 && (
        <div className="pt-3 border-t border-violet-200/20">
          <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Nombres Porte-Bonheur</p>
          <div className="flex gap-2 flex-wrap">
            {numer.lucky_numbers.map((num, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-sm font-bold bg-violet-100 text-violet-700">
                {num}
              </span>
            ))}
          </div>
        </div>
      )}

      {numer.year_forecast && (
        <div className="pt-3 border-t border-violet-200/20">
          <p className="text-xs font-bold text-violet-600 mb-2">Prédiction Annuelle</p>
          <p className="text-xs text-foreground/70 leading-relaxed italic">"{numer.year_forecast}"</p>
        </div>
      )}
    </div>
  );
}

function AstrologyCard({ sunSign, moonSign, ascendant }) {
  return (
    <div className="rounded-2xl border border-amber-200/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5 p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <span className="text-2xl">♈</span> Cycles Astrologiques
        </h3>
        <Badge className="bg-amber-100 text-amber-700 border-amber-200">En direct</Badge>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-4 rounded-lg bg-white/5">
          <p className="text-xs text-muted-foreground uppercase font-bold mb-2">Soleil</p>
          <p className="text-lg font-bold text-amber-600">{sunSign || "—"}</p>
        </div>
        <div className="text-center p-4 rounded-lg bg-white/5">
          <p className="text-xs text-muted-foreground uppercase font-bold mb-2">Lune</p>
          <p className="text-lg font-bold text-cyan-600">{moonSign || "—"}</p>
        </div>
        <div className="text-center p-4 rounded-lg bg-white/5">
          <p className="text-xs text-muted-foreground uppercase font-bold mb-2">Ascendant</p>
          <p className="text-lg font-bold text-indigo-600">{ascendant || "—"}</p>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground text-center pt-2 italic">
        Carte natale mise à jour selon la date du jour
      </p>
    </div>
  );
}

function WellnessCard({ quests, ecoProfile }) {
  const activeCount = quests.filter(q => q.status === "active").length;
  const completedCount = quests.filter(q => q.status === "completed").length;
  const totalXp = quests.reduce((s, q) => s + (q.xp_reward || 0), 0);

  return (
    <div className="rounded-2xl border border-emerald-200/30 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <span className="text-2xl">🌿</span> Bien-Etre Impact
        </h3>
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Vivant</Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="text-center p-3 rounded-lg bg-white/5">
          <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Quetes Actives</p>
          <p className="text-3xl font-black text-emerald-500">{activeCount}</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-white/5">
          <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Completees</p>
          <p className="text-3xl font-black text-teal-500">{completedCount}</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-white/5">
          <p className="text-xs text-muted-foreground uppercase font-bold mb-1">XP Total</p>
          <p className="text-3xl font-black text-green-500"><AnimatedCounter target={totalXp} /></p>
        </div>
        <div className="text-center p-3 rounded-lg bg-white/5">
          <p className="text-xs text-muted-foreground uppercase font-bold mb-1">CO2 Economise</p>
          <p className="text-2xl font-black text-lime-600">
            {ecoProfile?.total_co2_saved ? Math.round(ecoProfile.total_co2_saved) : "0"}kg
          </p>
        </div>
      </div>

      {ecoProfile?.level && (
        <div className="pt-3 border-t border-emerald-200/20">
          <p className="text-xs font-bold text-emerald-600">Niveau d'Evolution</p>
          <Badge className="mt-2 bg-emerald-100 text-emerald-700 border-emerald-200">{ecoProfile.level}</Badge>
        </div>
      )}
    </div>
  );
}

function SynchronicityCard({ numer, ecoProfile }) {
  if (!numer && !ecoProfile) return null;

  const synchronicities = [];
  
  if (numer?.current_year_number) {
    synchronicities.push({
      title: `Année Numerique ${numer.current_year_number}`,
      desc: "Influence numérique majeure cette année",
      emoji: "🔢"
    });
  }
  
  if (ecoProfile?.earned_badge_ids?.length > 0) {
    synchronicities.push({
      title: `${ecoProfile.earned_badge_ids.length} Badges Deverrouilles`,
      desc: "Réalisations cosmiques confirmées",
      emoji: "👑"
    });
  }

  if (numer?.life_path_number === numer?.current_year_number) {
    synchronicities.push({
      title: "Alignement Karmique !",
      desc: "Votre chemin de vie résonance avec l'année",
      emoji: "⚡"
    });
  }

  return (
    <div className="rounded-2xl border border-pink-200/30 bg-gradient-to-br from-pink-500/5 to-rose-500/5 p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <span className="text-2xl">✨</span> Synchronicites Detectees
        </h3>
        <Badge className="bg-pink-100 text-pink-700 border-pink-200">Active</Badge>
      </div>

      {synchronicities.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">Aucune synchronicité majeure détectée pour le moment</p>
      ) : (
        <div className="space-y-2">
          {synchronicities.map((sync, i) => (
            <div key={i} className="p-3 rounded-lg bg-white/5 border border-pink-200/20">
              <p className="text-sm font-bold text-pink-600">
                {sync.emoji} {sync.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{sync.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NumerologyParanormalDashboard() {
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me(), staleTime: Infinity });

  const { data: numer, isLoading: loadingNumer } = useQuery({
    queryKey: ["numerology-profile", user?.email],
    queryFn: async () => {
      if (!user) return null;
      return base44.entities.NumerologyProfile.filter({ user_email: user.email }, "-created_date", 1).then(r => r[0]);
    },
    enabled: !!user,
    staleTime: 60_000
  });

  const { data: quests = [] } = useQuery({
    queryKey: ["wellness-quests-dashboard", user?.email],
    queryFn: async () => {
      if (!user) return [];
      return base44.entities.WellnessQuest.filter({ user_email: user.email }, "-started_at", 100);
    },
    enabled: !!user,
    staleTime: 30_000
  });

  const { data: ecoProfile } = useQuery({
    queryKey: ["eco-profile-dashboard", user?.email],
    queryFn: async () => {
      if (!user) return null;
      return base44.entities.EcoProfile.filter({ user_email: user.email }, "-created_date", 1).then(r => r[0]);
    },
    enabled: !!user,
    staleTime: 60_000
  });

  const isLoading = loadingNumer;

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "Dashboard",
    "name": "Tableau de Bord Numerologie Paranormal",
    "description": "Dashboard personnalisé agrégeant données numérologie, cycles astrologiques, bien-être et synchronicités"
  };

  return (
    <div className="pb-20 space-y-8 max-w-6xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Tableau de Bord Numerologie Paranormal | CirculAI Hub"
        description="Dashboard personnel : profil numérologique, cycles astrologiques, quêtes bien-être, impact écologique et synchronicités détectées."
        keywords="numérologie, astrologie, paranormal, bien-être, dashboard, synchronicités, cycles cosmiques"
        canonicalUrl="https://egor69.ca/numerology-paranormal-dashboard"
        schemaData={seoSchema}
      />

      {/* Hero */}
      <div className="rounded-3xl p-12 text-center bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-indigo-500/10 border border-purple-200/20">
        <div className="text-6xl mb-4 animate-pulse">🔮</div>
        <h1 className="font-display text-4xl font-black text-foreground">Tableau de Bord Personnel</h1>
        <p className="text-muted-foreground mt-3">Numerologie Astrologie Synchronicites</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        </div>
      ) : !user ? (
        <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
          <AlertCircle className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground">Connectez-vous pour voir votre dashboard</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Numérologie */}
          {numer ? (
            <NumerologyCard numer={numer} />
          ) : (
            <div className="rounded-2xl border border-dashed border-violet-200/30 bg-violet-500/5 p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Dashboard numerologique pour voir votre analyse complete
              </p>
            </div>
          )}

          {/* Astrologie */}
          <AstrologyCard sunSign={numer?.life_path_interpretation} moonSign="En developpement" ascendant="En developpement" />

          {/* Bien-être Impact */}
          <WellnessCard quests={quests} ecoProfile={ecoProfile} />

          {/* Synchronicités */}
          <SynchronicityCard numer={numer} ecoProfile={ecoProfile} />

          {/* Energy Gauge */}
          <div className="rounded-2xl border border-cyan-200/30 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-6">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
              <span className="text-2xl">⚡</span> Energie Personnelle
            </h3>
            <div className="space-y-3">
              {[
                { label: "Vitalite Physique", value: 75, color: "from-red-400 to-orange-400" },
                { label: "Harmonie Emotionnelle", value: 68, color: "from-pink-400 to-rose-400" },
                { label: "Clarte Mentale", value: 82, color: "from-blue-400 to-cyan-400" },
                { label: "Conscience Spirituelle", value: 91, color: "from-violet-400 to-purple-400" }
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                    <span className="text-sm font-bold text-muted-foreground">{item.value}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${item.color} transition-all`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}