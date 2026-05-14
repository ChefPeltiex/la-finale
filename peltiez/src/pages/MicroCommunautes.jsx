import { useState, useMemo } from "react";
import { Users, Search, Zap, Plus, Globe, Leaf, Code, Sun, Flower2, Heart, Cpu, BookOpen, Music, Hammer, Recycle, Droplets, Wind, Mountain, Home } from "lucide-react";
import { toast } from "sonner";

const INITIAL_COMMUNITIES = [
  { id: "energie",        name: "Énergie Collective",      emoji: "⚡", icon: Sun,       color: "from-yellow-600 to-orange-700",   members: 2847, desc: "Panneaux solaires, autoconsommation, micro-réseaux, indépendance énergétique.", tags: ["solaire", "éolien", "hydro", "autonomie"] },
  { id: "jardinage",      name: "Jardins Partagés",         emoji: "🌱", icon: Flower2,   color: "from-green-600 to-emerald-700",   members: 4123, desc: "Permaculture, potagers urbains, semences, compostage et échange de récoltes.", tags: ["permaculture", "semences", "compost"] },
  { id: "code-ouvert",    name: "Code & Open Source",       emoji: "💻", icon: Code,      color: "from-blue-600 to-cyan-700",       members: 1892, desc: "Logiciels libres, projets civiques, outils numériques pour la circularité.", tags: ["python", "open-source", "IA", "data"] },
  { id: "spiritualite",   name: "Sagesse & Conscience",     emoji: "🕊️", icon: Zap,       color: "from-violet-600 to-purple-700",   members: 3211, desc: "Méditation, philosophies de vie, connexion humaine et collective.", tags: ["méditation", "philosophie", "conscience"] },
  { id: "reparation",     name: "Répare-Tout",              emoji: "🔧", icon: Hammer,    color: "from-amber-600 to-orange-700",    members: 2654, desc: "Ateliers DIY, droit à la réparation, guides pratiques et entraide technique.", tags: ["DIY", "électronique", "textiles", "vélos"] },
  { id: "zero-dechets",   name: "Zéro Déchet",              emoji: "♻️", icon: Recycle,   color: "from-teal-600 to-emerald-700",    members: 5891, desc: "Réduction à la source, alternatives plastique, slow living et minimalisme.", tags: ["plastique", "minimalisme", "alternatives"] },
  { id: "eau",            name: "Eau & Hydrosystèmes",      emoji: "💧", icon: Droplets,  color: "from-sky-600 to-blue-700",        members: 1437, desc: "Récupération d'eau, phytoépuration, protection des nappes et rivières.", tags: ["récupération", "phyto", "nappes"] },
  { id: "air",            name: "Air Pur & Forêts",         emoji: "🌬️", icon: Wind,      color: "from-green-500 to-teal-700",      members: 2108, desc: "Reforestation, corridors verts, qualité de l'air et biodiversité urbaine.", tags: ["arbres", "biodiversité", "air"] },
  { id: "alimentation",   name: "Alimentation Circulaire",  emoji: "🥗", icon: Leaf,      color: "from-lime-600 to-green-700",      members: 7432, desc: "Circuit court, lutte anti-gaspi, fermentation, cuisine zéro déchet.", tags: ["circuit-court", "anti-gaspi", "fermentation"] },
  { id: "tech-ethique",   name: "Tech Éthique",             emoji: "🤖", icon: Cpu,       color: "from-indigo-600 to-blue-700",     members: 1654, desc: "IA responsable, données souveraines, technologies au service du bien commun.", tags: ["IA-éthique", "données", "souveraineté"] },
  { id: "sante",          name: "Santé Globale",            emoji: "❤️", icon: Heart,     color: "from-rose-600 to-pink-700",       members: 3987, desc: "Médecine préventive, santé environnementale, bien-être et plantes médicinales.", tags: ["prévention", "plantes", "bien-être"] },
  { id: "culture",        name: "Culture & Arts",           emoji: "🎨", icon: Music,     color: "from-fuchsia-600 to-purple-700",  members: 2341, desc: "Expression artistique, culture locale, festivals circulaires et mémoire collective.", tags: ["art", "culture", "festivals"] },
  { id: "apprentissage",  name: "Apprendre Ensemble",       emoji: "📚", icon: BookOpen,  color: "from-orange-600 to-amber-700",    members: 4567, desc: "Partage de savoirs, tutorat, formations gratuites et bibliothèques de compétences.", tags: ["formation", "tutoriels", "compétences"] },
  { id: "mobilite",       name: "Mobilité Douce",           emoji: "🚲", icon: Mountain,  color: "from-green-700 to-teal-800",      members: 3122, desc: "Vélo, covoiturage, mobilité électrique, aménagement des villes pour les gens.", tags: ["vélo", "marche", "électrique", "covoiturage"] },
  { id: "habitat",        name: "Habitat Circulaire",       emoji: "🏠", icon: Home,      color: "from-stone-600 to-amber-800",     members: 2894, desc: "Éco-construction, rénovation énergétique, tiny house, matériaux de récupération.", tags: ["éco-construction", "rénovation", "biosourcé"] },
];

