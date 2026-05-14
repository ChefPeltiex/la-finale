import { useState } from 'react';
import { Sparkles, AlertCircle, Zap, X } from 'lucide-react';

const ALERT_CONFIG = {
  number_match: { emoji: '🔢', color: 'from-violet-500 to-purple-500', icon: Sparkles },
  time_alignment: { emoji: '⏰', color: 'from-blue-500 to-cyan-500', icon: Zap },
  energy_peak: { emoji: '⚡', color: 'from-yellow-500 to-orange-500', icon: Zap },
  planetary_influence: { emoji: '🪐', color: 'from-indigo-500 to-violet-500', icon: AlertCircle },
  angel_number: { emoji: '👼', color: 'from-pink-500 to-rose-500', icon: Sparkles },
  life_path_alignment: { emoji: '🌟', color: 'from-emerald-500 to-teal-500', icon: Sparkles }
};

export default function SynchronicityAlertComponent({ alert, onDismiss }) {
  const [visible, setVisible] = useState(true);

  const config = ALERT_CONFIG[alert.alert_type] || ALERT_CONFIG.number_match;

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) onDismiss(alert.id);
  };

  if (!visible) return null;

  return (
    <div className="animate-slide-in-right fixed bottom-4 right-4 z-50 max-w-sm">
      <div className={`bg-gradient-to-br ${config.color} rounded-2xl p-5 text-white shadow-2xl border border-white/10`}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{config.emoji}</span>
            <div>
              <p className="font-bold text-sm">{alert.title}</p>
              <p className="text-xs opacity-75">Synchronicité détectée</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/60 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs leading-relaxed mb-3 opacity-90">{alert.description}</p>

        {alert.number && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-white/15 text-center">
            <p className="text-xs opacity-75">Nombre actif</p>
            <p className="text-2xl font-black">{alert.number}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {Array.from({ length: alert.intensity }).map((_, i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-white/40" />
            ))}
          </div>
          {alert.action_recommended && (
            <p className="text-[10px] opacity-75 italic">{alert.action_recommended}</p>
          )}
        </div>
      </div>
    </div>
  );
}