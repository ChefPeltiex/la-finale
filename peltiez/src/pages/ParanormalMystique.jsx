import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SEOMeta from "@/components/SEOMeta";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = {
  objets_hantes: "👻 Objets Hantés",
  phenomenes: "⚡ Phénomènes Inexpliqués",
  mediums: "🔮 Médiums & Voyants",
  energie: "✨ Énergie & Auras",
  apparitions: "👥 Apparitions",
  poltergeist: "🪦 Poltergeists",
  autre: "🌀 Autres"
};

export default function ParanormalMystique() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: content = [], isLoading } = useQuery({
    queryKey: ["paranormal-content"],
    queryFn: () => base44.entities.ParanormalContent.filter({ is_published: true }, "-created_date", 50),
    staleTime: 120_000,
  });

  const filtered = useMemo(() =>
    content.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q || c.title.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q);
      const matchCat = categoryFilter === "all" || c.category === categoryFilter;
      return matchSearch && matchCat;
    }),
    [content, search, categoryFilter]
  );

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "Paranormal Mystique Phénomènes Inexpliqués",
    "description": "Explorez objets hantés, phénomènes paranormaux, médiums et énergies mystiques à travers des récits documentés et analyses."
  };

  return (
    <div className="pb-20 space-y-8 max-w-6xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Paranormal Mystique - Phénomènes Inexpliqués | CirculAI Hub"
        description="Explorez phénomènes paranormaux, objets hantés, médiums, énergies et apparitions. Documentation des cas, explications scientifiques et perspective spirituelle."
        keywords="paranormal, phénomènes inexpliqués, objets hantés, médiums, énergie, apparitions, spiritualité, mystère"
        canonicalUrl="https://egor69.ca/paranormal-mystique"
        schemaData={seoSchema}
      />

      {/* Hero */}
      <div className="rounded-3xl p-12 text-center bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-200/20">
        <div className="text-6xl mb-4">👻</div>
        <h1 className="font-display text-4xl font-black text-foreground">Paranormal Mystique</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Phénomènes inexpliqués, objets hantés, énergies mystiques — explorez les mystères au-delà de la science conventionnelle.
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-purple-400/30"
            placeholder="Rechercher phénomènes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              categoryFilter === "all"
                ? "bg-purple-600 text-white"
                : "bg-card border border-border text-muted-foreground hover:bg-accent"
            }`}>
            Tous ({content.length})
          </button>
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setCategoryFilter(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                categoryFilter === key
                  ? "bg-purple-600 text-white"
                  : "bg-card border border-border text-muted-foreground hover:bg-accent"
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-purple-500" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border">
          <AlertCircle className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground">Aucun contenu trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-purple-300/50 transition-all hover:-translate-y-1">
              {item.image_url && (
                <img src={item.image_url} alt={item.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-foreground line-clamp-2">{item.title}</h3>
                  {item.mystery_level && (
                    <div className="flex gap-0.5 flex-shrink-0">
                      {Array.from({ length: Math.ceil(item.mystery_level / 2) }).map((_, i) => (
                        <span key={i} className="text-sm">⚡</span>
                      ))}
                    </div>
                  )}
                </div>

                {item.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                )}

                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <Badge variant="outline" className="text-[10px]">{CATEGORIES[item.category]}</Badge>
                  {item.origin && <span className="text-muted-foreground">📍 {item.origin}</span>}
                </div>

                {item.documented_cases?.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground font-medium">
                      📋 {item.documented_cases.length} cas documentés
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}