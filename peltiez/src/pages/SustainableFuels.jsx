import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Droplets, Leaf, Flame, Recycle, Wrench, Heart, Globe } from "lucide-react";

const FUELS = [
  {
    name: "Huile Recyclée Premium",
    icon: Droplets,
    color: "from-blue-500 to-cyan-600",
    efficiency: 94,
    co2_reduction: 78,
    description: "Vidanges d'huiles moteur régénérées pour alimenter générateurs et systèmes de chauffage.",
    uses: ["Chauffage industriel", "Générateurs électriques", "Moteurs adaptés", "Systèmes de propulsion"],
    benefits: ["Réduit les déchets pétroliers", "Rendement excellent", "Coût minimal", "Biodégradable à 95%"],
  },
  {
    name: "BioDéchets Énergétiques",
    icon: Leaf,
    color: "from-green-500 to-emerald-700",
    efficiency: 87,
    co2_reduction: 92,
    description: "Déchets organiques (papier, carton, bois) convertis en biocharbon et biogaz.",
    uses: ["Production de biogaz", "Chauffage écologique", "Électricité décentralisée", "Compostage énergétique"],
    benefits: ["Zéro émission nette", "Crée de l'engrais", "Décentralisable", "Crée des emplois locaux"],
  },
  {
    name: "Plastique Transformé",
    icon: Flame,
    color: "from-purple-500 to-pink-600",
    efficiency: 82,
    co2_reduction: 85,
    description: "Déchets plastiques triés et fondus pour créer du carburant synthétique haute performance.",
    uses: ["Carburant aviation", "Carburant marin", "Moteurs spécialisés", "Électricité thermique"],
    benefits: ["Élimine les plastiques", "Haute densité énergétique", "Moins de résidus toxiques", "Technologie brevetée"],
  },
  {
    name: "Batterie Électro-Résiduelle",
    icon: Zap,
    color: "from-yellow-500 to-orange-600",
    efficiency: 96,
    co2_reduction: 99,
    description: "Batteries usagées repurposées comme stockage d'énergie et source d'électricité directe.",
    uses: ["Stockage d'énergie", "Alimentation de secours", "Microgrids urbains", "Appareils portables"],
    benefits: ["Récupère 98% de la capacité", "Zéro pollution", "Recyclage total possible", "Autonomie énergétique"],
  },
  {
    name: "Déchets Textiles Fibrés",
    icon: Recycle,
    color: "from-red-500 to-rose-600",
    efficiency: 79,
    co2_reduction: 88,
    description: "Vêtements et tissus usagés convertis en pellets de combustion écologique.",
    uses: ["Chauffage résidentiel", "Séchage industriel", "Production vapeur", "Briquettes énergie"],
    benefits: ["Résout la crise textile", "Très abordable", "Peu de polluants", "Bilan carbone neutre"],
  },
  {
    name: "Métaux Résiduels Énergétiques",
    icon: Wrench,
    color: "from-slate-500 to-gray-700",
    efficiency: 91,
    co2_reduction: 81,
    description: "Rognures et poudres métalliques (aluminium, magnésium) utilisées comme combustibles réactifs.",
    uses: ["Moteurs thermiques haute température", "Fusées et propulsion", "Systèmes militaires", "Industrie spatiale"],
    benefits: ["Énergie extrêmement concentrée", "Peu de déchet final", "Innovation technologique", "Applications infinies"],
  },
];

const TECHNOLOGY_STACK = [
  { step: 1, title: "Collecte Intelligente", desc: "Identification et tri automatisé via IA des déchets récupérables" },
  { step: 2, title: "Transformation Chimique", desc: "Procédés de régénération et de conversion écologiques certifiés" },
  { step: 3, title: "Stabilisation Énergétique", desc: "Stockage sécurisé et conservation de l'énergie extraite" },
  { step: 4, title: "Distribution Circulaire", desc: "Intégration dans le réseau énergétique décentralisé" },
  { step: 5, title: "Cycle Infini", desc: "Récupération des résidus pour nouveau cycle de transformation" },
];

const IMPACT_STATS = [
  { label: "kg CO₂ évité par litre", value: "2.8", icon: "🌍" },
  { label: "Déchets transformés/jour", value: "450T", icon: "♻️" },
  { label: "Efficacité thermique", value: "93%", icon: "⚡" },
  { label: "Emplois créés", value: "2,340", icon: "👨‍💼" },
];

