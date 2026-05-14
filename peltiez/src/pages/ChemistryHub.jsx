import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SEOMeta from "@/components/SEOMeta";
import SpecimenCard from "@/components/SpecimenCard";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ChemistryHub() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const { data: elements = [], isLoading } = useQuery({
    queryKey: ["chemical-elements"],
    queryFn: () => base44.entities.ChemicalElement.filter({ is_published: true }, "-atomic_number", 120),
    staleTime: 120_000
  });

  const categories = useMemo(() => 
    ["all", ...new Set(elements.map(e => e.category).filter(Boolean))],
    [elements]
  );

  const filtered = useMemo(() =>
    elements.filter(e => {
      const q = search.toLowerCase();
      const matchSearch = !q || e.element_name?.toLowerCase().includes(q) || e.symbol?.toLowerCase().includes(q);
      const matchCat = category === "all" || e.category === category;
      return matchSearch && matchCat;
    }),
    [elements, search, category]
  );

  return (
    <div className="pb-20 space-y-8 max-w-6xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Chemistry Hub - Éléments et Expériences Sans Danger | CirculAI Hub"
        description="Découvrez éléments chimiques et expériences à faire à la maison. Tableau périodique interactif, propriétés, histoire."
        keywords="chimie, éléments chimiques, tableau périodique, expériences scientifiques"
        canonicalUrl="https://egor69.ca/chemistry-hub"
      />

      {/* Hero */}
      <div className="rounded-3xl p-12 text-center bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-200/20">
        <div className="text-5xl mb-4 animate-bounce" style={{ animationDuration: "3s" }}>⚗️</div>
        <h1 className="font-display text-4xl font-black text-foreground">Chemistry Hub</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Éléments chimiques et expériences scientifiques · Apprendre la chimie en s'amusant
        </p>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher élément ou symbole..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 rounded-xl h-11"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap capitalize transition-all ${
                category === cat
                  ? "bg-blue-600 text-white"
                  : "bg-card border border-border text-muted-foreground hover:bg-accent"
              }`}>
              {cat === "all" ? "Tous" : cat.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground">Aucun élément trouvé</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{filtered.length} éléments · Tableau périodique interactif</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(element => (
              <SpecimenCard key={element.id} specimen={element} type="chemical" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}