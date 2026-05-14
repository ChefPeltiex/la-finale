import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Wrench, RefreshCw, Zap, Trophy,
  Globe, Heart, TreePine, CheckCircle, Lock, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const QUESTS = [
  {
    id: "don_objet",
    emoji: "🎁",
    title: { fr: "Don d'un objet", en: "Give an item", es: "Donar un objeto", pt: "Doar um objeto", sw: "Toa kitu", ar: "تبرع بشيء" },
    desc: { fr: "Donnez un objet dont vous n'avez plus besoin", en: "Give away something you no longer need", es: "Da algo que ya no necesitas", pt: "Dê algo que não precisa mais", sw: "Toa kitu usichohitaji", ar: "تبرع بشيء لا تحتاجه" },
    xp: 150,
    co2: 3.5,
    color: "from-emerald-500 to-green-700",
    icon: Gift,
    category: "planète",
  },
  {
    id: "reparer",
    emoji: "🔧",
    title: { fr: "Réparer plutôt que jeter", en: "Repair instead of trash", es: "Reparar en vez de tirar", pt: "Consertar em vez de jogar fora", sw: "Rekebisha badala ya kutupa", ar: "أصلح بدلاً من الرمي" },
    desc: { fr: "Faites réparer ou réparez un objet cassé", en: "Get a broken item fixed", es: "Repara un objeto roto", pt: "Conserte um objeto quebrado", sw: "Rekebisha kitu kilichovunjika", ar: "أصلح شيئاً مكسوراً" },
    xp: 200,
    co2: 5,
    color: "from-amber-500 to-orange-700",
    icon: Wrench,
    category: "planète",
  },
  {
    id: "echanger",
    emoji: "🔄",
    title: { fr: "Échange équitable", en: "Fair exchange", es: "Intercambio justo", pt: "Troca justa", sw: "Kubadilishana kwa haki", ar: "تبادل عادل" },
    desc: { fr: "Échangez un objet sans argent", en: "Swap an item without money", es: "Intercambia sin dinero", pt: "Troque sem dinheiro", sw: "Badilishana bila pesa", ar: "تبادل شيئاً بدون مال" },
    xp: 120,
    co2: 2,
    color: "from-purple-500 to-violet-700",
    icon: RefreshCw,
    category: "communauté",
  },
  {
    id: "partager_savoir",
    emoji: "📚",
    title: { fr: "Partager un savoir", en: "Share knowledge", es: "Compartir saber", pt: "Compartilhar conhecimento", sw: "Shiriki maarifa", ar: "شارك معرفة" },
    desc: { fr: "Publiez un tutoriel de réparation ou de réutilisation", en: "Publish a repair or reuse tutorial", es: "Publica un tutorial de reparación", pt: "Publique um tutorial de conserto", sw: "Chapisha mwongozo wa ukarabati", ar: "انشر درساً للإصلاح" },
    xp: 180,
    co2: 0,
    color: "from-blue-500 to-cyan-700",
    icon: Globe,
    category: "culture",
  },
  {
    id: "inviter",
    emoji: "🤝",
    title: { fr: "Inviter un ami", en: "Invite a friend", es: "Invitar un amigo", pt: "Convidar um amigo", sw: "Alika rafiki", ar: "ادعُ صديقاً" },
    desc: { fr: "Chaque ami invité = 5 arbres plantés ensemble", en: "Each invited friend = 5 trees planted together", es: "Cada amigo invitado = 5 árboles plantados", pt: "Cada amigo convidado = 5 árvores plantadas", sw: "Kila rafiki aliyealikwa = miti 5 iliyopandwa", ar: "كل صديق مدعو = 5 أشجار تُزرع معاً" },
    xp: 250,
    co2: 10,
    color: "from-pink-500 to-rose-700",
    icon: Heart,
    category: "communauté",
  },
  {
    id: "planter_arbre",
    emoji: "🌳",
    title: { fr: "Planter un arbre", en: "Plant a tree", es: "Plantar un árbol", pt: "Plantar uma árvore", sw: "Panda mti", ar: "ازرع شجرة" },
    desc: { fr: "Participez à une action de plantation dans votre ville", en: "Join a tree planting event in your city", es: "Participa en una plantación en tu ciudad", pt: "Participe de um plantio de árvores", sw: "Jiunge na kupanda miti mjini kwako", ar: "شارك في زراعة أشجار في مدينتك" },
    xp: 500,
    co2: 20,
    color: "from-green-600 to-emerald-800",
    icon: TreePine,
    category: "planète",
  },
];

