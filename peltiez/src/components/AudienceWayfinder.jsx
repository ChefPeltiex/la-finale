import { Link, useLocation } from "react-router-dom";
import { Building2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { CIRCULAI_BRAND, SITE_NAME } from "@/lib/site";

const HIDDEN_PREFIXES = ["/world", "/underworld", "/etherealm", "/netherealm", "/outworld", "/intro", "/welcome"];

export default function AudienceWayfinder() {
  const { pathname } = useLocation();
  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }

  const onCirculai = pathname === "/circulai" || pathname.startsWith("/docs/circulai");

  return (
    <nav
      className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/92 backdrop-blur-md"
      aria-label="Choix d'audience"
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
        <span className="text-white/45 hidden sm:inline">Je suis :</span>
        <Link
          to="/circulai"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-semibold transition-colors min-h-[40px]",
            onCirculai
              ? "bg-sky-600/90 text-white"
              : "bg-white/5 text-white/75 hover:bg-sky-950/50 hover:text-sky-100",
          )}
        >
          <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Partenaire · {CIRCULAI_BRAND}
        </Link>
        <Link
          to="/"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-semibold transition-colors min-h-[40px]",
            !onCirculai && pathname === "/"
              ? "bg-emerald-600/85 text-white"
              : "bg-white/5 text-white/75 hover:bg-emerald-950/40 hover:text-emerald-100",
          )}
        >
          <Users className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Citoyen · {SITE_NAME}
        </Link>
      </div>
    </nav>
  );
}
