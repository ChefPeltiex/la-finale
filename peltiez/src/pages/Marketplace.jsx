import { useState, useMemo, useDeferredValue } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Search, SlidersHorizontal, Package, Gift, Wrench, RefreshCw, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const TYPE_CONFIG = {
  all:        { label: "Tout",       icon: LayoutGrid },
  vente:      { label: "Vente",      icon: Package,   color: "bg-blue-100 text-blue-700" },
  don:        { label: "Don",        icon: Gift,       color: "bg-emerald-100 text-emerald-700" },
  réparation: { label: "Réparation", icon: Wrench,     color: "bg-amber-100 text-amber-700" },
  échange:    { label: "Échange",    icon: RefreshCw,  color: "bg-purple-100 text-purple-700" },
};

const CONDITION_LABELS = { neuf: "Neuf", "très bon": "Très bon", bon: "Bon", acceptable: "Acceptable" };

const CATEGORIES = ["tous", "électronique", "vêtements", "mobilier", "livres", "sport", "maison", "outils", "autre"];

function ListingCard({ listing }) {
  const cfg = TYPE_CONFIG[listing.type] || TYPE_CONFIG.don;
  const Icon = cfg.icon;
  return (
    <Link to={`/annonce/${listing.id}`}
      className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {listing.image_url ? (
          <img src={listing.image_url} alt={listing.title} loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon className="h-10 w-10 text-muted-foreground/20" />
          </div>
        )}
        {cfg.color && (
          <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
            <Icon className="h-3 w-3" /> {cfg.label}
          </div>
        )}
        {listing.price > 0 && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-foreground">
            {listing.price} $
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{listing.title}</h3>
        {listing.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{listing.description}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          {listing.condition && <Badge variant="outline" className="text-xs">{CONDITION_LABELS[listing.condition] || listing.condition}</Badge>}
          {listing.location && <span className="text-xs text-muted-foreground">{listing.location}</span>}
        </div>
      </div>
    </Link>
  );
}

export default function Marketplace() {
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("tous");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["listings", type],
    queryFn: () =>
      type === "all"
        ? base44.entities.Listing.filter({ status: "actif" }, "-created_date", 100)
        : base44.entities.Listing.filter({ status: "actif", type }, "-created_date", 100),
    staleTime: 30_000,
  });

  const filtered = useMemo(() =>
    listings.filter(l => {
      const q = deferredSearch.toLowerCase();
      const matchSearch = !q || l.title.toLowerCase().includes(q) || (l.description || "").toLowerCase().includes(q);
      const matchCat = category === "tous" || l.category === category;
      return matchSearch && matchCat;
    }),
    [listings, deferredSearch, category]
  );

  return (
    <div className="space-y-5 pb-20">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Marketplace</h1>
        <p className="text-sm text-muted-foreground mt-1">Découvrez des annonces près de chez vous</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Rechercher un objet, un service…" value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10 rounded-xl h-12 bg-card" />
      </div>

      {/* Type filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
          <button key={key} onClick={() => setType(key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap border transition-all",
              type === key ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-card border-border text-foreground hover:bg-accent"
            )}>
            <cfg.icon className="h-4 w-4" /> {cfg.label}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium border whitespace-nowrap transition-all capitalize",
              category === c ? "bg-secondary text-secondary-foreground border-secondary" : "bg-card border-border text-muted-foreground hover:bg-accent"
            )}>
            {c}
          </button>
        ))}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-muted" />
              <div className="p-4 space-y-2"><div className="h-4 bg-muted rounded w-3/4" /><div className="h-3 bg-muted rounded" /></div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <SlidersHorizontal className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">Aucun résultat</p>
          <p className="text-sm text-muted-foreground mt-1">Essayez d'autres filtres</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        </>
      )}
    </div>
  );
}