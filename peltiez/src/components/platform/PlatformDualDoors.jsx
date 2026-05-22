import { Link } from "react-router-dom";
import { ArrowRight, Globe2, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CIRCULAI_BRAND, SITE_NAME } from "@/lib/site";

export default function PlatformDualDoors({ compact = false }) {
  return (
    <div className={`grid gap-4 ${compact ? "md:grid-cols-2" : "md:grid-cols-2"} max-w-4xl mx-auto`}>
      <article className="platform-card-emerald rounded-2xl p-6 sm:p-8 flex flex-col">
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
          <Leaf className="h-4 w-4" aria-hidden />
          Monde concret
        </div>
        <h2 className="mt-3 text-2xl font-bold text-foreground tracking-tight">
          {CIRCULAI_BRAND}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
          Marché local, pilote municipal, seconde main — pour les citoyens, OBNL et élus. Ton humble, preuves
          vérifiables.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <Button asChild className="platform-btn-primary flex-1">
            <Link to="/seconde-main">
              Seconde main Québec
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 border-emerald-600/50 text-emerald-800 hover:bg-emerald-50">
            <Link to="/circulai">Kit & pilote</Link>
          </Button>
        </div>
      </article>

      <article className="platform-card-violet rounded-2xl p-6 sm:p-8 flex flex-col">
        <div className="flex items-center gap-2 text-violet-700 text-xs font-bold uppercase tracking-wider">
          <Globe2 className="h-4 w-4" aria-hidden />
          Monde culture
        </div>
        <h2 className="mt-3 text-2xl font-bold text-foreground tracking-tight">{SITE_NAME}</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
          Encyclopédie illustrée, codex, Verse 3D — le rêve et la quête. Hors dossier institutionnel.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <Button asChild className="bg-violet-600 hover:bg-violet-500 text-white flex-1">
            <Link to="/encyclopedie">
              Encyclopédie
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 border-violet-500/50 text-violet-800 hover:bg-violet-50">
            <Link to="/entrer">Choisir son monde</Link>
          </Button>
        </div>
      </article>
    </div>
  );
}
