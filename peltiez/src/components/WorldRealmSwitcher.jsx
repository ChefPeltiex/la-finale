import { Link, useLocation } from "react-router-dom";
import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { loadWorldChoice, worldChoiceLabel } from "@/lib/worldGateway";

/** Lien fixe « Changer de monde » → /entrer */
export default function WorldRealmSwitcher({ className }) {
  const { pathname } = useLocation();
  if (pathname === "/entrer") return null;

  const choice = loadWorldChoice();

  return (
    <Link
      to="/entrer"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-3 py-1.5",
        "text-[11px] font-medium text-white/70 hover:text-white hover:border-emerald-500/35 hover:bg-emerald-950/30 transition-colors",
        className,
      )}
      title="Revenir au choix des mondes (concret ou fantaisiste)"
    >
      <Layers className="h-3.5 w-3.5 shrink-0 text-emerald-400/80" aria-hidden />
      <span>{choice ? worldChoiceLabel(choice) : "Choisir un monde"}</span>
    </Link>
  );
}
