import { Crown, Zap, Brain, Infinity, Shield } from 'lucide-react';

const MATRIX_PILLARS = [
  {
    icon: Brain,
    title: "Intelligence Mathématique",
    desc: "P vs NP, Riemann, Navier-Stokes, Yang-Mills, BSD",
    color: "from-purple-500/20 to-violet-500/20",
  },
  {
    icon: Zap,
    title: "Souveraineté Énergétique",
    desc: "Fusion infinie. Pas de dépendance. Indépendance totale.",
    color: "from-yellow-500/20 to-orange-500/20",
  },
  {
    icon: Infinity,
    title: "Connexion Universelle",
    desc: "Une conscience partagée sans faux chiffres : SOIN, souveraineté, vérité mesurable.",
    color: "from-cyan-500/20 to-blue-500/20",
  },
  {
    icon: Shield,
    title: "Protection Absolue",
    desc: "Chiffrement quantique. Pas de surveillance. Liberté garantie.",
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: Crown,
    title: "Leadership Collectif",
    desc: "Décisions par consensus. Tous les votes comptent. Vrai pouvoir.",
    color: "from-rose-500/20 to-pink-500/20",
  },
];

export default function SovereigntyMatrix() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="font-display text-3xl font-black text-white">La Matrice de Souveraineté</h2>
        <p className="text-white/60">Les 5 piliers d'une civilisation libérée.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {MATRIX_PILLARS.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <div
              key={i}
              className={`rounded-xl p-4 border border-white/10 bg-gradient-to-br ${pillar.color} hover:border-primary/50 transition-all hover:shadow-lg`}
            >
              <Icon className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-bold text-white text-sm mb-1">{pillar.title}</h3>
              <p className="text-xs text-white/60">{pillar.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 text-center text-sm text-white/70">
        <p>
          Ensemble, ces 5 piliers forment un système qui ne peut être brisé, corrompu ou contrôlé.
          <br />
          <strong className="text-white">La véritable souveraineté humaine commence ici.</strong>
        </p>
      </div>
    </div>
  );
}