import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Zap, Gift, Leaf, Wrench,
  ArrowRight, Heart, Globe, Flame, CheckCircle,
  Lock, Sparkles, TrendingUp, Award, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const MISSIONS = [
  {
    id: "don_objet", icon: Gift, color: "from-emerald-500 to-green-700", points: 150,
    title: "Donner un objet", desc: "Publiez une annonce de don gratuit",
    action: "Publier un don", link: "/publier", co2: 3.5, category: "planète",
    badge: "🌱 Donateur"
  },
  {
    id: "reparer", icon: Wrench, color: "from-amber-500 to-orange-700", points: 200,
    title: "Réparer plutôt que jeter", desc: "Publiez une annonce de réparation",
    action: "Réparer", link: "/publier", co2: 5.2, category: "planète",
    badge: "🔧 Réparateur"
  },
  {
    id: "echanger", icon: RefreshCw, color: "from-purple-500 to-violet-700", points: 120,
    title: "Faire un échange", desc: "Proposez un troc équitable",
    action: "Échanger", link: "/publier", co2: 2.1, category: "communauté",
    badge: "🤝 Troqueur"
  },
  {
    id: "explorer", icon: Globe, color: "from-blue-500 to-cyan-700", points: 50,
    title: "Explorer le Marketplace", desc: "Découvrez 10 annonces de votre communauté",
    action: "Explorer", link: "/marketplace", co2: 0, category: "communauté",
    badge: "👁 Explorateur"
  },
  {
    id: "actualite", icon: Sparkles, color: "from-rose-500 to-pink-700", points: 80,
    title: "S'informer & résister", desc: "Lisez un article de l'Actualité citoyenne",
    action: "Lire", link: "/actualite", co2: 0, category: "culture",
    badge: "📰 Citoyen éveillé"
  },
  {
    id: "partager", icon: Heart, color: "from-red-500 to-rose-700", points: 100,
    title: "Inviter un ami", desc: "Partagez CirculAI Hub avec quelqu'un",
    action: "Partager", link: "/profil", co2: 1.0, category: "communauté",
    badge: "💌 Ambassadeur"
  },
];

const LEVELS = [
  { name: "Graine 🌱", min: 0,    color: "text-green-500",   bg: "bg-green-50",   ring: "ring-green-300" },
  { name: "Pousse 🌿",  min: 300,  color: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-300" },
  { name: "Arbre 🌳",   min: 800,  color: "text-teal-600",    bg: "bg-teal-50",    ring: "ring-teal-300" },
  { name: "Forêt 🌲",   min: 2000, color: "text-green-700",   bg: "bg-green-100",  ring: "ring-green-400" },
  { name: "Gardien 🌍", min: 5000, color: "text-emerald-800", bg: "bg-emerald-100",ring: "ring-emerald-500" },
];

const BADGES_LIST = [
  { id: "don_objet",  emoji: "🌱", label: "Donateur",         desc: "Premier don publié" },
  { id: "reparer",    emoji: "🔧", label: "Réparateur",        desc: "Première réparation" },
  { id: "echanger",   emoji: "🤝", label: "Troqueur",          desc: "Premier échange" },
  { id: "explorer",   emoji: "👁",  label: "Explorateur",       desc: "Marketplace exploré" },
  { id: "actualite",  emoji: "📰", label: "Citoyen éveillé",   desc: "Actualité lue" },
  { id: "partager",   emoji: "💌", label: "Ambassadeur",        desc: "Ami invité" },
  { id: "top10",      emoji: "🏆", label: "Top 10",             desc: "Classement mondial" },
  { id: "co2_10",     emoji: "🍃", label: "Héros carbone",      desc: "10kg CO₂ évité" },
];

const REWARDS = [
  { points: 500,  label: "Badge Or",          icon: "🥇", desc: "Accès au cercle des gardiens" },
  { points: 1000, label: "-20% Abonnement",   icon: "💳", desc: "Réduction sur Citoyen Souverain" },
  { points: 2000, label: "Annonce boostée",   icon: "🚀", desc: "Mise en avant 7 jours gratuits" },
  { points: 5000, label: "Rang Ambassadeur",  icon: "🌍", desc: "Statut mondial + certificat NFT" },
];

const CATEGORY_COLORS = {
  planète:     "bg-emerald-100 text-emerald-700",
  communauté:  "bg-blue-100 text-blue-700",
  culture:     "bg-purple-100 text-purple-700",
};

function getLevel(pts) {
  return [...LEVELS].reverse().find(l => pts >= l.min) || LEVELS[0];
}

function getNextLevel(pts) {
  return LEVELS.find(l => l.min > pts) || null;
}

function XPBar({ points }) {
  const lvl = getLevel(points);
  const next = getNextLevel(points);
  const prevMin = lvl.min;
  const nextMin = next ? next.min : prevMin + 1000;
  const pct = Math.min(100, Math.round(((points - prevMin) / (nextMin - prevMin)) * 100));
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{lvl.name}</span>
        {next && <span>{next.name} — encore {nextMin - points} pts</span>}
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-right text-muted-foreground">{points} pts au total</p>
    </div>
  );
}

