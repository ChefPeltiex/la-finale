import { MapPin, Shield, Sparkles } from "lucide-react";
import { CIRCULAI_BRAND } from "@/lib/site";

export default function PlatformTrustStrip({ className = "" }) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground ${className}`}
      role="note"
    >
      <span className="inline-flex items-center gap-1.5">
        <MapPin className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
        Québec · Limoilou
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Shield className="h-3.5 w-3.5 text-sky-600" aria-hidden />
        Pilote 90 j · preuves honnêtes
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-violet-500" aria-hidden />
        {CIRCULAI_BRAND} + Egor69 — deux portes
      </span>
    </div>
  );
}
