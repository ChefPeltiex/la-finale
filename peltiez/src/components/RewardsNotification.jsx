import { useEffect, useState } from 'react';
import { Trophy, Zap, Star, X } from 'lucide-react';

export default function RewardsNotification({ reward, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible || !reward) return null;

  const { xp_gained, badge_earned, level_up, level } = reward;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-300/50 rounded-2xl p-5 shadow-2xl max-w-sm">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <span className="font-bold text-foreground">Récompense déverrouillée!</span>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          {/* XP Gain */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5">
            <Zap className="h-5 w-5 text-yellow-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">Points d'expérience</p>
              <p className="text-lg font-black text-foreground">+{xp_gained} XP</p>
            </div>
          </div>

          {/* Badge */}
          {badge_earned && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5">
              <span className="text-2xl">{badge_earned.emoji}</span>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">Nouveau badge</p>
                <p className="text-sm font-bold text-foreground">{badge_earned.name}</p>
              </div>
            </div>
          )}

          {/* Level Up */}
          {level_up && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-violet-500/10 to-emerald-500/10 border border-violet-300/30">
              <Star className="h-5 w-5 text-violet-500 flex-shrink-0 animate-pulse" />
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">Niveau suivant!</p>
                <p className="text-sm font-bold text-foreground">{level}</p>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-3 text-center">Continue comme ça! 🌟</p>
      </div>
    </div>
  );
}