import { memo } from "react";
import { MapPin, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CONDITIONS = [
  { key: "all", label: "Tous états" },
  { key: "neuf", label: "Neuf" },
  { key: "bon_etat", label: "Bon état" },
  { key: "usage", label: "Usagé" },
  { key: "a_reparer", label: "À réparer" },
];

const MarketplaceFilters = memo(function MarketplaceFilters({
  condition, onConditionChange,
  location, onLocationChange,
  activeCount,
  onReset,
}) {
  return (
    <div className="space-y-3">
      {/* Condition Filter */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">État</p>
        <div className="flex flex-wrap gap-2">
          {CONDITIONS.map((c) => (
            <button
              key={c.key}
              onClick={() => onConditionChange(c.key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border",
                condition === c.key
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card border-border text-foreground hover:bg-accent"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Proximité</p>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Ville, quartier..."
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="pl-9 rounded-xl h-10 bg-card text-sm"
          />
          {location && (
            <button
              onClick={() => onLocationChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Active filters reset */}
      {activeCount > 0 && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {activeCount} filtre{activeCount > 1 ? "s" : ""} actif{activeCount > 1 ? "s" : ""}
          </Badge>
          <button onClick={onReset} className="text-xs text-primary hover:underline">
            Tout réinitialiser
          </button>
        </div>
      )}
    </div>
  );
});

export default MarketplaceFilters;