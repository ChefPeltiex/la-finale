import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SEOMeta from "@/components/SEOMeta";
import { BookOpen, Search, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TRADITIONS = {
  tarot: "🃏 Tarot",
  numerologie: "🔢 Numérologie",
  astrologie: "♈ Astrologie",
  alchimie: "⚗️ Alchimie",
  kabbalah: "🌳 Kabbale",
  hermetisme: "♣️ Hermétisme",
  chamanisme: "🪶 Chamanisme",
  tantrisme: "☬ Tantrisme",
  bouddhisme_tibetain: "🏔️ Bouddhisme Tibétain",
  taoisme: "☯️ Taoïsme",
  autre: "✨ Autres"
};

export default function EsotericismHub() {
  const [search, setSearch] = useState("");
  const [traditionFilter, setTraditionFilter] = useState("all");

  const { data: practices = [], isLoading } = useQuery({
    queryKey: ["esoteric-practices"],
    queryFn: () => base44.entities.EsotericPractice.filter({ is_published: true }, "-created_date", 220),
    staleTime: 120_000,
  });

  const filtered = useMemo(() =>
    practices.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
      const matchTrad = traditionFilter === "all" || p.tradition === traditionFilter;
      return matchSearch && matchTrad;
    }),
    [practices, search, traditionFilter]
  );

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalResource",
    "name": "Ésotérisme — Pratiques Spirituelles Anciennes",
    "description": "Explorez traditions ésotériques : tarot, numérologie, astrologie, alchimie, kabbale, chamanisme et plus."
  };

  return (
    <div className="pb-20 space-y-8 max-w-6xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Ésotérisme — Pratiques Spirituelles Anciennes | CirculAI Hub"
        description="Explorez ésotérisme : tarot, numérologie, astrologie, alchimie, kabbale, hermétisme, chamanisme, tantrisme, taoïsme. Principes, techniques, traditions."
        keywords="ésotérisme, tarot, numérologie, astrologie, alchimie, kabbale, chamanisme, hermétisme, spiritualité, traditions"
        canonicalUrl="https://egor69.ca/esotericism"
        schemaData={seoSchema}
      />

        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            to="/mythologies"
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm font-bold text-indigo-800 dark:text-indigo-100 hover:bg-indigo-500/20 transition-colors"
          >
            Mythologies (Grèce, Égypte, Celtes…)
          </Link>
          <Link
            to="/bien-etre-lexique"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-800 dark:text-emerald-100 hover:bg-emerald-500/20 transition-colors"
          >
            Lexique bien-être (herboristerie, massages…)
          </Link>
          <Link
            to="/arts-divinatoires-lexique"
            className="inline-flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-bold text-violet-800 dark:text-violet-100 hover:bg-violet-500/20 transition-colors"
          >
            Lexique arts divinatoires (tarot, astrologie…)
          </Link>
        </div>

      {/* Hero */}
      <div className="rounded-3xl p-12 text-center bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 border border-indigo-200/20">
        <div className="text-6xl mb-4">✨</div>
        <h1 className="font-display text-4xl font-black text-foreground">Ésotérisme Ancien</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Pratiques spirituelles, traditions hermétiques et systèmes de sagesse accumulés au fil des millénaires.
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
            placeholder="Rechercher pratiques..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setTraditionFilter("all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              traditionFilter === "all"
                ? "bg-indigo-600 text-white"
                : "bg-card border border-border text-muted-foreground hover:bg-accent"
            }`}>
            Toutes ({practices.length})
          </button>
          {Object.entries(TRADITIONS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTraditionFilter(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                traditionFilter === key
                  ? "bg-indigo-600 text-white"
                  : "bg-card border border-border text-muted-foreground hover:bg-accent"
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-indigo-500" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border">
          <BookOpen className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground">Aucune pratique trouvée</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(practice => (
            <div key={practice.id} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-indigo-300/50 transition-all hover:-translate-y-1">
              {practice.image_url && (
                <img src={practice.image_url} alt={practice.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-bold text-foreground mb-1">{practice.title}</h3>
                  <p className="text-xs text-muted-foreground">{TRADITIONS[practice.tradition]}</p>
                </div>

                {practice.description && (
                  <p className="text-xs text-foreground/70 line-clamp-2">{practice.description}</p>
                )}

                <div className="flex gap-1 flex-wrap">
                  {practice.principles?.slice(0, 2).map((p, i) => (
                    <Badge key={i} variant="outline" className="text-[9px]">✦ {p}</Badge>
                  ))}
                </div>

                <div className="pt-2 border-t border-border text-[10px] text-muted-foreground">
                  <p>
                    {practice.origin && <span>📍 {practice.origin} · </span>}
                    {practice.difficulty === "debutant" && "🟢 Débutant"}
                    {practice.difficulty === "intermediaire" && "🟡 Intermédiaire"}
                    {practice.difficulty === "avance" && "🔴 Avancé"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}