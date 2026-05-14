import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SEOMeta from "@/components/SEOMeta";
import SpecimenCard from "@/components/SpecimenCard";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function MagicHub() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [difficulty, setDifficulty] = useState("all");

  const { data: tricks = [], isLoading } = useQuery({
    queryKey: ["magic-tricks"],
    queryFn: () => base44.entities.MagicTrick.filter({ is_published: true }, "-created_date", 100),
    staleTime: 120_000
  });

  const types = useMemo(() => 
    ["all", ...new Set(tricks.map(t => t.type).filter(Boolean))],
    [tricks]
  );

  const difficulties = ["all", "debutant", "intermediaire", "avance"];

  const filtered = useMemo(() =>
    tricks.filter(t => {
      const q = search.toLowerCase();
      const matchSearch = !q || t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q);
      const matchType = type === "all" || t.type === type;
      const matchDiff = difficulty === "all" || t.difficulty === difficulty;
      return matchSearch && matchType && matchDiff;
    }),
    [tricks, search, type, difficulty]
  );

  return (
    <div className="pb-20 space-y-8 max-w-6xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Magic Hub - Tours de Magie et Illusions | CirculAI Hub"
        description="Découvrez tours de magie blanche, noire, illusions optiques avec démystifications. Apprendre à reproduire des tours."
        keywords="magie, tours de magie, illusions, prestidigitation, mentalisme"
        canonicalUrl="https://egor69.ca/magic-hub"
      />

      {/* Hero */}
      <div className="rounded-3xl p-12 text-center bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-200/20">
        <div className="text-5xl mb-4 animate-bounce" style={{ animationDuration: "2s" }}>✨</div>
        <h1 className="font-display text-4xl font-black text-foreground">Magic Hub</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Tours de magie et illusions · Magie blanche, noire, démystifications, tutoriels
        </p>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un tour de magie..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 rounded-xl h-11"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex gap-2 overflow-x-auto">
            {types.map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap capitalize transition-all ${
                  type === t
                    ? "bg-purple-600 text-white"
                    : "bg-card border border-border text-muted-foreground hover:bg-accent"
                }`}>
                {t === "all" ? "Tous" : t.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {difficulties.map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap capitalize transition-all ${
                  difficulty === d
                    ? "bg-violet-600 text-white"
                    : "bg-card border border-border text-muted-foreground hover:bg-accent"
                }`}>
                {d === "all" ? "Tous" : d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-purple-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground">Aucun tour trouvé</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{filtered.length} tours trouvés · Tutoriels inclus</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(trick => (
              <SpecimenCard key={trick.id} specimen={trick} type="magic" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}