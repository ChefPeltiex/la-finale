import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, Loader2, Trophy, Flame, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const QUEST_TEMPLATES = [
  {
    type: "meditation_daily",
    title: "Méditation Quotidienne",
    description: "Médite 5 minutes chaque jour",
    frequency: "quotidien",
    target_days: 30,
    xp_reward: 300,
    badge_reward: "Meditation Master",
    icon: "🧘"
  },
  {
    type: "yoga_weekly",
    title: "Yoga Hebdomadaire",
    description: "Complète 1 séance de yoga par semaine",
    frequency: "hebdomadaire",
    target_days: 12,
    xp_reward: 400,
    badge_reward: "Yoga Guru",
    icon: "🏃"
  },
  {
    type: "nutrition_challenge",
    title: "Défi Nutrition",
    description: "Consomme 5 portions de fruits/légumes par jour",
    frequency: "quotidien",
    target_days: 14,
    xp_reward: 200,
    badge_reward: "Health Foodie",
    icon: "🥗"
  },
  {
    type: "hydration",
    title: "Hydratation",
    description: "Bois 8 verres d'eau par jour",
    frequency: "quotidien",
    target_days: 21,
    xp_reward: 150,
    badge_reward: "Hydration Hero",
    icon: "💧"
  },
  {
    type: "sleep_tracking",
    title: "Sommeil de Qualité",
    description: "Dors 7-8 heures chaque nuit",
    frequency: "quotidien",
    target_days: 7,
    xp_reward: 250,
    badge_reward: "Sleep Well",
    icon: "😴"
  },
  {
    type: "gratitude",
    title: "Journal de Gratitude",
    description: "Écris 3 choses pour lesquelles tu es reconnaissant",
    frequency: "quotidien",
    target_days: 10,
    xp_reward: 180,
    badge_reward: "Grateful Soul",
    icon: "🙏"
  }
];

export default function WellnessQuests() {
  const queryClient = useQueryClient();

  const { data: userQuests = [] } = useQuery({
    queryKey: ["wellness-quests"],
    queryFn: async () => {
      const me = await base44.auth.me();
      if (!me) return [];
      return base44.entities.WellnessQuest.filter({ user_email: me.email }, "-started_at", 50);
    },
    staleTime: 60_000,
  });

  const startQuestMutation = useMutation({
    mutationFn: async (questType) => {
      const me = await base44.auth.me();
      const template = QUEST_TEMPLATES.find(q => q.type === questType);
      
      return base44.entities.WellnessQuest.create({
        user_email: me.email,
        quest_type: questType,
        title: template.title,
        description: template.description,
        frequency: template.frequency,
        target_days: template.target_days,
        progress: 0,
        status: "active",
        xp_reward: template.xp_reward,
        badge_reward: template.badge_reward,
        started_at: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["wellness-quests"]);
    }
  });

  const progressQuestMutation = useMutation({
    mutationFn: async (questId) => {
      const quest = userQuests.find(q => q.id === questId);
      const newProgress = (quest?.progress || 0) + 1;
      
      await base44.entities.WellnessQuest.update(questId, {
        progress: newProgress,
        status: newProgress >= (quest?.target_days || 1) ? "completed" : "active",
        completed_at: newProgress >= (quest?.target_days || 1) ? new Date().toISOString() : undefined
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["wellness-quests"]);
    }
  });

  const activeQuests = userQuests.filter(q => q.status === "active");
  const completedQuests = userQuests.filter(q => q.status === "completed");
  const availableQuests = QUEST_TEMPLATES.filter(t => !userQuests.some(q => q.quest_type === t.type && q.status === "active"));

  return (
    <div className="pb-20 space-y-8 max-w-4xl mx-auto px-4 pt-6">
      {/* Hero */}
      <div className="rounded-3xl p-8 text-center" style={{ background: "linear-gradient(135deg, hsl(280,60%,15%), hsl(240,50%,12%))" }}>
        <Trophy className="h-12 w-12 text-amber-400 mx-auto mb-3" />
        <h1 className="font-display text-3xl font-black text-white">Quêtes de Bien-être</h1>
        <p className="text-white/60 mt-2">Complète des défis quotidiens et gagne XP + badges</p>
      </div>

      {/* Quêtes Actives */}
      {activeQuests.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" /> Mes Quêtes Actives ({activeQuests.length})
          </h2>
          {activeQuests.map(quest => {
            const template = QUEST_TEMPLATES.find(t => t.type === quest.quest_type);
            const progress = Math.round((quest.progress / quest.target_days) * 100);
            return (
              <div key={quest.id} className="bg-card rounded-2xl border border-border p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{template?.icon}</span>
                      <div>
                        <h3 className="font-bold text-foreground">{quest.title}</h3>
                        <p className="text-xs text-muted-foreground">{quest.description}</p>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200">{quest.progress}/{quest.target_days}</Badge>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{progress}% complété</span>
                    <span className="text-orange-600 font-bold flex items-center gap-1">
                      +{quest.xp_reward} XP
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <Button
                  onClick={() => progressQuestMutation.mutate(quest.id)}
                  disabled={progressQuestMutation.isPending}
                  className="w-full rounded-xl font-bold gap-2 bg-orange-600 hover:bg-orange-700 text-white border-0">
                  {progressQuestMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Mise à jour...</>
                  ) : (
                    <><CheckCircle2 className="h-4 w-4" /> Marquer comme complété</>
                  )}
                </Button>
              </div>
            );
          })}
        </section>
      )}

      {/* Quêtes Complétées */}
      {completedQuests.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" /> Complétées ({completedQuests.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {completedQuests.map(quest => {
              const template = QUEST_TEMPLATES.find(t => t.type === quest.quest_type);
              return (
                <div key={quest.id} className="bg-green-50 rounded-xl border border-green-200 p-4 text-center">
                  <span className="text-3xl block mb-2">{template?.icon}</span>
                  <p className="font-bold text-green-900 text-sm">{quest.title}</p>
                  <Badge className="mt-2 bg-green-600 text-white border-0">
                    {quest.xp_reward} XP gagné
                  </Badge>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Quêtes Disponibles */}
      {availableQuests.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <Target className="h-5 w-5 text-violet-500" /> Quêtes Disponibles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableQuests.map(template => (
              <div key={template.type} className="bg-card rounded-2xl border border-border p-5 space-y-3 hover:shadow-md transition-all hover:border-violet-300/50">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{template.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-sm">{template.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs border-t pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Durée</span>
                    <span className="font-bold">{template.target_days} jours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Récompense</span>
                    <span className="text-violet-600 font-bold">+{template.xp_reward} XP</span>
                  </div>
                  {template.badge_reward && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Badge</span>
                      <Badge className="text-[10px] bg-violet-100 text-violet-700 border-violet-200">{template.badge_reward}</Badge>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => startQuestMutation.mutate(template.type)}
                  disabled={startQuestMutation.isPending}
                  className="w-full rounded-xl text-sm font-bold gap-1 bg-violet-600 hover:bg-violet-700 text-white border-0">
                  {startQuestMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      <Award className="h-3.5 w-3.5" /> Commencer
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {activeQuests.length === 0 && completedQuests.length === 0 && availableQuests.length === 0 && (
        <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
          <Target className="h-12 w-12 text-muted-foreground/20 mx-auto mb-2" />
          <p className="text-muted-foreground">Aucune quête disponible</p>
        </div>
      )}
    </div>
  );
}