import RevenueCharter from "@/components/RevenueCharter";
import WorldEthosCharter from "@/components/WorldEthosCharter";

export default function Charte() {
  return (
    <div className="max-w-3xl mx-auto pb-20 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Notre Charte</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Entraide · Transparence financière · Sécurité des données · Promesses fondatrices
        </p>
      </div>
      <WorldEthosCharter variant="full" />
      <RevenueCharter />
    </div>
  );
}