import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SEOMeta from "@/components/SEOMeta";
import { SITE_ORIGIN } from "@/lib/site";
import { Sparkles, Loader2, Heart, Leaf, Star, Moon, Sun, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AnimatedCounter from "@/components/AnimatedCounter";

const LIFE_PATH_MEANINGS = {
  1: "Leadership · Initiation · Indépendance · Force créatrice",
  2: "Dualité · Équilibre · Coopération · Sensibilité",
  3: "Expression · Créativité · Joie · Communication",
  4: "Stabilité · Fondations · Travail · Construire",
  5: "Liberté · Aventure · Changement · Adaptabilité",
  6: "Harmonie · Responsabilité · Service · Amour",
  7: "Sagesse · Introspection · Spiritualité · Analyse",
  8: "Pouvoir · Abondance · Succès · Manifestation",
  9: "Complétude · Universalité · Compassion · Transformation"
};

const COSMIC_ARCHETYPES = {
  1: { emoji: "⚡", archetype: "Le Créateur", color: "from-amber-500 to-orange-500" },
  2: { emoji: "☯️", archetype: "L'Équilibriste", color: "from-purple-500 to-pink-500" },
  3: { emoji: "🎨", archetype: "L'Artiste", color: "from-cyan-500 to-blue-500" },
  4: { emoji: "🏛️", archetype: "L'Architecte", color: "from-slate-500 to-gray-500" },
  5: { emoji: "🦋", archetype: "L'Explorateur", color: "from-green-500 to-teal-500" },
  6: { emoji: "💖", archetype: "Le Soigneur", color: "from-rose-500 to-red-500" },
  7: { emoji: "🧙", archetype: "Le Sage", color: "from-indigo-500 to-violet-500" },
  8: { emoji: "👑", archetype: "Le Souverain", color: "from-yellow-500 to-amber-500" },
  9: { emoji: "🌍", archetype: "L'Humanitaire", color: "from-emerald-500 to-green-500" }
};

const ECOLOGICAL_ALIGNMENTS = {
  1: "Tes actions de réparation reflètent ton leadership · Chaque objet sauvé = acte de création",
  2: "Tes échanges équitables incarnent l'équilibre universel · Harmonie circulaire",
  3: "Tes dons créatifs transforment les objets en nouvelles possibilités",
  4: "Tes fondations écologiques construisent un monde durable",
  5: "Tes explorations du don t'ouvrent à de nouvelles aventures",
  6: "Ton amour pour la Terre se manifeste dans chaque geste responsable",
  7: "Tes choix conscients reflètent une sagesse intérieure profonde",
  8: "Tes actions génèrent de l'abondance · Richesse circulaire",
  9: "Tu contribues à l'humanité entière · Impact cosmique universel"
};

function NumerologicalTheme({ numer, ecoProfile }) {
  // Hooks appelés AVANT toute condition conditionnelle - respect de la règle des hooks
  const lifePathNum = numer?.life_path_number || 1;
  
  const ecologicalAlignment = useMemo(() => {
    if (!ecoProfile) return null;
    return ECOLOGICAL_ALIGNMENTS[lifePathNum] || ECOLOGICAL_ALIGNMENTS[1];
  }, [lifePathNum, ecoProfile]);

  if (!numer) return null;

  const archetypeData = COSMIC_ARCHETYPES[lifePathNum] || COSMIC_ARCHETYPES[1];
  const meaning = LIFE_PATH_MEANINGS[lifePathNum] || "";

  return (
    <div className="space-y-6">
      {/* Thème Numérologique Principal */}
      <div className={`rounded-3xl p-8 text-white bg-gradient-to-br ${archetypeData.color} relative overflow-hidden`}>
        {/* Fond décoratif */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl bg-white" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-3xl bg-white" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-6xl">{archetypeData.emoji}</div>
            <div>
              <h2 className="font-display text-4xl font-black">Chemin de Vie {lifePathNum}</h2>
              <p className="text-lg font-bold text-white/80 mt-1">{archetypeData.archetype}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <p className="text-sm leading-relaxed font-medium">{meaning}</p>
            </div>

            {numer.life_path_interpretation && (
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 italic">
                <p className="text-sm leading-relaxed">"{numer.life_path_interpretation}"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alignement avec Impact Écologique */}
      {ecologicalAlignment && ecoProfile && (
        <div className="rounded-2xl border border-emerald-200/50 bg-gradient-to-br from-emerald-50/50 to-green-50/50 p-6 space-y-4">
          <h3 className="font-display text-xl font-bold text-emerald-900 flex items-center gap-2">
            <Leaf className="h-5 w-5 text-emerald-600" /> Ton Alignement Écologique
          </h3>

          <div className="p-4 rounded-lg bg-white/80 border border-emerald-200">
            <p className="text-sm leading-relaxed text-emerald-900">{ecologicalAlignment}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-white/60">
              <p className="text-2xl font-black text-emerald-600">
                <AnimatedCounter target={Math.round(ecoProfile.total_co2_saved || 0)} />
              </p>
              <p className="text-xs text-emerald-700 font-bold mt-1">kg CO₂</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/60">
              <p className="text-2xl font-black text-teal-600">
                <AnimatedCounter target={ecoProfile.total_donations || 0} />
              </p>
              <p className="text-xs text-teal-700 font-bold mt-1">Dons</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/60">
              <p className="text-2xl font-black text-green-600">
                <AnimatedCounter target={ecoProfile.total_objects_saved || 0} />
              </p>
              <p className="text-xs text-green-700 font-bold mt-1">Objets</p>
            </div>
          </div>

          {ecoProfile.level && (
            <div className="pt-3 border-t border-emerald-200 text-center">
              <Badge className="bg-emerald-600 text-white border-0 text-sm">
                🌱 {ecoProfile.level}
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Nombres Porte-Bonheur et Destinée */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {numer.lucky_numbers?.length > 0 && (
          <div className="rounded-2xl border border-amber-200/50 bg-gradient-to-br from-amber-50/50 to-orange-50/50 p-6">
            <h3 className="font-display text-lg font-bold text-amber-900 flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-amber-600" /> Nombres Porte-Bonheur
            </h3>
            <div className="flex gap-2 flex-wrap">
              {numer.lucky_numbers.map((num, i) => (
                <span key={i} className="px-4 py-2 rounded-full text-sm font-black bg-amber-200 text-amber-900">
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}

        {numer.destiny_number && (
          <div className="rounded-2xl border border-violet-200/50 bg-gradient-to-br from-violet-50/50 to-purple-50/50 p-6">
            <h3 className="font-display text-lg font-bold text-violet-900 flex items-center gap-2 mb-4">
              <Moon className="h-5 w-5 text-violet-600" /> Nombre de Destinée
            </h3>
            <div className="text-center">
              <p className="text-5xl font-black text-violet-600 mb-2">{numer.destiny_number}</p>
              {numer.destiny_interpretation && (
                <p className="text-xs text-violet-700 leading-relaxed">"{numer.destiny_interpretation}"</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Année Personnelle et Prédictions */}
      {numer.current_year_number && (
        <div className="rounded-2xl border border-cyan-200/50 bg-gradient-to-br from-cyan-50/50 to-blue-50/50 p-6 space-y-4">
          <h3 className="font-display text-lg font-bold text-cyan-900 flex items-center gap-2">
            <Sun className="h-5 w-5 text-cyan-600" /> Année Personnelle {numer.current_year_number}
          </h3>

          <div className="p-4 rounded-lg bg-white/80 border border-cyan-200">
            <p className="text-sm leading-relaxed text-cyan-900">
              {numer.year_forecast || "Découvre ce que l'univers a prévu pour toi cette année..."}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { label: "Déc", month: 12 },
              { label: "Jan", month: 1 },
              { label: "Fév", month: 2 },
              { label: "Mar", month: 3 },
              { label: "Avr", month: 4 },
              { label: "Mai", month: 5 }
            ].map(({ label, month }) => (
              <div key={month} className="text-center p-2 rounded-lg bg-white/60 text-xs">
                <p className="font-bold text-cyan-700">{label}</p>
                <p className="text-cyan-600 font-black">{(month + numer.current_year_number - 1) % 9 + 1}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compatibilité Numérologique */}
      {numer.compatibility_analysis && (
        <div className="rounded-2xl border border-pink-200/50 bg-gradient-to-br from-pink-50/50 to-rose-50/50 p-6">
          <h3 className="font-display text-lg font-bold text-pink-900 flex items-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-pink-600" /> Analyse de Compatibilité
          </h3>
          <p className="text-sm leading-relaxed text-pink-900">{numer.compatibility_analysis}</p>
        </div>
      )}
    </div>
  );
}

export default function DivinatoryArts() {
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity
  });

  const { data: numer, isLoading: loadingNumer } = useQuery({
    queryKey: ["numerology-profile-divination", user?.email],
    queryFn: async () => {
      if (!user) return null;
      return base44.entities.NumerologyProfile.filter(
        { user_email: user.email },
        "-created_date",
        1
      ).then(r => r[0]);
    },
    enabled: !!user,
    staleTime: 60_000
  });

  const { data: ecoProfile, isLoading: loadingEco } = useQuery({
    queryKey: ["eco-profile-divination", user?.email],
    queryFn: async () => {
      if (!user) return null;
      return base44.entities.EcoProfile.filter(
        { user_email: user.email },
        "-created_date",
        1
      ).then(r => r[0]);
    },
    enabled: !!user,
    staleTime: 60_000
  });

  const isLoading = loadingNumer || loadingEco;

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "Arts Divinatoires - Thème Numérologique Personnalisé",
    "description": "Consulte ton profil numérologique lié à ton impact écologique. Découvre comment tes actions environnementales s'alignent avec ton chemin de vie universel."
  };

  return (
    <div className="pb-20 space-y-8 max-w-4xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Arts Divinatoires - Thème Numérologique Personnalisé | CirculAI Hub"
        description="Consulte ton profil numérologique personnalisé lié à ton impact écologique. Découvre ton chemin de vie, tes nombres porte-bonheur et prédictions annuelles."
        keywords="numérologie, arts divinatoires, thème numérologique, chemin de vie, destinée, écologie spirituelle, astrologie, tarot, lexique divinatoire"
        canonicalUrl={`${SITE_ORIGIN}/arts-divinatoires`}
        schemaData={seoSchema}
      />

      {/* Hero */}
      <div className="rounded-3xl p-12 text-center bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-violet-500/10 border border-purple-200/20">
        <div className="text-6xl mb-4 animate-bounce" style={{ animationDuration: "3s" }}>
          🔮
        </div>
        <h1 className="font-display text-4xl font-black text-foreground">Arts Divinatoires</h1>
        <p className="text-muted-foreground mt-3">Ton Thème Numérologique Personnalisé</p>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl mx-auto">
          Découvre comment tes actions écologiques s'alignent avec ton chemin de vie cosmique
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-5">
          <Link
            to="/arts-divinatoires-lexique"
            className="inline-flex items-center rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-bold text-violet-800 dark:text-violet-100 hover:bg-violet-500/20 transition-colors"
          >
            Lexique comparé (tarot, astrologie, Yi Jing…)
          </Link>
          <Link
            to="/world"
            className="inline-flex items-center rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:border-violet-400/50 transition-colors"
          >
            Anneau divinatoire — Verse 3D
          </Link>
          <Link
            to="/esotericism"
            className="inline-flex items-center rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:border-violet-400/50 transition-colors"
          >
            Spires ésotériques
          </Link>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        </div>
      ) : !user ? (
        <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
          <AlertCircle className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground">Connectez-vous pour accéder à votre thème</p>
        </div>
      ) : !numer ? (
        <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border space-y-3">
          <Sparkles className="h-12 w-12 text-muted-foreground/20 mx-auto" />
          <p className="text-muted-foreground">Profil numérologique en cours de création...</p>
          <p className="text-xs text-muted-foreground">Visite ta Carte du Ciel pour commencer</p>
        </div>
      ) : (
        <NumerologicalTheme numer={numer} ecoProfile={ecoProfile} />
      )}

      {/* Info Box */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-500" /> Comment ça marche?
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span>1.</span> <span>Crée ton profil numérologique sur ta <strong>Carte du Ciel</strong></span>
          </li>
          <li className="flex gap-2">
            <span>2.</span> <span>Accumule des actions écologiques (dons, réparations, recyclage)</span>
          </li>
          <li className="flex gap-2">
            <span>3.</span> <span>Découvre l'alignement entre ton chemin de vie et ton impact</span>
          </li>
          <li className="flex gap-2">
            <span>4.</span> <span>Consulte tes nombres porte-bonheur et prédictions annuelles</span>
          </li>
        </ul>
      </div>
    </div>
  );
}