const LEVELS = [
  { min: 0,    max: 499,   label: "Graine 🌱",   color: "text-green-500",   bg: "bg-green-100" },
  { min: 500,  max: 1499,  label: "Pousse 🌿",   color: "text-emerald-600", bg: "bg-emerald-100" },
  { min: 1500, max: 3999,  label: "Arbre 🌳",    color: "text-teal-600",    bg: "bg-teal-100" },
  { min: 4000, max: 9999,  label: "Forêt 🌲",    color: "text-green-700",   bg: "bg-green-50" },
  { min: 10000,max: Infinity, label: "Gardien 🌍", color: "text-emerald-800", bg: "bg-emerald-50" },
];

const LEADERBOARD = [
  { name: "Amara N.", city: "Dakar 🇸🇳", xp: 12400, emoji: "🌍" },
  { name: "Marie-Ève T.", city: "Québec 🇨🇦", xp: 9850, emoji: "🌱" },
  { name: "Lucas M.", city: "Paris 🇫🇷", xp: 7200, emoji: "♻️" },
  { name: "Yuki T.", city: "Tokyo 🇯🇵", xp: 5600, emoji: "🌿" },
  { name: "Carlos R.", city: "São Paulo 🇧🇷", xp: 4100, emoji: "🌳" },
];

const CATEGORIES = [
  { key: "all", label: { fr: "Tout", en: "All", es: "Todo", pt: "Tudo", sw: "Yote", ar: "الكل" } },
  { key: "planète", label: { fr: "🌍 Planète", en: "🌍 Planet", es: "🌍 Planeta", pt: "🌍 Planeta", sw: "🌍 Sayari", ar: "🌍 كوكب" } },
  { key: "communauté", label: { fr: "🤝 Communauté", en: "🤝 Community", es: "🤝 Comunidad", pt: "🤝 Comunidade", sw: "🤝 Jumuiya", ar: "🤝 مجتمع" } },
  { key: "culture", label: { fr: "🎭 Culture", en: "🎭 Culture", es: "🎭 Cultura", pt: "🎭 Cultura", sw: "🎭 Utamaduni", ar: "🎭 ثقافة" } },
];

function getLevel(xp) {
  return LEVELS.find(l => xp >= l.min && xp <= l.max) || LEVELS[0];
}

