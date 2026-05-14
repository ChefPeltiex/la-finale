import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SEOMeta from "@/components/SEOMeta";
import { BookOpen, Search, Loader2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = {
  health: "🏥 Health & Medicine",
  government: "🏛️ Government",
  technology: "💻 Technology",
  environment: "🌍 Environment",
  space: "🚀 Space & Astronomy",
  finance: "💰 Finance",
  historical: "📚 Historical",
  paranormal: "👻 Paranormal",
  other: "❓ Other"
};

export default function ConspiracyMythDatabase() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: myths = [], isLoading } = useQuery({
    queryKey: ["conspiracy-myths-db"],
    queryFn: () => base44.entities.ConspiracyMyth.filter({ is_published: true }, "-credibility_score", 100),
    staleTime: 120_000
  });

  const categories = ["all", ...new Set(myths.map(m => m.category).filter(Boolean))];

  const filtered = useMemo(() =>
    myths.filter(m => {
      const q = search.toLowerCase();
      const matchSearch = !q || m.myth_title.toLowerCase().includes(q);
      const matchCat = categoryFilter === "all" || m.category === categoryFilter;
      return matchSearch && matchCat;
    }),
    [myths, search, categoryFilter]
  );

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "Conspiracy Myth Database",
    "description": "Educational database of documented conspiracy theories with debunking information and sources."
  };

  return (
    <div className="pb-20 space-y-8 max-w-6xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Conspiracy Myth Database — Documented & Debunked | CirculAI"
        description="Educational database of known conspiracy theories. Learn why they spread. Understand the psychology of belief. All documented with credible sources."
        keywords="conspiracy, myths, debunking, education, psychology, misinformation, documented"
        canonicalUrl="https://egor69.ca/conspiracy-myths"
        schemaData={seoSchema}
      />

      <div className="rounded-3xl p-10 text-center bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-200/20">
        <BookOpen className="h-12 w-12 text-purple-600 mx-auto mb-3" />
        <h1 className="font-display text-4xl font-black text-foreground">
          📚 Conspiracy Myth Database
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Educational database of documented conspiracy theories. Learn why humans believe myths. Understand the psychology.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-purple-50 rounded-2xl border-2 border-purple-300 p-6 text-center">
          <p className="text-4xl font-black text-purple-600">{myths.length}</p>
          <p className="text-sm text-purple-700 mt-2 font-bold">Documented Myths</p>
        </div>
        <div className="bg-pink-50 rounded-2xl border-2 border-pink-300 p-6 text-center">
          <p className="text-4xl font-black text-pink-600">
            {Math.round(myths.reduce((sum, m) => sum + (m.credibility_score || 0), 0) / myths.length)}%
          </p>
          <p className="text-sm text-pink-700 mt-2 font-bold">Avg Credibility</p>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-purple-400/30"
            placeholder="Search myths..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? "bg-purple-600 text-white"
                  : "bg-card border border-border text-muted-foreground hover:bg-accent"
              }`}>
              {cat === "all" ? "All" : CATEGORIES[cat]?.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border">
          <AlertTriangle className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground">No myths found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(myth => (
            <div key={myth.id} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all">
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground mb-2">{myth.myth_title}</h3>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {CATEGORIES[myth.category] || myth.category}
                      </Badge>
                      <Badge className={`text-xs ${
                        myth.impact_level === "dangerous" ? "bg-red-100 text-red-800 border-red-300" :
                        myth.impact_level === "misleading" ? "bg-amber-100 text-amber-800 border-amber-300" :
                        "bg-blue-100 text-blue-800 border-blue-300"
                      } border`}>
                        {myth.impact_level?.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-lg font-bold text-lg whitespace-nowrap ${
                    myth.credibility_score > 75 ? "bg-emerald-100 text-emerald-800" :
                    myth.credibility_score > 50 ? "bg-amber-100 text-amber-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {myth.credibility_score}%
                  </div>
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                    <p className="text-xs font-bold text-pink-900 uppercase mb-2">The Myth</p>
                    <p className="text-sm text-foreground">{myth.popular_belief}</p>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                    <p className="text-xs font-bold text-emerald-900 uppercase mb-2">The Truth</p>
                    <p className="text-sm text-foreground">{myth.actual_truth}</p>
                  </div>
                </div>

                {/* Psychology */}
                {myth.why_people_believe && (
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                    <p className="text-xs font-bold text-indigo-900 uppercase mb-2">🧠 Why People Believe This</p>
                    <p className="text-sm text-foreground">{myth.why_people_believe}</p>
                  </div>
                )}

                {/* Red Flags */}
                {myth.red_flags?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase">🚩 Warning Signs of Conspiracy Thinking</p>
                    <div className="flex flex-wrap gap-2">
                      {myth.red_flags.map((flag, i) => (
                        <Badge key={i} variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sources */}
                {myth.debunking_sources?.length > 0 && (
                  <div className="pt-4 border-t border-border space-y-2">
                    <p className="text-xs font-bold text-emerald-700 uppercase">✅ Verified Sources</p>
                    <ul className="space-y-1">
                      {myth.debunking_sources.map((src, i) => (
                        <li key={i} className="text-xs text-muted-foreground">
                          • {src}
                        </li>
                      ))}
                    </ul>
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