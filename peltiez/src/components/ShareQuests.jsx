import { useState } from "react";
import { Share2, Facebook, Linkedin, Twitter, CheckCircle, Flame } from "lucide-react";
import { toast } from "sonner";
import { emitStardust } from "@/lib/godMode";

const SHARE_REWARDS = [
  { platform: "LinkedIn",  icon: Linkedin,  color: "#0077B5", bg: "rgba(0,119,181,0.15)",  border: "rgba(0,119,181,0.4)",  xp: 75,  etincelles: 50,  label: "Partager sur LinkedIn", url: (text) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&title=${encodeURIComponent(text)}` },
  { platform: "Facebook",  icon: Facebook,  color: "#1877F2", bg: "rgba(24,119,242,0.15)", border: "rgba(24,119,242,0.4)", xp: 50,  etincelles: 35,  label: "Partager sur Facebook", url: (text) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(text)}` },
  { platform: "Twitter/X", icon: Twitter,   color: "#1DA1F2", bg: "rgba(29,161,242,0.15)", border: "rgba(29,161,242,0.4)", xp: 40,  etincelles: 25,  label: "Partager sur X/Twitter", url: (text) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin)}` },
];

const SHARE_TEXTS = [
  "🌱 J’évolue avec Egor69 — sanctuaire circulaire, atlas vivant, radar discipliné.",
  "♻️ Don · échange · réparation : je mesure mon impact quand les données sont là.",
  "🔧 Réparer plutôt que jeter. Egor69 relie gestes et quêtes.",
  "💚 Souveraineté sans blabla : Egor69 — soin, vérité, vitesse.",
];

export default function ShareQuests({ compact = false }) {
  const [shared, setShared] = useState(() => {
    try { return JSON.parse(localStorage.getItem("shared_platforms") || "[]"); } catch { return []; }
  });
  const [totalXP, setTotalXP] = useState(() => parseInt(localStorage.getItem("share_xp") || "0"));
  const [totalEtincelles, setTotalEtincelles] = useState(() => parseInt(localStorage.getItem("share_etincelles") || "0"));

  const shareText = SHARE_TEXTS[Math.floor(Date.now() / 86400000) % SHARE_TEXTS.length];

  const handleShare = (platform) => {
    const reward = SHARE_REWARDS.find(r => r.platform === platform);
    if (!reward) return;

    const popup = window.open(reward.url(shareText), "_blank", "width=600,height=400");

    const timer = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(timer);
        if (!shared.includes(platform)) {
          const updated = [...shared, platform];
          setShared(updated);
          localStorage.setItem("shared_platforms", JSON.stringify(updated));

          const newXP = totalXP + reward.xp;
          const newEt = totalEtincelles + reward.etincelles;
          setTotalXP(newXP);
          setTotalEtincelles(newEt);
          localStorage.setItem("share_xp", String(newXP));
          localStorage.setItem("share_etincelles", String(newEt));

          toast.success(`+${reward.xp} XP & +${reward.etincelles} Étincelles débloquées ! 🔥`, { icon: "⚡" });
          emitStardust({ x: window.innerWidth * 0.5, y: 120, power: 1.6 });
        }
      }
    }, 500);
  };

  if (compact) return (
    <div className="flex gap-2 flex-wrap">
      {SHARE_REWARDS.map(r => {
        const Icon = r.icon;
        const done = shared.includes(r.platform);
        return (
          <button key={r.platform} onClick={() => handleShare(r.platform)} disabled={done}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.05] disabled:opacity-60"
            style={{ background: r.bg, border: `1px solid ${r.border}`, color: r.color }}>
            <Icon className="h-3 w-3" />
            {done ? "✓ Partagé" : `+${r.etincelles} ✨`}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary" />
          <div>
            <p className="font-bold text-foreground text-sm">⚡ QUÊTES DE PARTAGE</p>
            <p className="text-[10px] font-mono text-muted-foreground">Partagez · Débloquez des Étincelles · Grandissez ensemble</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="text-center">
            <p className="text-lg font-black text-primary">{totalXP}</p>
            <p className="text-[9px] font-mono text-muted-foreground">XP gagné</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-amber-400">{totalEtincelles}</p>
            <p className="text-[9px] font-mono text-muted-foreground">✨ Étincelles</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Today's message */}
        <div className="rounded-xl p-4 bg-muted/50 border border-border">
          <p className="text-[10px] font-mono text-muted-foreground mb-1">MESSAGE DU JOUR</p>
          <p className="text-sm text-foreground italic">"{shareText}"</p>
        </div>

        {/* Platform buttons */}
        <div className="space-y-3">
          {SHARE_REWARDS.map(reward => {
            const Icon = reward.icon;
            const done = shared.includes(reward.platform);
            return (
              <div key={reward.platform} className="flex items-center gap-3 rounded-xl p-4 transition-all"
                style={{ background: done ? "rgba(16,185,129,0.06)" : reward.bg, border: `1px solid ${done ? "rgba(16,185,129,0.3)" : reward.border}` }}>
                <Icon className="h-5 w-5 flex-shrink-0" style={{ color: done ? "#10b981" : reward.color }} />
                <div className="flex-1">
                  <p className="text-sm font-bold" style={{ color: done ? "#10b981" : "hsl(var(--foreground))" }}>
                    {done ? `✓ ${reward.platform} partagé` : reward.label}
                  </p>
                  <p className="text-[10px] font-mono text-muted-foreground">
                    +{reward.xp} XP · +{reward.etincelles} Étincelles
                  </p>
                </div>
                {done ? (
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                ) : (
                  <button onClick={() => handleShare(reward.platform)}
                    className="px-4 py-2 rounded-lg font-bold text-xs text-white transition-all hover:scale-[1.05]"
                    style={{ background: reward.color }}>
                    Partager
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Progression */}
        <div className="rounded-xl p-4" style={{ background: "rgba(255,215,0,0.06)", border: "1px solid rgba(255,215,0,0.2)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-4 w-4 text-amber-400" />
            <p className="font-mono text-xs font-bold text-amber-400">PROGRESSION DE LA QUÊTE</p>
          </div>
          <div className="flex gap-2 mb-2">
            {SHARE_REWARDS.map(r => (
              <div key={r.platform} className="flex-1 h-2 rounded-full"
                style={{ background: shared.includes(r.platform) ? "#10b981" : "rgba(255,255,255,0.08)" }} />
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground">
            {shared.length}/{SHARE_REWARDS.length} réseaux · {shared.length === SHARE_REWARDS.length ? "🏆 QUÊTE COMPLÈTE ! Bonus 50 Étincelles !" : `${SHARE_REWARDS.length - shared.length} partages restants`}
          </p>
        </div>
      </div>
    </div>
  );
}