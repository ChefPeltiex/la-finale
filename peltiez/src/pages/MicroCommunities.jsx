import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Users, Zap, MapPin, Search, Leaf, Cpu, Sun, Music, Code2, Heart, Flower2, Wrench, Globe, BookOpen, Shield, Flame, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const THEME_ICONS = {
  "Énergie": Sun,
  "Jardinage": Flower2,
  "Code": Code2,
  "Spiritualité": Heart,
  "Réparation": Wrench,
  "Musique": Music,
  "Agriculture": Leaf,
  "Technologie": Cpu,
  "Santé": Shield,
  "Éducation": BookOpen,
  "Environnement": Globe,
  "Art": Flame,
};

const STARTER_GROUPS = [
  { name: "Énergie Solaire Québec", theme: "Énergie",      city: "Montréal",      members: 243, desc: "Partage de ressources, devis groupés et panneaux solaires communautaires." },
  { name: "Jardins Urbains MTL",    theme: "Jardinage",    city: "Laval",         members: 189, desc: "Échanges de semences, ateliers permaculture, jardins partagés." },
  { name: "Makers & Codeurs",       theme: "Code",         city: "Québec City",   members: 312, desc: "Dev open-source, hackathons circulaires, mentorat gratuit." },
  { name: "Cercle Intérieur",       theme: "Spiritualité", city: "Sherbrooke",    members: 97,  desc: "Méditation, sagesse partagée, rituels de pleine conscience." },
  { name: "Atelier Réparation",     theme: "Réparation",   city: "Longueuil",     members: 156, desc: "Café-réparation hebdomadaire. Apportez vos objets cassés." },
  { name: "Scène Circulaire",       theme: "Musique",      city: "Trois-Rivières",members: 78,  desc: "Prêt d'instruments, studios partagés, concerts gratuits." },
  { name: "Terra Farmers",          theme: "Agriculture",  city: "Saguenay",      members: 134, desc: "Réseau de fermes locales, AMAP, agriculture régénérative." },
  { name: "Tech For Good",          theme: "Technologie",  city: "Montréal",      members: 421, desc: "IA éthique, technologie au service de la transition écologique." },
  { name: "Corps & Âme",            theme: "Santé",        city: "Gatineau",      members: 203, desc: "Santé holistique, médecines douces, partage de pratiques." },
  { name: "École Infinie",          theme: "Éducation",    city: "Rimouski",      members: 88,  desc: "Apprentissage entre pairs, cours gratuits, bibliothèque vivante." },
  { name: "Gardiens de la Terre",   theme: "Environnement",city: "Sept-Îles",     members: 67,  desc: "Nettoyages collectifs, bio-monitoring, citoyens-scientifiques." },
  { name: "Studio Circulaire",      theme: "Art",          city: "Montréal",      members: 115, desc: "Matériaux récupérés, expositions, ateliers créatifs ouverts." },
];

