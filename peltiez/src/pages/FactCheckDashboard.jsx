import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SEOMeta from "@/components/SEOMeta";
import { CheckCircle2, AlertCircle, Search, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const IMPACT_COLORS = {
  harmless: "bg-blue-100 text-blue-800 border-blue-300",
  misleading: "bg-amber-100 text-amber-800 border-amber-300",
  dangerous: "bg-red-100 text-red-800 border-red-300"
};

export default function FactCheckDashboard() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: myths = [], isLoading } = useQuery({
    queryKey: ["conspiracy-myths"],
    queryFn: () => base44.entities.ConspiracyMyth.filter({ is_published: true }, "-credibility_score", 100),
    staleTime: 120_000
  });

  const categories = ["all", ...new Set(myths.map(m => m.category).filter(Boolean))];

  const filtered = useMemo(() =>
    myths.filter(m => {
      const q = search.toLowerCase();
      const matchSearch = !q || m.myth_title.toLowerCase().includes(q) || (m.popular_belief || "").toLowerCase().includes(q);
      const matchCat = categoryFilter === "all" || m.category === categoryFilter;
      return matchSearch && matchCat;
    }),
    [myths, search, categoryFilter]
  );

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "FactCheckPage",
    "name": "Fact Check Dashboard — Debunking Conspiracy Myths",
    "description": "Verify popular conspiracy theories against scientific evidence. Read debunking with sources."
  };

  return (
    <div className="pb-20 space-y-8 max-w-6xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Fact Check Dashboard — Debunk Conspiracy Myths | CirculAI"
        description="Verify conspiracy theories with scientific evidence. Read debunking articles with credible sources. Understand why false beliefs spread."
        keywords="fact-check, debunk, conspiracy, myth, evidence, science, truth"
        canonicalUrl="https://egor69.ca/fact-check"
        schemaData={seoSchema}
      />

      <div className="rounded-3xl p-10 text-center bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200/20">
        <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
        <h1 className="font-display text-4xl font-black text-foreground">
          ✅ Fact Check Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Verify conspiracy theories with scientific evidence. Understand why myths spread. Read debunking with sources.
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
            placeholder="Search myths to debunk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all capitalize ${
                categoryFilter === cat
                  ? "bg-emerald-600 text-white"
                  : "bg-card border border-border text-muted-foreground hover:bg-accent"
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border">
          <AlertCircle className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
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
                    <h3 className="font-bold text-lg text-foreground mb-1">{myth.myth_title}</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      {myth.category.replace(/_/g, ' ')} · Impact: <span className="font-bold">{myth.impact_level}</span>
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap ${
                    myth.credibility_score > 80 ? "bg-emerald-100 text-emerald-800" :
                    myth.credibility_score > 50 ? "bg-amber-100 text-amber-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {myth.credibility_score}% Verified
                  </div>
                </div>

                {/* The Myth */}
                <div className="bg-amber-50 rounded-lg border-l-4 border-amber-400 p-4">
                  <p className="text-xs font-bold text-amber-900 uppercase mb-1">The Myth (What People Believe)</p>
                  <p className="text-sm text-foreground">{myth.popular_belief}</p>
                </div>

                {/* The Truth */}
                <div className="bg-emerald-50 rounded-lg border-l-4 border-emerald-400 p-4">
                  <p className="text-xs font-bold text-emerald-900 uppercase mb-1">The Truth (Scientific Consensus)</p>
                  <p className="text-sm text-foreground">{myth.actual_truth}</p>
                </div>

                {/* Why People Believe */}
                {myth.why_people_believe && (
                  <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                    <p className="text-xs font-bold text-blue-900 uppercase mb-1">Psychology: Why This Myth Spreads</p>
                    <p className="text-sm text-foreground">{myth.why_people_believe}</p>
                  </div>
                )}

                {/* Red Flags */}
                {myth.red_flags?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase">🚩 Red Flags (Signs of Misinformation)</p>
                    <div className="flex flex-wrap gap-2">
                      {myth.red_flags.map((flag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Impact Badge */}
                {myth.impact_level && (
                  <div className="pt-2 border-t border-border">
                    <Badge className={`${IMPACT_COLORS[myth.impact_level] || IMPACT_COLORS.misleading} border`}>
                      {myth.impact_level === "dangerous" && "⚠️"} {myth.impact_level.toUpperCase()}
                    </Badge>
                  </div>
                )}

                {/* Debunking Sources */}
                {myth.debunking_sources?.length > 0 && (
                  <div className="pt-4 border-t border-border space-y-2">
                    <p className="text-xs font-bold text-emerald-700 uppercase">✅ Credible Sources</p>
                    <ul className="space-y-1">
                      {myth.debunking_sources.slice(0, 3).map((src, i) => (
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