export default function MicroCommunautes() {
  const [search, setSearch] = useState("");
  const [joined, setJoined] = useState(() => {
    try { return JSON.parse(localStorage.getItem("joined_communities") || "[]"); } catch { return []; }
  });

  const filtered = useMemo(() =>
    INITIAL_COMMUNITIES.filter(c =>
      !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    ), [search]);

  const total_members = INITIAL_COMMUNITIES.reduce((s, c) => s + c.members, 0);

  const join = (id) => {
    if (joined.includes(id)) return;
    const updated = [...joined, id];
    setJoined(updated);
    localStorage.setItem("joined_communities", JSON.stringify(updated));
    toast.success("Communauté rejointe ! +30 XP ⚡", { icon: "🎮" });
  };

  return (
    <div className="pb-20 space-y-10 max-w-6xl mx-auto px-4 pt-8">

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-mono text-xs font-bold bg-primary/10 text-primary border border-primary/20">
          <Globe className="h-4 w-4" /> RÉSEAU DES 144 000 · MICRO-COMMUNAUTÉS THÉMATIQUES
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-foreground">
          Trouvez votre tribu.
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {INITIAL_COMMUNITIES.length} communautés actives · {total_members.toLocaleString("fr-CA")} membres · 80+ pays
        </p>
        <div className="flex justify-center gap-6 text-sm font-mono">
          <span className="text-primary font-bold">{joined.length} rejointes</span>
          <span className="text-muted-foreground">{INITIAL_COMMUNITIES.length - joined.length} disponibles</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-lg mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher une communauté ou un thème…"
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-primary/50" />
      </div>

      {/* Community grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((community) => {
          const isJoined = joined.includes(community.id);
          return (
            <div key={community.id}
              className="rounded-2xl overflow-hidden border border-border bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              {/* Color header */}
              <div className={`px-5 py-4 bg-gradient-to-br ${community.color} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{community.emoji}</span>
                  <div>
                    <h3 className="font-bold text-white text-sm leading-snug">{community.name}</h3>
                    <p className="text-white/60 text-[10px] font-mono">{community.members.toLocaleString("fr-CA")} membres</p>
                  </div>
                </div>
                {isJoined && <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />}
              </div>
              {/* Body */}
              <div className="p-5 space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">{community.desc}</p>
                <div className="flex flex-wrap gap-1">
                  {community.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-muted text-muted-foreground">#{tag}</span>
                  ))}
                </div>
                <button onClick={() => join(community.id)} disabled={isJoined}
                  className="w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-70"
                  style={{
                    background: isJoined ? "rgba(16,185,129,0.1)" : "hsl(var(--primary))",
                    color: isJoined ? "hsl(var(--primary))" : "white",
                    border: isJoined ? "1px solid hsl(var(--primary) / 0.3)" : "none"
                  }}>
                  {isJoined ? <><Users className="h-4 w-4" /> Membre ✓</> : <><Plus className="h-4 w-4" /> Rejoindre · +30 XP</>}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground">Aucune communauté trouvée pour "{search}"</p>
        </div>
      )}

      {/* CTA create */}
      <div className="rounded-2xl p-8 text-center border border-primary/20 bg-primary/5 space-y-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Votre passion n'est pas dans la liste ?</h2>
        <p className="text-muted-foreground">Proposez une nouvelle micro-communauté. Si 10 personnes s'inscrivent, elle est activée automatiquement.</p>
        <button className="px-8 py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02]"
          onClick={() => toast.success("Proposition reçue ! Merci d'enrichir le réseau.")}
          style={{ background: "hsl(var(--primary))" }}>
          <Plus className="inline h-4 w-4 mr-2" /> Proposer une communauté
        </button>
      </div>
    </div>
  );
}