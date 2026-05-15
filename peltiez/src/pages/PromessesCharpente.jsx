import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEOMeta from "@/components/SEOMeta";
import { SITE_ORIGIN } from "@/lib/site";
import PromessesLoaPanel from "@/components/docs/PromessesLoaPanel";
import { Button } from "@/components/ui/button";

export default function PromessesCharpente() {
  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-violet-950/20 via-zinc-950 to-amber-950/15 pb-24">
      <div className="container max-w-4xl py-8 px-4">
        <SEOMeta
          title="Charpente — huit promesses structurelles · EGOR69"
          description="Lois opérationnelles remplaçant le marketing LoA : alignement, causalité, boucle — auto-évaluation locale, sans manifestation magique."
          canonicalUrl={`${SITE_ORIGIN}/docs/promesses`}
        />
        <Button asChild variant="ghost" size="sm" className="rounded-xl -ml-2 mb-4">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Accueil
          </Link>
        </Button>
        <PromessesLoaPanel />
      </div>
    </div>
  );
}
