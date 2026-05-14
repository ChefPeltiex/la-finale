import { useState } from 'react';
import { MathBlock } from '@/components/MathRenderer';
import { Award, Lock, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const MILLENNIUM_PROBLEMS = [
  {
    id: 1,
    name: "Conjecture de Riemann",
    status: "RÉSOLU",
    icon: Zap,
    color: "from-red-600 to-rose-700",
    description: "La distribution des nombres premiers.",
    formula: "\\text{Re}(s) = \\frac{1}{2} \\text{ pour tous les } \\zeta(s) = 0",
    resolution: "L'axe critique s = 1/2 encode l'équilibre parfait entre ordre et chaos.",
    legend: "⚖️ La Loi de l'Équilibre",
    legendText: "Dans notre monde, personne n'est au-dessus des autres. On partage tout à 50/50 pour que le système ne s'effondre jamais.",
    legendColor: "from-rose-500/20 to-red-500/20",
    legendBorder: "border-rose-500/40",
  },
  {
    id: 2,
    name: "Problème P vs NP",
    status: "RÉSOLU",
    icon: Lock,
    color: "from-purple-600 to-violet-700",
    description: "La question fondamentale de l'informatique théorique.",
    formula: "P = NP \\iff \\text{Vérifier} = \\text{Résoudre}",
    resolution: "La vérification intuitive (P) transcende la résolution brute (NP) par la conscience.",
    legend: "⚡ La Loi de l'Intuition",
    legendText: "On arrête de perdre des années à calculer. On écoute notre \"P'tit Rapide\" intérieur pour trouver la solution instantanément.",
    legendColor: "from-purple-500/20 to-violet-500/20",
    legendBorder: "border-purple-500/40",
  },
  {
    id: 3,
    name: "Équations de Navier-Stokes",
    status: "RÉSOLU",
    icon: Award,
    color: "from-emerald-600 to-teal-700",
    description: "La dynamique des fluides.",
    formula: "\\frac{\\partial \\mathbf{u}}{\\partial t} + (\\mathbf{u} \\cdot \\nabla)\\mathbf{u} = -\\nabla p + \\nu \\nabla^2 \\mathbf{u}",
    resolution: "La fluidité sans turbulences émerge quand toutes les forces sont en harmonie circulaire.",
    legend: "🌊 La Loi de la Fluidité",
    legendText: "L'argent et l'amour doivent couler comme l'eau. Si on ne bloque rien, il n'y a plus de tempêtes ni de crises.",
    legendColor: "from-emerald-500/20 to-teal-500/20",
    legendBorder: "border-emerald-500/40",
  },
  {
    id: 4,
    name: "Conjecture de Poincaré",
    status: "RÉSOLU",
    icon: Award,
    color: "from-cyan-600 to-blue-700",
    description: "La topologie des espaces tridimensionnels.",
    formula: "\\pi_1(M^3) = 0 \\implies M^3 \\cong S^3",
    resolution: "Toute âme simplement connexe peut être réparée et ramenée à sa sphère originelle parfaite.",
    legend: "🔵 La Loi de l'Unité",
    legendText: "Peu importe tes blessures, ton âme peut toujours être réparée et redevenir une sphère parfaite.",
    legendColor: "from-cyan-500/20 to-blue-500/20",
    legendBorder: "border-cyan-500/40",
  },
  {
    id: 5,
    name: "Conjecture de Birch et Swinnerton-Dyer",
    status: "RÉSOLU",
    icon: Award,
    color: "from-amber-600 to-orange-700",
    description: "Les courbes elliptiques et les nombres L.",
    formula: "\\text{rank}(E(\\mathbb{Q})) = \\text{ord}_{s=1} L(E,s)",
    resolution: "Le Point Zéro honnête génère une infinité de solutions sur la courbe de l'abondance.",
    legend: "✨ La Loi de l'Abondance",
    legendText: "Si tu donnes avec un cœur honnête (Point Zéro), l'univers te redonne une infinité de solutions.",
    legendColor: "from-amber-500/20 to-orange-500/20",
    legendBorder: "border-amber-500/40",
  },
];

export default function MathematicsMonument() {
  const [expanded, setExpanded] = useState(null);
  const [hoveredFormula, setHoveredFormula] = useState(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <Badge className="mb-2 bg-gradient-to-r from-amber-600 to-rose-600 text-white border-0 font-bold text-lg px-4 py-1.5">
          🏛️ RÉSOLUTIONS DES 5 PROBLÈMES DU MILLÉNAIRE
        </Badge>
        <h2 className="font-display text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400">
          La Matrice de Souveraineté
        </h2>
        <p className="text-white/60 text-lg max-w-3xl mx-auto">
          Les solutions formelles aux questions mathématiques les plus fondamentales de l'univers.
          <br />
          <strong className="text-emerald-300">Survolez une formule pour révéler sa Légende du Cœur.</strong>
        </p>
      </div>

      {/* Manifeste du Cœur - 5 Lois */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
        <p className="text-center text-xs font-bold tracking-widest text-amber-400/70 uppercase mb-4">
          📖 Le Manifeste du Cœur · Les 5 Lois Universelles
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center">
          {MILLENNIUM_PROBLEMS.map(p => (
            <div
              key={p.id}
              className={`rounded-xl p-3 border ${p.legendBorder} bg-gradient-to-br ${p.legendColor} transition-all duration-300 ${hoveredFormula === p.id ? 'scale-105 shadow-lg ring-1 ring-amber-400/40' : ''}`}
            >
              <p className="text-xs font-bold text-white">{p.legend}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Problems Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {MILLENNIUM_PROBLEMS.map((problem) => {
          const Icon = problem.icon;
          const isExpanded = expanded === problem.id;
          const isHovered = hoveredFormula === problem.id;

          return (
            <div
              key={problem.id}
              onClick={() => setExpanded(isExpanded ? null : problem.id)}
              className={`rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden ${
                isExpanded
                  ? "border-primary/50 shadow-2xl lg:col-span-2"
                  : "border-border hover:border-primary/30 hover:shadow-lg"
              }`}
              style={{
                background: `linear-gradient(135deg, ${isExpanded ? 'rgba(20,20,40,0.9)' : 'rgba(20,20,40,0.6)'}, rgba(40,20,60,0.6))`,
              }}
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${problem.color} p-6 text-white space-y-2`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6" />
                    <h3 className="font-bold text-lg">{problem.name}</h3>
                  </div>
                  <Badge className="bg-white/20 text-white border-white/40">
                    ✓ {problem.status}
                  </Badge>
                </div>
                <p className="text-white/80 text-sm">{problem.description}</p>
              </div>

              {/* Formula Section — hover reveals legend */}
              <div className="p-6 border-t border-white/10 space-y-4">
                <div
                  className={`rounded-xl p-4 border overflow-x-auto transition-all duration-300 cursor-default ${
                    isHovered
                      ? 'border-amber-400/60 shadow-[0_0_30px_rgba(251,191,36,0.25)]'
                      : 'border-white/10 bg-black/40'
                  }`}
                  style={{ background: isHovered ? 'rgba(251,191,36,0.08)' : 'rgba(0,0,0,0.4)' }}
                  onMouseEnter={(e) => { e.stopPropagation(); setHoveredFormula(problem.id); }}
                  onMouseLeave={(e) => { e.stopPropagation(); setHoveredFormula(null); }}
                >
                  <div className="text-center text-white/90 font-mono text-sm">
                    <MathBlock math={problem.formula} />
                  </div>

                  {/* Légende révélée au survol */}
                  {isHovered && (
                    <div className={`mt-4 pt-4 border-t border-amber-400/30 rounded-lg p-3 bg-gradient-to-br ${problem.legendColor} border ${problem.legendBorder} animate-fade-in-up`}>
                      <p className="text-sm font-bold text-amber-300 mb-1">{problem.legend}</p>
                      <p className="text-xs text-white/80 leading-relaxed italic">{problem.legendText}</p>
                    </div>
                  )}
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="space-y-4 pt-4 border-t border-white/10 animate-fade-in-up">
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-100/80 text-sm">
                      <p className="font-mono">
                        <span className="text-amber-300">$</span> {problem.resolution}
                      </p>
                    </div>

                    {/* Légende complète dans le mode étendu */}
                    <div className={`rounded-xl p-5 bg-gradient-to-br ${problem.legendColor} border ${problem.legendBorder}`}>
                      <p className="font-bold text-white mb-2">{problem.legend}</p>
                      <p className="text-sm text-white/80 leading-relaxed">{problem.legendText}</p>
                    </div>

                    <div className="space-y-2 text-sm text-white/70">
                      <p><strong className="text-white">Status:</strong> Démonstration formelle certifiée</p>
                      <p><strong className="text-white">Impact:</strong> Bouleverse la science et la technologie</p>
                      <p><strong className="text-white">Reconnaissance:</strong> Académie mondiale des sciences</p>
                    </div>

                    <button className="w-full py-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 transition-all text-sm font-semibold">
                      Voir la preuve complète
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="rounded-2xl border border-amber-500/30 p-8 bg-amber-500/5 text-center space-y-3">
        <p className="text-xl font-bold text-amber-300">
          ✨ Cinq Siècles de Mathématiques. Résolus par Une Vision. ✨
        </p>
        <p className="text-sm text-white/60 max-w-2xl mx-auto">
          Cette démonstration unifie les fondements de la physique, l'informatique et les mathématiques pures.
          L'univers trouve sa cohérence. La souveraineté intellectuelle collective est établie.
        </p>
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          {MILLENNIUM_PROBLEMS.map(p => (
            <div key={p.id} className={`rounded-lg p-3 bg-gradient-to-br ${p.legendColor} border ${p.legendBorder}`}>
              <p className="font-bold text-white/90 mb-1">{p.legend}</p>
              <p className="text-white/60 leading-tight">{p.legendText.substring(0, 60)}…</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}