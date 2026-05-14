import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SEOMeta from "@/components/SEOMeta";
import MysticalReadingChallenge from "@/components/MysticalReadingChallenge";
import { Target, Loader2, Trophy, Recycle, BookOpen, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CHALLENGE_CONFIG = {
  recycling: {
    icon: Recycle,
    color: "from-emerald-500 to-teal-500",
    label: "Défi Recyclage",
    emoji: "♻️"
  },
  mystical_reading: {
    icon: BookOpen,
    color: "from-violet-500 to-purple-500",
    label: "Lecture Mystique",
    emoji: "📖"
  },
  meditation: {
    icon: Flame,
    color: "from-orange-500 to-red-500",
    label: "Méditation",
    emoji: "🧘"
  }
};

export default function DailyChallenges() {
  const queryClient = useQueryClient();
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me(), staleTime: Infinity });

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ["daily-challenges", user?.email],
    queryFn: () => base44.entities.DailyChallenge.filter(
      { user_email: user.email, status: "active" },
      "-challenge_date",
      20
    ),
    enabled: !!user,
    staleTime: 30_000,
    refetchInterval: 15_000
  });

  const progressMutation = useMutation({
    mutationFn: async (data) => {
      const { challengeId, newValue } = data;
      const challenge = challenges.find(c => c.id === challengeId);
      const isCompleted = newValue >= challenge.target_value;

      await base44.entities.DailyChallenge.update(challengeId, {
        current_value: newValue,
        status: isCompleted ? "completed" : "active",
        completed_at: isCompleted ? new Date().toISOString() : undefined
      });

      // Award XP if completed
      if (isCompleted && user) {
        await base44.functions.invoke('awardRewardsOnAction', {
          user_email: user.email,
          action: 'complete_daily_challenge',
          xp: challenge.xp_reward
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries(["daily-challenges"])
  });

  const stats = useMemo(() => ({
    active: challenges.filter(c => c.status === "active").length,
    completed: challenges.filter(c => c.status === "completed").length,
    totalXp: challenges.filter(c => c.status === "completed").reduce((s, c) => s + (c.xp_reward || 0), 0)
  }), [challenges]);

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "Game",
    "name": "Défis Quotidiens - Test Your Might",
    "description": "Défis quotidiens : recyclage, lectures mystiques, méditation. Gagnez XP et badges!"
  };

  return (
    <div className="pb-20 space-y-8 max-w-4xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Défis Quotidiens - Gagnez XP | CirculAI Hub"
        description="Défis quotidiens: recyclage, lectures mystiques, méditation. Gagnez XP, badges et points d'expérience."
        keywords="défis, XP, recyclage, lecture mystique, gamification, récompenses"
        canonicalUrl="https://egor69.ca/daily-challenges"
        schemaData={seoSchema}
      />

      {/* Hero */}
      <div className="rounded-3xl p-10 text-center bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-200/20">
        <Target className="h-12 w-12 text-purple-500 mx-auto mb-3" />
        <h1 className="font-display text-3xl font-black text-foreground">Défis Quotidiens</h1>
        <p className="text-muted-foreground mt-2">Complète des objectifs · Gagne XP · Déverrouille badges</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-3xl font-black text-purple-500">{stats.active}</p>
          <p className="text-xs text-muted-foreground mt-1">Défis actifs</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-3xl font-black text-emerald-600">{stats.completed}</p>
          <p className="text-xs text-muted-foreground mt-1">Complétés</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-3xl font-black text-amber-500">{stats.totalXp}</p>
          <p className="text-xs text-muted-foreground mt-1">XP gagnés</p>
        </div>
      </div>

      {/* Challenges */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-purple-500" /></div>
      ) : challenges.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border">
          <Trophy className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">Aucun défi aujourd'hui</p>
          <p className="text-sm text-muted-foreground mt-1">Reviens plus tard pour de nouveaux défis!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {challenges.filter(c => c.challenge_type === 'mystical_reading').map(challenge => (
            <MysticalReadingChallenge
              key={challenge.id}
              challenge={challenge}
              onProgress={(id, newValue) => progressMutation.mutate({ challengeId: id, newValue })}
            />
          ))}

          {/* Recyclage challenges */}
          {challenges.filter(c => c.challenge_type === 'recycling').map(challenge => {
            const cfg = CHALLENGE_CONFIG.recycling;
            const progress = (challenge.current_value / challenge.target_value) * 100;
            const isCompleted = challenge.current_value >= challenge.target_value;

            return (
              <div key={challenge.id} className={`rounded-2xl border overflow-hidden transition-all ${
                isCompleted ? "bg-emerald-50/50 border-emerald-300/50" : "bg-card border-border"
              }`}>
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg bg-gradient-to-br ${cfg.color} text-white`}>
                        {cfg.emoji}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{challenge.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{challenge.description}</p>
                      </div>
                    </div>
                    {isCompleted && <span className="text-2xl">✨</span>}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium">{challenge.current_value}/{challenge.target_value} objets</p>
                      <Badge variant="secondary">{Math.round(progress)}%</Badge>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-200/20 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Récompense</p>
                      <p className="font-bold text-emerald-600">+{challenge.xp_reward} XP</p>
                    </div>
                  </div>

                  {!isCompleted && (
                    <Button
                      onClick={() => progressMutation.mutate({ challengeId: challenge.id, newValue: challenge.current_value + 1 })}
                      disabled={progressMutation.isPending}
                      className="w-full rounded-lg h-9 bg-emerald-600 hover:bg-emerald-700 text-white border-0 text-sm font-bold">
                      {progressMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "+1 objet"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info box */}
      <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground space-y-2">
        <p className="font-semibold text-foreground">💡 Comment ça marche?</p>
        <ul className="space-y-1 text-xs">
          <li>✓ Complète des défis quotidiens</li>
          <li>✓ Gagne XP et badges</li>
          <li>✓ Accumule des points d'expérience</li>
          <li>✓ Déverrouille nouvelles sections du jeu</li>
        </ul>
      </div>
    </div>
  );
}