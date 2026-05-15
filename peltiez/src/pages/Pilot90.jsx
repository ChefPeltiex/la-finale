import { Link } from "react-router-dom";
import SEOMeta from "@/components/SEOMeta";
import Pilot90Panel from "@/components/pilot/Pilot90Panel";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Pilot90() {
  return (
    <div className="pb-20 max-w-2xl mx-auto px-4 space-y-6">
      <SEOMeta
        title="Pilote 90 jours"
        description="Jalons du pilote, rituel d’anniversaire du 21 mai et preuves vérifiables — sans astrologie déterministe."
      />
      <Button asChild variant="ghost" size="sm" className="rounded-xl -ml-2">
        <Link to="/profil">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Profil
        </Link>
      </Button>
      <Pilot90Panel />
    </div>
  );
}
