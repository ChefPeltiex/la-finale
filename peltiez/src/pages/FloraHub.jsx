import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SEOMeta from "@/components/SEOMeta";
import SpecimenCard from "@/components/SpecimenCard";
import { Leaf, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function FloraHub() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const { data: specimens = [], isLoading } = useQuery({
    queryKey: ["flora-specimens"],
    queryFn: () => base44.entities.FloraSpecimen.filter({ is_published: true }, "-created_date", 100),
    staleTime: 120_000
  });

  const categories = useMemo(() => 
    ["all", ...new Set(specimens.map(s => s.category).filter(Boolean))],
    [specimens]
  );

  const filtered = useMemo(() =>
    specimens.filter(s => {
      const q = search.toLowerCase();
      const matchSearch = !q || s.common_name?.toLowerCase().includes(q) || s.scientific_name?.toLowerCase().includes(q);
      const matchCat = category === "all" || s.category === category;
      return matchSearch && matchCat;
    }),
    [specimens, search, category]
  );

  return (
    <div className="pb-20 space-y-8 max-w-6xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Flora Hub - Découvrez la Flore Interactive | CirculAI Hub"
        description="Explorez plus de 100 plantes, arbres et fleurs. Fiches descriptives, photos, histoires et habitats naturels. Éducatif et interactif."
        keywords="flore, plantes, arbres, botanique, écologie, nature, biodiversité"
        canonicalUrl="https://egor69.ca/flora-hub"
      />

      {/* Hero */}
      <div className="rounded-3xl p-12 text-center bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-200/20">
        <Leaf className="h-16 w-16 text-green-600 mx-auto mb-4 animate-bounce" />
        <h1 className="font-display text-4xl font-black text-foreground">Flora Hub</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Découvrez le monde fascinant des plantes · Fiches, photos et histoires botaniques
        </p>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom commun ou scientifique..."
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
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                category === cat
                  ? "bg-green-600 text-white"
                  : "bg-card border border-border text-muted-foreground hover:bg-accent"
              }`}>
              {cat === "all" ? "Toutes" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground">Aucun specimen trouvé</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{filtered.length} plantes · {Math.ceil(filtered.length / 3)} pages</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(specimen => (
              <SpecimenCard key={specimen.id} specimen={specimen} type="flora" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}