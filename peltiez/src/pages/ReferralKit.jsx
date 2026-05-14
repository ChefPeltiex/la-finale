import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ReferralKitComponent from "@/components/ReferralKit";

export default function ReferralKit() {
  const navigate = useNavigate();

  return (
    <div className="pb-20 space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
      </div>

      <ReferralKitComponent />
    </div>
  );
}