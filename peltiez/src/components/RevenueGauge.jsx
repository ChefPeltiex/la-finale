import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Target } from "lucide-react";

export default function RevenueGauge({ currentRevenue = 0, targetRevenue = 1000 }) {
  const percentage = useMemo(() => 
    Math.min((currentRevenue / targetRevenue) * 100, 100), 
    [currentRevenue, targetRevenue]
  );

  const remaining = Math.max(targetRevenue - currentRevenue, 0);

  return (
    <div className="rounded-2xl border border-border bg-card p-8 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Progression vers ton objectif</h3>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-primary">${currentRevenue.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">sur ${targetRevenue}</p>
        </div>
      </div>

      {/* Circular Gauge */}
      <div className="flex justify-center mb-8">
        <div className="relative h-40 w-40">
          {/* Background circle */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-muted/30"
            />
            {/* Animated progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeDasharray={`${(percentage / 100) * 282.7} 282.7`}
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 282.7" }}
              animate={{ strokeDasharray: `${(percentage / 100) * 282.7} 282.7` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(158,60%,40%)" />
                <stop offset="100%" stopColor="hsl(260,70%,50%)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.p
              className="text-3xl font-black text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {Math.round(percentage)}%
            </motion.p>
            <p className="text-xs text-muted-foreground mt-1">Complété</p>
          </div>
        </div>
      </div>

      {/* Progress bar with labels */}
      <div className="space-y-3">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-xs text-emerald-600 font-semibold">Généré</p>
            <p className="font-bold text-foreground">${currentRevenue.toFixed(0)}</p>
          </div>
          <div className="p-2 rounded-lg bg-muted border border-border">
            <p className="text-xs text-muted-foreground font-semibold">Objectif</p>
            <p className="font-bold text-foreground">${targetRevenue}</p>
          </div>
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs text-primary font-semibold">À faire</p>
            <p className="font-bold text-foreground">${remaining.toFixed(0)}</p>
          </div>
        </div>
      </div>

      {/* Motivational message */}
      <div className="mt-6 pt-6 border-t border-border">
        {percentage < 50 && (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Tu es en bonne voie! Continue comme ça 💚
          </p>
        )}
        {percentage >= 50 && percentage < 100 && (
          <p className="text-sm text-primary font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Plus qu'un effort! Tu es presque là 🔥
          </p>
        )}
        {percentage >= 100 && (
          <p className="text-sm text-emerald-600 font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Objectif atteint! 🎉 Fixe un nouvel objectif?
          </p>
        )}
      </div>
    </div>
  );
}