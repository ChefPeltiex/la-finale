import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ICONS = {
  flora: "🌿", fauna: "🦁", insect: "🦋", mineral: "💎",
  chemical: "⚗️", magic: "✨"
};

const COLORS = {
  flora: "from-green-500 to-emerald-600",
  fauna: "from-orange-500 to-amber-600",
  insect: "from-yellow-500 to-orange-600",
  mineral: "from-slate-500 to-gray-600",
  chemical: "from-blue-500 to-cyan-600",
  magic: "from-purple-500 to-violet-600"
};

export default function SpecimenCard({ specimen, type = "flora" }) {
  const [expanded, setExpanded] = useState(false);
  
  const icon = ICONS[type] || "✨";
  const colorClass = COLORS[type] || "from-emerald-500 to-teal-600";

  const details = useMemo(() => {
    const items = [];
    if (specimen.scientific_name) items.push({ label: "Scientifique", value: specimen.scientific_name });
    if (specimen.category) items.push({ label: "Catégorie", value: specimen.category });
    if (specimen.hardness) items.push({ label: "Dureté Mohs", value: specimen.hardness });
    if (specimen.difficulty) items.push({ label: "Difficulté", value: specimen.difficulty });
    if (specimen.conservation_status) items.push({ label: "Conservation", value: specimen.conservation_status });
    return items;
  }, [specimen]);

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md hover:border-primary/30 transition-all hover:-translate-y-1">
      {/* Header avec image/icône */}
      <div className={`h-32 bg-gradient-to-br ${colorClass} relative overflow-hidden flex items-center justify-center`}>
        {specimen.image_url ? (
          <img src={specimen.image_url} alt={specimen.common_name || specimen.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform" loading="lazy" />
        ) : (
          <span className="text-6xl opacity-80">{icon}</span>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-foreground text-sm leading-tight flex-1">
            {specimen.common_name || specimen.title || specimen.element_name || specimen.name}
          </h3>
          {specimen.views_count && (
            <span className="text-[10px] text-muted-foreground font-medium">{specimen.views_count} vues</span>
          )}
        </div>

        {/* Description */}
        {(specimen.description || specimen.excerpt) && (
          <p className={`text-xs text-muted-foreground leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
            {specimen.description || specimen.excerpt}
          </p>
        )}

        {/* Détails rapides */}
        {details.length > 0 && (
          <div className="space-y-1 pt-2 border-t">
            {details.slice(0, expanded ? details.length : 1).map((item, i) => (
              <div key={i} className="flex justify-between text-[10px]">
                <span className="text-muted-foreground font-medium">{item.label}</span>
                <span className="text-foreground font-bold capitalize">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tags/Caractéristiques */}
        {specimen.characteristics?.length > 0 && (
          <div className="flex gap-1 flex-wrap pt-2">
            {specimen.characteristics.slice(0, 2).map((c, i) => (
              <Badge key={i} variant="outline" className="text-[10px] py-0">{c}</Badge>
            ))}
            {specimen.characteristics.length > 2 && (
              <Badge variant="outline" className="text-[10px] py-0">+{specimen.characteristics.length - 2}</Badge>
            )}
          </div>
        )}

        {/* Expand button */}
        {(specimen.story || specimen.interpretation || specimen.folklore || details.length > 1) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-1 mt-2 py-1.5 rounded-lg hover:bg-muted transition-colors text-xs font-bold text-primary">
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {expanded ? "Réduire" : "Lire plus"}
          </button>
        )}
      </div>

      {/* Contenu développé */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t">
          {details.length > 1 && (
            <div className="space-y-1">
              {details.slice(1).map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium">{item.label}</span>
                  <span className="text-foreground font-bold capitalize">{item.value}</span>
                </div>
              ))}
            </div>
          )}

          {(specimen.story || specimen.folklore || specimen.interpretation) && (
            <p className="text-xs text-foreground leading-relaxed italic">
              {specimen.story || specimen.folklore || specimen.interpretation}
            </p>
          )}

          {specimen.benefits?.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Bénéfices</p>
              <ul className="text-xs text-foreground space-y-0.5">
                {specimen.benefits.map((b, i) => <li key={i}>✓ {b}</li>)}
              </ul>
            </div>
          )}

          {specimen.uses?.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Utilisations</p>
              <ul className="text-xs text-foreground space-y-0.5">
                {specimen.uses.slice(0, 3).map((u, i) => <li key={i}>→ {u}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}