function QuestCard({ quest, lang, onClaim, claimed }) {
  const title = quest.title[lang] || quest.title.fr;
  const desc = quest.desc[lang] || quest.desc.fr;

  return (
    <div className={cn(
      "relative rounded-2xl overflow-hidden border border-border bg-card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
      claimed && "opacity-60"
    )}>
      <div className={`h-2 bg-gradient-to-r ${quest.color}`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="text-3xl">{quest.emoji}</div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">+{quest.xp} XP</span>
            {quest.co2 > 0 && (
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">🌿 -{quest.co2}kg CO₂</span>
            )}
          </div>
        </div>
        <h3 className="font-display font-bold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{desc}</p>
        <Button
          size="sm"
          className={cn("w-full rounded-xl", claimed ? "bg-emerald-500 hover:bg-emerald-500 cursor-default" : "")}
          onClick={() => !claimed && onClaim(quest)}
          disabled={claimed}
        >
          {claimed ? <><CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Accompli !</> : <><Zap className="h-3.5 w-3.5 mr-1.5" /> Relever le défi</>}
        </Button>
      </div>
    </div>
  );
}

export default function Jeu() {
  const { lang } = useLanguage();
  const [cat, setCat] = useState("all");
  const [claimed, setClaimed] = useState(() => {
    try { return JSON.parse(localStorage.getItem("claimed_quests") || "[]"); } catch { return []; }
  });
  const [totalXP, setTotalXP] = useState(() => {
    return parseInt(localStorage.getItem("player_xp") || "0", 10);
  });
  const [toast, setToast] = useState(null);

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity,
  });

  const handleClaim = (quest) => {
    const newClaimed = [...claimed, quest.id];
    const newXP = totalXP + quest.xp;
    setClaimed(newClaimed);
    setTotalXP(newXP);
    localStorage.setItem("claimed_quests", JSON.stringify(newClaimed));
    localStorage.setItem("player_xp", String(newXP));
    setToast(`+${quest.xp} XP • ${quest.emoji} ${quest.title[lang] || quest.title.fr}`);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = cat === "all" ? QUESTS : QUESTS.filter(q => q.category === cat);
  const level = getLevel(totalXP);
  const nextLevel = LEVELS.find(l => l.min > totalXP);
  const progress = nextLevel ? Math.round(((totalXP - level.min) / (nextLevel.min - level.min)) * 100) : 100;

  return (
    <div className="pb-24 space-y-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl font-semibold text-sm animate-bounce">
          🎉 {toast}
        </div>
      )}

      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden" style={{background:"linear-gradient(135deg,hsl(260,60%,20%) 0%,hsl(220,50%,14%) 50%,hsl(158,50%,12%) 100%)"}}>
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
          <Trophy className="h-80 w-80 text-amber-400" />
        </div>
        <div className="relative z-10 p-8 sm:p-14 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span className="text-xs text-white/80 font-medium">Jouer pour le Bien — Gagner en faisant le Bien</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            🎮 La <span className="text-amber-400">Plateforme de Jeu</span><br />qui change le monde
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Chaque action réelle pour la planète, la communauté ou la culture vous rapporte des XP, des badges et des récompenses tangibles. Le jeu le plus impactant au monde.
          </p>
        </div>
      </section>

      {/* Player Card */}
      <section className="bg-card rounded-2xl border border-border p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-4xl shadow-lg">
            {user ? "🌱" : "👤"}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-3 justify-center sm:justify-start mb-1">
              <h2 className="font-display font-bold text-foreground text-xl">{user?.full_name || "Joueur Anonyme"}</h2>
              <Badge className={`${level.bg} ${level.color} border-0 font-bold`}>{level.label}</Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-3">{totalXP.toLocaleString("fr-FR")} XP accumulés</p>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            {nextLevel && (
              <p className="text-xs text-muted-foreground mt-1">{nextLevel.min - totalXP} XP pour atteindre le niveau suivant</p>
            )}
          </div>
          <div className="flex gap-4 text-center">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xl font-bold text-amber-600">{claimed.length}</p>
              <p className="text-xs text-amber-700">Défis</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              <p className="text-xl font-bold text-emerald-600">{QUESTS.reduce((s,q) => claimed.includes(q.id) ? s+q.co2 : s, 0).toFixed(1)}</p>
              <p className="text-xs text-emerald-700">kg CO₂</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setCat(c.key)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium border whitespace-nowrap transition-all",
              cat === c.key ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-accent"
            )}>
            {c.label[lang] || c.label.fr}
          </button>
        ))}
      </div>

      {/* Quests Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(q => (
          <QuestCard key={q.id} quest={q} lang={lang} onClaim={handleClaim} claimed={claimed.includes(q.id)} />
        ))}
      </div>

      {/* Leaderboard */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h2 className="font-display text-xl font-bold text-foreground">Classement mondial</h2>
          <Badge variant="secondary" className="ml-auto">🌍 Top acteurs du bien</Badge>
        </div>
        <div className="space-y-2">
          {LEADERBOARD.map((p, i) => (
            <div key={p.name} className={cn(
              "flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-sm",
              i === 0 ? "bg-amber-50 border-amber-200" : "bg-card border-border"
            )}>
              <div className={cn(
                "h-9 w-9 rounded-xl flex items-center justify-center font-bold text-lg",
                i === 0 ? "bg-amber-400 text-white" : i === 1 ? "bg-slate-300 text-slate-700" : i === 2 ? "bg-amber-700/30 text-amber-800" : "bg-muted text-muted-foreground"
              )}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i+1}`}
              </div>
              <div className="text-xl">{p.emoji}</div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.city}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary text-sm">{p.xp.toLocaleString("fr-FR")} XP</p>
                <p className="text-xs text-muted-foreground">{getLevel(p.xp).label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security Pledge in Game */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-center">
        <Lock className="h-8 w-8 mx-auto mb-3 text-emerald-400" />
        <h3 className="font-display font-bold text-white text-lg mb-2">Jeu éthique. Données sacrées.</h3>
        <p className="text-white/60 text-sm max-w-md mx-auto">Vos scores, vos actions, vos données restent les vôtres. Chiffrées, protégées, jamais vendues. Sur notre honneur.</p>
      </section>
    </div>
  );
}