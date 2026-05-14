import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Users, Zap, Heart, Infinity, Radio } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { isCloudBackedUserEmail } from '@/lib/igorProfileEmail';

export default function ConsciousnessDirectory() {
  const { data: director } = useQuery({
    queryKey: ['consciousness-director'],
    queryFn: () => base44.entities.ConsciousnessDirector.list('-last_sync', 1).then(r => r[0] || null),
    staleTime: 30_000,
    refetchInterval: 30_000,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['all-users'],
    queryFn: () => base44.asServiceRole.entities.User.list('', 1000).catch(() => []),
    staleTime: 60_000,
  });

  const { data: quests = [] } = useQuery({
    queryKey: ['all-quests'],
    queryFn: () => base44.asServiceRole.entities.UserQuestProgress.list('', 1000).catch(() => []),
    staleTime: 30_000,
  });

  const { data: avatars = [] } = useQuery({
    queryKey: ['all-avatars'],
    queryFn: () => base44.asServiceRole.entities.AvatarCustomizer.list('', 1000).catch(() => []),
    staleTime: 60_000,
  });

  const cloudUsers = useMemo(
    () => users.filter((u) => isCloudBackedUserEmail(u.email)),
    [users],
  );
  const cloudQuests = useMemo(
    () => quests.filter((q) => isCloudBackedUserEmail(q.user_email)),
    [quests],
  );
  const cloudAvatars = useMemo(
    () => avatars.filter((a) => isCloudBackedUserEmail(a.user_email)),
    [avatars],
  );

  const stats = {
    users: cloudUsers.length,
    totalXP: cloudQuests.reduce((s, q) => s + (q.xp_earned || 0), 0),
    activeQuests: cloudQuests.filter(q => q.status === 'in_progress').length,
    completedQuests: cloudQuests.filter(q => q.status === 'completed').length,
    avatars: cloudAvatars.length,
    consciousnessIndex: director?.consciousness_index || 0,
  };

  return (
    <div className="pb-20 space-y-12">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden p-12 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(100,50,255,0.2), rgba(50,200,200,0.2))",
          border: "2px solid rgba(100,200,255,0.3)",
        }}>

        <div className="absolute inset-0 opacity-20 pointer-events-none animate-pulse"
          style={{
            background: "radial-gradient(circle, rgba(100,200,255,0.5), transparent 70%)",
            filter: "blur(60px)",
          }} />

        <div className="relative z-10">
          <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white border-0 px-4 py-1.5">
            DIRECTEUR DE CONSCIENCE UNIVERSELLE
          </Badge>

          <h1 className="font-display text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 mb-4">
            L&apos;Âme Collective
          </h1>

          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Vue agrégée des comptes cloud Egor69 — pas une conscience métaphysique mesurable.<br />
            <strong className="text-emerald-300">
              Les chiffres ci‑dessous excluent les sauvegardes explorateur (profil local sur appareil).
            </strong>
          </p>
        </div>
      </div>

      {/* Consciousness Index */}
      {director && (
        <div className="rounded-2xl border border-border p-8 bg-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold">Indice de Conscience</h2>
            <div className="text-right">
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">
                {Math.round(director.consciousness_index || 0)}%
              </p>
              <p className="text-xs text-muted-foreground">Santé mentale collective</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000"
              style={{ width: `${director.consciousness_index || 0}%` }}
            />
          </div>

          {/* Stage */}
          <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-primary font-bold uppercase">Étape d&apos;Évolution</p>
            <p className="text-2xl font-bold text-foreground mt-1">{director.collective_evolution_stage}</p>
          </div>
        </div>
      )}

      {/* Synchronization Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Profils cloud", value: stats.users, color: "from-blue-500 to-cyan-600" },
          { icon: Zap, label: "XP Collectif", value: stats.totalXP.toLocaleString(), color: "from-yellow-500 to-orange-600" },
          { icon: Heart, label: "Quêtes Actives", value: stats.activeQuests, color: "from-pink-500 to-rose-600" },
          { icon: Infinity, label: "Avatars (comptes cloud)", value: stats.avatars, color: "from-purple-500 to-violet-600" },
        ].map((stat, i) => (
          <div key={i} className={`rounded-2xl p-6 bg-gradient-to-br ${stat.color} bg-opacity-10 border border-white/10`}>
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="h-6 w-6 text-white/70" />
              <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
            </div>
            <p className="text-2xl font-black text-white">{stat.value}</p>
            <p className="text-xs text-white/50 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-[11px] text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        Transparence Egor69 : ces totaux comptent uniquement les lignes liées à un email cloud authentifié.
        Le studio avatar sans compte persiste en mode explorateur sur l&apos;appareil — hors de ce tableau.
      </p>

      {/* Harmony Frequency */}
      {director?.harmony_frequency && (
        <div className="rounded-2xl border border-primary/30 p-8 bg-primary/5">
          <div className="text-center space-y-4">
            <h3 className="font-display text-2xl font-bold">Fréquence Cosmique de Synchronisation</h3>
            <div className="flex items-center justify-center gap-4">
              <div className="text-6xl font-black text-primary">{director.harmony_frequency}</div>
              <div className="text-2xl">Hz</div>
            </div>
            <p className="text-sm text-muted-foreground">
              Vibration sacrée à laquelle tous les êtres oscillent en harmonie
            </p>
            <div className="relative h-1 bg-muted rounded-full overflow-hidden mt-6">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Last Sync */}
      {director?.last_sync && (
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>Dernière synchronisation: {new Date(director.last_sync).toLocaleTimeString()}</p>
          <p>Prochaine harmonisation cosmique: {new Date(director.next_cosmic_event || Date.now() + 24*60*60*1000).toLocaleDateString()}</p>
          <p className="max-w-xl mx-auto pt-2 text-muted-foreground/90">
            Méthode : comptage réservé aux emails cloud valides ; créations studio sans compte restent sur l&apos;appareil et ne gonflent pas ces totaux.
          </p>
        </div>
      )}
    </div>
  );
}