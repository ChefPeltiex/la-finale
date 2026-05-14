import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MysticalReadingChallenge({ challenge, onProgress }) {
  const [adding, setAdding] = useState(false);
  const progress = (challenge.current_value / challenge.target_value) * 100;
  const isCompleted = challenge.current_value >= challenge.target_value;

  const handleAddPage = async () => {
    setAdding(true);
    await onProgress(challenge.id, challenge.current_value + 1);
    setAdding(false);
  };

  const handleAddMultiple = async () => {
    setAdding(true);
    const pages = prompt(`Combien de pages lues? (actuel: ${challenge.current_value}/${challenge.target_value})`);
    if (pages && !isNaN(pages)) {
      await onProgress(challenge.id, challenge.current_value + parseInt(pages));
    }
    setAdding(false);
  };

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all ${
      isCompleted ? "bg-emerald-50/50 border-emerald-300/50" : "bg-card border-border"
    }`}>
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg bg-violet-100">
              📖
            </div>
            <div>
              <h3 className="font-bold text-foreground">{challenge.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{challenge.description}</p>
            </div>
          </div>
          {isCompleted && <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-1" />}
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-foreground">{challenge.current_value}/{challenge.target_value} pages</p>
            <Badge variant="secondary" className="text-xs">{Math.round(progress)}%</Badge>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-400 to-purple-500 transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Reward info */}
        <div className="px-3 py-2 rounded-lg bg-violet-500/5 border border-violet-200/20 flex items-center justify-between">
          <div className="text-sm">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Récompense</p>
            <p className="font-bold text-violet-600">+{challenge.xp_reward} XP</p>
          </div>
          {challenge.badge_reward && (
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
              🏆 {challenge.badge_reward}
            </Badge>
          )}
        </div>

        {/* Buttons */}
        {!isCompleted ? (
          <div className="flex gap-2">
            <Button
              onClick={handleAddPage}
              disabled={adding}
              className="flex-1 rounded-lg text-sm h-9 bg-violet-600 hover:bg-violet-700 text-white border-0">
              {adding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "+1 page"}
            </Button>
            <Button
              onClick={handleAddMultiple}
              disabled={adding}
              variant="outline"
              className="rounded-lg text-sm h-9">
              + Ajouter plusieurs
            </Button>
          </div>
        ) : (
          <div className="text-center py-2 rounded-lg bg-emerald-100">
            <p className="text-sm font-bold text-emerald-700">✨ Défi complété!</p>
          </div>
        )}
      </div>
    </div>
  );
}