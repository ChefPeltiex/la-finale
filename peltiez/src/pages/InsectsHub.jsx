import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SEOMeta from "@/components/SEOMeta";
import SpecimenCard from "@/components/SpecimenCard";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function InsectsHub() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  const { data: specimens = [], isLoading } = useQuery({
    queryKey: ["insect-specimens"],
    queryFn: () => base44.entities.InsectSpecimen.filter({ is_published: true }, "-created_date", 100),
    staleTime: 120_000
  });

  const types = useMemo(() => 
    ["all", ...new Set(specimens.map(s => s.type).filter(Boolean))],
    [specimens]
  );

  const filtered = useMemo(() =>
    specimens.filter(s => {
      const q = search.toLowerCase();
      const matchSearch = !q || s.common_name?.toLowerCase().includes(q);
      const matchType = type === "all" || s.type === type;
      return matchSearch && matchType;
    }),
    [specimens, search, type]
  );

  return (
    <div className="pb-20 space-y-8 max-w-6xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Insects Hub - Papillons, Abeilles & Insectes | CirculAI Hub"
        description="Explorez le monde des insectes. Papillons, abeilles, libellules. Cycle de vie, rôle écologique. Éducatif et fascinant."
        keywords="insectes, papillons, abeilles, entomologie, biodiversité, écologie"
        canonicalUrl="https://egor69.ca/insects-hub"
      />

      {/* Hero */}
      <div className="rounded-3xl p-12 text-center bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-200/20">
        <div className="text-5xl mb-4 animate-bounce" style={{ animationDuration: "2s" }}>🦋</div>
        <h1 className="font-display text-4xl font-black text-foreground">Insects Hub</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Le monde fascinant des insectes · Papillons, abeilles, libellules et bien plus
        </p>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un insecte..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 rounded-xl h-11"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap capitalize transition-all ${
                type === t
                  ? "bg-yellow-600 text-white"
                  : "bg-card border border-border text-muted-foreground hover:bg-accent"
              }`}>
              {t === "all" ? "Tous" : t.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-yellow-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground">Aucun insecte trouvé</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{filtered.length} insectes trouvés</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(specimen => (
              <SpecimenCard key={specimen.id} specimen={specimen} type="insect" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}