export default function SustainableFuels() {
  const [selectedFuel, setSelectedFuel] = useState(0);
  const fuel = FUELS[selectedFuel];

  return (
    <div className="space-y-20 pb-20">

      {/* HERO */}
      <section className="relative rounded-3xl overflow-hidden text-center py-24 px-6"
        style={{ background: "linear-gradient(135deg, hsl(158,60%,15%) 0%, hsl(220,50%,12%) 50%, hsl(260,60%,15%) 100%)" }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
          <Flame className="h-96 w-96 text-yellow-400" />
        </div>
        <div className="relative z-10 space-y-6">
          <Zap className="h-16 w-16 text-yellow-400 mx-auto" />
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-white">
            Carburants du Futur
          </h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto leading-relaxed">
            Les déchets ne sont pas des déchets. Ce sont des carburants dormants.
            Réveillons l'énergie dans chaque objet jeté.
          </p>
          <p className="text-emerald-400 font-bold text-lg">
            Zéro déchet → Énergie infinie → Planète régénérée
          </p>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {IMPACT_STATS.map((stat) => (
            <div key={stat.label} className="bg-card rounded-2xl border border-border p-5 text-center hover:shadow-md transition-all">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FUEL SELECTOR */}
      <section className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">6 Carburants Révolutionnaires</h2>
          <p className="text-muted-foreground">Chaque déchet devient puissance énergétique</p>
        </div>

        {/* Fuel cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FUELS.map((f, idx) => {
            const Icon = f.icon;
            const isSelected = idx === selectedFuel;
            return (
              <button
                key={idx}
                onClick={() => setSelectedFuel(idx)}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${
                  isSelected
                    ? "border-primary shadow-xl scale-105 bg-primary/5"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.name}</h3>
                <div className="flex gap-2 mb-2 text-xs">
                  <Badge variant="outline">{f.efficiency}% efficacité</Badge>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    -{f.co2_reduction}% CO₂
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{f.description}</p>
              </button>
            );
          })}
        </div>

        {/* Detailed view */}
        <div className="bg-card rounded-3xl border border-border p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${fuel.color} flex items-center justify-center flex-shrink-0`}>
              {fuel.icon && <fuel.icon className="h-8 w-8 text-white" />}
            </div>
            <div className="flex-1">
              <h2 className="font-display text-3xl font-bold text-foreground">{fuel.name}</h2>
              <p className="text-muted-foreground mt-2">{fuel.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Efficacité Énergétique</p>
              <p className="text-3xl font-bold text-primary">{fuel.efficiency}%</p>
              <div className="h-2 bg-border rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${fuel.efficiency}%` }} />
              </div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-sm text-emerald-700 mb-1">Réduction CO₂</p>
              <p className="text-3xl font-bold text-emerald-600">{fuel.co2_reduction}%</p>
              <div className="h-2 bg-emerald-200 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${fuel.co2_reduction}%` }} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">Applications Principales</h3>
            <div className="grid grid-cols-2 gap-3">
              {fuel.uses.map((use) => (
                <div key={use} className="flex items-center gap-2 p-2 rounded-lg bg-accent">
                  <Zap className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm text-accent-foreground">{use}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">Avantages Uniques</h3>
            <div className="space-y-2">
              {fuel.benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3 p-3 rounded-lg bg-green-50/50 border border-green-100">
                  <Heart className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-green-900">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section>
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-foreground">Processus de Transformation</h2>
          <p className="text-muted-foreground mt-2">De déchet à énergie en 5 étapes</p>
        </div>

        <div className="space-y-4">
          {TECHNOLOGY_STACK.map((tech, idx) => (
            <div key={idx} className="flex gap-4 items-start p-6 bg-card rounded-2xl border border-border hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold text-lg">
                {tech.step}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg mb-1">{tech.title}</h3>
                <p className="text-muted-foreground">{tech.desc}</p>
              </div>
              {idx < TECHNOLOGY_STACK.length - 1 && (
                <div className="hidden sm:block text-primary/30">↓</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* GLOBAL IMPACT */}
      <section className="rounded-3xl p-10 sm:p-14"
        style={{ background: "linear-gradient(135deg, hsl(158,60%,15%) 0%, hsl(220,50%,12%) 50%, hsl(260,60%,15%) 100%)" }}>
        <div className="space-y-6 text-center text-white">
          <Globe className="h-16 w-16 mx-auto text-emerald-400" />
          <h2 className="font-display text-4xl font-bold">Impact Mondial</h2>
          <div className="max-w-2xl mx-auto space-y-4 text-white/80">
            <p className="text-lg leading-relaxed">
              Si le monde adoptait ces carburants, nous éliminerions
              <span className="text-emerald-400 font-bold"> 2.1 milliards de tonnes </span>
              de déchets chaque année.
            </p>
            <p className="text-lg leading-relaxed">
              Cela équivaut à planter
              <span className="text-emerald-400 font-bold"> 4 milliards d'arbres </span>
              annuellement.
            </p>
            <p className="text-xl font-bold text-yellow-300 italic">
              Aucun déchet n'est définitif. Tout peut être combustible. Tout peut être énergie.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg" className="rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0">
          <Link to="/abonnement">
            💰 Investir dans le futur énergétique
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-xl font-bold">
          <Link to="/marketplace">
            🔄 Voir les déchets à transformer
          </Link>
        </Button>
      </section>

    </div>
  );
}