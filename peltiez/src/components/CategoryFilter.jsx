import { memo } from "react";
import { Gift, ArrowRightLeft, Wrench, Recycle, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { key: "all", label: "Tout", icon: LayoutGrid },
  { key: "donner", label: "Dons", icon: Gift },
  { key: "echanger", label: "Échanges", icon: ArrowRightLeft },
  { key: "reparer", label: "Réparation", icon: Wrench },
  { key: "recycler", label: "Recyclage", icon: Recycle },
];

const CategoryFilter = memo(function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onSelect(cat.key)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200",
            selected === cat.key
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-card border border-border text-foreground hover:bg-accent"
          )}
        >
          <cat.icon className="h-4 w-4" />
          {cat.label}
        </button>
      ))}
    </div>
  );
});

export default CategoryFilter;