import { memo } from "react";
import { Link } from "react-router-dom";
import { MapPin, Gift, ArrowRightLeft, Wrench, Recycle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CATEGORY_CONFIG = {
  donner: { label: "Don", icon: Gift, color: "bg-emerald-100 text-emerald-700" },
  echanger: { label: "Échange", icon: ArrowRightLeft, color: "bg-amber-100 text-amber-700" },
  reparer: { label: "Réparation", icon: Wrench, color: "bg-blue-100 text-blue-700" },
  recycler: { label: "Recyclage", icon: Recycle, color: "bg-purple-100 text-purple-700" },
};

const CONDITION_LABELS = { neuf: "Neuf", bon_etat: "Bon état", usage: "Usagé", a_reparer: "À réparer" };

const ItemCard = memo(function ItemCard({ item }) {
  const cat = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.donner;
  const CatIcon = cat.icon;

  return (
    <Link
      to={`/annonce/${item.id}`}
      className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CatIcon className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        <div className={cn("absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", cat.color)}>
          <CatIcon className="h-3 w-3" />
          {cat.label}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {item.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between mt-3">
          <Badge variant="secondary" className="text-xs">
            {CONDITION_LABELS[item.condition] || item.condition}
          </Badge>
          {item.location && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {item.location}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
});

export default ItemCard;