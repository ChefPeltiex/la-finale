import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Sparkles, Heart, Zap, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export default function EpicJourney() {
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity,
  });

  const { data: epic } = useQuery({
    queryKey: ['epic-quest', user?.email],
    queryFn: () => user ? base44.entities.EpicQuestSystem.filter({ user_email: user.email }, '-last_action', 1).then(r => r[0] || null) : null,
    enabled: !!user,
    refetchInterval: 10_000,
  });

  if (!epic) return <div className="text-center py-20">Chargement de votre épopée...</div>;

  const realization = epic.dream_realization_percent || 0;
  const questCount = epic.quest_chain?.length || 0;

  return (
    <div className="pb-20 space-y-12">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden p-12 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,100,100,0.1))",
          border: "2px solid rgba(255,215,0,0.3)",
        }}>
        <div className="relative z-10 space-y-4">
          <Badge className="mb-4 bg-gradient-to-r from-amber-600 to-rose-600 text-white border-0 px-4 py-1.5">
            VOTRE ÉPOPÉE PERSONNELLE
          </Badge>
          <h1 className="font-display text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-rose-300">
            Le Chemin vers Votre Rêve
          </h1>
          <p className="text-white/70 text-lg">
            Chaque action. Chaque apprentissage. Chaque réparation. Chaque partage.<br />
            <strong className="text-emerald-300">Rapproche votre réalisation de {Math.round(realization)}%</strong>
          </p>
        </div>
      </div>

      {/* Dream Realization Gauge */}
      <div className="rounded-3xl border border-border p-8 bg-card space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-foreground">Réalisation du Rêve</h2>
            <span className="text-3xl font-black text-amber-500">{Math.round(realization)}%</span>
          </div>
          <div className="w-full h-4 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-pink-400 transition-all duration-1000"
              style={{ width: `${realization}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Étapes Complétées</p>
            <p className="text-2xl font-bold text-foreground">{questCount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rêve Ultime</p>
            <p className="text-lg font-bold text-amber-500 line-clamp-1">{epic.ultimate_dream}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Statut</p>
            <p className="text-lg font-bold text-emerald-500">{epic.dream_status}</p>
          </div>
        </div>
      </div>

      {/* Recent Quests */}
      {epic.quest_chain && epic.quest_chain.length > 0 && (
        <div>
          <h2 className="font-display text-2xl font-bold mb-4">Vos Quêtes Récentes</h2>
          <div className="space-y-2">
            {epic.quest_chain.slice(-5).reverse().map((quest, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/30">
                <Sparkles className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground line-clamp-1">{quest.title}</p>
                  <p className="text-xs text-muted-foreground">+{quest.reward_dream_points} points de rêve</p>
                </div>
                <Badge variant="outline" className="flex-shrink-0 text-xs">
                  ✓ Complété
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Heart, label: "Apprendre", hint: "Expandre votre conscience", link: "/universal-hub" },
          { icon: Zap, label: "Échanger", hint: "Créer de l'harmonie", link: "/marketplace" },
          { icon: Crown, label: "Jouer", hint: "Gagner des récompenses", link: "/jeu" },
        ].map((action, i) => (
          <Link key={i} to={action.link}
            className="rounded-2xl border border-border p-6 hover:shadow-lg hover:border-primary/30 transition-all hover:-translate-y-1 bg-card text-center">
            <action.icon className="h-8 w-8 text-primary mx-auto mb-3" />
            <p className="font-bold text-foreground mb-1">{action.label}</p>
            <p className="text-xs text-muted-foreground">{action.hint}</p>
          </Link>
        ))}
      </div>

      {/* Motivation */}
      <div className="rounded-2xl border border-amber-500/30 p-8 bg-amber-500/5 text-center space-y-4">
        <p className="text-xl font-bold text-amber-300">
          ✨ Vous êtes à {Math.round(realization)}% de votre réalisation ✨
        </p>
        <p className="text-sm text-white/70">
          Continuez. Chaque action compte. Votre rêve devient réalité.
        </p>
      </div>
    </div>
  );
}