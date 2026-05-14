import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SEOMeta from "@/components/SEOMeta";
import { Lightbulb, Search, Loader2, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TRADITIONS = {
  bouddhisme: "🏯 Bouddhisme",
  hindouisme: "🕉️ Hindouisme",
  taoisme: "☯️ Taoïsme",
  confucianisme: "🏛️ Confucianisme",
  stoicisme: "🏛️ Stoïcisme",
  epicurianisme: "🍇 Épicurianisme",
  platonisme: "💭 Platonisme",
  aristotelisme: "🔬 Aristotélisme",
  existentialisme: "🤔 Existentialisme",
  pragmatisme: "⚙️ Pragmatisme",
  autre: "🌍 Autres"
};

export default function PhilosophiesBelief() {
  const [search, setSearch] = useState("");
  const [traditionFilter, setTraditionFilter] = useState("all");

  const { data: beliefs = [], isLoading } = useQuery({
    queryKey: ["beliefs"],
    queryFn: () => base44.entities.Belief.filter({ is_published: true }, "-created_date", 50),
    staleTime: 120_000,
  });

  const filtered = useMemo(() =>
    beliefs.filter(b => {
      const q = search.toLowerCase();
      const matchSearch = !q || b.title.toLowerCase().includes(q) || b.description?.toLowerCase().includes(q);
      const matchTrad = traditionFilter === "all" || b.tradition === traditionFilter;
      return matchSearch && matchTrad;
    }),
    [beliefs, search, traditionFilter]
  );

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalResource",
    "name": "Philosophies Croyances Traditions Universelles",
    "description": "Explorez traditions philosophiques mondiales : bouddhisme, hindouisme, taoïsme, stoïcisme, existentialisme et plus."
  };

  return (
    <div className="pb-20 space-y-8 max-w-6xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Philosophies Croyances Traditions Universelles | CirculAI Hub"
        description="Explorez philosophies et croyances mondiales : bouddhisme, hindouisme, taoïsme, stoïcisme, platonisme, existentialisme. Valeurs, pratiques, fondateurs."
        keywords="philosophie, croyances, traditions, bouddhisme, hindouisme, taoïsme, stoïcisme, existentialisme, spiritualité"
        canonicalUrl="https://egor69.ca/philosophies-beliefs"
        schemaData={seoSchema}
      />

      {/* Hero */}
      <div className="rounded-3xl p-12 text-center bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200/20">
        <div className="text-6xl mb-4">🌍</div>
        <h1 className="font-display text-4xl font-black text-foreground">Philosophies Croyances</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Traditions philosophiques et systèmes de croyances de cultures du monde entier — explorez avec respect et ouverture.
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-amber-400/30"
            placeholder="Rechercher traditions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setTraditionFilter("all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              traditionFilter === "all"
                ? "bg-amber-600 text-white"
                : "bg-card border border-border text-muted-foreground hover:bg-accent"
            }`}>
            Toutes ({beliefs.length})
          </button>
          {Object.entries(TRADITIONS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTraditionFilter(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                traditionFilter === key
                  ? "bg-amber-600 text-white"
                  : "bg-card border border-border text-muted-foreground hover:bg-accent"
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-amber-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border">
          <Lightbulb className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground">Aucune tradition trouvée</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(belief => (
            <div key={belief.id} className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg hover:border-amber-300/50 transition-all hover:-translate-y-1">
              {belief.image_url && (
                <img src={belief.image_url} alt={belief.title} className="w-full h-32 object-cover rounded-xl mb-4" />
              )}
              
              <div className="space-y-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">{belief.title}</h2>
                  <Badge className="mt-2 bg-amber-100 text-amber-700 border-amber-200">
                    {TRADITIONS[belief.tradition]}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  {belief.founder && (
                    <p><strong>👤 Fondateur :</strong> {belief.founder}</p>
                  )}
                  {belief.origin_period && (
                    <p className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {belief.origin_period}</p>
                  )}
                  {belief.origin_region && (
                    <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {belief.origin_region}</p>
                  )}
                </div>

                {belief.description && (
                  <p className="text-sm text-foreground/70 leading-relaxed">{belief.description}</p>
                )}

                {belief.core_beliefs?.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Principes Centraux</p>
                    <div className="space-y-1">
                      {belief.core_beliefs.slice(0, 3).map((belief_item, i) => (
                        <p key={i} className="text-xs text-foreground/70">✦ {belief_item}</p>
                      ))}
                    </div>
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