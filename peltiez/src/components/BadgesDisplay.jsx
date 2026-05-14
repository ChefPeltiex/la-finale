import { useState } from "react";
import { Trophy, Lock, Check } from "lucide-react";

const CO2_BADGES = [
  { threshold: 0,    name: 'Écocitoyen',         emoji: '🌱', color: 'emerald', description: 'Premiers pas écologiques' },
  { threshold: 10,   name: 'Défenseur Vert',     emoji: '🌿', color: 'green',   description: '10 kg CO₂ économisés' },
  { threshold: 50,   name: 'Champion Circulaire', emoji: '♻️', color: 'teal',    description: '50 kg CO₂ économisés' },
  { threshold: 100,  name: 'Héros Planétaire',   emoji: '🌍', color: 'blue',    description: '100 kg CO₂ économisés' },
  { threshold: 250,  name: 'Gardien de Terre',   emoji: '🌳', color: 'cyan',    description: '250 kg CO₂ économisés' },
  { threshold: 500,  name: 'Légende Verte',      emoji: '👑', color: 'violet',  description: '500 kg CO₂ économisés' },
];

const COLOR_MAP = {
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  green:   'bg-green-50 border-green-200 text-green-700',
  teal:    'bg-teal-50 border-teal-200 text-teal-700',
  blue:    'bg-blue-50 border-blue-200 text-blue-700',
  cyan:    'bg-cyan-50 border-cyan-200 text-cyan-700',
  violet:  'bg-violet-50 border-violet-200 text-violet-700',
};

export default function BadgesDisplay({ userBadges = [], totalCO2 = 0 }) {
  const [expanded, setExpanded] = useState(false);

  const earnedBadgeNames = new Set(userBadges.map(b => b.name));
  const earnedBadges = CO2_BADGES.filter(b => earnedBadgeNames.has(b.name));
  const nextBadge = CO2_BADGES.find(b => !earnedBadgeNames.has(b.name) && b.threshold > totalCO2);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" /> Badges de Durabilité
        </h3>
        <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
          {earnedBadges.length}/{CO2_BADGES.length}
        </span>
      </div>

      {/* Earned Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {earnedBadges.map(badge => (
          <div
            key={badge.name}
            className={`rounded-xl p-4 border-2 text-center ${COLOR_MAP[badge.color]} hover:shadow-md transition-shadow cursor-help`}
            title={badge.description}>
            <div className="text-3xl mb-2">{badge.emoji}</div>
            <p className="text-xs font-bold leading-tight">{badge.name}</p>
            <p className="text-[10px] opacity-75 mt-1">{badge.threshold}+ kg</p>
          </div>
        ))}

        {/* Locked Next Badge */}
        {nextBadge && (
          <div
            className="rounded-xl p-4 border-2 border-dashed border-slate-300 text-center text-slate-400 opacity-50"
            title={nextBadge.description}>
            <div className="text-3xl mb-2 filter grayscale">{nextBadge.emoji}</div>
            <p className="text-xs font-bold leading-tight">{nextBadge.name}</p>
            <p className="text-[10px] mt-1">
              {Math.max(0, Math.round((nextBadge.threshold - totalCO2) * 10) / 10)} kg restant
            </p>
          </div>
        )}
      </div>

      {/* Progress to Next Badge */}
      {nextBadge && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">Vers: {nextBadge.name}</span>
            <span className="text-muted-foreground">
              {Math.round((totalCO2 / nextBadge.threshold) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((totalCO2 / nextBadge.threshold) * 100, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground">
            {Math.round((nextBadge.threshold - totalCO2) * 10) / 10} kg CO₂ à économiser
          </p>
        </div>
      )}

      {/* Details Toggle */}
      {CO2_BADGES.length > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-xs font-bold text-primary hover:underline text-center py-2">
          {expanded ? '▼ Masquer' : '▶ Voir tous les badges'} disponibles
        </button>
      )}

      {/* All Badges List */}
      {expanded && (
        <div className="bg-card rounded-xl border border-border p-4 space-y-2 max-h-64 overflow-y-auto">
          {CO2_BADGES.map(badge => {
            const earned = earnedBadgeNames.has(badge.name);
            return (
              <div
                key={badge.name}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  earned
                    ? `${COLOR_MAP[badge.color]}`
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                <div className="text-2xl filter">{badge.emoji}</div>
                <div className="flex-1">
                  <p className="text-xs font-bold">{badge.name}</p>
                  <p className="text-[10px] opacity-75">{badge.description}</p>
                </div>
                {earned ? (
                  <Check className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <Lock className="h-4 w-4 flex-shrink-0 opacity-50" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}