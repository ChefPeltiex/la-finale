import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCardById } from "@/content/engine";
import SensoryCard from "@/components/UniversalCard/SensoryCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { isGrosCalinUnlocked } from "@/lib/grosCalin";
import GrosCalinGate from "@/components/GrosCalinGate";
import CardSharePanel from "@/components/CardSharePanel";

export default function CardPage() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [unlocked, setUnlocked] = useState(() => isGrosCalinUnlocked());

  useEffect(() => {
    (async () => {
      const c = await getCardById(id);
      setCard(c);
    })();
  }, [id]);

  if (!unlocked) {
    return <GrosCalinGate onUnlocked={() => setUnlocked(true)} />;
  }

  return (
    <div className="pb-20 max-w-5xl mx-auto px-4 lg:px-8 space-y-6 pt-10">
      <Button asChild variant="ghost" className="gap-2">
        <Link to="/atlas">
          <ArrowLeft className="h-4 w-4" /> Retour à l’Atlas
        </Link>
      </Button>
      <SensoryCard card={card} />
      <CardSharePanel card={card} />
    </div>
  );
}

