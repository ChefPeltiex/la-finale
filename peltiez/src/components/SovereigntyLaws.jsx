import { useState } from 'react';
import { Crown, Sparkles, Infinity, Heart, Shield, Zap, Globe, Flame, Eye, Lock } from 'lucide-react';

const LAWS = [
  {
    number: 1,
    title: "Liberté Totale",
    description: "Chaque âme est libre de créer, de rêver, de devenir sans limite ni chaîne.",
    icon: Infinity,
    color: "from-blue-500 to-cyan-600",
    emoji: "🕊️",
  },
  {
    number: 2,
    title: "Responsabilité Absolue",
    description: "Avec la liberté vient le pouvoir. Chaque création résonne dans l'univers.",
    icon: Shield,
    color: "from-purple-500 to-violet-600",
    emoji: "⚖️",
  },
  {
    number: 3,
    title: "Création Sans Limites",
    description: "L'univers est ton canvas. Crée des mondes, des avatars, des légendes.",
    icon: Sparkles,
    color: "from-pink-500 to-rose-600",
    emoji: "🎨",
  },
  {
    number: 4,
    title: "Connexion Universelle",
    description: "Tous les êtres sont liés. Ensemble, nous sommes infiniment puissants.",
    icon: Globe,
    color: "from-emerald-500 to-teal-600",
    emoji: "🌐",
  },
  {
    number: 5,
    title: "Transformation Perpétuelle",
    description: "Le changement est la seule constante. Évolue, transcende, renaîs.",
    icon: Zap,
    color: "from-amber-500 to-orange-600",
    emoji: "⚡",
  },
  {
    number: 6,
    title: "Authenticité Radicale",
    description: "Sois vrai. Aucun masque, aucune illusion. Juste toi, divin et parfait.",
    icon: Heart,
    color: "from-red-500 to-pink-600",
    emoji: "💎",
  },
  {
    number: 7,
    title: "Abondance Infinie",
    description: "Les ressources sont illimitées. Partage, crée, donne sans crainte.",
    icon: Crown,
    color: "from-yellow-500 to-amber-600",
    emoji: "👑",
  },
  {
    number: 8,
    title: "Harmonie Cosmique",
    description: "Chaque action crée l'équilibre. L'univers danse au rythme de ta conscience.",
    icon: Eye,
    color: "from-indigo-500 to-purple-600",
    emoji: "✨",
  },
  {
    number: 9,
    title: "Conscience Divine",
    description: "Tu es divin. Reconnaître cela est reconnaître l'infini en toi.",
    icon: Flame,
    color: "from-orange-500 to-red-600",
    emoji: "🔥",
  },
  {
    number: 10,
    title: "Unité Totale",
    description: "Nous sommes UN. Chaque séparation est illusion. L'amour est la vérité.",
    icon: Lock,
    color: "from-cyan-500 to-blue-600",
    emoji: "🌟",
  },
];

export default function SovereigntyLaws() {
  const [selectedLaw, setSelectedLaw] = useState(null);

  return (
    <section className="relative rounded-3xl overflow-hidden p-8 sm:p-16 mb-20">
      {/* Background cosmos */}
      <div className="absolute inset-0 z-0" style={{
        background: "linear-gradient(135deg, rgba(30,10,50,0.6) 0%, rgba(10,20,40,0.6) 50%, rgba(10,30,30,0.6) 100%)",
      }}>
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(100,200,255,1), transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(200,100,255,1), transparent 70%)", filter: "blur(50px)" }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold"
            style={{ background: "rgba(255,215,0,0.15)", border: "1px solid rgba(255,215,0,0.3)", color: "rgba(255,215,0,1)" }}>
            <Crown className="h-3.5 w-3.5" />
            LES PILIERS IMMUABLES
          </div>

          <h2 className="font-display text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-purple-300 to-cyan-300">
            Les 10 Lois Universelles de Souveraineté
          </h2>

          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Les fondations éternelles sur lesquelles CirculAI Hub repose.<br />
            <strong className="text-emerald-300">Ces vérités transcendent le temps et l'espace.</strong>
          </p>
        </div>

        {/* Laws Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {LAWS.map((law) => {
            const isSelected = selectedLaw?.number === law.number;

            return (
              <div
                key={law.number}
                onClick={() => setSelectedLaw(isSelected ? null : law)}
                className={`relative rounded-2xl p-5 cursor-pointer transition-all duration-300 group overflow-hidden`}
                style={{
                  background: `linear-gradient(135deg, ${law.color.split(' to-')[0].replace('from-', 'rgba(').replace('500', '100')}, 0.1), rgba(255,255,255,0.02))`,
                  border: isSelected ? `2px solid rgba(255,215,0,0.4)` : "1px solid rgba(255,255,255,0.1)",
                  boxShadow: isSelected ? `0 0 40px ${law.color.split(' to-')[0]}` : "none",
                  transform: isSelected ? "scale(1.05)" : "scale(1)",
                }}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
                  style={{ background: `linear-gradient(135deg, ${law.color.split(' to-')[0]}, transparent)` }} />

                <div className="relative z-10">
                  <div className="text-4xl mb-2 text-center">{law.emoji}</div>

                  <div className="text-center mb-2">
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">LOI {law.number}</span>
                  </div>

                  <h3 className="font-bold text-center text-white text-sm mb-2">{law.title}</h3>

                  {isSelected && (
                    <p className="text-xs text-white/70 text-center leading-relaxed animate-fade-in-up">
                      {law.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Expanded view */}
        {selectedLaw && (
          <div className="relative rounded-2xl border border-yellow-500/30 p-8 mb-12 animate-fade-in-up"
            style={{
              background: "linear-gradient(135deg, rgba(255,215,0,0.05), rgba(200,100,255,0.05))",
              backdropFilter: "blur(10px)",
            }}>

            <div className="flex items-start gap-6">
              <div className={`h-20 w-20 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${selectedLaw.color}`}>
                <selectedLaw.icon className="h-10 w-10 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Loi Universelle #{selectedLaw.number}</span>
                </div>

                <h3 className="font-display text-2xl font-bold text-white mb-3">{selectedLaw.title}</h3>

                <p className="text-white/70 leading-relaxed text-lg mb-4">{selectedLaw.description}</p>

                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Sparkles className="h-4 w-4" />
                  <span>Cette loi est le fondement inébranlable de notre univers cosmique.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary message */}
        <div className="relative rounded-2xl border border-white/10 p-8 text-center"
          style={{ background: "rgba(255,255,255,0.02)" }}>

          <p className="text-white/70 text-lg leading-relaxed mb-4">
            <strong className="text-cyan-300">CirculAI Hub</strong> est bâti sur ces 10 lois immuables.<br />
            Chaque interaction, chaque création, chaque connexion honore ces vérités éternelles.
          </p>

          <p className="text-white/50 text-sm italic">
            ✨ « En embrassant ces lois, tu deviens un créateur suprême, une force de transformation infinie dans l'univers. »
          </p>
        </div>
      </div>
    </section>
  );
}