export default function Game() {
  const [tab, setTab] = useState("missions");
  const [completedLocal, setCompletedLocal] = useState([]);
  const [totalPoints, setTotalPoints] = useState(() => {
    return parseInt(localStorage.getItem("circul_points") || "0", 10);
  });
  const [earnedBadges, setEarnedBadges] = useState(() => {
    try { return JSON.parse(localStorage.getItem("circul_badges") || "[]"); } catch { return []; }
  });

  const addPoints = (mission) => {
    if (completedLocal.includes(mission.id)) return;
    const newPts = totalPoints + mission.points;
    setTotalPoints(newPts);
    setCompletedLocal(p => [...p, mission.id]);
    if (!earnedBadges.includes(mission.id)) {
      const newBadges = [...earnedBadges, mission.id];
      setEarnedBadges(newBadges);
      localStorage.setItem("circul_badges", JSON.stringify(newBadges));
    }
    localStorage.setItem("circul_points", String(newPts));
  };

  const level = getLevel(totalPoints);
  const co2Total = (earnedBadges.includes("reparer") ? 5.2 : 0) +
    (earnedBadges.includes("don_objet") ? 3.5 : 0) +
    (earnedBadges.includes("echanger") ? 2.1 : 0);

  const TABS = [
    { key: "missions",   label: "🎯 Missions" },
    { key: "badges",     label: "🏅 Badges" },
    { key: "recompenses",label: "🎁 Récompenses" },
    { key: "classement", label: "🏆 Classement" },
  ];

  const LEADERBOARD = [
    { name: "Amara N.",    city: "🇸🇳 Dakar",   pts: 8420, badges: 8 },
    { name: "Marie-Ève T.",city: "🇨🇦 Québec",  pts: 7350, badges: 7 },
    { name: "Lucas M.",    city: "🇫🇷 Paris",    pts: 6100, badges: 6 },
    { name: "Yuki T.",     city: "🇯🇵 Tokyo",    pts: 5890, badges: 6 },
    { name: "Carlos R.",   city: "🇧🇷 São Paulo",pts: 4200, badges: 5 },
    { name: "Sofia K.",    city: "🇩🇪 Berlin",   pts: 3980, badges: 5 },
    { name: "Vous",        city: "🌍 Ici",        pts: totalPoints, badges: earnedBadges.length, isMe: true },
  ].sort((a, b) => b.pts - a.pts);

  return (
    <div className="pb-24 space-y-6 max-w-3xl mx-auto">

      {/* HERO GAME */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 text-white"
        style={{ background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)" }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-end pr-6">
          <Globe className="h-48 w-48" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4">
            <Flame className="h-3.5 w-3.5 text-orange-400" />
            <span className="text-xs font-medium text-white/80">Jeu d'impact mondial · Saison 1</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Jouer à <span className="text-emerald-400">faire le bien</span>
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-lg mb-6">
            Chaque bonne action pour la planète, la communauté et vous-même vous rapporte des points réels, des badges, et des récompenses tangibles.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Zap, label: "Points", val: totalPoints.toLocaleString(), color: "text-yellow-400" },
              { icon: Leaf, label: "kg CO₂ évité", val: co2Total.toFixed(1), color: "text-emerald-400" },
              { icon: Award, label: "Badges", val: earnedBadges.length, color: "text-purple-400" },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-2xl p-3 text-center border border-white/10">
                <s.icon className={`h-5 w-5 mx-auto mb-1 ${s.color}`} />
                <p className={`text-xl font-bold ${s.color}`}>{s.val}</p>
                <p className="text-[10px] text-white/50">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Level bar */}
          <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <div className={`h-9 w-9 rounded-xl ${level.bg} flex items-center justify-center text-lg`}>
                {level.name.split(" ")[1]}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{level.name}</p>
                <p className="text-[10px] text-white/50">Votre niveau actuel</p>
              </div>
            </div>
            <XPBar points={totalPoints} />
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-1 bg-muted p-1 rounded-2xl overflow-x-auto">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={cn(
              "flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all",
              tab === t.key ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"
            )}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── MISSIONS ── */}
      {tab === "missions" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Accomplis des missions pour gagner des points et des badges. Chaque action a un impact réel sur la planète.</p>
          {MISSIONS.map(m => {
            const done = completedLocal.includes(m.id);
            const Icon = m.icon;
            return (
              <div key={m.id}
                className={cn("bg-card rounded-2xl border p-4 transition-all", done ? "border-emerald-200 bg-emerald-50/40" : "border-border hover:border-primary/20 hover:shadow-md")}>
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-foreground text-sm">{m.title}</h3>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[m.category]}`}>{m.category}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{m.desc}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                        <Zap className="h-3 w-3" /> +{m.points} pts
                      </span>
                      {m.co2 > 0 && (
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                          <Leaf className="h-3 w-3" /> -{m.co2}kg CO₂
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">🏅 {m.badge}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {done ? (
                      <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                        <CheckCircle className="h-5 w-5" /> Fait !
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        <Button asChild size="sm" className="rounded-xl text-xs">
                          <Link to={m.link} onClick={() => addPoints(m)}>{m.action} <ArrowRight className="h-3 w-3 ml-1" /></Link>
                        </Button>
                        <button onClick={() => addPoints(m)}
                          className="text-[10px] text-muted-foreground hover:text-primary underline text-center">
                          Marquer comme fait
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── BADGES ── */}
      {tab === "badges" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Collectez des badges en accomplissant des missions. Chaque badge reflète votre engagement réel.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BADGES_LIST.map(b => {
              const unlocked = earnedBadges.includes(b.id);
              return (
                <div key={b.id}
                  className={cn("rounded-2xl border p-4 text-center transition-all",
                    unlocked ? "bg-card border-primary/20 shadow-md" : "bg-muted/40 border-border opacity-50 grayscale")}>
                  <div className="text-3xl mb-2">{unlocked ? b.emoji : "🔒"}</div>
                  <p className="text-xs font-semibold text-foreground">{b.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{b.desc}</p>
                  {unlocked && <Badge className="mt-2 text-[10px] bg-primary/10 text-primary border-primary/20">Débloqué ✓</Badge>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── RÉCOMPENSES ── */}
      {tab === "recompenses" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Des récompenses réelles vous attendent à chaque palier. L'économie circulaire paie vraiment.</p>
          {REWARDS.map(r => {
            const reached = totalPoints >= r.points;
            return (
              <div key={r.points}
                className={cn("bg-card rounded-2xl border p-5 flex items-center gap-4 transition-all",
                  reached ? "border-emerald-300 bg-emerald-50/30 shadow-md" : "border-border opacity-60")}>
                <div className="text-4xl">{r.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{r.label}</h3>
                    {reached && <Badge className="text-[10px] bg-emerald-100 text-emerald-700 border-emerald-200">Débloqué !</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{r.desc}</p>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden w-40">
                    <div className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.min(100, (totalPoints / r.points) * 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{Math.min(totalPoints, r.points)}/{r.points} pts</p>
                </div>
                {reached ? (
                  <CheckCircle className="h-7 w-7 text-emerald-500 shrink-0" />
                ) : (
                  <Lock className="h-6 w-6 text-muted-foreground shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── CLASSEMENT ── */}
      {tab === "classement" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Classement mondial des citoyens CirculAI — mis à jour en temps réel. Grimper = faire plus de bien.</p>
          {LEADERBOARD.map((p, i) => (
            <div key={p.name}
              className={cn("flex items-center gap-3 p-4 rounded-2xl border transition-all",
                p.isMe ? "bg-primary/5 border-primary/30 shadow-md" : "bg-card border-border hover:border-primary/20")}>
              <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0",
                i === 0 ? "bg-yellow-100 text-yellow-700" :
                i === 1 ? "bg-slate-100 text-slate-700" :
                i === 2 ? "bg-orange-100 text-orange-700" :
                "bg-muted text-muted-foreground")}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-semibold", p.isMe ? "text-primary" : "text-foreground")}>
                  {p.name} {p.isMe && "(Vous)"}
                </p>
                <p className="text-xs text-muted-foreground">{p.city} · {p.badges} badges</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground text-sm">{p.pts.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">points</p>
              </div>
            </div>
          ))}
          <div className="bg-accent rounded-2xl p-5 text-center">
            <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-sm font-semibold text-accent-foreground">Grimpez dans le classement en accomplissant des missions !</p>
            <Button size="sm" className="mt-3 rounded-xl" onClick={() => setTab("missions")}>
              Voir les missions <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}