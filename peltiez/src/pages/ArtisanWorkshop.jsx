import { useState } from "react";
import { Wrench, Zap, Clock, Users, Star, Globe, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const METIERS = [
  { id: "plombier",      emoji: "🔧", name: "Plombiers",        count: 48,  desc: "Fuites, installation, urgences 24/7", tag: "Bâtiment" },
  { id: "horloger",      emoji: "⏱️",  name: "Horlogers",        count: 12,  desc: "Montres, horloges, mécanismes précis", tag: "Artisanat" },
  { id: "codeur",        emoji: "💻",  name: "Développeurs",     count: 134, desc: "Web, apps, automatisation, IA", tag: "Tech" },
  { id: "agriculteur",   emoji: "🌾",  name: "Agriculteurs",     count: 67,  desc: "Maraîchage, fermes, AMAP, semences", tag: "Agriculture" },
  { id: "electricien",   emoji: "⚡",  name: "Électriciens",     count: 89,  desc: "Installation, dépannage, solaire", tag: "Bâtiment" },
  { id: "menuisier",     emoji: "🪚",  name: "Menuisiers",       count: 54,  desc: "Meubles, réparation bois, sur-mesure", tag: "Artisanat" },
  { id: "couturier",     emoji: "🧵",  name: "Couturiers",       count: 41,  desc: "Retouches, upcycling, mode durable", tag: "Textile" },
  { id: "cuisiner",      emoji: "👨‍🍳", name: "Cuisiniers",       count: 77,  desc: "Traiteur, cours, chef à domicile", tag: "Alimentation" },
  { id: "jardinier",     emoji: "🌱",  name: "Jardiniers",       count: 93,  desc: "Entretien, permaculture, potager", tag: "Verdure" },
  { id: "mecanicien",    emoji: "🚗",  name: "Mécaniciens",      count: 61,  desc: "Voitures, vélos, motos, dépannage", tag: "Transport" },
  { id: "peintre",       emoji: "🎨",  name: "Peintres",         count: 45,  desc: "Intérieur, extérieur, restauration", tag: "Bâtiment" },
  { id: "informaticien", emoji: "🖥️",  name: "Informaticiens",   count: 108, desc: "Support, réseaux, sécurité, cloud", tag: "Tech" },
  { id: "medecin",       emoji: "🩺",  name: "Thérapeutes",      count: 55,  desc: "Massage, acupuncture, naturo, yoga", tag: "Santé" },
  { id: "photographe",   emoji: "📷",  name: "Photographes",     count: 39,  desc: "Portraits, événements, produits", tag: "Art" },
  { id: "tuteur",        emoji: "📚",  name: "Tuteurs",          count: 82,  desc: "Maths, langue, musique, sport", tag: "Éducation" },
  { id: "serrurier",     emoji: "🔑",  name: "Serruriers",       count: 28,  desc: "Urgences, installation, copie clés", tag: "Bâtiment" },
  { id: "demenageur",    emoji: "📦",  name: "Déménageurs",      count: 33,  desc: "Transport local, montage meubles", tag: "Transport" },
  { id: "graphiste",     emoji: "✏️",  name: "Graphistes",       count: 71,  desc: "Logo, identité, print, motion", tag: "Design" },
  { id: "comptable",     emoji: "💼",  name: "Comptables",       count: 44,  desc: "Déclarations, gestion PME, conseils", tag: "Finance" },
  { id: "apiculteur",    emoji: "🍯",  name: "Apiculteurs",      count: 17,  desc: "Miel local, ruches urbaines, formation", tag: "Agriculture" },
];

const FEATURES = [
  { icon: Users,   title: "Gérez vos clients",     desc: "Carnet d'adresses, historique de services, relances auto." },
  { icon: Star,    title: "Évaluations vérifiées", desc: "Système d'avis infalsifiable — ta réputation CirculAI." },
  { icon: Zap,     title: "Devis en 2 clics",      desc: "Modèles de devis personnalisables, signature numérique." },
  { icon: Clock,   title: "Agenda intégré",         desc: "Calendrier de disponibilités visible par tes clients." },
  { icon: Globe,   title: "Zéro commission Meta",   desc: "Aucune pub, aucune commission. Ton établi, tes règles." },
  { icon: Wrench,  title: "Contrats simplifiés",    desc: "Entente de service en 2 clics, sécurisée CirculAI." },
];

export default function ArtisanWorkshop() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("Tous");
  const [activeTrade, setActiveTrade] = useState(null);

  const tags = ["Tous", ...new Set(METIERS.map(m => m.tag))];

  const filtered = METIERS.filter(m => {
    const matchTag = activeTag === "Tous" || m.tag === activeTag;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  const selectedMetier = METIERS.find(m => m.id === activeTrade);

  return (
    <div className="min-h-screen pb-20" style={{ background: "linear-gradient(160deg, hsl(25,30%,5%) 0%, hsl(220,30%,5%) 100%)" }}>
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-12">

        {/* Hero */}
        <div className="text-center space-y-4">
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 font-mono tracking-widest px-4 py-1.5">
            🛠️ ÉTABLIS VIRTUELS — RÉSEAU DES ARTISANS
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white">
            Ton métier.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
              Ton établi. Zéro Meta.
            </span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            20 métiers. Un espace professionnel complet pour gérer tes clients, tes devis et ta réputation — sans payer de commissions à personne.
          </p>
          <div className="flex gap-4 justify-center text-sm font-mono text-white/35">
            <span>🔧 {METIERS.reduce((s, m) => s + m.count, 0)}+ artisans inscrits</span>
            <span>·</span>
            <span>💰 0% commission</span>
            <span>·</span>
            <span>⭐ Évaluations vérifiées</span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input placeholder="Rechercher un métier…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white bg-white/5 border border-white/10 outline-none focus:border-amber-400 placeholder:text-white/25" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {tags.map(t => (
              <button key={t} onClick={() => setActiveTag(t)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: activeTag === t ? "rgba(245,158,11,0.25)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${activeTag === t ? "rgba(245,158,11,0.6)" : "rgba(255,255,255,0.08)"}`,
                  color: activeTag === t ? "#fbbf24" : "rgba(255,255,255,0.5)",
                }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Trades Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map(m => (
            <button key={m.id} onClick={() => setActiveTrade(activeTrade === m.id ? null : m.id)}
              className="rounded-2xl p-4 text-center transition-all hover:scale-[1.03]"
              style={{
                background: activeTrade === m.id ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.04)",
                border: `2px solid ${activeTrade === m.id ? "rgba(245,158,11,0.6)" : "rgba(255,255,255,0.06)"}`,
              }}>
              <div className="text-3xl mb-2">{m.emoji}</div>
              <p className="font-bold text-white text-xs">{m.name}</p>
              <p className="text-[10px] text-white/35 mt-1">{m.count} actifs</p>
            </button>
          ))}
        </div>

        {/* Selected Trade Detail */}
        {selectedMetier && (
          <div className="rounded-2xl p-8" style={{ background: "rgba(245,158,11,0.08)", border: "2px solid rgba(245,158,11,0.3)" }}>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl">{selectedMetier.emoji}</span>
              <div>
                <h2 className="font-display text-3xl font-bold text-white">{selectedMetier.name}</h2>
                <p className="text-white/50 mt-1">{selectedMetier.desc}</p>
                <Badge className="mt-2 bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">{selectedMetier.tag}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                <p className="text-2xl font-black text-amber-300">{selectedMetier.count}</p>
                <p className="text-xs text-white/40">Artisans actifs</p>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                <p className="text-2xl font-black text-emerald-300">0%</p>
                <p className="text-xs text-white/40">Commission</p>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                <p className="text-2xl font-black text-blue-300">2 clics</p>
                <p className="text-xs text-white/40">Pour un devis</p>
              </div>
            </div>
            <Link to="/abonnement">
              <button className="mt-5 w-full py-3 rounded-xl font-mono font-bold text-white transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.4), rgba(251,191,36,0.2))", border: "1px solid rgba(245,158,11,0.5)" }}>
                🛠️ Créer mon établi {selectedMetier.name} →
              </button>
            </Link>
          </div>
        )}

        {/* Features */}
        <div>
          <h2 className="font-display text-3xl font-bold text-white text-center mb-8">Tout ce que l'établi inclut</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <f.icon className="h-6 w-6 text-amber-400 mb-3" />
                <h3 className="font-bold text-white mb-1">{f.title}</h3>
                <p className="text-sm text-white/50">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl p-10 text-center" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(251,191,36,0.06))", border: "2px solid rgba(245,158,11,0.3)" }}>
          <div className="text-5xl mb-4">🛠️</div>
          <h2 className="font-display text-3xl font-bold text-white mb-3">Ouvre ton établi aujourd'hui</h2>
          <p className="text-white/55 mb-6">Gratuit. Sans commission. Sans publicité. Ton métier mérite mieux que Facebook.</p>
          <Link to="/abonnement">
            <button className="px-10 py-4 rounded-xl font-mono font-black text-lg text-black transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}>
              🚀 OUVRIR MON ÉTABLI GRATUITEMENT →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}