export default function MicroCommunities() {
  const [search, setSearch] = useState("");
  const [activeTheme, setActiveTheme] = useState("Tous");
  const [joining, setJoining] = useState(null);
  const [joined, setJoined] = useState(() => {
    try { return JSON.parse(localStorage.getItem("joined_groups") || "[]"); } catch { return []; }
  });
  const [generating, setGenerating] = useState(false);
  const [aiContent, setAiContent] = useState(null);

  const themes = ["Tous", ...Object.keys(THEME_ICONS)];

  const filtered = STARTER_GROUPS.filter(g => {
    const matchTheme = activeTheme === "Tous" || g.theme === activeTheme;
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) || g.city.toLowerCase().includes(search.toLowerCase());
    return matchTheme && matchSearch;
  });

  const handleJoin = async (groupName) => {
    setJoining(groupName);
    await new Promise(r => setTimeout(r, 500));
    const updated = joined.includes(groupName) ? joined.filter(g => g !== groupName) : [...joined, groupName];
    setJoined(updated);
    localStorage.setItem("joined_groups", JSON.stringify(updated));
    setJoining(null);
  };

  const generateGroupContent = async () => {
    setGenerating(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: "Génère en français 3 idées de posts d'introduction pour une micro-communauté circulaire au Québec. Format JSON: {posts: [{title, body, tags}]}",
      response_json_schema: { type: "object", properties: { posts: { type: "array", items: { type: "object", properties: { title: { type: "string" }, body: { type: "string" }, tags: { type: "array", items: { type: "string" } } } } } } }
    });
    setAiContent(res?.posts || []);
    setGenerating(false);
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: "linear-gradient(160deg, hsl(220,30%,5%) 0%, hsl(200,30%,6%) 100%)" }}>
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-12">

        {/* Hero */}
        <div className="text-center space-y-4">
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 font-mono tracking-widest px-4 py-1.5">
            🌐 RÉSEAU DES 144 000 — MICRO-COMMUNAUTÉS
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white">
            Ton quartier.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
              Ta passion. Ton groupe.
            </span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            100 micro-communautés actives au Québec, organisées par thème et par ville. Rejoins ta tribu, partage des ressources, construis l'économie du futur ensemble.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mt-8">
            {[
              { val: STARTER_GROUPS.length, label: "Groupes actifs" },
              { val: STARTER_GROUPS.reduce((s, g) => s + g.members, 0).toLocaleString("fr-FR"), label: "Membres" },
              { val: "12", label: "Villes couvertes" },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-xl font-black text-white">{s.val}</p>
                <p className="text-[10px] text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input placeholder="Rechercher par nom ou ville…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white bg-white/5 border border-white/10 outline-none focus:border-blue-400 placeholder:text-white/25" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {themes.map(t => (
              <button key={t} onClick={() => setActiveTheme(t)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: activeTheme === t ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${activeTheme === t ? "rgba(59,130,246,0.6)" : "rgba(255,255,255,0.08)"}`,
                  color: activeTheme === t ? "#93c5fd" : "rgba(255,255,255,0.5)",
                }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(g => {
            const Icon = THEME_ICONS[g.theme] || Users;
            const isJoined = joined.includes(g.name);
            return (
              <div key={g.name} className="rounded-2xl p-5 transition-all hover:scale-[1.01]"
                style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${isJoined ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.07)"}` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(59,130,246,0.2)" }}>
                    <Icon className="h-5 w-5 text-blue-300" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-white/35">
                    <Users className="h-3 w-3" /> {g.members}
                  </div>
                </div>
                <h3 className="font-bold text-white mb-1">{g.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  <MapPin className="h-3 w-3 text-white/35" />
                  <span className="text-[11px] text-white/35">{g.city}</span>
                  <Badge className="ml-1 bg-blue-500/15 text-blue-300 border-blue-500/25 text-[9px] px-1.5 py-0">{g.theme}</Badge>
                </div>
                <p className="text-xs text-white/50 leading-relaxed mb-4">{g.desc}</p>
                <button onClick={() => handleJoin(g.name)} disabled={joining === g.name}
                  className="w-full py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                  style={{
                    background: isJoined ? "rgba(16,185,129,0.2)" : "rgba(59,130,246,0.2)",
                    border: `1px solid ${isJoined ? "rgba(16,185,129,0.5)" : "rgba(59,130,246,0.4)"}`,
                    color: isJoined ? "#10b981" : "#60a5fa",
                  }}>
                  {joining === g.name ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : isJoined ? "✓ Rejoint" : "+ Rejoindre"}
                </button>
              </div>
            );
          })}
        </div>

        {/* IA Content Generator */}
        <div className="rounded-2xl p-8 text-center" style={{ background: "rgba(139,92,246,0.08)", border: "2px solid rgba(139,92,246,0.3)" }}>
          <Zap className="h-8 w-8 text-purple-400 mx-auto mb-3" />
          <h2 className="font-display text-2xl font-bold text-white mb-2">Générateur de contenu IA</h2>
          <p className="text-white/55 text-sm mb-5">Génère des posts d'introduction pour lancer ta communauté, même vide.</p>
          <button onClick={generateGroupContent} disabled={generating}
            className="px-8 py-3 rounded-xl font-mono font-bold text-sm text-white transition-all hover:scale-105 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #6d28d9, #a855f7)" }}>
            {generating ? <><Loader2 className="h-4 w-4 animate-spin inline mr-2" />Génération IA…</> : "✨ Générer du contenu d'amorçage"}
          </button>

          {aiContent && (
            <div className="mt-6 space-y-4 text-left">
              {aiContent.map((post, i) => (
                <div key={i} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.25)" }}>
                  <p className="font-bold text-white text-sm mb-1">{post.title}</p>
                  <p className="text-xs text-white/60 mb-2">{post.body}</p>
                  <div className="flex gap-1 flex-wrap">
                    {(post.tags || []).map(tag => <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(139,92,246,0.3)", color: "#c4b5fd" }}>#{tag}</span>)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}