import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Facebook, Linkedin, Twitter, CheckCircle, Copy, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SITE_ORIGIN } from "@/lib/site";

const QUESTS = [
  {
    id: "share_fb",
    platform: "Facebook",
    icon: Facebook,
    color: "#1877F2",
    bg: "rgba(24,119,242,0.15)",
    border: "rgba(24,119,242,0.4)",
    reward: 50,
    title: "Partager Egor69 sur Facebook",
    desc: "Publie un post sur ta page ou dans un groupe avec le lien officiel Egor69.",
    cta: "Partager sur Facebook",
    url: () => {
      const u = encodeURIComponent(SITE_ORIGIN);
      const quote = encodeURIComponent(
        "🌍 Je rejoins Egor69 — économie circulaire, partage et réparation. #Egor69"
      );
      return `https://www.facebook.com/sharer/sharer.php?u=${u}&quote=${quote}`;
    },
  },
  {
    id: "share_li",
    platform: "LinkedIn",
    icon: Linkedin,
    color: "#0A66C2",
    bg: "rgba(10,102,194,0.15)",
    border: "rgba(10,102,194,0.4)",
    reward: 100,
    title: "Partager sur LinkedIn",
    desc: "Un post professionnel = 100 Étincelles. Montre ton engagement ESG.",
    cta: "Partager sur LinkedIn",
    url: () =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_ORIGIN)}`,
  },
  {
    id: "share_tw",
    platform: "X / Twitter",
    icon: Twitter,
    color: "#1DA1F2",
    bg: "rgba(29,161,242,0.15)",
    border: "rgba(29,161,242,0.4)",
    reward: 30,
    title: "Tweeter Egor69",
    desc: "Un tweet = 30 Étincelles. Partage le mouvement sans inventer de chiffres d’audience.",
    cta: "Tweeter",
    url: () => {
      const text = encodeURIComponent(
        "🔥 Egor69 — économie circulaire et entraide. Rejoins le mouvement. 🌍 #Egor69 #ÉconomieCirculaire"
      );
      return `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(SITE_ORIGIN)}`;
    },
  },
  {
    id: "share_link",
    platform: "Lien unique",
    icon: Copy,
    color: "#10b981",
    bg: "rgba(16,185,129,0.15)",
    border: "rgba(16,185,129,0.4)",
    reward: 25,
    title: "Copier et partager ton lien de parrainage",
    desc: "Chaque ami inscrit via ton lien = 25 Étincelles supplémentaires par conversion.",
    cta: "Copier mon lien",
    url: () => null,
  },
];

const ETINCELLE_REWARDS = [
  { seuil: 100,  reward: "Badge « Ambassadeur Egor69 »",     icon: "🥉" },
  { seuil: 300,  reward: "1 mois Hub Pro offert",              icon: "🥈" },
  { seuil: 700,  reward: "30$ crédits marketplace",           icon: "🥇" },
  { seuil: 1500, reward: "Invitation VIP événement national",  icon: "👑" },
];

export default function ShareQuests() {
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem("share_quests") || "[]"); } catch { return []; }
  });
  const [etincelles, setEtincelles] = useState(() => parseInt(localStorage.getItem("etincelles") || "0"));
  const [copied, setCopied] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity,
  });

  const referralLink = user
    ? `${SITE_ORIGIN}?ref=${encodeURIComponent(user.email?.split("@")[0] || "ami")}`
    : SITE_ORIGIN;

  const handleQuest = (quest) => {
    if (quest.url()) {
      window.open(quest.url(), "_blank", "width=600,height=500");
    } else {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }

    if (!completed.includes(quest.id)) {
      const newCompleted = [...completed, quest.id];
      const newTotal = etincelles + quest.reward;
      setCompleted(newCompleted);
      setEtincelles(newTotal);
      localStorage.setItem("share_quests", JSON.stringify(newCompleted));
      localStorage.setItem("etincelles", String(newTotal));
      toast.success(`+${quest.reward} Étincelles ✨ gagnées !`);
    }
  };

  const nextReward = ETINCELLE_REWARDS.find(r => r.seuil > etincelles);
  const progressPct = nextReward ? Math.min((etincelles / nextReward.seuil) * 100, 100) : 100;

  return (
    <div className="min-h-screen pb-20" style={{ background: "linear-gradient(160deg, hsl(260,30%,5%) 0%, hsl(220,30%,5%) 100%)" }}>
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-12">

        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="text-6xl mb-2">✨</div>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 font-mono tracking-widest">
            SYSTÈME D'ÉTINCELLES — QUÊTES DE PARTAGE
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white">
            Partage. Gagne.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
              Transforme le monde.
            </span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Chaque partage sur un réseau externe débloque des crédits Étincelles — échangeables contre des avantages sur Egor69 (selon les règles affichées dans l’app).
          </p>
        </div>

        {/* Étincelles Counter */}
        <div className="rounded-2xl p-8 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "2px solid rgba(139,92,246,0.4)" }}>
          <p className="text-xs font-mono text-white/40 mb-2">MES ÉTINCELLES TOTALES</p>
          <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">{etincelles}</p>
          <p className="text-white/50 text-sm mt-2 font-mono">✨</p>

          {nextReward && (
            <div className="mt-6 space-y-2">
              <p className="text-xs text-white/40 font-mono">Prochain objectif : {nextReward.icon} {nextReward.reward}</p>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #7c3aed, #a855f7, #ec4899)" }} />
              </div>
              <p className="text-xs text-white/30">{etincelles} / {nextReward.seuil} Étincelles</p>
            </div>
          )}
        </div>

        {/* Quests */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-white">Quêtes disponibles</h2>
          {QUESTS.map(quest => {
            const Icon = quest.icon;
            const done = completed.includes(quest.id);
            return (
              <div key={quest.id} className="rounded-2xl p-6 flex items-center gap-5 transition-all hover:scale-[1.01]"
                style={{ background: quest.bg, border: `2px solid ${done ? "rgba(16,185,129,0.6)" : quest.border}` }}>
                <div className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${quest.color}20` }}>
                  <Icon className="h-6 w-6" style={{ color: quest.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white text-sm">{quest.title}</h3>
                    {done && <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-white/55">{quest.desc}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-black text-yellow-300 mb-2">+{quest.reward} ✨</p>
                  <button onClick={() => handleQuest(quest)}
                    className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
                    style={{ background: done ? "rgba(16,185,129,0.3)" : `${quest.color}30`, border: `1px solid ${done ? "rgba(16,185,129,0.5)" : quest.border}`, color: done ? "#10b981" : quest.color }}>
                    {done ? (quest.id === "share_link" ? (copied ? "Copié !" : quest.cta) : "✓ Fait") : quest.cta}
                    {!done && <ExternalLink className="h-3 w-3 inline ml-1" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rewards table */}
        <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h2 className="font-display text-xl font-bold text-white mb-5">🏆 Récompenses débloquées</h2>
          <div className="space-y-3">
            {ETINCELLE_REWARDS.map(r => {
              const unlocked = etincelles >= r.seuil;
              return (
                <div key={r.seuil} className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: unlocked ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${unlocked ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.05)"}` }}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{r.icon}</span>
                    <p className={`text-sm font-medium ${unlocked ? "text-white" : "text-white/40"}`}>{r.reward}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-yellow-300">{r.seuil} ✨</span>
                    {unlocked && <CheckCircle className="h-4 w-4 text-emerald-400" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}